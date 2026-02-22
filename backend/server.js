require("dotenv").config()
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const service_account = require("./serviceKey.json");
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Otp = require("./../models/Otp");

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/api/request-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateOTP();  // use your function

    // Delete old OTP if exists
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry
    });

    await transporter.sendMail({
      from: `"DigiNoteS" <${process.env.EMAIL}>`,
      to: email,
      subject: "Verify your account",
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>Email Verification</h2>
          <p>Dear User,</p>
          <p>Thank you for requesting to verify your email address. </p><br>
          <p>Your One Time Password (OTP) is:${otp}<br>Please be advised that this OTP will expire in 5 minutes, and we kindly ask you to utilize it promptly.</p>
          <br>
          <br>
          <p>Regards,<br>
          DigiNoteS<br>
          d25dit079@charusat.edu.in<br>
          9428182546</p>
        </div>
      `
    });
    console.log("OTP sent and saved:", otp);

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});
app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email });

  if (!record) {
    return res.status(400).json({ message: "OTP not found" });
  }

  if (record.otp.toString() !== otp.toString()) {
    return res.status(400).json({ message: "Wrong OTP" });
  }

  if (record.expiresAt < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  // Optional: Delete OTP after success
  await Otp.deleteMany({ email });

  res.json({ message: "OTP verified" });
});
app.listen(5000, () => {
    console.log("server is running")
});

admin.initializeApp({
    credential: admin.credential.cert(service_account)
});

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
