import { Request, Response } from "express";
import { emailQueue } from "../config/queue";

export const addToEmailQueue = async (req: Request, res: Response) => {
    const { email, subject, message } = req.body;
    await emailQueue.add({ email, subject, message });
    res.status(200).json({ message: "Email added to queue" });
};
