import { MetadataRoute } from 'next'

const villes = ['strasbourg', 'paris', 'lyon', 'marseille', 'bordeaux', 'toulouse', 'nantes', 'lille', 'nice', 'montpellier']
const metiers = ['plombier', 'electricien', 'menuisier', 'carreleur', 'peintre', 'macon', 'chauffagiste', 'serrurier', 'pisciniste', 'conciergerie']

const articlesStatiques = [
  'comment-faire-un-devis-professionnel',
  'logiciel-devis-artisan-gratuit',
  'mentions-legales-devis-artisan',
  'signature-electronique-devis-valeur-legale',
  'devis-plombier-electricien-menuisier',
  'transformer-devis-en-facture',
  'devis-batiment-travaux',
  'relance-devis-non-signe',
  'auto-entrepreneur-devis-facture',
  'catalogue-produits-artisan',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base: MetadataRoute.Sitemap = [
    { url: 'https://fairedesdevis.fr', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://fairedesdevis.fr/register', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://fairedesdevis.fr/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://fairedesdevis.fr/login', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://fairedesdevis.fr/legal/cgu', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://fairedesdevis.fr/legal/confidentialite', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://fairedesdevis.fr/legal/mentions', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  const articlesStatiquesUrls: MetadataRoute.Sitemap = articlesStatiques.map(slug => ({
    url: `https://fairedesdevis.fr/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const articlesVillesUrls: MetadataRoute.Sitemap = metiers.flatMap(metier =>
    villes.map(ville => ({
      url: `https://fairedesdevis.fr/blog/${metier}-${ville}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  )

  const fichesMeatiersUrls: MetadataRoute.Sitemap = metiers.map(metier => ({
    url: `https://fairedesdevis.fr/metiers/${metier}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...base, ...articlesStatiquesUrls, ...articlesVillesUrls, ...fichesMeatiersUrls]
}