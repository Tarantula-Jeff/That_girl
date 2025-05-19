const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests are allowed" });
  }

  const { firstName, lastName, name, email, phone, message } = req.body;
  const fullName = firstName && lastName
    ? `${firstName} ${lastName}`
    : name || "No name provided";

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Cyril Photos" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: "CYRIL-Frames Connect",
      text: `
                BOOKING MESSAGE
      -------------------------------------
      
        Name: ${fullName}
        Email: ${email}
        Phone: ${phone || "Not provided"}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.redirect(303, "https://cyril-photos.vercel.app/success.html");
  } catch (error) {
    console.error("Email Error:", error);
    return res.status(500).send({ message: "Email could not be sent", error });
  }
}
