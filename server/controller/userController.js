import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req,res)=>{
    try {
        const {fullName, email, password} = req.body;
        // console.log(fullName, email,  password);
        if(!fullName || !email || !password){
            return res.status(400).json({
                message:"Something is missing",
                success: false
            })
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message: "User already exist with this email",
                success: false
            })
        }

        const hashedPassword =  await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            email,
            password: hashedPassword,
        })
        return res.status(201).json({
            message:"Account created successfully",
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}


export const login = async(req,res)=>{
    try {
        const {email, password} = req.body;
        // console.log(email, password);
         if(!email || !password){
            return res.status(400).json({
                message:"Something is missing",
                success: false
            })
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Incorrect email and password",
                success: false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
           return res.status(400).json({
            message: "Incorrect email and password",
            success: false
           })
        }
        const tokenData = {
            userId: user._id
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn:'1d'});

        user= {
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profile:user.profile
        }
        return res.status(200).cookie("token", token, {maxAge: 1*24*60*60*1000, httpsOnly: true, sameSite: 'strict'}).json({
            message: `Welcome back ${user.fullName}`,
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}


export const logout = async (req,res)=>{
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
