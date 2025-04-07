import express from "express";
import {singleUpload, multipleUpload} from "../middleware/upload";
import { uploadFile,uploadFiles } from "../controller/upload.controller";

const router = express.Router();


router.post("/singleupload", singleUpload, uploadFile);

router.post("/multipleUpload", multipleUpload, uploadFiles);

export default router;
