import express from "express";
import { addToEmailQueue } from "../controller/queue.controller";

const router = express.Router();


router.post("/", addToEmailQueue);

export default router;
