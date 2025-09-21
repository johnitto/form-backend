const express = require("express");
const nodemailer = require("nodemailer");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/send-form", async (req, res) => {
  const { to_email, ...fields } = req.body;

  // Transport SMTP (via Gmail gratuit)
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Construire dynamiquement le message
  let messageBody = "";
  for (const [key, value] of Object.entries(fields)) {
    messageBody += `${key}: ${value}\n`;
  }

  await transporter.sendMail({
    from: `"Formulaire Site" <${process.env.SMTP_USER}>`,
    to: to_email,
    subject: "Nouveau message depuis un site EvoSite",
    text: messageBody
  });

  res.json({ success: true });
});

app.listen(3000, () => console.log("Form backend running 🚀"));
