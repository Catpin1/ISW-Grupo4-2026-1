const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (options) => {
  const mailOptions = {
    from: '"Mi App" <no-reply@miapp.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  return await transporter.sendMail(mailOptions);
};