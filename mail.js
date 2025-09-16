const nodemailer = require("nodemailer");

// 1. Transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shaybankhan12345@gmail.com",  
    pass: "tqxy lsxb eppf bgyi"         
  }
});


function sendEmail(to , subject, text) {
  const mailOptions = {
    from: "shaybankhan12345@gmail.com",
    to: to,
    subject: subject,
    text: text
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error: ", error);
    }
    console.log("Email sent: " + info.response);
  });
}

module.exports = sendEmail;