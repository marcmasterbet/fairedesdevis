import Link from 'next/link'
import { notFound } from 'next/navigation'

const articles: Record<string, {
  titre: string
  categorie: string
  date: string
  contenu: string
}> = {
  'comment-faire-un-devis-professionnel': {
    titre: 'Comment faire un devis professionnel en 2026 (guide complet)',
    categorie: 'GUIDE PRATIQUE',
    date: '24 juillet 2026',
    contenu: `
      <h2>Qu'est-ce qu'un devis professionnel ?</h2>
      <p>Un devis est un document contractuel qui engage l'artisan sur le prix et les prestations. En France, il est obligatoire pour tout travail dépassant 150€ TTC dans le bâtiment.</p>
      <h2>Les mentions obligatoires sur un devis</h2>
      <ul>
        <li>Nom, prénom ou raison sociale et adresse du professionnel</li>
        <li>Numéro SIRET</li>
        <li>Date de rédaction et durée de validité</li>
        <li>Description détaillée des travaux</li>
        <li>Prix unitaires HT, TVA applicable et montant TTC</li>
        <li>Conditions de paiement</li>
        <li>Mention "Devis gratuit et sans engagement"</li>
      </ul>
      <h2>Comment créer un devis en 60 secondes avec FaireDesDevis</h2>
      <p>Avec FaireDesDevis, vous renseignez votre client, sélectionnez vos produits depuis votre catalogue et l'IA génère un devis complet, professionnel et légal en moins d'une minute.</p>
      <h2>La signature électronique</h2>
      <p>Une fois le devis envoyé, votre client le signe directement en ligne. La signature électronique avec mention "Bon pour accord" a valeur légale en France conformément au règlement eIDAS.</p>
    `
  },
  'logiciel-devis-artisan-gratuit': {
    titre: 'Logiciel devis artisan gratuit : pourquoi la gratuité coûte cher',
    categorie: 'GUIDE LOGICIEL',
    date: '22 juillet 2026',
    contenu: `
      <h2>Le mythe du logiciel gratuit</h2>
      <p>Beaucoup d'artisans cherchent un logiciel de devis gratuit. C'est compréhensible. Mais la gratuité cache souvent des limitations sérieuses qui vous coûtent du temps et de l'argent.</p>
      <h2>Les pièges des logiciels gratuits</h2>
      <ul>
        <li>Nombre de devis limité par mois</li>
        <li>Pas de signature électronique légale</li>
        <li>Pas de facturation intégrée</li>
        <li>Export PDF avec filigrane</li>
        <li>Support inexistant</li>
      </ul>
      <h2>Combien coûte vraiment un devis fait à la main ?</h2>
      <p>Un artisan passe en moyenne 45 minutes à créer un devis manuellement. À 50€/h de taux horaire, c'est 37,50€ par devis. FaireDesDevis à 24,99€/mois vous fait économiser des centaines d'euros chaque mois.</p>
      <h2>Pourquoi FaireDesDevis vaut 24,99€/mois</h2>
      <p>Devis illimités, signature électronique légale, facturation en 1 clic, catalogue intelligent, carnet clients — tout ce dont vous avez besoin pour 24,99€/mois avec 7 jours gratuits.</p>
    `
  },
  'mentions-legales-devis-artisan': {
    titre: 'Mentions légales obligatoires sur un devis artisan en France',
    categorie: 'RÉGLEMENTATION',
    date: '20 juillet 2026',
    contenu: `
      <h2>Pourquoi les mentions légales sont importantes</h2>
      <p>Un devis sans les mentions obligatoires peut être contesté par votre client et vous expose à des sanctions. Voici la checklist complète.</p>
      <h2>Checklist des mentions obligatoires</h2>
      <ul>
        <li>✅ Nom et prénom ou raison sociale</li>
        <li>✅ Adresse complète</li>
        <li>✅ Numéro SIRET</li>
        <li>✅ Numéro TVA intracommunautaire (si applicable)</li>
        <li>✅ Assurance décennale (nom de l'assureur, numéro de police)</li>
        <li>✅ Date de rédaction du devis</li>
        <li>✅ Durée de validité de l'offre</li>
        <li>✅ Description précise des travaux</li>
        <li>✅ Prix HT, TVA et TTC</li>
        <li>✅ Conditions de paiement et acompte</li>
        <li>✅ Pénalités de retard</li>
      </ul>
      <h2>FaireDesDevis intègre toutes ces mentions automatiquement</h2>
      <p>Configurez votre profil une seule fois — SIRET, assurance, TVA — et FaireDesDevis les intègre automatiquement dans tous vos devis.</p>
    `
  },
  'signature-electronique-devis-valeur-legale': {
    titre: 'Signature électronique sur un devis : valeur légale en France',
    categorie: 'RÉGLEMENTATION',
    date: '18 juillet 2026',
    contenu: `
      <h2>La signature électronique est-elle légale en France ?</h2>
      <p>Oui. Depuis le règlement européen eIDAS (910/2014), la signature électronique a la même valeur juridique qu'une signature manuscrite en France.</p>
      <h2>Conditions pour qu'une signature électronique soit valide</h2>
      <ul>
        <li>Identification du signataire (nom, email)</li>
        <li>Mention explicite "Bon pour accord"</li>
        <li>Horodatage certifié</li>
        <li>Adresse IP enregistrée</li>
        <li>Consentement libre et éclairé</li>
      </ul>
      <h2>Comment fonctionne la signature sur FaireDesDevis</h2>
      <p>Votre client reçoit le devis par email. Il clique sur le lien, écrit "Bon pour accord", dessine sa signature et valide. Le tout est horodaté et l'IP est enregistrée. Valeur légale garantie.</p>
      <h2>En cas de litige</h2>
      <p>La signature électronique FaireDesDevis constitue une preuve recevable devant les tribunaux français.</p>
    `
  },
  'devis-plombier-electricien-menuisier': {
    titre: 'Devis plombier, électricien, menuisier : modèles gratuits 2026',
    categorie: 'MODÈLES',
    date: '15 juillet 2026',
    contenu: `
      <h2>Pourquoi chaque métier a besoin d'un modèle adapté</h2>
      <p>Un devis de plombier n'a pas les mêmes lignes qu'un devis d'électricien. Les matériaux, la TVA applicable et les mentions spécifiques varient selon le corps de métier.</p>
      <h2>Devis plombier</h2>
      <p>Les devis plomberie doivent inclure : fourniture et pose des équipements, main d'œuvre, garantie décennale, TVA à 10% pour rénovation ou 20% pour neuf.</p>
      <h2>Devis électricien</h2>
      <p>Les devis électricité doivent mentionner : certification Qualifelec ou RGE, câblage et équipements, mise aux normes NF C 15-100, TVA applicable.</p>
      <h2>Devis menuisier</h2>
      <p>Les devis menuiserie incluent : essence du bois ou matériaux, dimensions précises, finitions, pose et délais de livraison.</p>
      <h2>FaireDesDevis adapte le devis à votre métier</h2>
      <p>Configurez votre activité une fois et FaireDesDevis génère automatiquement le bon modèle avec les bonnes mentions pour votre corps de métier.</p>
    `
  },
  'transformer-devis-en-facture': {
    titre: 'Comment transformer un devis accepté en facture en 1 clic',
    categorie: 'GUIDE PRATIQUE',
    date: '10 juillet 2026',
    contenu: `
      <h2>Devis signé : et maintenant ?</h2>
      <p>Une fois votre devis accepté et signé par votre client, vous devez émettre une facture. C'est une obligation légale en France pour tout professionnel.</p>
      <h2>Les différences entre un devis et une facture</h2>
      <ul>
        <li>Le devis est une proposition — la facture est une demande de paiement</li>
        <li>La facture doit avoir un numéro séquentiel unique</li>
        <li>La facture doit mentionner la date d'échéance de paiement</li>
        <li>Les pénalités de retard sont obligatoires sur la facture</li>
      </ul>
      <h2>La conversion en 1 clic sur FaireDesDevis</h2>
      <p>Depuis votre dashboard, cliquez sur "Convertir en facture" sur n'importe quel devis accepté. FaireDesDevis génère automatiquement la facture avec le bon numéro, les bonnes mentions et l'envoie à votre client.</p>
      <h2>Suivi des paiements</h2>
      <p>Suivez en temps réel quelles factures sont payées, en attente ou en retard depuis votre tableau de bord.</p>
    `
  },
  'devis-batiment-travaux': {
    titre: 'Comment faire un devis pour travaux en bâtiment en 2026',
    categorie: 'GUIDE PRATIQUE',
    date: '8 juillet 2026',
    contenu: `
      <h2>Le devis bâtiment : une obligation légale</h2>
      <p>Pour tous travaux de construction, rénovation ou entretien dépassant 150€ TTC, le devis est obligatoire en France. Il protège à la fois l'artisan et le client.</p>
      <h2>Comment chiffrer des travaux bâtiment</h2>
      <ul>
        <li>Calculez le coût des matériaux avec une marge de 10-15%</li>
        <li>Estimez le temps de main d'œuvre précisément</li>
        <li>Ajoutez les frais de déplacement</li>
        <li>Prévoyez une marge pour les imprévus (5-10%)</li>
        <li>Appliquez la TVA au bon taux (5,5%, 10% ou 20%)</li>
      </ul>
      <h2>Les taux de TVA dans le bâtiment</h2>
      <p>TVA à 5,5% pour les travaux d'économie d'énergie, 10% pour la rénovation de logements de plus de 2 ans, 20% pour les constructions neuves.</p>
      <h2>Gagnez du temps avec FaireDesDevis</h2>
      <p>Importez votre catalogue de matériaux et tarifs. L'IA calcule automatiquement les totaux, applique la bonne TVA et génère un devis professionnel en 60 secondes.</p>
    `
  },
  'relance-devis-non-signe': {
    titre: 'Comment relancer un client après un devis non signé',
    categorie: 'CONSEILS',
    date: '5 juillet 2026',
    contenu: `
      <h2>Pourquoi relancer est essentiel</h2>
      <p>En moyenne, 60% des devis non relancés ne sont jamais signés. Pourtant, une simple relance au bon moment peut transformer un prospect hésitant en client.</p>
      <h2>Quand relancer ?</h2>
      <ul>
        <li>J+3 : première relance douce par email</li>
        <li>J+7 : appel téléphonique</li>
        <li>J+14 : dernière relance avec offre limitée</li>
      </ul>
      <h2>Comment relancer sans être intrusif</h2>
      <p>Proposez une valeur ajoutée : "J'ai une disponibilité la semaine prochaine si vous souhaitez démarrer rapidement." Ou mentionnez une hausse de prix des matériaux pour créer l'urgence.</p>
      <h2>Modèle d'email de relance</h2>
      <p>Bonjour [Prénom], je me permets de revenir vers vous concernant le devis n°[XXX] envoyé le [date]. Avez-vous des questions ? Je reste disponible pour en discuter. Cordialement, [Votre nom]</p>
    `
  },
  'auto-entrepreneur-devis-facture': {
    titre: 'Auto-entrepreneur : comment faire ses devis et factures légalement',
    categorie: 'RÉGLEMENTATION',
    date: '2 juillet 2026',
    contenu: `
      <h2>Les obligations de l'auto-entrepreneur</h2>
      <p>Même en auto-entreprise, vous êtes soumis aux mêmes obligations de facturation que les autres professionnels. Vos devis et factures doivent respecter un cadre légal précis.</p>
      <h2>Mentions spécifiques auto-entrepreneur</h2>
      <ul>
        <li>Mention "Auto-entrepreneur" ou "Micro-entreprise"</li>
        <li>Numéro SIRET obligatoire</li>
        <li>Mention "TVA non applicable, art. 293 B du CGI" si franchise de TVA</li>
        <li>Votre nom et prénom (pas de raison sociale possible)</li>
      </ul>
      <h2>Les seuils de chiffre d'affaires 2026</h2>
      <p>Ventes de marchandises : 188 700€. Prestations de services : 77 700€. Au-delà, vous basculez en régime réel et devez facturer la TVA.</p>
      <h2>FaireDesDevis adapté aux auto-entrepreneurs</h2>
      <p>Configurez votre statut auto-entrepreneur et FaireDesDevis intègre automatiquement toutes les mentions légales spécifiques à votre situation.</p>
    `
  },
  'catalogue-produits-artisan': {
    titre: 'Comment créer un catalogue produits pour artisan et gagner 2h par semaine',
    categorie: 'PRODUCTIVITÉ',
    date: '28 juin 2026',
    contenu: `
      <h2>Pourquoi un catalogue produits est indispensable</h2>
      <p>Sans catalogue, chaque devis vous oblige à ressaisir les mêmes produits, références et prix. Avec un catalogue bien organisé, vous créez un devis en 60 secondes au lieu de 45 minutes.</p>
      <h2>Comment organiser votre catalogue</h2>
      <ul>
        <li>Catégorisez par type de produit ou de prestation</li>
        <li>Renseignez les prix d'achat et de vente</li>
        <li>Ajoutez les références fournisseurs</li>
        <li>Mettez à jour les prix régulièrement</li>
      </ul>
      <h2>Importer depuis Excel ou CSV</h2>
      <p>FaireDesDevis accepte l'import de catalogue depuis Excel ou CSV. L'IA extrait automatiquement vos produits, références et prix — même depuis un fichier mal formaté.</p>
      <h2>Résultat concret</h2>
      <p>Un artisan avec un catalogue de 200 produits crée ses devis 20x plus vite. Sur 10 devis par semaine, c'est 7 heures récupérées chaque semaine.</p>
    `
  },
}

