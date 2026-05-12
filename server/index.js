import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const PORT = Number(process.env.CONTACT_API_PORT || 3001);

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const app = express();
const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json({ limit: "48kb" }));

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!String(name || "").trim() || !String(email || "").trim() || !String(message || "").trim()) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const contactTo = process.env.CONTACT_TO || smtpUser;
  const contactFrom = process.env.CONTACT_FROM || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || !contactTo) {
    console.error("Missing SMTP or CONTACT_TO configuration");
    return res.status(503).json({ error: "Email service not configured" });
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true";

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port,
      secure,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"Portfolio" <${contactFrom}>`,
      to: contactTo,
      replyTo: String(email).trim(),
      subject: `Portfolio: message from ${String(name).trim()}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Contact API (Nodemailer) listening on http://localhost:${PORT}`);
});
