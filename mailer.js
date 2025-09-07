const nodemailer = require("nodemailer");

// Using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "avikedare27@gmail.com",       // replace with your email
    pass: "iiufleonnkxisfed"           // App password if 2FA enabled
  }
});

module.exports = transporter;
