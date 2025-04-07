import express from "express";
import { sendEmail } from "../controller/mail.controller";

const router = express.Router();

router.post("/", sendEmail);

export default router;
