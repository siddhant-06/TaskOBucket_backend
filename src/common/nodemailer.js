// // src/utils/sendEmail.js
// import nodemailer from 'nodemailer';

// // Sends an email using NodeMailer
// export const sendEmail = async (
//   to = 'send@123.com',
//   subject = 'Test Email Subject',
//   text = 'This is a test email',
//   html = '<p>Hello Test Email</p>'
// ) => {
//   try {
//     // Create a transporter object using default SMTP transport
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER, // Replace with your email address
//         pass: process.env.EMAIL_PASS, // Replace with your email password or app password
//       },
//     });

//     // Email options
//     const mailOptions = {
//       from: process.env.EMAIL_USER, // Sender address
//       to, // List of recipients
//       subject, // Subject line
//       text, // Plain text body
//       html, // HTML body (optional)
//     };

//     // Send mail
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully!');
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Email sending failed');
//   }
// };

// // use like await sendEmail('recipient@example.com', 'Welcome Email', 'Plain text version', `<h1>Welcome to Our Service!</h1>`);
