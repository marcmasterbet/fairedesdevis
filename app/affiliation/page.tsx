'use client'
import { useState } from 'react'

export default function Affiliation() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const faqs = [
    { q: "Comment je reçois mes 15€ ?", a: "Une fois votre client validé (SIRET valide + 2 mois payants + 1 devis créé), vous recevez 15€ par virement bancaire le 5 du mois suivant la validation. Dès le premier client — pas de seuil minimum." },
    { q: "Combien de clients puis-je apporter ?", a: "Maximum 10 clients validés par mois, soit 150€/mois maximum. Les clients au-delà du quota mensuel sont perdus — ils ne sont pas reportés au mois suivant. Il n'y a pas de limite sur le total." },
    { q: "Quand est-ce qu'un client est considéré validé ?", a: "Un client est validé quand il a : un SIRET valide, 2 mois payants après l'essai gratuit, et au moins 1 devis créé sur le logiciel." },
    { q: "Comment savoir si mes clients se sont inscrits ?", a: "Depuis votre dashboard FaireDesDevis, vous voyez en temps réel vos clients apportés et leur statut de validation." },
    { q: "Est-ce que je dois être client FaireDesDevis ?", a: "Non ! Vous pouvez être apporteur sans être abonné. Mais nous recommandons de tester le produit pour mieux le recommander." },
    { q: "Un client peut-il avoir plusieurs apporteurs ?", a: "Non. Un seul apporteur par client — celui dont le lien a été cliqué en premier. C'est irrévocable et automatique." },
    { q: "Les 15€ sont-ils imposables ?", a: "Oui. Les commissions constituent des revenus imposables que vous devez déclarer selon votre situation fiscale (particulier, auto-entrepreneur, société)." },
  ]

  const etapes = [
    { num: "1", titre: "Inscrivez-vous", desc: "Remplissez le formulaire gratuitement. Nous validons votre demande sous 24h et vous envoyons votre lien unique.", icon: "✍️" },
    { num: "2", titre: "Partagez votre lien", desc: "Envoyez votre lien à des artisans, publiez sur les réseaux, intégrez-le à votre site ou vos emails.", icon: "🔗" },
    { num: "3", titre: "Touchez 15€ par client", desc: "15€ par client validé. Virement le 5 du mois suivant la validation. Maximum 10 clients par mois.", icon: "💶" },
  ]

  return (
    <main className="min-h-screen bg-white">

      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-blue-600">FaireDesDevis</a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#comment-ca-marche" className="text-gray-600 hover:text-blue-600 text-sm">Comment ça marche</a>
            <a href="#pour-qui" className="text-gray-600 hover:text-blue-600 text-sm">Pour qui</a>
            <a href="#faq" className="text-gray-600 hover:text-blue-600 text-sm">FAQ</a>
            <a href="/affiliation/conditions" className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold border border-emerald-200 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition">
              📄 Conditions
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-gray-600 hover:text-blue-600 text-sm">Connexion</a>
            <a href="/affiliation/rejoindre" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700">
              Devenir apporteur
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            🤝 Programme Apporteurs d'affaires — FaireDesDevis
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Gagnez <span className="text-emerald-600">15€</span><br/>par client apporté
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Recommandez FaireDesDevis aux artisans de votre réseau et touchez 15€ par client validé. Versement unique, sans abonnement, sans prise de tête.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="/affiliation/rejoindre" className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
              Rejoindre le programme →
            </a>
            <a href="/affiliation/conditions" className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-200 hover:border-emerald-300 transition">
              Voir les conditions
            </a>
          </div>
          <p className="text-gray-400 text-sm">Gratuit · Sans engagement · 15€ par client validé · Max 10/mois</p>
        </div>
      </section>

      {/* Simulateur */}
      <section className="py-16 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Combien pouvez-vous gagner ?</h2>
          <p className="text-blue-200 mb-10">15€ par client validé — maximum 10 clients par mois</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { clients: 1, gain: '15€' },
              { clients: 3, gain: '45€' },
              { clients: 5, gain: '75€' },
              { clients: 10, gain: '150€' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-gray-900">{s.clients}</p>
                <p className="text-sm text-gray-500 mb-3">client{s.clients > 1 ? 's' : ''} validé{s.clients > 1 ? 's' : ''}</p>
                <p className="text-2xl font-bold text-emerald-600">{s.gain}</p>
                <p className="text-xs text-gray-400">versement unique</p>
              </div>
            ))}
          </div>
          <p className="text-blue-200 text-sm mt-6">Maximum 10 clients par mois = 150€/mois maximum</p>
        </div>
      </section>

      {/* Comment ca marche */}
      <section id="comment-ca-marche" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-gray-500 text-lg">Simple, transparent, sans prise de tête</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {etapes.map((e, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition text-center">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  {e.num}
                </div>
                <p className="text-3xl mb-4">{e.icon}</p>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{e.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>

          {/* Conditions de validation */}
          <div className="mt-12 bg-white rounded-2xl border border-emerald-200 p-8">
            <h3 className="font-bold text-gray-900 text-lg mb-6 text-center">✅ Conditions de validation d'un client</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '🏢', titre: 'SIRET valide', desc: 'Le client doit avoir un SIRET valide renseigné sur son compte.' },
                { icon: '💳', titre: '2 mois payants', desc: 'Le client doit avoir payé 2 mois d\'abonnement après l\'essai gratuit.' },
                { icon: '📄', titre: '1 devis créé', desc: 'Le client doit avoir créé au moins un devis sur le logiciel.' },
              ].map((c, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl mb-2">{c.icon}</p>
                  <p className="font-semibold text-gray-900 mb-1">{c.titre}</p>
                  <p className="text-gray-500 text-sm">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section id="pour-qui" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ce programme est fait pour vous si...</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🧮", titre: "Expert-comptable", desc: "Vous avez des clients artisans et indépendants qui font des devis. Recommandez-leur FaireDesDevis et touchez 15€ par client inscrit." },
              { icon: "🏗️", titre: "Fournisseur matériaux", desc: "Vos clients artisans ont besoin d'outils pro. Intégrez notre programme à votre offre et créez une source de revenus additionnelle." },
              { icon: "📱", titre: "Créateur de contenu", desc: "Vous avez une audience d'artisans ou d'indépendants sur YouTube, Instagram ou TikTok ? Partagez votre lien et monétisez." },
              { icon: "🏢", titre: "Groupement pro", desc: "CAPEB, FFB, chambres de métiers — proposez FaireDesDevis à vos adhérents et touchez 15€ par inscription validée." },
              { icon: "💼", titre: "Consultant", desc: "Vous accompagnez des artisans ou des PME ? Ajoutez FaireDesDevis à votre catalogue d'outils recommandés." },
              { icon: "🤝", titre: "Tout le monde", desc: "Vous connaissez des artisans, plombiers, électriciens, menuisiers ? Partagez simplement votre lien et gagnez 15€ par client validé." },
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition">
                <p className="text-3xl mb-4">{p.icon}</p>
                <h3 className="font-bold text-gray-900 mb-2">{p.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pourquoi notre programme ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: "💶", titre: "15€ par client — versement unique", desc: "Simple et lisible. Pas de calcul complexe — 15€ par client validé, versés le 5 du mois suivant la validation." },
              { icon: "📊", titre: "Dashboard en temps réel", desc: "Suivez vos clients apportés et leur statut de validation directement depuis votre dashboard FaireDesDevis." },
              { icon: "💸", titre: "Dès le 1er client", desc: "Pas de seuil minimum. Votre 1er client validé = 15€ virés sur votre compte le 5 du mois suivant." },
              { icon: "🚀", titre: "Produit qui se vend tout seul", desc: "FaireDesDevis résout un vrai problème des artisans. Pas besoin de forcer — montrez-le une fois et les artisans adhèrent naturellement." },
              { icon: "🎯", titre: "Marché immense", desc: "3 millions d'artisans en France font des devis manuellement. La cible est immense et peu exploitée par la concurrence." },
              { icon: "🤝", titre: "Support dédié", desc: "Une question ? Nous répondons sous 24h. Vous n'êtes pas seul — on vous aide à réussir car votre succès est le nôtre." },
            ].map((a, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 flex gap-4">
                <p className="text-3xl flex-shrink-0">{a.icon}</p>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{a.titre}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Questions fréquentes</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <span className="text-emerald-600 text-xl ml-4">{faqOpen === i ? '−' : '+'}</span>
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/affiliation/conditions" className="text-emerald-600 hover:underline text-sm font-semibold">
              Voir toutes les conditions du programme →
            </a>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-6 bg-emerald-600 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Prêt à gagner des commissions ?</h2>
          <p className="text-emerald-100 text-lg mb-8">Rejoignez notre programme gratuitement et touchez 15€ dès votre premier client validé</p>
          <a href="/affiliation/rejoindre" className="inline-block bg-white text-emerald-700 px-10 py-4 rounded-xl text-lg font-bold hover:bg-emerald-50 transition">
            Devenir apporteur gratuitement →
          </a>
          <p className="text-emerald-200 text-sm mt-4">Gratuit · Sans engagement · 15€ par client · Max 10/mois</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">FaireDesDevis</h3>
              <p className="text-gray-400 text-sm">Programme Apporteurs d'affaires</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400 flex-wrap justify-center">
              <a href="/" className="hover:text-white transition">Accueil</a>
              <a href="/affiliation/conditions" className="hover:text-white transition text-emerald-400">Conditions</a>
              <a href="/legal/cgu" className="hover:text-white transition">CGU</a>
              <a href="/legal/confidentialite" className="hover:text-white transition">Confidentialité</a>
              <a href="/login" className="hover:text-white transition">Connexion</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            © 2026 FaireDesDevis — Tous droits réservés
          </div>
        </div>
      </footer>

    </main>
  )
}