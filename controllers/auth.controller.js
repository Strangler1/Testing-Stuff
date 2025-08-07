import express from "express";
import bcrypt from "bcryptjs";
import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {JWT_SECRET, NODE_ENV} from "../config/env.js";

//api/v1/auth/register
export const register= async (req,res)=>{
    const {name,email,password} = req.body;

    try{
    if(!name || !email || !password) {
        return res.status(400).send("Please provide all required fields");
    }

    const existingUser = await User.findOne({email});
    if(existingUser) {
        return res.status(400).send("User already exists with this email");
    }

    const passwordHash= await bcrypt.hash(password,10);
    console.log("Hashed password:",passwordHash)
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    });

    const token= jwt.sign({id:newUser._id},JWT_SECRET,{expiresIn:"1d"});
    console.log("Generated token:", token);
    res.cookie("token",token,{
        httpOnly:true,
        secure:NODE_ENV==="production",
        maxAge:24*60*60*1000 // 1 day
    });
    res.status(201).json({
        success:true,
        message:"User registered successfully",
        user:newUser,
        token
    });
    console.log("User registered successfully:", newUser);
} catch(error) {
    console.error("Error during registration:", error);
    res.status(500).json({
        success:false,
        message:error.message,
        stack:error.stack
    });
}
}

//api/v1/auth/login
export const login=async (req,res)=>{
    const {email,password} = req.body;

    try{
        if(!email || !password){
            throw new Error("Please provide email and password");
        }
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not fournd ,please regsiter to login in"
            })
        }
        const isValid=await bcrypt.compare(password,user.password);
        if(!isValid){
            return res.status(401).json({
                success:false,
                message:"Invalid Credentials"
            });
        }
        const token = jwt.sign({id:user._id},JWT_SECRET,{expiresIn:"1d"});
        res.cookie("token",token,{
            httpOnly:true,
            secure:NODE_ENV==="production",
            maxAge:24*60*60*1000 // 1 day
        });
        
        res.status(200).json({
            success:true,
            message:"User logged in successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            },
            token
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
            stack:error.stack
        })
    }
}

//api/v1/auth/logout
export const logout=(req,res)=>{
    res.clearCookie("token").json({
        success:true,
        message:"User logged out successfully"
    });
}