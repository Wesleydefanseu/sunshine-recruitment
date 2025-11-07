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
        
        setFormData({
          nom: '', prenom: '', email: '', telephone: '',
          poste: '', ville: '', quartier: '', message: ''
        });
        setCvFile(null);
        
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
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      padding: '60px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <h1 style={{
            fontSize: '42px',
            color: '#c9a961',
            marginBottom: '15px',
            fontWeight: '300',
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}>
            Rejoignez Notre Équipe
          </h1>
          <h2 style={{
            fontSize: '28px',
            color: '#fff',
            marginBottom: '20px',
            fontWeight: '400'
          }}>
            Sunshine Beauty & Spa
          </h2>
          <div style={{
            width: '60px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #c9a961, transparent)',
            margin: '30px auto'
          }} />
          <p style={{
            color: '#888',
            fontSize: '16px',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Complétez le formulaire ci-dessous pour postuler
          </p>
        </div>

        {/* Formulaire */}
        <div style={{
          background: 'rgba(20, 20, 20, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(201, 169, 97, 0.2)',
          borderRadius: '20px',
          padding: '60px 50px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}>
          <form onSubmit={handleSubmit}>
            
            {/* Section 1: Coordonnées */}
            <div style={{ marginBottom: '60px' }}>
              <h3 style={{
                fontSize: '14px',
                color: '#c9a961',
                marginBottom: '35px',
                fontWeight: '500',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                Informations Personnelles
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '40px'
              }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    placeholder="Nom *"
                    style={{
                      width: '100%',
                      padding: '12px 0',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(201, 169, 97, 0.3)',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#c9a961'}
                    onBlur={(e) => e.target.style.borderBottomColor = 'rgba(201, 169, 97, 0.3)'}
                  />
                </div>
                
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                    placeholder="Prénom *"
                    style={{
                      width: '100%',
                      padding: '12px 0',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(201, 169, 97, 0.3)',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#c9a961'}
                    onBlur={(e) => e.target.style.borderBottomColor = 'rgba(201, 169, 97, 0.3)'}
                  />
                </div>
                
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Email *"
                    style={{
                      width: '100%',
                      padding: '12px 0',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(201, 169, 97, 0.3)',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#c9a961'}
                    onBlur={(e) => e.target.style.borderBottomColor = 'rgba(201, 169, 97, 0.3)'}
                  />
                </div>
                
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                    placeholder="Téléphone *"
                    style={{
                      width: '100%',
                      padding: '12px 0',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(201, 169, 97, 0.3)',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#c9a961'}
                    onBlur={(e) => e.target.style.borderBottomColor = 'rgba(201, 169, 97, 0.3)'}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Poste & Documents */}
            <div style={{ marginBottom: '60px' }}>
              <h3 style={{
                fontSize: '14px',
                color: '#c9a961',
                marginBottom: '35px',
                fontWeight: '500',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                Candidature
              </h3>
              
              <div style={{ marginBottom: '40px' }}>
                <select
                  name="poste"
                  value={formData.poste}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(201, 169, 97, 0.3)',
                    color: formData.poste ? '#fff' : '#666',
                    fontSize: '16px',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23c9a961\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right center'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#c9a961'}
                  onBlur={(e) => e.target.style.borderBottomColor = 'rgba(201, 169, 97, 0.3)'}
                >
                  <option value="">Sélectionnez le poste *</option>
                  <option value="Coiffeur">Coiffeur / Coiffeuse</option>
                  <option value="Prothese Ongulaire">Prothésiste Ongulaire</option>
                  <option value="Estheticienne">Esthéticienne</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              
              <div>
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 32px',
                    background: 'transparent',
                    border: '1px solid rgba(201, 169, 97, 0.5)',
                    color: '#c9a961',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '400',
                    fontSize: '15px',
                    letterSpacing: '1px',
                    transition: 'all 0.3s',
                    textTransform: 'uppercase'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201, 169, 97, 0.1)';
                    e.currentTarget.style.borderColor = '#c9a961';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(201, 169, 97, 0.5)';
                  }}
                >
                  <span style={{ fontSize: '18px' }}>📎</span>
                  {cvFile ? cvFile.name : 'Joindre votre CV'}
                </label>
                <div style={{
                  marginTop: '10px',
                  fontSize: '13px',
                  color: '#666'
                }}>
                  PDF, DOC, DOCX - Maximum 5MB
                </div>
              </div>
            </div>

            {/* Section 3: Message */}
            <div style={{ marginBottom: '60px' }}>
              <h3 style={{
                fontSize: '14px',
                color: '#c9a961',
                marginBottom: '35px',
                fontWeight: '500',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                Message de Motivation
              </h3>
              
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                placeholder="Parlez-nous de vous et de vos motivations... (Optionnel)"
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(201, 169, 97, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: '1.6',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#c9a961'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(201, 169, 97, 0.3)'}
              />
            </div>

            {/* Section 4: Localisation */}
            <div style={{ marginBottom: '60px' }}>
              <h3 style={{
                fontSize: '14px',
                color: '#c9a961',
                marginBottom: '35px',
                fontWeight: '500',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                Localisation
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '40px'
              }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleInputChange}
                    required
                    placeholder="Ville *"
                    style={{
                      width: '100%',
                      padding: '12px 0',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(201, 169, 97, 0.3)',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#c9a961'}
                    onBlur={(e) => e.target.style.borderBottomColor = 'rgba(201, 169, 97, 0.3)'}
                  />
                </div>
                
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="quartier"
                    value={formData.quartier}
                    onChange={handleInputChange}
                    placeholder="Quartier"
                    style={{
                      width: '100%',
                      padding: '12px 0',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(201, 169, 97, 0.3)',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#c9a961'}
                    onBlur={(e) => e.target.style.borderBottomColor = 'rgba(201, 169, 97, 0.3)'}
                  />
                </div>
              </div>
            </div>

            {/* Message de statut */}
            {status.message && (
              <div style={{
                padding: '18px 24px',
                borderRadius: '8px',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: status.type === 'success' 
                  ? 'rgba(34, 197, 94, 0.15)' 
                  : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${status.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                color: status.type === 'success' ? '#4ade80' : '#f87171',
                fontSize: '15px'
              }}>
                <span style={{ fontSize: '20px' }}>
                  {status.type === 'success' ? '✓' : '⚠'}
                </span>
                {status.message}
              </div>
            )}

            {/* Bouton d'envoi */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '18px',
                background: isSubmitting 
                  ? 'rgba(100, 100, 100, 0.3)' 
                  : 'linear-gradient(135deg, rgba(201, 169, 97, 0.2), rgba(201, 169, 97, 0.1))',
                border: '1px solid #c9a961',
                color: '#c9a961',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '500',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                transition: 'all 0.3s',
                opacity: isSubmitting ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = 'rgba(201, 169, 97, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 169, 97, 0.2), rgba(201, 169, 97, 0.1))';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid #c9a961',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '18px' }}>✉</span>
                  Envoyer ma Candidature
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '50px',
          color: '#555',
          fontSize: '13px',
          letterSpacing: '1px'
        }}>
          <div style={{
            width: '40px',
            height: '1px',
            background: 'rgba(201, 169, 97, 0.3)',
            margin: '0 auto 20px'
          }} />
          © 2025 Sunshine Beauty & Spa
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        ::placeholder {
          color: #666;
        }
        
        select option {
          background: #1a1a1a;
          color: #fff;
        }
      `}</style>
    </div>
  );
}