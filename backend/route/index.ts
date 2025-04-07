import { Router } from "express";
import express from "express";
import path from "path";

const router: Router = Router();

import userRouter from "./user.route";
import loginRouter from "./login.route";
import productRouter from "./product.route";
import uploadRoutes from "./upload.route";  
import sendEmail from "./mail.route";
import queueRouter from "./queue.route";
router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/login", loginRouter);
router.use("/upload", uploadRoutes);
router.use("/send-email", sendEmail);
router.use("/add-email", queueRouter);
router.use("/uploads", express.static(path.join(__dirname, "../uploads"))); 

export default router;
