import nodemailer from "nodemailer";
import AsyncHandler from 'express-async-handler';


export const sendEmail = AsyncHandler( async (data, req, res) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })

    let info = await transporter.sendMail({
        from: "Foo bar",
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html
    })
    console.log("message sent:", info.messageId)
})