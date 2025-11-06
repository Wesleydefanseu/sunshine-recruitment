export const metadata = {
  title: 'Candidature - Sunshine Beauty & Spa',
  description: 'Formulaire de recrutement pour rejoindre notre équipe',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}