import "dotenv/config";
import express from "express";
import cors from "cors";

const PORT = Number(process.env.PORT || process.env.CONTACT_API_PORT || 3001);

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function applyTemplate(template, vars) {
  return String(template).replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

function normalizeTemplateText(value) {
  return String(value).replace(/\\n/g, "\n");
}

function textToHtml(text) {
  return escapeHtml(text)
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");
}

function buildPortfolioEmailLayout({
  title,
  subtitle,
  bodyHtml,
  ctaLabel,
  ctaUrl,
  footerHtml,
  profileImageUrl,
}) {
  const ctaBlock =
    ctaLabel && ctaUrl
      ? `<tr>
          <td style="padding:0 32px 28px 32px;">
            <a href="${escapeHtml(ctaUrl)}" target="_blank" rel="noreferrer" style="display:inline-block;background:#8b5cf6;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600;">
              ${escapeHtml(ctaLabel)}
            </a>
          </td>
        </tr>`
      : "";

  const profileImageBlock = profileImageUrl
    ? `<div style="margin-bottom:14px;">
        <img
          src="${escapeHtml(profileImageUrl)}"
          alt="Ashish Bedi"
          width="56"
          height="56"
          style="display:block;width:56px;height:56px;border-radius:999px;border:2px solid #a78bfa;"
        />
      </div>`
    : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#070b17;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;color:#e5e7eb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#070b17;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#0f172a;border:1px solid #1e293b;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px;background:linear-gradient(135deg,#1e1b4b,#312e81);">
                ${profileImageBlock}
                <div style="font-size:13px;letter-spacing:0.08em;color:#c4b5fd;text-transform:uppercase;margin-bottom:8px;">Ashish's Portfolio</div>
                <h1 style="margin:0;font-size:26px;line-height:1.3;color:#ffffff;">${escapeHtml(title)}</h1>
                <p style="margin:10px 0 0 0;color:#ddd6fe;font-size:15px;line-height:1.6;">${escapeHtml(subtitle)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 24px 32px;">
                <div style="font-size:15px;line-height:1.8;color:#e2e8f0;">
                  ${bodyHtml}
                </div>
              </td>
            </tr>
            ${ctaBlock}
            <tr>
              <td style="border-top:1px solid #1e293b;padding:18px 32px;color:#94a3b8;font-size:13px;line-height:1.7;">
                ${footerHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildAckEmail({ name, message }) {
  const subjectTemplate = normalizeTemplateText(
    process.env.ACK_SUBJECT || "Thanks for reaching out, {{name}}!"
  );
  const bodyTemplate = normalizeTemplateText(
    process.env.ACK_BODY ||
      `Hi {{name}},

Thank you for contacting me through my portfolio website.

I have successfully received your message and appreciate you taking the time to get in touch. I will review your inquiry and respond as soon as possible.

Your Message:
"{{message}}"

I look forward to connecting with you.

Best regards,
Ashish Bedi
Full Stack Developer
{{linkedinUrl}}`
  );

  const vars = {
    name: String(name).trim(),
    message: String(message).trim(),
    linkedinUrl:
      process.env.ACK_LINKEDIN_URL || "https://www.linkedin.com/in/ashish-bedi-45a6b0256/",
    profileImageUrl:
      process.env.ACK_PROFILE_IMAGE_URL || "https://avatars.githubusercontent.com/ashishbedi1",
  };

  const subject = applyTemplate(subjectTemplate, vars);
  const text = applyTemplate(bodyTemplate, vars);
  const html = buildPortfolioEmailLayout({
    title: `Thanks for reaching out, ${vars.name}!`,
    subtitle: "Your message was received successfully.",
    bodyHtml: `<p style="margin:0 0 14px 0;">${textToHtml(text)}</p>`,
    ctaLabel: "Connect on LinkedIn",
    ctaUrl: vars.linkedinUrl,
    profileImageUrl: vars.profileImageUrl,
    footerHtml:
      'This is an automated acknowledgment from Ashish\'s portfolio contact form.<br/>If this was not you, you can ignore this email.',
  });

  return { subject, text, html };
}

function buildOwnerNotificationEmail({ name, email, message }) {
  const safeName = String(name).trim();
  const safeEmail = String(email).trim();
  const safeMessage = String(message).trim();
  const profileImageUrl =
    process.env.ACK_PROFILE_IMAGE_URL || "https://avatars.githubusercontent.com/ashishbedi1";
  const text = `New contact form submission\n\nFrom: ${safeName} <${safeEmail}>\n\nMessage:\n${safeMessage}`;

  const html = buildPortfolioEmailLayout({
    title: "New Contact Form Message",
    subtitle: `${safeName} sent you a message.`,
    bodyHtml: `<p style="margin:0 0 12px 0;"><strong>From:</strong> ${escapeHtml(safeName)} &lt;${escapeHtml(safeEmail)}&gt;</p>
      <div style="background:#0b1226;border:1px solid #1f2a44;border-radius:12px;padding:14px 16px;color:#cbd5e1;">
        ${textToHtml(safeMessage)}
      </div>`,
    ctaLabel: "Reply to sender",
    ctaUrl: `mailto:${encodeURIComponent(safeEmail)}`,
    profileImageUrl,
    footerHtml: "Delivered by portfolio contact API.",
  });

  return { text, html };
}

async function sendBrevoEmail({ to, toName, subject, html, text, replyTo, senderName }) {
  const apiKey = process.env.BREVO_API_KEY;
  const contactFrom = process.env.CONTACT_FROM;

  const payload = {
    sender: { name: senderName, email: contactFrom },
    to: [{ email: to, name: toName || to }],
    subject,
    htmlContent: html,
    textContent: text,
  };

  if (replyTo) {
    payload.replyTo = { email: replyTo };
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Brevo API error ${response.status}: ${errBody}`);
  }
}

const app = express();
const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json({ limit: "48kb" }));

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "portfolio-contact-api" });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!String(name || "").trim() || !String(email || "").trim() || !String(message || "").trim()) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const brevoApiKey = process.env.BREVO_API_KEY;
  const contactTo = process.env.CONTACT_TO;
  const contactFrom = process.env.CONTACT_FROM;

  if (!brevoApiKey || !contactTo || !contactFrom) {
    console.error("Missing BREVO_API_KEY, CONTACT_TO, or CONTACT_FROM configuration");
    return res.status(503).json({ error: "Email service not configured" });
  }

  try {
    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim();
    const trimmedMessage = String(message).trim();

    const ownerMail = buildOwnerNotificationEmail({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    });

    await sendBrevoEmail({
      to: contactTo,
      toName: "Ashish Bedi",
      subject: `Portfolio: message from ${trimmedName}`,
      html: ownerMail.html,
      text: ownerMail.text,
      replyTo: trimmedEmail,
      senderName: "Portfolio",
    });

    const sendAck = process.env.SEND_ACK_EMAIL !== "false";
    if (sendAck) {
      const ack = buildAckEmail({ name: trimmedName, message: trimmedMessage });
      await sendBrevoEmail({
        to: trimmedEmail,
        toName: trimmedName,
        subject: ack.subject,
        html: ack.html,
        text: ack.text,
        senderName: "Ashish Bedi",
      });
    }

    res.json({ ok: true, ackSent: sendAck });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Contact API (Brevo) listening on http://localhost:${PORT}`);
});
