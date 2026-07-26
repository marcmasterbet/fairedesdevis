import Link from 'next/link'

const LOGO = 'https://xkwdwragibeingoaizwq.supabase.co/storage/v1/object/public/logos/ChatGPT%20Image%2026%20juil.%202026,%2016_39_11.png'

export default function DevisEnLigneGratuit() {
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
          <div className="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            🎉 7 jours gratuits — aucun engagement
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Devis en ligne gratuit<br/>
            <span className="text-blue-600">pour artisans et indépendants</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Créez votre premier devis professionnel gratuitement en 60 secondes. Aucune carte bancaire requise pendant 7 jours.
          </p>
          <a href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Créer mon devis gratuit →
          </a>
          <p className="text-sm text-gray-400 mt-4">✅ Sans carte bancaire · ✅ Sans engagement · ✅ Annulation en 1 clic</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Ce que vous obtenez gratuitement pendant 7 jours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Devis illimités en 60 secondes',
              'Signature électronique légale',
              'Envoi par email automatique',
              'Facturation en 1 clic',
              'Catalogue produits illimité',
              'Carnet clients complet',
              'PDF professionnel avec votre logo',
              'Support prioritaire',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-green-50 rounded-xl p-4 border border-green-100">
                <span className="text-green-600 font-bold text-lg">✓</span>
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-blue-600 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Commencez gratuitement maintenant</h2>
          <p className="text-blue-200 mb-8">Puis 24,99€/mois — résiliation libre à tout moment</p>
          <a href="/register" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition">
            Créer mon compte gratuit →
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