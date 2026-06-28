export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b">
        <h1 className="text-xl font-bold text-blue-600">FaireDesDevis</h1>
        <div className="flex gap-4">
          <a href="/login" className="text-gray-600 hover:text-blue-600">Connexion</a>
          <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Essai gratuit</a>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-24 px-8">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">Créez vos devis professionnels<br/>en 60 secondes</h2>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">L'IA génère des devis parfaits pour tous les métiers. Plombier, électricien, graphiste, pisciniste — configurez une fois, dévisez en quelques clics.</p>
        <a href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700">Commencer gratuitement →</a>
        <p className="text-gray-400 mt-4 text-sm">1 devis gratuit — sans carte bancaire</p>
      </section>

      {/* Tarifs */}
      <section className="py-20 px-8 bg-gray-50">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Tarifs simples et transparents</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { name: "Gratuit", price: "0€", desc: "1 devis pour tester", features: ["1 devis", "Catalogue produits", "Export PDF"] },
            { name: "Starter", price: "19€/mois", desc: "Pour les indépendants", features: ["15 devis/mois", "Catalogue illimité", "Import Excel", "Relance auto"] },
            { name: "Pro", price: "39€/mois", desc: "Le plus populaire", features: ["Devis illimités", "Tout Starter", "Historique complet", "Support prioritaire"], popular: true },
            { name: "Entreprise", price: "199€/mois", desc: "Pour les équipes", features: ["15 utilisateurs", "Dashboard manager", "Tout Pro", "Facturation électronique"] },
          ].map((plan) => (
            <div key={plan.name} className={`bg-white rounded-2xl p-6 border ${plan.popular ? "border-blue-600 shadow-lg" : "border-gray-200"}`}>
              {plan.popular && <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Populaire</span>}
              <h4 className="text-lg font-bold mt-2">{plan.name}</h4>
              <p className="text-3xl font-bold text-blue-600 my-2">{plan.price}</p>
              <p className="text-gray-500 text-sm mb-4">{plan.desc}</p>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-gray-600 flex gap-2">✓ {f}</li>
                ))}
              </ul>
              <a href="/register" className="block text-center mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm">Commencer</a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        © 2026 FaireDesDevis — Tous droits réservés
      </footer>
    </main>
  );
}