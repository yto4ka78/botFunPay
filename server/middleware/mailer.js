import nodemailer from "nodemailer";

export async function sendVerificationEmail(to, link) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"BotFunPay" <${process.env.SMTP_USER}>`,
    to,
    subject: "Confirmation of registration",
    html: `
      <h2>Confirmation of registration on BFP</h2>
      <p>To activate your account, click the link below:</p>
      <a href="${link}">Click on this inscription</a>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully!");
    console.log("Accepted:", info.accepted);
    console.log("Envelope:", info.envelope);
    console.log("HTML content:\n", mailOptions.html);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}
