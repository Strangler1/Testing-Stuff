import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxLength:30
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minLength:[6,"Please enter a password with at least 6 characters"],
        select:false
    }
})

export const User = mongoose.model("User",userSchema);