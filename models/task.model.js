import mongoose from "mongoose";

const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minLength:[3,"Please eneter a ttitle with ayeast 3 chancraters"]
    },
    description:{
        type:String,
        maxLength:[500,"Description cannot exceedd 500 characters"]
    },
    completed:{
        type:Boolean,
        default:false
    },
    dueDate:{
        type:Date,
        default:Date.now
    },
    priority:{
        type:String,
        enum:["low","medium","high"],
        default:"low"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{
    timestamps:true
})

export const Task = mongoose.model("Task",taskSchema);