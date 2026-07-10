import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { devisId, clientEmail, clientNom, prestataireNom, numero, montantTTC, lienSignature } = await req.json()

  try {
    await resend.emails.send({
      from: 'FaireDesDevis <onboarding@resend.dev>',
      to: clientEmail,
      subject: `Devis ${numero} de ${prestataireNom}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#2563eb;padding:24px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="color:white;margin:0;font-size:24px">FaireDesDevis</h1>
          </div>
          <div style="background:white;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">
            <p style="font-size:16px;color:#1e293b">Bonjour <strong>${clientNom}</strong>,</p>
            <p style="color:#64748b">Vous avez reçu un devis de la part de <strong>${prestataireNom}</strong>.</p>
            <div style="background:#f8fafc;border-left:4px solid #2563eb;padding:16px;border-radius:0 8px 8px 0;margin:24px 0">
              <p style="margin:0;color:#64748b;font-size:14px">Devis N°</p>
              <p style="margin:4px 0 0;font-size:20px;font-weight:bold;color:#1e293b">${numero}</p>
              <p style="margin:8px 0 0;font-size:24px;font-weight:bold;color:#2563eb">${montantTTC} € TTC</p>
            </div>
            <p style="color:#64748b">Pour consulter, accepter ou refuser ce devis, cliquez sur le bouton ci-dessous :</p>
            <div style="text-align:center;margin:32px 0">
              <a href="${lienSignature}" style="background:#2563eb;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">
                Voir et signer le devis →
              </a>
            </div>
            <p style="color:#94a3b8;font-size:12px;text-align:center">
              Ce lien est valable 30 jours. Si vous n'êtes pas concerné par ce devis, ignorez cet email.
            </p>
          </div>
          <p style="text-align:center;color:#94a3b8;font-size:11px;margin-top:16px">
            FaireDesDevis.fr — Devis professionnels en 60 secondes
          </p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur envoi email:', error)
    return NextResponse.json({ error: 'Erreur envoi email' }, { status: 500 })
  }
}