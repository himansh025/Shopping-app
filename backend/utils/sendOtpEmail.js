// utils/sendOtpEmail.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config({ path: './.env' });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendOtpEmail = async ({ email, fullname, otp }) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Welcome ${fullname}! Verify Your Account`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #3b82f6;">Complete Your Registration</h2>
        <p>Hi ${fullname},</p>
        <p>Thank you for signing up! To complete your registration, please enter the following verification code:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <h1 style="font-size: 32px; letter-spacing: 5px; margin: 0; color: #1e3a8a;">${otp}</h1>
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;
