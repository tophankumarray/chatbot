import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";




const app = express();

// app.get("/",(req,res)=>{
//     return res.status(200).json({
//         message:"Hello from backend",
//         success:true
//     })
// })


// database
connectDB();

dotenv.config({
    path:".env"
})


// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOption = {
    origin: "http://localhost:3000",
    credentials:true
}
app.use(cors(corsOption));

const PORT = process.env.PORT ;


// api's
app.use("/api/v1/user", userRoute);


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}...`)
})