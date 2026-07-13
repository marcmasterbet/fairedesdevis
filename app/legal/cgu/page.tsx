export default function CGU() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <a href="/" className="text-blue-600 font-bold text-xl block mb-8">FaireDesDevis</a>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions Générales d'Utilisation</h1>
        <p className="text-gray-400 text-sm mb-8">Dernière mise à jour : juillet 2026</p>

        <div className="space-y-8 text-gray-600">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Objet</h2>
            <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du service FaireDesDevis, édité par E.I. BRETZNER MARC, accessible à l'adresse fairedesdevis.fr.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Acceptation des CGU</h2>
            <p>L'utilisation du service implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous devez cesser d'utiliser le service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Description du service</h2>
            <p>FaireDesDevis est une application SaaS permettant aux professionnels et artisans de :</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Créer des devis professionnels assistés par intelligence artificielle</li>
              <li>Envoyer des devis par email à leurs clients</li>
              <li>Recueillir la signature électronique de leurs clients</li>
              <li>Transformer des devis en factures</li>
              <li>Gérer leur catalogue produits et leur carnet clients</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Inscription et compte</h2>
            <p>L'accès au service nécessite la création d'un compte avec une adresse email valide. L'utilisateur est responsable de la confidentialité de ses identifiants. Tout accès frauduleux doit être signalé immédiatement à support@fairedesdevis.fr.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Période d'essai et abonnement</h2>
            <p>Le service propose une période d'essai gratuite d'un mois sans carte bancaire. À l'issue de cette période, l'accès au service est conditionné à la souscription d'un abonnement mensuel au tarif en vigueur (19,90€ HT/mois). L'abonnement est sans engagement et résiliable à tout moment.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Signature électronique</h2>
            <p>Les signatures électroniques recueillies via FaireDesDevis sont horodatées et enregistrées avec l'adresse IP du signataire. Elles ont valeur légale conformément au règlement eIDAS (UE n°910/2014). L'utilisateur est seul responsable de la conservation des devis signés.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Données et confidentialité</h2>
            <p>Les données saisies dans l'application (clients, devis, produits) appartiennent à l'utilisateur. FaireDesDevis s'engage à ne pas les communiquer à des tiers sans consentement, sauf obligation légale. Voir notre <a href="/legal/confidentialite" className="text-blue-600">politique de confidentialité</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Responsabilité</h2>
            <p>FaireDesDevis met tout en œuvre pour assurer la disponibilité du service mais ne peut garantir une disponibilité ininterrompue. La responsabilité de FaireDesDevis ne saurait être engagée en cas de perte de données résultant d'une interruption de service. L'utilisateur est seul responsable du contenu des devis et factures générés.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Résiliation</h2>
            <p>L'utilisateur peut résilier son compte à tout moment depuis son espace ou en contactant support@fairedesdevis.fr. FaireDesDevis se réserve le droit de suspendre ou supprimer un compte en cas de violation des présentes CGU, sans préavis.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Modification des CGU</h2>
            <p>FaireDesDevis se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par email de toute modification substantielle. La poursuite de l'utilisation du service vaut acceptation des nouvelles CGU.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Droit applicable</h2>
            <p>Les présentes CGU sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire. À défaut, les tribunaux compétents seront ceux du ressort de Strasbourg.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contact</h2>
            <p>E.I. BRETZNER MARC<br/>
            11 rue de la Vieille Ill, 67640 Fegersheim<br/>
            <a href="mailto:support@fairedesdevis.fr" className="text-blue-600">support@fairedesdevis.fr</a></p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex gap-6 text-sm text-gray-400">
          <a href="/legal/confidentialite" className="hover:text-blue-600">Confidentialité</a>
          <a href="/legal/mentions" className="hover:text-blue-600">Mentions légales</a>
          <a href="/" className="hover:text-blue-600">Accueil</a>
        </div>
      </div>
    </main>
  )
}