import { Task } from "../models/task.model.js";
import asyncHandler from "express-async-handler";

export const getTasks = async (req, res) => {
    try{
        const {status, priority} = req.query;
        const query = {};
        if(status) query.status = status;
        if(priority) query.priority = priority;
        const tasks = await Task.find(query);
        res.status(200).json({
            success: true,
            data: tasks
        });
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

export const getTasksByPriority = (req, res) => {
    res.send(`Get tasks by priority level`);
}   

export const getCompletedTasks=(req,res)=>{
    res.send("Get all completed tasks");
}

export const getPendingTasks=(req,res)=>{
    res.send("Get all pending tasks");
}
//api/v1/task
export const addTask=asyncHandler(async (req,res)=>{
    const {title,description,priority,status}=req.body;
    if(!title) return res.status(400).json({message:"Title is required"})
    
    const newTask =await Task.create({
        title,
        description,
        priority: priority || "low",
        status: status || "pending",
        user: req.user._id // Associate task with authenticated user
    })
    res.status(201).json({
        success: true,
        message: "Task added successfully",
        data: newTask
    });
})

//
export const updateTask=asyncHandler(async (req,res)=>{
    const {id} = req.params;
    const {title,description,priority,status}=req.body;
    const task = await Task.findById(id);
    if(!task) return res.status(404).json({message:"Task not found"});
    const updatedTask= await Task.create({
        title: title || task.title,
        description: description || task.description,
        priority: priority || task.priority,
        status: status || task.status,
        user: req.user._id // Associate task with authenticated user
    })
    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: updatedTask
    });
})

//api/v1/task/id
export const deleteTask=asyncHandler(async (req,res)=>{
    const {id} = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if(!deletedTask) return res.status(404).json({
        success: false,
        message:"Task not found"
    });
    res.status(200).json({
        success: true,
        message: "Task deleted successfully",
        data: deletedTask
    });
})

