const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let verificationCodes = {}; // store codes temporarily

// EMAIL CONFIG (use your Gmail)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "aruyapeace@gmail.com",
        pass: "wbmg qmmc sqix ijyj" // NOT your normal password
    }
});

// SEND CODE
app.post("/send-code", async (req, res) => {
    const { email } = req.body;

    const code = Math.floor(100000 + Math.random() * 900000);

    verificationCodes[email] = code;

    const mailOptions = {
        from: "SecureTrace <aruyapeace@gmail.com>",
        to: email,
        subject: "SecureTrace Verification Code",
        text: `Your verification code is: ${code}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
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

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});