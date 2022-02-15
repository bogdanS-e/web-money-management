import nodemailer from "nodemailer";

const emailClient = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  }
});

emailClient.verify().then(console.log).catch(console.error);


export default emailClient;