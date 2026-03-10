import nodemailer from 'nodemailer';

const NOTIFICATION_EMAILS = (process.env.NOTIFICATION_EMAILS || '').split(',').filter(Boolean);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

type LeadData = {
  name: string;
  lastname?: string | null;
  email: string;
  phone?: string | null;
  company?: string | null;
  interest?: string | null;
  message?: string | null;
  source: string;
};

export async function sendLeadNotification(lead: LeadData) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD || NOTIFICATION_EMAILS.length === 0) {
    console.warn('Email notification skipped: SMTP credentials or NOTIFICATION_EMAILS not configured');
    return;
  }

  const fullName = [lead.name, lead.lastname].filter(Boolean).join(' ');
  const sourceLabel = lead.source === 'hero-form' ? 'Formulario principal' : 'Modal de cotización';

  const rows = [
    { label: 'Nombre', value: fullName },
    { label: 'Email', value: lead.email },
    { label: 'Teléfono', value: lead.phone || 'No indicado' },
    { label: 'Empresa', value: lead.company || 'No indicada' },
    { label: 'Áreas de interés', value: lead.interest || 'No indicadas' },
    { label: 'Mensaje', value: lead.message || 'Sin mensaje' },
    { label: 'Origen', value: sourceLabel },
  ];

  const htmlRows = rows
    .map(
      (r) =>
        `<tr>
          <td style="padding:8px 12px;font-weight:600;color:#334155;border-bottom:1px solid #e2e8f0;white-space:nowrap;vertical-align:top">${r.label}</td>
          <td style="padding:8px 12px;color:#475569;border-bottom:1px solid #e2e8f0">${r.value}</td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#002366;padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">Nuevo Lead Recibido</h1>
      </div>
      <div style="background:#fff;padding:24px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px">
        <p style="color:#64748b;margin:0 0 16px;font-size:14px">Se ha registrado un nuevo lead desde la página web.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${htmlRows}
        </table>
        <div style="margin-top:24px;text-align:center">
          <a href="https://interfazdidactica.com/admin/leads"
             style="display:inline-block;background:#f28500;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">
            Ver en el CRM
          </a>
        </div>
      </div>
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">
        Interfaz Didáctica — Notificación automática
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Interfaz Didáctica" <${process.env.SMTP_EMAIL}>`,
      to: NOTIFICATION_EMAILS.join(', '),
      subject: `Nuevo lead: ${fullName} — ${sourceLabel}`,
      html,
    });
    console.log('Lead notification email sent to:', NOTIFICATION_EMAILS.join(', '));
  } catch (error) {
    console.error('Failed to send lead notification email:', error);
  }
}
