const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const transporter = require("../mailer");

const router = express.Router();

// Helper to generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ===== REGISTER + SEND OTP =====
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Please fill all fields" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    db.query(
      "INSERT INTO users (username, email, password, otp, is_verified) VALUES (?, ?, ?, ?, ?)",
      [username, email, hashedPassword, otp, false],
      (err) => {
        if (err) return res.status(500).send(err);

        // Send OTP email
        const mailOptions = {
          from: '"Auth App" <avikedare27@gmail.com>',
          to: email,
          subject: "Verify your email",
          text: `Your OTP is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ msg: "Error sending OTP" });
          }
          res.json({ msg: "Registered! OTP sent to your email." });
        });
      }
    );
  });
});

// ===== VERIFY OTP =====
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) return res.status(400).json({ msg: "Please provide email and OTP" });

  db.query("SELECT * FROM users WHERE email = ? AND otp = ?", [email, otp], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(400).json({ msg: "Invalid OTP" });

    db.query("UPDATE users SET is_verified = TRUE, otp = NULL WHERE email = ?", [email], (err) => {
      if (err) return res.status(500).send(err);
      res.json({ msg: "Email verified successfully! You can now login." });
    });
  });
});

// ===== LOGIN (ONLY VERIFIED USERS) =====
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ msg: "Please fill all fields" });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(400).json({ msg: "Invalid credentials" });

    const user = results[0];
    if (!user.is_verified) return res.status(400).json({ msg: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, "secretKey", { expiresIn: "1h" });
    res.json({ msg: "Login successful", token });
  });
});

module.exports = router;
