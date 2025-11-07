import { createPool } from '@vercel/postgres';
import { put } from '@vercel/blob';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Créer la connexion avec fallback sur DATABASE_URL
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('AUCUNE VARIABLE DE CONNEXION TROUVÉE !');
  console.error('Variables disponibles:', Object.keys(process.env).filter(k => k.includes('POSTGRES') || k.includes('DATABASE')));
}

const pool = createPool({
  connectionString: connectionString,
});

const sql = pool.sql;

// Initialiser Resend seulement si la clé existe
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request) {
  console.log('API appelée - Début du traitement');
  
  try {
    const formData = await request.formData();
    console.log('FormData reçu');
    
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

    console.log('Données reçues:', { nom, prenom, email, telephone, poste, ville });

    // Validation des données obligatoires
    if (!nom || !prenom || !email || !telephone || !poste || !ville || !cvFile) {
      console.error('Validation échouée - Champs manquants');
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Upload du CV vers Vercel Blob
    let cvUrl = null;
    try {
      console.log('Upload du CV...');
      const blob = await put(`cv/${Date.now()}-${cvFile.name}`, cvFile, {
        access: 'public',
      });
      cvUrl = blob.url;
      console.log('CV uploadé:', cvUrl);
    } catch (error) {
      console.error('Erreur upload CV:', error);
      return NextResponse.json(
        { error: 'Erreur lors du téléchargement du CV: ' + error.message },
        { status: 500 }
      );
    }

    // Enregistrement dans la base de données
    try {
      console.log('Enregistrement dans la BD...');
      
      const result = await sql`
        INSERT INTO candidatures (
          nom, prenom, email, telephone, poste, ville, quartier, message, cv_url, date_soumission
        ) VALUES (
          ${nom}, ${prenom}, ${email}, ${telephone}, ${poste}, ${ville}, ${quartier}, ${message}, ${cvUrl}, NOW()
        )
        RETURNING id
      `;
      
      console.log('Candidature enregistrée avec succès, ID:', result.rows[0]?.id);
    } catch (error) {
      console.error('Erreur BD:', error);
      console.error('Détails erreur:', error.message);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement: ' + error.message },
        { status: 500 }
      );
    }

    // Envoi des emails seulement si Resend est configuré
    if (resend) {
      // Email au recruteur
      try {
        console.log(' Envoi email recruteur...');
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: 'spasunshine7@gmail.com', // CHANGEZ CECI !
          subject: `Nouvelle candidature : ${poste} - ${prenom} ${nom}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5;">
              <div style="background: linear-gradient(135deg, #d4af37, #f4e04d); padding: 40px; text-align: center;">
                <h1 style="color: #000; margin: 0; font-size: 32px;">✨ Nouvelle Candidature Reçue</h1>
              </div>
              
              <div style="padding: 40px; background: white;">
                <h2 style="color: #d4af37; border-bottom: 3px solid #d4af37; padding-bottom: 10px; margin-bottom: 25px;">
                  Informations du Candidat
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
                    <td style="padding: 12px; background: white;"><strong style="color: #d4af37;">${poste}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; background: #f9f9f9; font-weight: bold;">Localisation</td>
                    <td style="padding: 12px; background: white;">${ville}${quartier ? ', ' + quartier : ''}</td>
                  </tr>
                </table>
                
                ${message ? `
                  <h3 style="color: #d4af37; margin-top: 30px; margin-bottom: 15px;">
                    Message / Motivation
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
                    Télécharger le CV
                  </a>
                </div>
              </div>
              
              <div style="padding: 30px; text-align: center; background: #1a1a1a; color: #999;">
                <p style="margin: 0; font-size: 14px;">© 2025 Sunshine Beauty & Spa</p>
              </div>
            </div>
          `,
        });
        console.log('Email recruteur envoyé');
      } catch (error) {
        console.error('Erreur envoi email recruteur:', error.message);
        // On continue même si l'email échoue
      }

      // Email de confirmation au candidat
      try {
        console.log('Envoi email candidat...');
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
                    Si votre profil correspond à nos besoins, nous vous recontacterons dans les meilleurs délais.
                  </p>
                </div>
                
                <p style="font-size: 16px; color: #666; margin-top: 30px;">
                  Nous vous remercions pour l'intérêt que vous portez à Sunshine Beauty & Spa.
                </p>
                
                <p style="margin-top: 40px; color: #666;">Cordialement,</p>
                <p style="color: #d4af37; font-weight: bold; font-size: 18px; margin: 5px 0;">
                  L'équipe Sunshine Beauty & Spa
                </p>
              </div>
              
              <div style="padding: 30px; text-align: center; background: #1a1a1a; color: #999;">
                <p style="margin: 0; font-size: 14px;">© 2025 Sunshine Beauty & Spa</p>
              </div>
            </div>
          `,
        });
        console.log('✅ Email candidat envoyé');
      } catch (error) {
        console.error('⚠️ Erreur envoi email candidat:', error.message);
      }
    } else {
      console.log('⚠️ Resend non configuré, emails non envoyés');
    }

    console.log('🎉 Traitement terminé avec succès');
    return NextResponse.json({ 
      success: true,
      message: 'Candidature envoyée avec succès' 
    });

  } catch (error) {
    console.error('ERREUR GÉNÉRALE:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json(
      { error: 'Une erreur est survenue: ' + error.message },
      { status: 500 }
    );
  }
}