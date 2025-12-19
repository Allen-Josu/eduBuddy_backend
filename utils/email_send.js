const nodeMailer = require("nodemailer");

exports.sendMail = async (email, subject, text, html) => {
  try {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.gmail,
        pass: process.env.pass,
      },
    });

    const mailOptions = {
      from: "STACC - Edubuddy",
      to: email,
      subject: subject,
      text: text,
      html: html, 
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email", error };
  }
};