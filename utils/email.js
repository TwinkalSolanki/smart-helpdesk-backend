const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_EMAIL_HOST,
    port: process.env.SMTP_EMAIL_PORT,
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.SMTP_EMAIL_USER,
        pass: process.env.SMTP_EMAIL_PASS,
    },
});
    
exports.sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"Helpdesk" <${process.env.SMTP_EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log("Email sent to", to);
    } catch (err) {
        console.error("Email send failed:", err);
    }
}   


