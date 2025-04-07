
import { transporter } from "../config/mailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { Request, Response } from "express";
import validator from "validator";
export const sendEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { to, subject, template, variables, attachments } = req.body;

    if (!to || typeof to !== "string" || !validator.isEmail(to.trim())) {
      res.status(400).json({ error: "Valid recipient email is required." });
      return;
    }

    if (!template || typeof template !== "string" || !/^[a-zA-Z0-9_-]+$/.test(template)) {
      res.status(400).json({ error: "Invalid template name." });
      return;
    }

    const templateDir = path.join(__dirname, "..", "templates");
    const templatePath = path.join(templateDir, `${template}.html`);

    if (!fs.existsSync(templatePath)) {
      res.status(404).json({ error: `Template '${template}.html' not found.` });
      return;
    }

    const source = fs.readFileSync(templatePath, "utf8");
    const compiledTemplate = handlebars.compile(source);
    const htmlContent = compiledTemplate(variables ?? {});

    const emailAttachments =
      Array.isArray(attachments) &&
      attachments.every(
        (file: unknown) => typeof file === "string" && /^[\w,\s-]+\.[A-Za-z]{3,5}$/.test(file)
      )
        ? attachments.map((filename: string) => ({
            filename,
            path: path.join(__dirname, "..", "attachments", filename),
          }))
        : [];

    const mailOptions = {
      from: "sivakumarrajaait@gmail.com",
      to: to.trim(),
      subject: subject?.trim() ?? "No Subject",
      html: htmlContent,
      attachments: emailAttachments,
    };

    console.log("Sending email to:", to);

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

