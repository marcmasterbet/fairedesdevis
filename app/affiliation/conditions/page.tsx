'use client'

export default function Conditions() {
  return (
    <main className="min-h-screen bg-white">

      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-blue-600">FaireDesDevis</a>
          <div className="flex items-center gap-4">
            <a href="/affiliation" className="text-sm text-gray-500 hover:text-blue-600">← Programme</a>
            <a href="/affiliation/rejoindre" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700">
              Devenir apporteur
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">

        <div className="text-center mb-12">
          <div className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            📄 Conditions du programme
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Conditions apporteurs d'affaires
          </h1>
          <p className="text-gray-500">Transparentes, simples, sans surprise.</p>
        </div>

        <div className="space-y-6">

          {/* Commission */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4">
              <h2 className="font-bold text-gray-900 text-lg">💶 Commission</h2>
            </div>
            <div className="px-6 py-5">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <p className="text-gray-600 text-sm">Montant par client actif</p>
                <p className="font-bold text-emerald-600 text-lg">4€ / mois</p>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <p className="text-gray-600 text-sm">Durée maximale par client</p>
                <p className="font-bold text-gray-900">36 mois</p>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <p className="text-gray-600 text-sm">Gain maximum par client</p>
                <p className="font-bold text-gray-900">144€ <span className="text-gray-400 font-normal text-xs">(36 × 4€)</span></p>
              </div>
              <div className="flex justify-between items-center py-3">
                <p className="text-gray-600 text-sm">Nombre de clients maximum</p>
                <p className="font-bold text-gray-900">Illimité</p>
              </div>
            </div>
          </div>

          {/* Paiement */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
              <h2 className="font-bold text-gray-900 text-lg">🏦 Paiement</h2>
            </div>
            <div className="px-6 py-5">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <p className="text-gray-600 text-sm">Date de virement</p>
                <p className="font-bold text-gray-900">Le 5 de chaque mois</p>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <p className="text-gray-600 text-sm">Seuil minimum de versement</p>
                <p className="font-bold text-emerald-600">Dès 4€ <span className="text-gray-400 font-normal text-xs">(dès le 1er client)</span></p>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <p className="text-gray-600 text-sm">Moyen de paiement</p>
                <p className="font-bold text-gray-900">Virement bancaire</p>
              </div>
              <div className="flex justify-between items-center py-3">
                <p className="text-gray-600 text-sm">Condition de versement</p>
                <p className="font-bold text-gray-900">Client abonné et ayant payé</p>
              </div>
            </div>
          </div>

          {/* Règles */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-amber-50 border-b border-amber-100 px-6 py-4">
              <h2 className="font-bold text-gray-900 text-lg">📋 Règles</h2>
            </div>
            <div className="px-6 py-5">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <p className="text-gray-600 text-sm">Apporteurs par client</p>
                <p className="font-bold text-gray-900">1 seul · Premier lien cliqué</p>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <p className="text-gray-600 text-sm">Attribution de l'apporteur</p>
                <p className="font-bold text-gray-900">Premier lien cliqué — irrévocable</p>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <p className="text-gray-600 text-sm">Si le client résilie</p>
                <p className="font-bold text-red-500">Commission arrêtée immédiatement</p>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <p className="text-gray-600 text-sm">Si le client se réabonne</p>
                <p className="font-bold text-gray-900">Commission reprend</p>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <p className="text-gray-600 text-sm">Durée du cookie de tracking</p>
                <p className="font-bold text-gray-900">30 jours</p>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <p className="text-gray-600 text-sm">Inscription de l'apporteur</p>
                <p className="font-bold text-gray-900">Gratuite · Sans engagement</p>
              </div>
              <div className="flex justify-between items-center py-3">
                <p className="text-gray-600 text-sm">Résiliation du programme</p>
                <p className="font-bold text-gray-900">À tout moment</p>
              </div>
            </div>
          </div>

          {/* Exemple concret */}
          <div className="bg-emerald-600 rounded-2xl p-6 text-white">
            <h2 className="font-bold text-lg mb-4">📊 Exemple concret</h2>
            <div className="space-y-3">
              {[
                { label: 'Vous apportez 10 clients en janvier', value: '+10 clients' },
                { label: 'Chaque mois ils sont actifs', value: '10 × 4€ = 40€/mois' },
                { label: 'Pendant 36 mois maximum', value: '40€ × 36 = 1 440€' },
                { label: 'Virement le 5 de chaque mois', value: 'Automatique' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-emerald-500 last:border-0">
                  <p className="text-emerald-100 text-sm">{item.label}</p>
                  <p className="font-bold text-white text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-gray-500 text-sm mb-2">Une question sur le programme ?</p>
            <a href="mailto:affiliation@fairedesdevis.fr" className="text-blue-600 font-semibold hover:underline">
              support@fairedesdevis.fr
            </a>
          </div>

        </div>

        <div className="text-center mt-12">
          <a href="/affiliation/rejoindre" className="inline-block bg-emerald-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-emerald-700 transition">
            Rejoindre le programme →
          </a>
          <p className="text-gray-400 text-xs mt-3">Gratuit · Sans engagement · Virement le 5 du mois</p>
        </div>

      </div>

      <footer className="py-12 px-6 bg-gray-900 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">FaireDesDevis</h3>
            <p className="text-gray-400 text-sm">Programme Apporteurs d'affaires</p>
          </div>
          <div className="flex gap-6 text-sm text-gray-400 flex-wrap justify-center">
            <a href="/affiliation" className="hover:text-white transition">Programme</a>
            <a href="/affiliation/rejoindre" className="hover:text-white transition">S'inscrire</a>
            <a href="/legal/cgu" className="hover:text-white transition">CGU</a>
            <a href="/login" className="hover:text-white transition">Connexion</a>
          </div>
        </div>
      </footer>

    </main>
  )
}