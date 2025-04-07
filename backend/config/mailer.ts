
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Mail Transporter Error:", error);
  } else {
    console.log("Mail Transporter is ready to send emails");
  }
});


