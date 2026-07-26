import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use } from 'react'

const villes = [
  { nom: 'Strasbourg', region: 'Grand Est' },
  { nom: 'Paris', region: 'Île-de-France' },
  { nom: 'Lyon', region: 'Auvergne-Rhône-Alpes' },
  { nom: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur' },
  { nom: 'Bordeaux', region: 'Nouvelle-Aquitaine' },
  { nom: 'Toulouse', region: 'Occitanie' },
  { nom: 'Nantes', region: 'Pays de la Loire' },
  { nom: 'Lille', region: 'Hauts-de-France' },
  { nom: 'Nice', region: 'Provence-Alpes-Côte d\'Azur' },
  { nom: 'Montpellier', region: 'Occitanie' },
]

const metiers = [
  { nom: 'plombier', label: 'Plombier', travaux: 'fuite d\'eau, installation sanitaire, chauffe-eau, débouchage' },
  { nom: 'electricien', label: 'Électricien', travaux: 'mise aux normes, tableau électrique, installation, dépannage' },
  { nom: 'menuisier', label: 'Menuisier', travaux: 'pose de fenêtres, portes, parquet, aménagement sur mesure' },
  { nom: 'carreleur', label: 'Carreleur', travaux: 'pose de carrelage, faïence, salle de bain, terrasse' },
  { nom: 'peintre', label: 'Peintre', travaux: 'peinture intérieure, extérieure, ravalement, décoration' },
  { nom: 'macon', label: 'Maçon', travaux: 'construction, rénovation, extension, enduit, gros œuvre' },
  { nom: 'chauffagiste', label: 'Chauffagiste', travaux: 'installation chaudière, pompe à chaleur, radiateurs, entretien' },
  { nom: 'serrurier', label: 'Serrurier', travaux: 'remplacement serrure, ouverture de porte, blindage, dépannage' },
  { nom: 'pisciniste', label: 'Pisciniste', travaux: 'installation piscine, entretien, rénovation, traitement eau' },
  { nom: 'conciergerie', label: 'Conciergerie', travaux: 'gestion locative, accueil voyageurs, ménage, état des lieux' },
]

const articlesStatiques: Record<string, {
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
      <p>Beaucoup d'artisans cherchent un logiciel de devis gratuit. C'est compréhensible. Mais la gratuité cache souvent des limitations sérieuses.</p>
      <h2>Les pièges des logiciels gratuits</h2>
      <ul>
        <li>Nombre de devis limité par mois</li>
        <li>Pas de signature électronique légale</li>
        <li>Pas de facturation intégrée</li>
        <li>Export PDF avec filigrane</li>
        <li>Support inexistant</li>
      </ul>
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
      <p>Un devis sans les mentions obligatoires peut être contesté par votre client et vous expose à des sanctions.</p>
      <h2>Checklist des mentions obligatoires</h2>
      <ul>
        <li>✅ Nom et prénom ou raison sociale</li>
        <li>✅ Adresse complète</li>
        <li>✅ Numéro SIRET</li>
        <li>✅ Assurance décennale</li>
        <li>✅ Prix HT, TVA et TTC</li>
        <li>✅ Conditions de paiement</li>
      </ul>
      <h2>FaireDesDevis intègre toutes ces mentions automatiquement</h2>
      <p>Configurez votre profil une seule fois et FaireDesDevis les intègre dans tous vos devis.</p>
    `
  },
  'signature-electronique-devis-valeur-legale': {
    titre: 'Signature électronique sur un devis : valeur légale en France',
    categorie: 'RÉGLEMENTATION',
    date: '18 juillet 2026',
    contenu: `
      <h2>La signature électronique est-elle légale en France ?</h2>
      <p>Oui. Depuis le règlement européen eIDAS (910/2014), la signature électronique a la même valeur juridique qu'une signature manuscrite.</p>
      <h2>Conditions pour qu'une signature soit valide</h2>
      <ul>
        <li>Identification du signataire</li>
        <li>Mention "Bon pour accord"</li>
        <li>Horodatage certifié</li>
        <li>Adresse IP enregistrée</li>
      </ul>
      <h2>Comment fonctionne la signature sur FaireDesDevis</h2>
      <p>Votre client reçoit le devis par email, clique sur le lien, signe en ligne. Valeur légale garantie.</p>
    `
  },
  'devis-plombier-electricien-menuisier': {
    titre: 'Devis plombier, électricien, menuisier : modèles gratuits 2026',
    categorie: 'MODÈLES',
    date: '15 juillet 2026',
    contenu: `
      <h2>Pourquoi chaque métier a besoin d'un modèle adapté</h2>
      <p>Un devis de plombier n'a pas les mêmes lignes qu'un devis d'électricien.</p>
      <h2>Devis plombier</h2>
      <p>Fourniture et pose des équipements, main d'œuvre, garantie décennale, TVA à 10% pour rénovation.</p>
      <h2>Devis électricien</h2>
      <p>Certification Qualifelec ou RGE, câblage et équipements, mise aux normes NF C 15-100.</p>
      <h2>Devis menuisier</h2>
      <p>Essence du bois, dimensions précises, finitions, pose et délais de livraison.</p>
    `
  },
  'transformer-devis-en-facture': {
    titre: 'Comment transformer un devis accepté en facture en 1 clic',
    categorie: 'GUIDE PRATIQUE',
    date: '10 juillet 2026',
    contenu: `
      <h2>Devis signé : et maintenant ?</h2>
      <p>Une fois votre devis accepté, vous devez émettre une facture. C'est une obligation légale.</p>
      <h2>Les différences entre devis et facture</h2>
      <ul>
        <li>Le devis est une proposition — la facture est une demande de paiement</li>
        <li>La facture doit avoir un numéro séquentiel unique</li>
        <li>Les pénalités de retard sont obligatoires sur la facture</li>
      </ul>
      <h2>La conversion en 1 clic sur FaireDesDevis</h2>
      <p>Cliquez sur "Convertir en facture" — FaireDesDevis génère automatiquement la facture et l'envoie à votre client.</p>
    `
  },
  'devis-batiment-travaux': {
    titre: 'Comment faire un devis pour travaux en bâtiment en 2026',
    categorie: 'GUIDE PRATIQUE',
    date: '8 juillet 2026',
    contenu: `
      <h2>Le devis bâtiment : une obligation légale</h2>
      <p>Pour tous travaux dépassant 150€ TTC, le devis est obligatoire en France.</p>
      <h2>Comment chiffrer des travaux bâtiment</h2>
      <ul>
        <li>Calculez le coût des matériaux avec une marge de 10-15%</li>
        <li>Estimez le temps de main d'œuvre précisément</li>
        <li>Ajoutez les frais de déplacement</li>
        <li>Appliquez la TVA au bon taux (5,5%, 10% ou 20%)</li>
      </ul>
    `
  },
  'relance-devis-non-signe': {
    titre: 'Comment relancer un client après un devis non signé',
    categorie: 'CONSEILS',
    date: '5 juillet 2026',
    contenu: `
      <h2>Pourquoi relancer est essentiel</h2>
      <p>60% des devis non relancés ne sont jamais signés.</p>
      <h2>Quand relancer ?</h2>
      <ul>
        <li>J+3 : première relance douce par email</li>
        <li>J+7 : appel téléphonique</li>
        <li>J+14 : dernière relance avec offre limitée</li>
      </ul>
    `
  },
  'auto-entrepreneur-devis-facture': {
    titre: 'Auto-entrepreneur : comment faire ses devis et factures légalement',
    categorie: 'RÉGLEMENTATION',
    date: '2 juillet 2026',
    contenu: `
      <h2>Les obligations de l'auto-entrepreneur</h2>
      <p>Même en auto-entreprise, vos devis doivent respecter un cadre légal précis.</p>
      <h2>Mentions spécifiques auto-entrepreneur</h2>
      <ul>
        <li>Mention "Auto-entrepreneur"</li>
        <li>Numéro SIRET obligatoire</li>
        <li>Mention "TVA non applicable, art. 293 B du CGI"</li>
      </ul>
    `
  },
  'catalogue-produits-artisan': {
    titre: 'Comment créer un catalogue produits pour artisan et gagner 2h par semaine',
    categorie: 'PRODUCTIVITÉ',
    date: '28 juin 2026',
    contenu: `
      <h2>Pourquoi un catalogue produits est indispensable</h2>
      <p>Sans catalogue, chaque devis vous oblige à ressaisir les mêmes produits. Avec un catalogue, vous créez un devis en 60 secondes.</p>
      <h2>Importer depuis Excel ou CSV</h2>
      <p>FaireDesDevis accepte l'import depuis Excel ou CSV. L'IA extrait automatiquement vos produits et prix.</p>
    `
  },
}

function genererArticleVille(metier: typeof metiers[0], ville: typeof villes[0]) {
  return {
    titre: `${metier.label} à ${ville.nom} : devis gratuit en 60 secondes`,
    categorie: 'ANNUAIRE',
    date: '26 juillet 2026',
    contenu: `
      <h2>Trouver un ${metier.label.toLowerCase()} à ${ville.nom}</h2>
      <p>Vous cherchez un ${metier.label.toLowerCase()} à ${ville.nom} (${ville.region}) ? Obtenez un devis professionnel en 60 secondes grâce à FaireDesDevis, la plateforme de devis en ligne pour artisans.</p>
      <h2>Les prestations d'un ${metier.label.toLowerCase()} à ${ville.nom}</h2>
      <p>Un ${metier.label.toLowerCase()} à ${ville.nom} intervient pour : ${metier.travaux}. Chaque intervention nécessite un devis détaillé avant travaux.</p>
      <h2>Combien coûte un ${metier.label.toLowerCase()} à ${ville.nom} ?</h2>
      <p>Le tarif d'un ${metier.label.toLowerCase()} à ${ville.nom} varie selon la complexité des travaux, les matériaux utilisés et le temps d'intervention. Un devis précis est indispensable pour comparer les offres.</p>
      <h2>Comment obtenir un devis de ${metier.label.toLowerCase()} à ${ville.nom} ?</h2>
      <ul>
        <li>Décrivez vos travaux précisément</li>
        <li>Demandez plusieurs devis pour comparer</li>
        <li>Vérifiez les assurances et certifications du professionnel</li>
        <li>Exigez un devis signé avant de démarrer</li>
      </ul>
      <h2>Vous êtes ${metier.label.toLowerCase()} à ${ville.nom} ?</h2>
      <p>Créez vos devis professionnels en 60 secondes avec FaireDesDevis. Vos clients signent en ligne, vous facturez en 1 clic. Essai gratuit 7 jours sans engagement.</p>
    `
  }
}

function getArticle(slug: string) {
  if (articlesStatiques[slug]) return articlesStatiques[slug]

  for (const metier of metiers) {
    for (const ville of villes) {
      const villeSlug = ville.nom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
      const generatedSlug = `${metier.nom}-${villeSlug}`
      if (slug === generatedSlug) {
        return genererArticleVille(metier, ville)
      }
    }
  }

  return null
}

export default function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const article = getArticle(slug)
  if (!article) notFound()

  return (
    <main style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      <nav style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 20, fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>FaireDesDevis</Link>
        <Link href="/blog" style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>← Blog</Link>
        <Link href="/register" style={{ background: '#2563eb', color: '#fff', borderRadius: 8, padding: '10px 18px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Essai gratuit 7j</Link>
      </nav>

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