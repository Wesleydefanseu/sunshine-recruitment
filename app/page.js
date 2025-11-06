'use client';
import { useState } from 'react';

export default function RecruitmentForm() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poste: '',
    ville: '',
    quartier: '',
    message: ''
  });
  
  const [cvFile, setCvFile] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setStatus({ type: 'error', message: 'Le fichier ne doit pas dépasser 5MB' });
        return;
      }
      setCvFile(file);
      setStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    if (cvFile) {
      formDataToSend.append('cv', cvFile);
    }

    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ 
          type: 'success', 
          message: 'Votre candidature a été envoyée avec succès ! Nous vous recontacterons bientôt.' 
        });
        
        // Réinitialiser le formulaire
        setFormData({
          nom: '', prenom: '', email: '', telephone: '',
          poste: '', ville: '', quartier: '', message: ''
        });
        setCvFile(null);
        
        // Réinitialiser l'input file
        const fileInput = document.getElementById('cv-upload');
        if (fileInput) fileInput.value = '';
      } else {
        setStatus({ 
          type: 'error', 
          message: data.error || 'Une erreur est survenue lors de l\'envoi' 
        });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'Erreur de connexion. Veuillez réessayer.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 30px',
            background: 'linear-gradient(135deg, #d4af37, #f4e04d, #d4af37)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '60px',
            fontWeight: 'bold',
            color: '#000',
            boxShadow: '0 20px 60px rgba(212, 175, 55, 0.4)'
          }}>
            S
          </div>
          <h1 style={{
            fontSize: '48px',
            background: 'linear-gradient(135deg, #d4af37, #f4e04d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>
            Rejoignez l'équipe
          </h1>
          <h2 style={{
            fontSize: '36px',
            color: '#fff',
            marginBottom: '20px'
          }}>
            Sunshine Beauty & Spa
          </h2>
          <p style={{
            color: '#999',
            fontSize: '18px'
          }}>
            Veuillez remplir le formulaire pour soumettre votre candidature
          </p>
        </div>

        {/* Formulaire */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)',
          border: '2px solid #d4af37',
          borderRadius: '30px',
          padding: '50px',
          boxShadow: '0 30px 80px rgba(212, 175, 55, 0.2)'
        }}>
          <form onSubmit={handleSubmit}>
            
            {/* Section 1: Coordonnées */}
            <div style={{ marginBottom: '50px' }}>
              <h3 style={{
                fontSize: '24px',
                color: '#d4af37',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                fontWeight: 'bold'
              }}>
                <span style={{
                  width: '40px',
                  height: '40px',
                  background: '#d4af37',
                  color: '#000',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>1</span>
                Vos Coordonnées
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '25px'
              }}>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  placeholder="Nom *"
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: '#000',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                />
                
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                  placeholder="Prénom *"
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: '#000',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
                
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Email *"
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: '#000',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
                
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                  placeholder="Téléphone *"
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: '#000',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Section 2: Poste & Documents */}
            <div style={{ marginBottom: '50px' }}>
              <h3 style={{
                fontSize: '24px',
                color: '#d4af37',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                fontWeight: 'bold'
              }}>
                <span style={{
                  width: '40px',
                  height: '40px',
                  background: '#d4af37',
                  color: '#000',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>2</span>
                Poste & Documents
              </h3>
              
              <div style={{ marginBottom: '25px' }}>
                <select
                  name="poste"
                  value={formData.poste}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: '#000',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    color: formData.poste ? '#fff' : '#666',
                    fontSize: '16px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Choisissez le poste visé... *</option>
                  <option value="Coiffeur">Coiffeur / Coiffeuse</option>
                  <option value="Prothese Ongulaire">Prothésiste Ongulaire</option>
                  <option value="Estheticienne">Esthéticienne</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#d4af37',
                  fontWeight: '600',
                  marginBottom: '10px'
                }}>
                  Joindre votre CV (PDF/DOCX, Max 5MB) *
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  required
                  id="cv-upload"
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="cv-upload"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '18px 30px',
                    background: 'linear-gradient(135deg, #d4af37, #f4e04d)',
                    color: '#000',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)',
                    transition: 'all 0.3s'
                  }}
                >
                  📤 {cvFile ? cvFile.name : 'Choisir un fichier'}
                </label>
              </div>
            </div>

            {/* Section 3: Message */}
            <div style={{ marginBottom: '50px' }}>
              <h3 style={{
                fontSize: '24px',
                color: '#d4af37',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                fontWeight: 'bold'
              }}>
                <span style={{
                  width: '40px',
                  height: '40px',
                  background: '#d4af37',
                  color: '#000',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>3</span>
                Message
              </h3>
              
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                placeholder="Lettre de motivation / Détails (Optionnel)"
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  background: '#000',
                  border: '2px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Section 4: Localisation */}
            <div style={{ marginBottom: '50px' }}>
              <h3 style={{
                fontSize: '24px',
                color: '#d4af37',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                fontWeight: 'bold'
              }}>
                <span style={{
                  width: '40px',
                  height: '40px',
                  background: '#d4af37',
                  color: '#000',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>4</span>
                Votre Localisation
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '25px'
              }}>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                  required
                  placeholder="Ville *"
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: '#000',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
                
                <input
                  type="text"
                  name="quartier"
                  value={formData.quartier}
                  onChange={handleInputChange}
                  placeholder="Quartier"
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: '#000',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Message de statut */}
            {status.message && (
              <div style={{
                padding: '18px',
                borderRadius: '12px',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: status.type === 'success' 
                  ? 'rgba(34, 197, 94, 0.2)' 
                  : 'rgba(239, 68, 68, 0.2)',
                border: `2px solid ${status.type === 'success' ? '#22c55e' : '#ef4444'}`,
                color: status.type === 'success' ? '#4ade80' : '#f87171'
              }}>
                {status.type === 'success' ? '✓' : '⚠'} {status.message}
              </div>
            )}

            {/* Bouton d'envoi */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '20px',
                background: isSubmitting 
                  ? '#666' 
                  : 'linear-gradient(135deg, #d4af37, #f4e04d)',
                color: '#000',
                border: 'none',
                borderRadius: '15px',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 15px 50px rgba(212, 175, 55, 0.4)',
                transition: 'all 0.3s'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    border: '3px solid #000',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Envoi en cours...
                </>
              ) : (
                <>
                  ✉️ Envoyer ma Candidature
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          color: '#666',
          fontSize: '14px'
        }}>
          © 2025 Sunshine Beauty & Spa - Tous droits réservés
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        input:focus, select:focus, textarea:focus {
          border-color: #d4af37 !important;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3) !important;
        }
        
        button:not(:disabled):hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 60px rgba(212, 175, 55, 0.6) !important;
        }
      `}</style>
    </div>
  );
}