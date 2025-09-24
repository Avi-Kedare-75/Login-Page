const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "avikedare27@gmail.com",       
    pass: ""           
  }
});

module.exports = transporter;


