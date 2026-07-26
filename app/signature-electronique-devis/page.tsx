import Link from 'next/link'

const LOGO = 'https://xkwdwragibeingoaizwq.supabase.co/storage/v1/object/public/logos/ChatGPT%20Image%2026%20juil.%202026,%2016_39_11.png'

export default function SignatureElectroniqueDevis() {
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
            Signature électronique de devis<br/>
            <span className="text-blue-600">légale et sécurisée</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Vos clients signent votre devis en ligne depuis leur téléphone. Valeur légale garantie, conforme au règlement eIDAS.
          </p>
          <a href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Essayer gratuitement →
          </a>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Comment fonctionne la signature électronique ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { num: '1', titre: 'Envoi du devis', desc: 'Votre client reçoit un email avec le lien vers son devis.' },
              { num: '2', titre: 'Lecture en ligne', desc: 'Il consulte le devis depuis son téléphone ou ordinateur.' },
              { num: '3', titre: 'Bon pour accord', desc: 'Il écrit la mention légale et dessine sa signature.' },
              { num: '4', titre: 'Signature certifiée', desc: 'Horodatage + IP enregistrés. Valeur légale garantie.' },
            ].map((e, i) => (
              <div key={i} className="text-center bg-blue-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">{e.num}</div>
                <h3 className="font-bold text-gray-900 mb-2">{e.titre}</h3>
                <p className="text-gray-500 text-sm">{e.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Conformité légale garantie</h3>
            <ul className="space-y-2">
              {[
                'Conforme au règlement européen eIDAS (910/2014)',
                'Même valeur qu\'une signature manuscrite en France',
                'Mention "Bon pour accord" obligatoire incluse',
                'Horodatage certifié et adresse IP enregistrée',
                'Preuve recevable devant les tribunaux français',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <span className="text-green-600">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-blue-600 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Signature électronique incluse dans FaireDesDevis</h2>
          <p className="text-blue-200 mb-8">7 jours gratuits — 24,99€/mois ensuite — résiliation libre</p>
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