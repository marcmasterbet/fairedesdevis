import Link from 'next/link'

const LOGO = 'https://xkwdwragibeingoaizwq.supabase.co/storage/v1/object/public/logos/ChatGPT%20Image%2026%20juil.%202026,%2016_39_11.png'

export default function LogicielDevisArtisan() {
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
            Logiciel de devis artisan<br/>
            <span className="text-blue-600">simple, rapide et légal</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            FaireDesDevis est le logiciel de devis pensé pour les artisans. Créez un devis professionnel en 60 secondes, envoyez-le par email et faites-le signer électroniquement.
          </p>
          <a href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Essayer gratuitement 7 jours →
          </a>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Pourquoi FaireDesDevis est le meilleur logiciel de devis pour artisans ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', titre: 'Devis en 60 secondes', desc: 'Sélectionnez vos produits depuis votre catalogue, ajoutez la main d\'œuvre — l\'IA génère le devis complet.' },
              { icon: '✍️', titre: 'Signature électronique', desc: 'Votre client signe en ligne avec mention "Bon pour accord". Valeur légale garantie, conforme eIDAS.' },
              { icon: '🧾', titre: 'Facturation intégrée', desc: 'Transformez un devis accepté en facture en 1 clic. Suivez vos paiements en temps réel.' },
              { icon: '📦', titre: 'Catalogue intelligent', desc: 'Importez votre catalogue depuis Excel ou CSV. L\'IA extrait vos produits et prix automatiquement.' },
              { icon: '👥', titre: 'Carnet clients', desc: 'Gérez vos clients et consultez l\'historique de tous leurs devis en un coup d\'œil.' },
              { icon: '📱', titre: '100% mobile', desc: 'Créez vos devis depuis le chantier sur votre téléphone. Interface optimisée pour tous les écrans.' },
            ].map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <p className="text-3xl mb-4">{f.icon}</p>
                <h3 className="font-bold text-gray-900 mb-2">{f.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-blue-600 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Le logiciel de devis artisan à 24,99€/mois</h2>
          <p className="text-blue-200 mb-8">Devis illimités · Signature électronique · Facturation · 7 jours gratuits</p>
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