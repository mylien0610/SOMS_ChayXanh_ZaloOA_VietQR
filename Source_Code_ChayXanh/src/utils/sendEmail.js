const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(toEmail, subject, text) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_ACCOUNT,
      pass: process.env.SMTP_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: `ntml061002@gmail.com`, // sender address
    to: toEmail,
    subject: subject,
    text: text,
  });

  console.log(`Message sent: ${info.messageId}`);
}

module.exports = sendEmail;
