const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525, // STARTTLS
      secure: false, // Not using SSL
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 2) Define the email options
    const mailOptions = {
      from: "Abhishek Tripathi <abhishektripath.vns@gmail.com>",
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || undefined, // Optional HTML content
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error(`Error sending email to ${options.email}:`, error.message);
    throw new Error("Email could not be sent. Please try again later.");
  }
};

module.exports = sendEmail;
