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

    const otp = Math.floor(100000 + Math.random() * 900000);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP",
      text: `Your OTP is ${otp}`
    });

    console.log("OTP sent to:", email);

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

  if (record.otp !== otp) {
    return res.status(400).json({ message: "Wrong OTP" });
  }

  if (record.expiresAt < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

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
