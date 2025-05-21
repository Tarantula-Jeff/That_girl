const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests are allowed" });
  }


  const { name, email, contact, deliveryAddress, item, quantity, message } = req.body;


  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"That Girl Jewels" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: "THAT GIRL MUST HAVES ORDERS",
      text: `
          NEW ORDER DETAILS
  -------------------------------------

  Name: ${name}
  Email: ${email}
  Contact: ${contact || "Not provided"}
  Delivery Address: ${deliveryAddress || "Not provided"}
  Item: ${item || "Not specified"}
  Quantity: ${quantity}
  Message: ${message || "None"}

  -------------------------------------
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.redirect(303, "https://cyril-photos.vercel.app/success.html");
  } catch (error) {
    console.error("Email Error:", error);
    return res.status(500).send({ message: "Email could not be sent", error });
  }
}
