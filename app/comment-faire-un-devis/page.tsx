import Link from 'next/link'

const LOGO = 'https://xkwdwragibeingoaizwq.supabase.co/storage/v1/object/public/logos/ChatGPT%20Image%2026%20juil.%202026,%2016_39_11.png'

export default function CommentFaireUnDevis() {
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
            Comment faire un devis professionnel ?<br/>
            <span className="text-blue-600">Guide complet 2026</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Tout ce qu'il faut savoir pour créer un devis légal, professionnel et qui fait signer vos clients rapidement.
          </p>
          <a href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Créer mon devis gratuitement →
          </a>
          <p className="text-sm text-gray-400 mt-4">7 jours gratuits — aucun engagement</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto prose prose-lg">

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Qu'est-ce qu'un devis ?</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Un devis est un document contractuel par lequel un professionnel s'engage sur le prix et les prestations qu'il va réaliser pour son client. En France, il est obligatoire pour tout travail dépassant 150€ TTC dans le bâtiment. Une fois signé par le client avec la mention "Bon pour accord", il a valeur de contrat.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Les mentions obligatoires sur un devis</h2>
          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <ul className="space-y-3">
              {[
                'Nom, prénom ou raison sociale et adresse du professionnel',
                'Numéro SIRET',
                'Numéro TVA intracommunautaire (si applicable)',
                'Assurance décennale (nom assureur + numéro de police)',
                'Date de rédaction et durée de validité',
                'Description détaillée des travaux ou prestations',
                'Prix unitaires HT, TVA applicable et montant TTC',
                'Conditions de paiement et montant de l\'acompte',
                'Pénalités de retard',
                'Mention "Devis gratuit et sans engagement"',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Comment calculer le prix d'un devis ?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">Pour calculer le prix de votre devis, vous devez prendre en compte :</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { titre: 'Coût des matériaux', desc: 'Prix d\'achat + marge de 15-20% pour couvrir les imprévus et le transport.' },
              { titre: 'Main d\'œuvre', desc: 'Temps estimé × votre taux horaire. Soyez précis pour éviter de travailler à perte.' },
              { titre: 'Frais généraux', desc: 'Déplacement, outillage, assurance — à répartir sur chaque chantier.' },
              { titre: 'TVA', desc: '5,5% énergie, 10% rénovation, 20% neuf. Appliquez le bon taux selon la prestation.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">{item.titre}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">La signature électronique sur un devis</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Depuis le règlement européen eIDAS, la signature électronique a la même valeur légale qu'une signature manuscrite en France. Pour qu'elle soit valide, elle doit inclure : la mention "Bon pour accord", l'identification du signataire, un horodatage certifié et l'adresse IP enregistrée. FaireDesDevis gère tout ça automatiquement.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Créer un devis en 60 secondes avec FaireDesDevis</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Avec FaireDesDevis, vous créez un devis professionnel complet en moins d'une minute. L'IA intègre automatiquement toutes les mentions légales, calcule la TVA et génère un document PDF prêt à envoyer. Votre client signe en ligne depuis son téléphone.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { num: '1', desc: 'Configurez votre profil une fois' },
              { num: '2', desc: 'Sélectionnez vos prestations' },
              { num: '3', desc: 'Envoyez au client par email' },
              { num: '4', desc: 'Le client signe en ligne' },
            ].map((e, i) => (
              <div key={i} className="text-center bg-blue-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">{e.num}</div>
                <p className="text-sm text-gray-700">{e.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      <section className="py-16 px-6 bg-blue-600 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Prêt à créer votre premier devis ?</h2>
          <p className="text-blue-200 mb-8">7 jours gratuits — aucun engagement — annulation en 1 clic</p>
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
          <Link href="/legal/mentions" className="hover:text-white">Mentions légales</Link>
        </div>
        <p className="text-gray-600 text-sm">© 2026 FaireDesDevis</p>
      </footer>

    </main>
  )
}