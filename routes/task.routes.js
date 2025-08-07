import {Router} from "express";
import {protect} from "../middleware/protect.middleware.js";
import { 
    getTasks, 
    getTasksByPriority, 
    getCompletedTasks, 
    getPendingTasks, 
    addTask, 
    updateTask, 
    deleteTask 
} from "../controllers/task.controller.js";
const taskRouter=Router();

// Public routes (no authentication required)
///api/v1/task (GET - view tasks)
taskRouter.get("/",protect,getTasks);
///api/v1/task/priority/:level
taskRouter.get("/priority/:level",getTasksByPriority);
///api/v1/task/completed
taskRouter.get("/completed",getCompletedTasks);
///api/v1/task/pending
taskRouter.get("/pending",getPendingTasks);

// Protected routes (authentication required)
///api/v1/task (POST - add task)
taskRouter.post("/", protect, addTask);
///api/v1/task/id (PUT - update task)
taskRouter.put("/:id", protect, updateTask);
///api/v1/task/id (DELETE - delete task)
taskRouter.delete("/:id", protect, deleteTask);

export default taskRouter;