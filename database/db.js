import mongoose from "mongoose";

import { DB_URI } from "../config/env.js";

export const connectDb = async() =>{
    
    if(!DB_URI){
        throw new Error("Database URI is not defiend in the environment variables");
    }

    try{

        await mongoose.connect(DB_URI);
        console.log("Database connected succesfully at ",mongoose.connection.host);
    }catch(error){
        console.error("Database connection failed:", error);
        res.status(500).json({
            success:false,
            message:error.message,
            stack:error.stack
        })
    }
}