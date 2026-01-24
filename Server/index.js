const express = require('express');
const app = express();

 
// trust first proxy
app.set('trust proxy', 1);

//import routes
const userRoutes = require('./routes/User');
const courseRoutes = require('./routes/Course');
const paymentRoutes = require('./routes/Payments');
const profileRoutes = require('./routes/Profile');

const database = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { cloudinaryConfig} = require('./config/cloudinary');
const fileUpload = require('express-fileupload');


require("dotenv").config();
const PORT = process.env.PORT || 4000;

//database connection
database.dbConnect();
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "https://study-notion-ed-tech-app-frontend.vercel.app",
  "https://study-notion-ed-tech-app-frontend-7slkmyo0d.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow postman
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));

//cloudinary connection
cloudinaryConfig();

//routes mounting
app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/course',courseRoutes);
app.use('/api/v1/payments',paymentRoutes);
app.use('/api/v1/profile',profileRoutes);

//default route
app.get('/',(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to EduTech Server"
    });
});

//listen server
app.listen(PORT,()=>{
    console.log(`Server is working on http://localhost:${PORT}`);
});
