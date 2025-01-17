import nodemailer from "nodemailer";
import { generateAccessToken } from "./accessToken.js";
import { APP_NAME } from "../configs/serverPath.js";

import {
  EMAIL_SENDER,
} from "../configs/email.js";

export async function sendEmail({
  to,
  subject,
  text,
  html = "",
  name = EMAIL_SENDER,
  from = process.env.FROM_EMAIL,
}) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      logger: true,
      debug: true,
    });

    const info = await transporter.sendMail({
      from: `${name} <${from}>`,
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    throw new Error("Failed to send email. " + error.message);
  }
}

export function sendAccountActivationEmail(users, subject, text) {
  const { email, name, _id } = users;

  return sendEmail({
    to: email,
    subject: subject || `Your ${APP_NAME} Account Activation`,
    text:
      text ||
      `
            Welcome ${name}!
            Thank you for signup
            Please click on the bewlo link to activate your account. 
            Link: ${
              process.env.SERVER_HOST_URL
            }/api/v1/user/activate/${generateAccessToken({ accessKey: _id })}  
        `,
  });
}
