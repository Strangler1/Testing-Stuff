import {Router} from "express";
import {register, login, logout} from "../controllers/auth.controller.js";
const authRouter=Router();

//http://localhost:5000/api/v1/auth/register
authRouter.post("/register",register);
//http://localhost:5000/api/v1/auth/login
authRouter.post("/login",login);
//http://localhost:5000/api/v1/auth/logout
authRouter.post("/logout",logout);

export default authRouter;