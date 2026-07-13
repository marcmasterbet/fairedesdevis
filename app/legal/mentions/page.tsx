export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <a href="/" className="text-blue-600 font-bold text-xl block mb-8">FaireDesDevis</a>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions légales</h1>

        <div className="prose max-w-none space-y-8 text-gray-600">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Éditeur du site</h2>
            <p>E.I. BRETZNER MARC<br/>
            11 rue de la Vieille Ill<br/>
            67640 Fegersheim<br/>
            France<br/>
            SIRET : [EN COURS D'IMMATRICULATION]<br/>
            Email : support@fairedesdevis.fr</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Directeur de la publication</h2>
            <p>Marc Bretzner</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Hébergeur</h2>
            <p>Vercel Inc.<br/>
            440 N Barranca Ave #4133<br/>
            Covina, CA 91723<br/>
            États-Unis<br/>
            <a href="https://vercel.com" className="text-blue-600">https://vercel.com</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Propriété intellectuelle</h2>
            <p>L'ensemble du contenu de ce site (textes, images, logos, icônes) est la propriété exclusive de E.I. BRETZNER MARC. Toute reproduction, distribution ou utilisation sans autorisation préalable est strictement interdite.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
            <p>Pour toute question : <a href="mailto:support@fairedesdevis.fr" className="text-blue-600">support@fairedesdevis.fr</a></p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex gap-6 text-sm text-gray-400">
          <a href="/legal/cgu" className="hover:text-blue-600">CGU</a>
          <a href="/legal/confidentialite" className="hover:text-blue-600">Confidentialité</a>
          <a href="/" className="hover:text-blue-600">Accueil</a>
        </div>
      </div>
    </main>
  )
}