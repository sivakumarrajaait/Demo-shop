import express, { Express } from 'express';
import request from 'supertest';
import path from 'path';
import multer from 'multer';
import { uploadFile, uploadFiles } from '../../controller/upload.controller';

const app: Express = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload/single', upload.single('file'), uploadFile);
app.post('/upload/multiple', upload.array('files', 5), uploadFiles);

describe('Upload Controller', () => {
  describe('uploadFile', () => {
    it('should upload a single file and return its URL', async () => {
      const response = await request(app)
        .post('/upload/single')
        .attach('file', path.resolve(__dirname, '../../assets/sample1.png')); 

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('fileUrl');
      expect(response.body.message).toBe('File uploaded successfully');
    });

    it('should return 400 if no file is uploaded', async () => {
      const response = await request(app).post('/upload/single');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('No file uploaded');
    });
  });

  describe('uploadFiles', () => {
    it('should upload multiple files and return their URLs', async () => {
      const response = await request(app)
        .post('/upload/multiple')
        .attach('files', path.resolve(__dirname, '../../assets/sample1.png'))
        .attach('files', path.resolve(__dirname, '../../assets/sample2.png'));

      expect(response.status).toBe(200);
      expect(response.body.fileUrls).toBeInstanceOf(Array);
      expect(response.body.fileUrls.length).toBe(2);
      expect(response.body.message).toBe('Files uploaded successfully');
    });

    it('should return 400 if no files are uploaded', async () => {
      const response = await request(app).post('/upload/multiple');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('No files uploaded');
    });
  });
});
