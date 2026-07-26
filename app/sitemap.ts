import { MetadataRoute } from 'next'

const villes = ['strasbourg', 'paris', 'lyon', 'marseille', 'bordeaux', 'toulouse', 'nantes', 'lille', 'nice', 'montpellier', 'rennes', 'reims', 'saint-etienne', 'toulon', 'grenoble', 'dijon', 'angers', 'nimes', 'villeurbanne', 'clermont-ferrand', 'aix-en-provence', 'brest', 'tours', 'amiens', 'limoges', 'annecy', 'perpignan', 'boulogne-billancourt', 'metz', 'besancon', 'orleans', 'rouen', 'mulhouse', 'caen', 'nancy', 'saint-denis', 'argenteuil', 'montreuil', 'roubaix', 'tourcoing', 'avignon', 'dunkerque', 'poitiers', 'versailles', 'colombes', 'pau', 'vitry-sur-seine', 'la-rochelle', 'cannes', 'colmar']
const metiers = ['plombier', 'electricien', 'menuisier', 'carreleur', 'peintre', 'macon', 'chauffagiste', 'serrurier', 'pisciniste', 'conciergerie']
const departements = ['alsace', 'ile-de-france', 'auvergne-rhone-alpes', 'paca', 'nouvelle-aquitaine', 'occitanie', 'bretagne', 'pays-de-la-loire', 'hauts-de-france', 'normandie', 'grand-est', 'bourgogne-franche-comte', 'centre-val-de-loire']

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

const landingPages = [
  'comment-faire-un-devis',
  'logiciel-devis-artisan',
  'devis-en-ligne-gratuit',
  'signature-electronique-devis',
  'facturation-artisan',
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

  const departementsUrls: MetadataRoute.Sitemap = departements.map(dep => ({
    url: `https://fairedesdevis.fr/departements/${dep}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const landingPagesUrls: MetadataRoute.Sitemap = landingPages.map(slug => ({
    url: `https://fairedesdevis.fr/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  return [...base, ...articlesStatiquesUrls, ...articlesVillesUrls, ...fichesMeatiersUrls, ...departementsUrls, ...landingPagesUrls]
}