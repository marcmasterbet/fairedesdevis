'use client'
import { useState } from 'react'

export default function Affiliation() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const faqs = [
    { q: "Comment je reçois mes commissions ?", a: "Chaque mois vous recevez un virement bancaire pour toutes vos commissions du mois. Minimum de versement : 10€." },
    { q: "Combien de temps dure la commission ?", a: "Tant que votre client reste abonné à FaireDesDevis vous touchez 4€/mois. Si il résilie, la commission s'arrête." },
    { q: "Y a-t-il un nombre maximum de clients à parrainer ?", a: "Non, aucune limite ! Plus vous parrainez, plus vous gagnez." },
    { q: "Comment savoir si mes filleuls se sont inscrits ?", a: "Vous avez accès à un dashboard personnel qui affiche en temps réel vos clics, inscriptions et commissions." },
    { q: "Est-ce que je dois être client FaireDesDevis ?", a: "Non ! Vous pouvez être affilié sans être abonné. Mais nous recommandons de tester le produit pour mieux le recommander." },
    { q: "Quand est-ce que je reçois ma première commission ?", a: "Dès qu'un de vos filleuls paye son premier mois — soit 30 jours après son inscription." },
  ]

  const etapes = [
    { num: "1", titre: "Inscrivez-vous", desc: "Créez votre compte affilié gratuitement et obtenez votre lien unique personnalisé.", icon: "✍️" },
    { num: "2", titre: "Partagez votre lien", desc: "Envoyez votre lien à des artisans, publiez sur les réseaux, intégrez-le à votre site.", icon: "🔗" },
    { num: "3", titre: "Touchez vos commissions", desc: "4€/mois par client actif. Virement mensuel automatique sur votre compte bancaire.", icon: "💶" },
  ]

  return (
    <main className="min-h-screen bg-white">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-blue-600">FaireDesDevis</a>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-gray-600 hover:text-blue-600 text-sm">Connexion</a>
            <a href="/affiliation/rejoindre" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Devenir affilié</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            🤝 Programme Partenaires FaireDesDevis
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Gagnez <span className="text-blue-600">4€/mois</span><br/>par artisan parrainé
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Recommandez FaireDesDevis aux artisans de votre réseau et touchez une commission récurrente tant qu'ils restent abonnés. Sans limite, sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="/affiliation/rejoindre" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              Rejoindre le programme →
            </a>
            <a href="#comment-ca-marche" className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-200 hover:border-blue-300 transition">
              En savoir plus
            </a>
          </div>
          <p className="text-gray-400 text-sm">Gratuit · Sans engagement · Virement mensuel</p>
        </div>
      </section>

      {/* Simulateur */}
      <section className="py-16 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Combien pouvez-vous gagner ?</h2>
          <p className="text-blue-200 mb-10">4€ par client actif par mois — sans plafond</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
  { clients: 5, gain: '20€', label: '/mois' },
  { clients: 10, gain: '40€', label: '/mois' },
  { clients: 25, gain: '100€', label: '/mois' },
  { clients: 50, gain: '200€', label: '/mois' },
].map((s, i) => (
  <div key={i} className="bg-white rounded-2xl p-6 text-center">
    <p className="text-3xl font-bold text-gray-900">{s.clients}</p>
    <p className="text-sm text-gray-500 mb-3">clients apportés</p>
    <p className="text-2xl font-bold text-emerald-600">{s.gain}</p>
    <p className="text-xs text-gray-400">{s.label}</p>
  </div>
))}
          </div>
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
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition text-center">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  {e.num}
                </div>
                <p className="text-3xl mb-4">{e.icon}</p>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{e.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ce programme est fait pour vous si...</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🧮", titre: "Expert-comptable", desc: "Vous avez des clients artisans et indépendants qui font des devis. Recommandez-leur FaireDesDevis et gagnez sur chaque abonnement." },
              { icon: "🏗️", titre: "Fournisseur matériaux", desc: "Vos clients artisans ont besoin d'outils pro. Intégrez notre programme à votre offre et créez une source de revenus additionnelle." },
              { icon: "📱", titre: "Créateur de contenu", desc: "Vous avez une audience d'artisans ou d'indépendants sur YouTube, Instagram ou TikTok ? Partagez votre lien et monétisez." },
              { icon: "🏢", titre: "Groupement pro", desc: "CAPEB, FFB, chambres de métiers — proposez FaireDesDevis à vos adhérents et touchez une commission sur chaque inscription." },
              { icon: "💼", titre: "Consultant", desc: "Vous accompagnez des artisans ou des PME ? Ajoutez FaireDesDevis à votre catalogue d'outils recommandés." },
              { icon: "🤝", titre: "Tout le monde", desc: "Vous connaissez des artisans, plombiers, électriciens, menuisiers ? Partagez simplement votre lien et gagnez des commissions." },
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
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
              { icon: "♾️", titre: "Commission récurrente", desc: "Contrairement à une commission unique, vous touchez 4€ chaque mois tant que votre filleul reste abonné. Un client fidèle = des revenus passifs durables." },
              { icon: "📊", titre: "Dashboard en temps réel", desc: "Suivez vos clics, vos inscriptions et vos commissions en temps réel depuis votre espace personnel." },
              { icon: "💸", titre: "Virement mensuel", desc: "Vos commissions sont versées chaque mois par virement bancaire. Pas de seuil minimum élevé — dès 10€ vous êtes payé." },
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
      <section className="py-20 px-6">
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
                  <span className="text-blue-600 text-xl ml-4">{faqOpen === i ? '−' : '+'}</span>
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-6 bg-blue-600 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Prêt à gagner des commissions ?</h2>
          <p className="text-blue-200 text-lg mb-8">Rejoignez notre programme gratuitement et commencez à gagner dès votre premier filleul</p>
          <a href="/affiliation/rejoindre" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition">
            Devenir affilié gratuitement →
          </a>
          <p className="text-blue-300 text-sm mt-4">Gratuit · Sans engagement · 4€/mois par client actif</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">FaireDesDevis</h3>
              <p className="text-gray-400 text-sm">Programme Partenaires</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="/" className="hover:text-white transition">Accueil</a>
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