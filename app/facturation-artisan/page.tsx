import Link from 'next/link'

const LOGO = 'https://xkwdwragibeingoaizwq.supabase.co/storage/v1/object/public/logos/ChatGPT%20Image%2026%20juil.%202026,%2016_39_11.png'

export default function FacturationArtisan() {
  return (
    <main className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <img src={LOGO} alt="FaireDesDevis" style={{ height: '40px', width: 'auto' }} />
            <span className="text-xl font-bold text-blue-600">FaireDesDevis</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-gray-600 hover:text-blue-600 text-sm">Connexion</a>
            <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Essai gratuit</a>
          </div>
        </div>
      </header>

      <section className="py-20 px-6 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Facturation artisan en ligne<br/>
            <span className="text-blue-600">en 1 clic depuis votre devis</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Transformez automatiquement vos devis acceptés en factures professionnelles. Suivez vos paiements en temps réel depuis votre tableau de bord.
          </p>
          <a href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Essayer gratuitement →
          </a>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tout ce qu'il faut pour facturer comme un pro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🧾', titre: 'Devis → Facture en 1 clic', desc: 'Devis accepté ? Cliquez sur "Convertir en facture". Toutes les informations sont reprises automatiquement.' },
              { icon: '📋', titre: 'Numérotation automatique', desc: 'Vos factures sont numérotées séquentiellement et automatiquement. Conforme aux obligations légales.' },
              { icon: '📅', titre: 'Suivi des échéances', desc: 'Visualisez en un coup d\'œil quelles factures sont payées, en attente ou en retard.' },
              { icon: '📧', titre: 'Envoi automatique', desc: 'La facture est envoyée automatiquement à votre client par email dès sa création.' },
              { icon: '💶', titre: 'Tableau de bord financier', desc: 'Suivez votre chiffre d\'affaires, vos encaissements et vos impayés en temps réel.' },
              { icon: '📄', titre: 'PDF professionnel', desc: 'Chaque facture est générée en PDF avec votre logo, vos coordonnées et toutes les mentions légales.' },
            ].map((f, i) => (
              <div key={i} className="flex gap-4 bg-gray-50 rounded-xl p-5 border border-gray-200">
                <span className="text-3xl">{f.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{f.titre}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-blue-600 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Facturation incluse dans FaireDesDevis</h2>
          <p className="text-blue-200 mb-8">Devis + Signature + Facturation · 24,99€/mois · 7 jours gratuits</p>
          <a href="/register" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition">
            Commencer gratuitement →
          </a>
        </div>
      </section>

      <footer className="py-8 px-6 bg-gray-900 text-center">
        <div className="flex justify-center gap-6 text-sm text-gray-400 flex-wrap mb-4">
          <Link href="/" className="hover:text-white">Accueil</Link>
          <Link href="/blog" className="hover:text-white">Blog</Link>
          <Link href="/legal/cgu" className="hover:text-white">CGU</Link>
        </div>
        <p className="text-gray-600 text-sm">© 2026 FaireDesDevis</p>
      </footer>
    </main>
  )
}