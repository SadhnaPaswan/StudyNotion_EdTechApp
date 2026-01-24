const User = require('../models/user');
const OTP = require('../models/otp');
const mailSender = require('../utils/mailSender');
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Profile = require('../models/profile');
const changePasswordTemplate = require('../templates/changePasswordTemplate');
require('dotenv').config();



//send otp
exports.sendOtp = async (req,res) => {
    try{
        //fetch email from req body
        const email = req.body.email.toLowerCase();

        //check user is already registered or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                success:false,
                message:"User already registered"
            });
        }

        //generate 6 digit otp
        const otp = crypto.randomInt(100000, 1000000).toString(); 
        console.log("Secure OTP:", otp);
        //store otp in db
        const newOtp = OTP.create({email,otp});
        return res.status(200).json({
            success:true,
            message:"OTP sent to your email",
            otp: otp,
            email: email
        });

    }catch(err){
        console.log("Error in sending otp",err);
        return res.status(500).json({
            success:false,
            message:"Error in sending otp",
            err:err.message
        });
    }
}

//sign up
exports.signUp = async (req,res) => {
    try{
        //fetch data from req body
        const {firstName,lastName,email,password,confirmPassword,accountType,otp} = req.body;

        //validate fields
        if(!firstName || !lastName || !email || !password || !confirmPassword ){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }

        //validate password and confirm password
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password do not match"
            });
        }

        //check user is already registered or not
        const existingUser = await User.findOne({Email:email.toLowerCase()});
        if(existingUser){
            return res.status(409).json({
                success:false,
                message:"User already registered"
            });
        }

        //verify otp
        const recentOtp = await OTP.findOne({email:email.toLowerCase()}).sort({createdAt:-1});
        console.log(recentOtp);
        if(!recentOtp){
            return res.status(400).json({
                success:false,
                message:"OTP not found. Please request for a new OTP"
            });
        }
          if (recentOtp.otp !== otp.toString()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);

        //create user entry in db
        const profileDetails = await Profile.create({
            gender:null,
            dob:null,
            contactNumber:null,
            about:null,
            Image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        }); 

        const newUser = await User.create({
            FirstName: firstName,
            LastName: lastName,
            Email: email.toLowerCase(),
            
            Password: hashedPassword,
            AccountType: accountType || 'Student',
            AdditionalDetails: profileDetails._id,
            
            
        });
        return res.status(200).json({
            success:true,
            message:"User is successfully registered",
           
        })

    }catch(err){
        console.log("Error while signUp",err);
        return res.status(500).json({
            success:false,
            message:"Unable to signUp,Please Try again"
        })
    }
}


//log in
exports.logIn = async (req,res) => {
    try{
        //fetch data from req body
        const {email,password} = req.body;

        //validate fields
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }

        //check user is already registered or not
        const existingUser = await User.findOne({Email:email.toLowerCase()}).populate("AdditionalDetails");
        if(!existingUser){
            return res.status(409).json({
                success:false,
                message:"User is not registered"
            });
        }

        //match password
        const isPasswordMatch = await bcrypt.compare(password,existingUser.Password);
        const payload = { id: existingUser._id,
            email: existingUser.Email,
            AccountType: existingUser.AccountType
        };
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,       // REQUIRED (https)
            sameSite: "None",   // REQUIRED for cross-domain
            };

        if(isPasswordMatch){
            //generate jwt token and send it in response
            const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'72h'});
            existingUser.token = token;
            existingUser.Password = undefined;
            //create cookie and send response
            res.cookie("token",token,options).status(200).json({
                success:true,
                message:"User logged in successfully",
                user:existingUser,
                token
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Invalid password"
            });
        }
    }catch(err){
        console.log("Error while logIn",err);
        return res.status(500).json({
            success:false,
            message:"Unable to logIn,Please Try again"
          })
    }
}



// Change Password
    exports.changePassword = async (req, res) => {
    try {
        //get data from req body
        const { email, oldPassword, newPassword } = req.body;

        //Validate input
        if ( !oldPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
        }

        // Check if new passwords match
        // if (newPassword !== confirmNewPassword) {
        // return res.status(400).json({
        //     success: false,
        //     message: "New password and confirm password do not match",
        // });
        // }

         //get userid
        const Id = req.user.id;

        //Find user by email
        // const existingUser = await User.findOne({ Email: email });
        const existingUser = await User.findById(Id);
        if (!existingUser) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
        }

        //Validate old password
        const isMatch = await bcrypt.compare(oldPassword, existingUser.Password);
        if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Old password is incorrect",
        });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in DB
        existingUser.Password = hashedPassword;
        await existingUser.save();

        const htmlContent = changePasswordTemplate(existingUser.FirstName);

        // Send confirmation email
        await mailSender(
        email,
        "Password Changed Successfully",
        htmlContent
        );
        return res.status(200).json({
        success: true,
        message: "Password updated successfully",
        });
    } catch (err) {
        console.error("Error while changing password:", err);
        return res.status(500).json({
        success: false,
        message: "Something went wrong, please try again later",
        });
    }
};