export default function Article({ params }: { params: { slug: string } }) {
  const article = articles[params.slug]
  if (!article) notFound()

  return (
    <main style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 20, fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>FaireDesDevis</Link>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <Link href="/blog" style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>← Blog</Link>
        </div>
        <Link href="/register" style={{ background: '#2563eb', color: '#fff', borderRadius: 8, padding: '10px 18px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Essai gratuit 7j</Link>
      </nav>

      {/* ARTICLE */}
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: '0.1em' }}>{article.categorie}</span>
          <span style={{ fontSize: 11, color: '#6b7280' }}>·</span>
          <span style={{ fontSize: 11, color: '#6b7280' }}>{article.date}</span>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#ffffff', lineHeight: 1.2, marginBottom: 40 }}>{article.titre}</h1>

        <div
          style={{ color: '#d1d5db', lineHeight: 1.8, fontSize: 16 }}
          dangerouslySetInnerHTML={{ __html: article.contenu
            .replace(/<h2>/g, '<h2 style="color:#ffffff;font-size:22px;font-weight:800;margin:36px 0 16px">')
            .replace(/<ul>/g, '<ul style="margin:16px 0 24px;padding-left:24px">')
            .replace(/<li>/g, '<li style="margin-bottom:8px">')
            .replace(/<p>/g, '<p style="margin-bottom:20px">')
          }}
        />

        {/* CTA */}
        <div style={{ background: '#1a1a2e', border: '1px solid #2563eb', borderRadius: 16, padding: 32, marginTop: 48, textAlign: 'center' }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>Prêt à créer votre premier devis en 60 secondes ?</p>
          <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 24 }}>7 jours gratuits — aucun engagement — annulation en 1 clic</p>
          <Link href="/register" style={{ background: '#2563eb', color: '#fff', borderRadius: 10, padding: '14px 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            Commencer gratuitement →
          </Link>
        </div>
      </article>

    </main>
  )
}