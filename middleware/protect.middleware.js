import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protect = async (req,res,next) =>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Not authorized, no token found"
            });
        }
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        
        if(!req.user){
            return res.status(401).json({
                success:false,
                message:"User not found"
            });
        }
        console.log("User authenticated:", req.user);
        next();
    }
    catch(error){
        console.error("Protection middleware error:", error);
        return res.status(401).json({
            success:false,
            message:"Not authorized, invalid token"
        });
    }
}