const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));
app.use(bodyParser.json());

let verificationCodes = {}; // store codes temporarily

// EMAIL CONFIG (use your Gmail)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
    }
});

// SEND CODE
app.post("/send-code", async (req, res) => {
    const { email } = req.body;

    const code = Math.floor(100000 + Math.random() * 900000);

    verificationCodes[email] = code;

    const mailOptions = {
        from: `SecureTrace <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "SecureTrace Verification Code",
        text: `Your verification code is: ${code}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (err) {
        console.log("EMAIL ERROR:", err.message);
        res.json({ success: false, error: err.message });
    }
});

// VERIFY CODE
app.post("/verify-code", (req, res) => {
    const { email, code } = req.body;

    if (verificationCodes[email] == code) {
        delete verificationCodes[email];
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});