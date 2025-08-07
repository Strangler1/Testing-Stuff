import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {PORT,NODE_ENV} from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import taskRouter from "./routes/task.routes.js";
import {connectDb} from "./database/db.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app=express();

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:3000',    // React development server
            'http://localhost:3001',    // Alternative React port
            'http://localhost:5173',    // Vite development server
            'http://localhost:8080',    // Vue development server
            'http://127.0.0.1:5500',    // Live Server (VS Code extension)
            'http://127.0.0.1:3000',    // Alternative localhost
        ];
        
        // In production, add your actual domain
        if (NODE_ENV === 'production') {
            allowedOrigins.push('https://yourdomain.com');
        }
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,              // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.get("/",(req,res)=>{
    res.send("this is home page");
})

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/task",taskRouter);

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT} in ${NODE_ENV} mode`)
    connectDb();
})

export default app;