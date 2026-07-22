'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) router.push('/dashboard')
    }
    check()
  }, [router])

  const faqs = [
    { q: "Est-ce vraiment gratuit les 7 premiers jours ?", a: "Oui, 7 jours complets pour tester toutes les fonctionnalités sans limitation. Aucun frais pendant 7 jours, aucun engagement, annulation en 1 clic avant la fin de l'essai. À la fin de l'essai, vous choisissez de continuer à 24,99€/mois ou vous résiliez — sans aucune contrainte." },
    { q: "Mes devis sont-ils vraiment professionnels ?", a: "Oui. L'IA génère des devis avec votre logo, votre signature, vos coordonnées bancaires, les conditions de paiement et les mentions légales. Vos clients reçoivent un document signé électroniquement." },
    { q: "La signature électronique a-t-elle une valeur légale ?", a: "Oui. La signature électronique avec mention 'Bon pour accord', horodatage et adresse IP a valeur légale en France conformément au règlement eIDAS." },
    { q: "Puis-je importer mon catalogue de produits ?", a: "Oui. Importez votre catalogue depuis un fichier CSV ou TXT. L'IA extrait automatiquement vos produits, références et prix." },
    { q: "Combien de devis puis-je créer ?", a: "Illimité. Le plan unique à 24,99€/mois vous donne accès à des devis illimités, une facturation illimitée et un catalogue illimité." },
    { q: "Puis-je transformer un devis en facture ?", a: "Oui en 1 clic. Une fois le devis accepté et signé par votre client, transformez-le en facture automatiquement. Suivez vos paiements depuis votre dashboard." },
  ]

  const features = [
    { icon: "⚡", title: "Devis en 60 secondes", desc: "Sélectionnez vos produits, ajoutez la main d'oeuvre et l'IA génère un devis professionnel instantanément." },
    { icon: "✍️", title: "Signature électronique", desc: "Votre client reçoit le devis par email, l'accepte et le signe en ligne. Valeur légale garantie." },
    { icon: "🧾", title: "Facturation intégrée", desc: "Transformez un devis accepté en facture en 1 clic. Suivez vos paiements en temps réel." },
    { icon: "📦", title: "Catalogue intelligent", desc: "Importez votre catalogue depuis Excel ou CSV. L'IA extrait vos produits et prix automatiquement." },
    { icon: "👥", title: "Carnet clients", desc: "Gérez vos clients, consultez l'historique de leurs devis et créez un nouveau devis en 1 clic." },
    { icon: "📱", title: "100% mobile", desc: "Créez vos devis depuis votre téléphone sur le chantier. Interface optimisée pour tous les écrans." },
  ]

  const etapes = [
    { num: "1", titre: "Configurez votre profil", desc: "Logo, signature, IBAN, taux horaire — configurez une fois et c'est intégré dans tous vos devis.", icon: "⚙️" },
    { num: "2", titre: "Créez votre devis", desc: "Sélectionnez votre client, ajoutez vos produits depuis votre catalogue et l'IA génère le document.", icon: "✏️" },
    { num: "3", titre: "Envoyez au client", desc: "Le client reçoit un email avec son devis. Il l'accepte ou le refuse en ligne depuis son téléphone.", icon: "📧" },
    { num: "4", titre: "Facturez et encaissez", desc: "Devis accepté ? Transformez-le en facture en 1 clic et suivez vos paiements depuis le dashboard.", icon: "💶" },
  ]

  return (
    <main className="min-h-screen bg-white">

      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">FaireDesDevis</h1>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#comment-ca-marche" className="text-gray-600 hover:text-blue-600 text-sm">Comment ça marche</a>
            <a href="#fonctionnalites" className="text-gray-600 hover:text-blue-600 text-sm">Fonctionnalités</a>
            <a href="#tarif" className="text-gray-600 hover:text-blue-600 text-sm">Tarif</a>
            <a href="#faq" className="text-gray-600 hover:text-blue-600 text-sm">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-gray-600 hover:text-blue-600 text-sm">Connexion</a>
            <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Essai gratuit</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            🎉 7 jours pour tester — aucun engagement, annulation en 1 clic
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Votre devis professionnel<br/>
            <span className="text-blue-600">en 60 secondes</span>
          </h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            L'IA génère vos devis, vos clients signent en ligne, vous facturez en 1 clic.
            Conçu pour les artisans, plombiers, électriciens, menuisiers et tous les indépendants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              Commencer gratuitement →
            </a>
            <a href="#comment-ca-marche" className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-200 hover:border-blue-300 transition">
              Voir comment ça marche
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm text-gray-500">
            <span>✅ Aucun engagement</span>
            <span className="hidden sm:block">·</span>
            <span>✅ Annulation en 1 clic avant la fin de l'essai</span>
            <span className="hidden sm:block">·</span>
            <span>✅ Aucun frais pendant 7 jours</span>
          </div>
        </div>
      </section>

      {/* Preuve sociale — marché */}
      <section className="py-10 px-6 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-gray-400 text-xs font-semibold uppercase tracking-widest mb-8">
            Pourquoi FaireDesDevis ?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">3M+</p>
              <p className="text-gray-500 text-sm mt-1">artisans en France font encore leurs devis à la main</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">60s</p>
              <p className="text-gray-500 text-sm mt-1">pour créer un devis professionnel complet avec l'IA</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">100%</p>
              <p className="text-gray-500 text-sm mt-1">légal — signature électronique conforme eIDAS</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">0€</p>
              <p className="text-gray-500 text-sm mt-1">pendant 7 jours — aucun engagement, annulation libre</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <p className="text-3xl font-bold">60s</p>
            <p className="text-blue-200 text-sm mt-1">Pour créer un devis</p>
          </div>
          <div>
            <p className="text-3xl font-bold">100%</p>
            <p className="text-blue-200 text-sm mt-1">En ligne</p>
          </div>
          <div>
            <p className="text-3xl font-bold">0€</p>
            <p className="text-blue-200 text-sm mt-1">Les 7 premiers jours</p>
          </div>
          <div>
            <p className="text-3xl font-bold">Légal</p>
            <p className="text-blue-200 text-sm mt-1">Signature électronique</p>
          </div>
        </div>
      </section>

      {/* Comment ca marche */}
      <section id="comment-ca-marche" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-gray-500 text-lg">4 étapes pour passer de zéro à devis signé</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {etapes.map((e, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">
                  {e.num}
                </div>
                <p className="text-2xl mb-3">{e.icon}</p>
                <h3 className="font-bold text-gray-900 mb-2">{e.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition">
              Essayer gratuitement →
            </a>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tout ce qu'il vous faut</h2>
            <p className="text-gray-500 text-lg">Un outil complet pensé pour les artisans et indépendants</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
                <p className="text-3xl mb-4">{f.icon}</p>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarif */}
      <section id="tarif" className="py-20 px-6 bg-gray-50">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Un tarif simple et transparent</h2>
          <p className="text-gray-500 text-lg mb-12">Pas de surprise, pas de frais cachés</p>
          <div className="bg-blue-600 rounded-2xl p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-sm font-bold px-6 py-2 rounded-full whitespace-nowrap">
              🎉 7 jours gratuits — aucun engagement
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 mt-4">Plan unique</h3>
            <p className="text-6xl font-bold text-white mb-1">24,99€</p>
            <p className="text-blue-200 text-sm mb-8">par mois · résiliation libre</p>
            <ul className="space-y-3 text-left mb-8">
              {[
                'Devis illimités',
                'Signature électronique légale',
                'Facturation en 1 clic',
                'Catalogue et clients illimités',
                'Emails automatiques au client',
                'Support prioritaire',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white">
                  <span className="text-green-300 font-bold text-base">✓</span> {item}
                </li>
              ))}
            </ul>
            <a href="/register" className="block text-center bg-white text-blue-600 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition">
              Commencer — 7 jours gratuits →
            </a>
            <div className="flex justify-center gap-4 mt-4 text-blue-300 text-xs flex-wrap">
              <span>✅ Aucun engagement</span>
              <span>✅ Annulation en 1 clic</span>
              <span>✅ Aucun frais pendant 7 jours</span>
            </div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Prêt à gagner du temps ?</h2>
          <p className="text-blue-200 text-lg mb-8">Rejoignez les artisans qui créent leurs devis en 60 secondes</p>
          <a href="/register" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition">
            Commencer — 7 jours gratuits →
          </a>
          <div className="flex justify-center gap-4 mt-4 text-blue-300 text-sm flex-wrap">
            <span>✅ Aucun engagement</span>
            <span>✅ Annulation en 1 clic</span>
            <span>✅ Aucun frais pendant 7 jours</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">FaireDesDevis</h3>
              <p className="text-gray-400 text-sm">Devis professionnels pour artisans</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400 flex-wrap justify-center">
              <a href="/legal/cgu" className="hover:text-white transition">CGU</a>
              <a href="/legal/confidentialite" className="hover:text-white transition">Confidentialité</a>
              <a href="/legal/mentions" className="hover:text-white transition">Mentions légales</a>
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