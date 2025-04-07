import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../uploads');


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});


const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  cb(null, true); 
};


const singleUpload = multer({ storage, fileFilter }).single('file');

const multipleUpload = multer({ storage, fileFilter }).array('files', 10);

export { singleUpload, multipleUpload };
