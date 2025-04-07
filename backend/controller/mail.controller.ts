
import { transporter } from "../config/mailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { Request, Response } from "express";

export const sendEmail = async (req: Request, res: Response): Promise<void> => { 
  try {
    const { to, subject, template, variables, attachments } = req.body;

  
    if (!to || typeof to !== "string" || to.trim() === "") {
      res.status(400).json({ error: "Recipient email is required" });
      return;
    }

    console.log("Recipient Email:", to);

 
    const templatePath = path.join(__dirname, `../templates/${template}.html`);
    if (!fs.existsSync(templatePath)) {
      res.status(400).json({ error: `Template ${template}.html not found` });
      return;
    }

    const source = fs.readFileSync(templatePath, "utf8");
    const compiledTemplate = handlebars.compile(source);
    const htmlContent = compiledTemplate(variables);

 
    const emailAttachments =
      attachments?.map((filename: string) => ({
        filename,
        path: path.join(__dirname, `../attachments/${filename}`),
      })) || [];

    const mailOptions = {
      from: "sivakumarrajaait@gmail.com",
      to,
      subject,
      html: htmlContent,
      attachments: emailAttachments,
    };

    console.log("Sending Email with options:", mailOptions);

  
    await transporter.sendMail(mailOptions); 
    res.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

