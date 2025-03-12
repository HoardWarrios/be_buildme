import express from "express";
import {register, login,resetPassword,logout} from "../controllers/auth.controller.js"


const router = express.Router();

//Auth route endpoints
router.post("/register", register)
router.post("/login", login)
router.put("/reset-password", resetPassword);
router.post("/logout", logout)


export default router;