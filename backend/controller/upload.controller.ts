import { Request, Response } from "express";


export const uploadFile = (req: Request, res: Response): void => {
  
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }


  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.status(200).json({ message: "File uploaded successfully", fileUrl });
};

export const uploadFiles = (req: Request, res: Response): void => {
  console.log("Received files:", req.files);

  if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
     res.status(400).json({ message: "No files uploaded" })
     return;
  }

  const fileUrls = (req.files as Express.Multer.File[]).map((file) => {
    return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  });

  res.status(200).json({
    message: "Files uploaded successfully",
    fileUrls,
  });
};
