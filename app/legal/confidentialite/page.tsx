export default function Confidentialite() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <a href="/" className="text-blue-600 font-bold text-xl block mb-8">FaireDesDevis</a>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de confidentialité</h1>
        <p className="text-gray-400 text-sm mb-8">Dernière mise à jour : juillet 2026</p>

        <div className="space-y-8 text-gray-600">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Responsable du traitement</h2>
            <p>E.I. BRETZNER MARC — 11 rue de la Vieille Ill, 67640 Fegersheim — support@fairedesdevis.fr</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Données collectées</h2>
            <p className="mb-2">Nous collectons les données suivantes :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nom, email, métier lors de l'inscription</li>
              <li>Données professionnelles : SIRET, adresse, téléphone, logo, signature</li>
              <li>Données de vos clients saisies dans l'application</li>
              <li>Données des devis et factures créés</li>
              <li>Adresse IP lors de la signature électronique</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Finalités du traitement</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fourniture du service de création de devis et factures</li>
              <li>Authentification et sécurité du compte</li>
              <li>Envoi d'emails transactionnels (devis, confirmations, notifications)</li>
              <li>Amélioration du service</li>
              <li>Respect des obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Base légale</h2>
            <p>Le traitement est basé sur l'exécution du contrat (CGU) et le consentement de l'utilisateur lors de l'inscription.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Sous-traitants</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Supabase</strong> — hébergement de la base de données (USA, couvert par les clauses contractuelles types)</li>
              <li><strong>Vercel</strong> — hébergement de l'application (USA)</li>
              <li><strong>Resend</strong> — envoi d'emails transactionnels (USA)</li>
              <li><strong>Anthropic</strong> — génération IA des devis (USA)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Durée de conservation</h2>
            <p>Vos données sont conservées pendant toute la durée de votre abonnement et 3 ans après la résiliation pour des obligations légales (comptabilité, preuve de signature électronique).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Vos droits</h2>
            <p className="mb-2">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
            </ul>
            <p className="mt-3">Pour exercer vos droits : <a href="mailto:support@fairedesdevis.fr" className="text-blue-600">support@fairedesdevis.fr</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Cookies</h2>
            <p>Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement de l'authentification. Aucun cookie publicitaire ou de tracking n'est utilisé.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact et réclamation</h2>
            <p>Pour toute question : <a href="mailto:support@fairedesdevis.fr" className="text-blue-600">support@fairedesdevis.fr</a><br/>
            Vous pouvez également saisir la CNIL : <a href="https://www.cnil.fr" className="text-blue-600">www.cnil.fr</a></p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex gap-6 text-sm text-gray-400">
          <a href="/legal/cgu" className="hover:text-blue-600">CGU</a>
          <a href="/legal/mentions" className="hover:text-blue-600">Mentions légales</a>
          <a href="/" className="hover:text-blue-600">Accueil</a>
        </div>
      </div>
    </main>
  )
}