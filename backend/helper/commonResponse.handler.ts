import nodemailer, { SentMessageInfo } from "nodemailer"; 
import dotenv from "dotenv";

dotenv.config();

interface Contact {
    name: string;
    email: string;
    mobileNumber: string;
    subject: string;
    message: string;
}

export const sendEmail = async (contact: Contact): Promise<void> => {
    const sender = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const composeMail = {
        from: process.env.EMAIL_USER,
        replyTo: contact.email,
        to: "sivakumarrajaait@gmail.com",
        subject: `Welcome to My Website Contact: ${contact.subject}`,
        text: `
            Name: ${contact.name}
            Email: ${contact.email}
            Mobile Number: ${contact.mobileNumber}
            Subject: ${contact.subject}
            Message: ${contact.message}
        `,
    };

    sender.sendMail(composeMail, (error: Error | null, info: SentMessageInfo) => {
        if (error) {
            console.error("Error sending email:", error.message);
        } else {
            console.log("Mail sent successfully:", info.response);
        }
    });
};
