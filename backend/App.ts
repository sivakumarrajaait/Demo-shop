import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './route/index';
import { connectDB } from './config/db';
import "./config/cron";
import { createBullBoard } from "@bull-board/api";  
import { ExpressAdapter } from "@bull-board/express";  
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { emailQueue } from "./config/queue";  
dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
    queues: [new BullAdapter(emailQueue)], 
    serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api', routes);





app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
