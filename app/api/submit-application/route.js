import { sql } from '@vercel/postgres';
import { put } from '@vercel/blob';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Récupération des données
    const nom = formData.get('nom');
    const prenom = formData.get('prenom');
    const email = formData.get('email');
    const telephone = formData.get('telephone');
    const poste = formData.get('poste');
    const ville = formData.get('ville');
    const quartier = formData.get('quartier') || '';
    const message = formData.get('message') || '';
    const cvFile = formData.get('cv');

    // Validation des données obligatoires
    if (!nom || !prenom || !email || !telephone || !poste || !ville || !cvFile) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Upload du CV vers Vercel Blob
    let cvUrl = null;
    try {
      const blob = await put(`cv/${Date.now()}-${cvFile.name}`, cvFile, {
        access: 'public',
      });
      cvUrl = blob.url;
    } catch (error) {
      console.error('Erreur upload CV:', error);
      return NextResponse.json(
        { error: 'Erreur lors du téléchargement du CV' },
        { status: 500 }
      );
    }

    // Enregistrement dans la base de données
    try {
      await sql`
        INSERT INTO candidatures (
          nom, prenom, email, telephone, poste, ville, quartier, message, cv_url, date_soumission
        ) VALUES (
          ${nom}, ${prenom}, ${email}, ${telephone}, ${poste}, ${ville}, ${quartier}, ${message}, ${cvUrl}, NOW()
        )
      `;
    } catch (error) {
      console.error('Erreur BD:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement dans la base de données' },
        { status: 500 }
      );
    }

    // Envoi de l'email au recruteur
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev ', // Changez ceci avec votre domaine vérifié
        to: 'spasunshine7@gmail.com ', // Email du recruteur
        subject: `Nouvelle candidature : ${poste} - ${prenom} ${nom}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #d4af37, #f4e04d); padding: 40px; text-align: center;">
              <h1 style="color: #000; margin: 0; font-size: 32px;">Nouvelle Candidature Reçue</h1>
            </div>
            
            <div style="padding: 40px; background: white;">
              <h2 style="color: #d4af37; border-bottom: 3px solid #d4af37; padding-bottom: 10px; margin-bottom: 25px;">
                📋 Informations du Candidat
              </h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px; background: #f9f9f9; font-weight: bold; width: 150px;">Nom</td>
                  <td style="padding: 12px; background: white;">${nom}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; background: #f9f9f9; font-weight: bold;">Prénom</td>
                  <td style="padding: 12px; background: white;">${prenom}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; background: #f9f9f9; font-weight: bold;">Email</td>
                  <td style="padding: 12px; background: white;">
                    <a href="mailto:${email}" style="color: #d4af37; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px; background: #f9f9f9; font-weight: bold;">Téléphone</td>
                  <td style="padding: 12px; background: white;">${telephone}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; background: #f9f9f9; font-weight: bold;">Poste</td>
                  <td style="padding: 12px; background: white;"><strong>${poste}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 12px; background: #f9f9f9; font-weight: bold;">Localisation</td>
                  <td style="padding: 12px; background: white;">${ville}${quartier ? ', ' + quartier : ''}</td>
                </tr>
              </table>
              
              ${message ? `
                <h3 style="color: #d4af37; margin-top: 30px; margin-bottom: 15px;">
                  💬 Message / Motivation
                </h3>
                <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #d4af37; line-height: 1.6;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              ` : ''}
              
              <div style="margin-top: 40px; text-align: center;">
                <a href="${cvUrl}" 
                   style="display: inline-block; 
                          padding: 18px 40px; 
                          background: linear-gradient(135deg, #d4af37, #f4e04d); 
                          color: #000; 
                          text-decoration: none; 
                          border-radius: 10px; 
                          font-weight: bold;
                          font-size: 16px;
                          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);">
                  📄 Télécharger le CV
                </a>
              </div>
            </div>
            
            <div style="padding: 30px; text-align: center; background: #1a1a1a; color: #999;">
              <p style="margin: 0; font-size: 14px;">© 2025 Sunshine Beauty & Spa</p>
              <p style="margin: 5px 0 0 0; font-size: 12px;">Plateforme de recrutement</p>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error('Erreur envoi email recruteur:', error);
      // On continue même si l'email échoue
    }

    // Email de confirmation au candidat
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Confirmation de réception de votre candidature - Sunshine Beauty & Spa',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #d4af37, #f4e04d); padding: 40px; text-align: center;">
              <h1 style="color: #000; margin: 0; font-size: 36px;">✨ Merci ${prenom} !</h1>
            </div>
            
            <div style="padding: 40px; background: white;">
              <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
                Bonjour <strong>${prenom} ${nom}</strong>,
              </p>
              
              <p style="font-size: 16px; color: #666; line-height: 1.8; margin-bottom: 25px;">
                Nous avons bien reçu votre candidature pour le poste de <strong style="color: #d4af37;">${poste}</strong>.
              </p>
              
              <div style="background: #f9f9f9; padding: 25px; border-left: 4px solid #d4af37; margin: 30px 0;">
                <p style="margin: 0; color: #666; line-height: 1.8;">
                  Notre équipe va examiner votre profil avec attention. 
                  Si votre profil correspond à nos besoins, nous vous recontacterons dans les meilleurs délais 
                  pour la suite du processus de recrutement.
                </p>
              </div>
              
              <p style="font-size: 16px; color: #666; margin-top: 30px;">
                Nous vous remercions pour l'intérêt que vous portez à Sunshine Beauty & Spa.
              </p>
              
              <p style="margin-top: 40px; color: #666;">
                Cordialement,
              </p>
              <p style="color: #d4af37; font-weight: bold; font-size: 18px; margin: 5px 0;">
                L'équipe Sunshine Beauty & Spa
              </p>
            </div>
            
            <div style="padding: 30px; text-align: center; background: #1a1a1a; color: #999;">
              <p style="margin: 0; font-size: 14px;">© 2025 Sunshine Beauty & Spa</p>
              <p style="margin: 5px 0 0 0; font-size: 12px;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </p>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error('Erreur envoi email candidat:', error);
      // On continue même si l'email échoue
    }

    return NextResponse.json({ 
      success: true,
      message: 'Candidature envoyée avec succès' 
    });

  } catch (error) {
    console.error('Erreur générale:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de votre candidature' },
      { status: 500 }
    );
  }
}