import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use } from 'react'

const LOGO = 'https://xkwdwragibeingoaizwq.supabase.co/storage/v1/object/public/logos/ChatGPT%20Image%2026%20juil.%202026,%2016_39_11.png'

const departements: Record<string, {
  nom: string
  region: string
  villes: string[]
  metiers: string[]
}> = {
  'alsace': {
    nom: 'Alsace',
    region: 'Grand Est',
    villes: ['Strasbourg', 'Mulhouse', 'Colmar', 'Haguenau', 'Schiltigheim'],
    metiers: ['Plombier', 'Électricien', 'Menuisier', 'Carreleur', 'Peintre', 'Maçon', 'Chauffagiste', 'Serrurier', 'Pisciniste', 'Conciergerie'],
  },
  'ile-de-france': {
    nom: 'Île-de-France',
    region: 'Île-de-France',
    villes: ['Paris', 'Versailles', 'Boulogne-Billancourt', 'Saint-Denis', 'Argenteuil', 'Montreuil', 'Vitry-sur-Seine', 'Colombes'],
    metiers: ['Plombier', 'Électricien', 'Menuisier', 'Carreleur', 'Peintre', 'Maçon', 'Chauffagiste', 'Serrurier', 'Pisciniste', 'Conciergerie'],
  },
  'auvergne-rhone-alpes': {
    nom: 'Auvergne-Rhône-Alpes',
    region: 'Auvergne-Rhône-Alpes',
    villes: ['Lyon', 'Grenoble', 'Saint-Étienne', 'Villeurbanne', 'Clermont-Ferrand', 'Annecy'],
    metiers: ['Plombier', 'Électricien', 'Menuisier', 'Carreleur', 'Peintre', 'Maçon', 'Chauffagiste', 'Serrurier', 'Pisciniste', 'Conciergerie'],
  },
  'paca': {
    nom: 'Provence-Alpes-Côte d\'Azur',
    region: 'PACA',
    villes: ['Marseille', 'Nice', 'Toulon', 'Aix-en-Provence', 'Avignon', 'Cannes'],
    metiers: ['Plombier', 'Électricien', 'Menuisier', 'Carreleur', 'Peintre', 'Maçon', 'Chauffagiste', 'Serrurier', 'Pisciniste', 'Conciergerie'],
  },
  'nouvelle-aquitaine': {
    nom: 'Nouvelle-Aquitaine',
    region: 'Nouvelle-Aquitaine',
    villes: ['Bordeaux', 'Limoges', 'Poitiers', 'Pau', 'La Rochelle'],
    metiers: ['Plombier', 'Électricien', 'Menuisier', 'Carreleur', 'Peintre', 'Maçon', 'Chauffagiste', 'Serrurier', 'Pisciniste', 'Conciergerie'],
  },
  'occitanie': {
    nom: 'Occitanie',
    region: 'Occitanie',
    villes: ['Toulouse', 'Montpellier', 'Nîmes', 'Perpignan', 'Avignon'],
    metiers: ['Plombier', 'Électricien', 'Menuisier', 'Carreleur', 'Peintre', 'Maçon', 'Chauffagiste', 'Serrurier', 'Pisciniste', 'Conciergerie'],
  },
  'bretagne': {
    nom: 'Bretagne',
    region: 'Bretagne',
    villes: ['Rennes', 'Brest', 'Quimper', 'Lorient', 'Vannes'],
    metiers: ['Plombier', 'Électricien', 'Menuisier', 'Carreleur', 'Peintre', 'Maçon', 'Chauffagiste', 'Serrurier', 'Pisciniste', 'Conciergerie'],
  },
  'pays-de-la-loire': {
    nom: 'Pays de la Loire',
    region: 'Pays de la Loire',
    villes: ['Nantes', 'Angers', 'Le Mans', 'Saint-Nazaire', 'La Roche-sur-Yon'],
    metiers: ['Plombier', 'Électricien', 'Menuisier', 'Carreleur', 'Peintre', 'Maçon', 'Chauffagiste', 'Serrurier', 'Pisciniste', 'Conciergerie'],
  },
  'hauts-de-france': {
    nom: 'Hauts-de-France',
    region: 'Hauts-de-France',
    villes: ['Lille', 'Amiens', 'Roubaix', 'Tourcoing', 'Dunkerque'],
    metiers: ['Plombier', 'Électricien', 'Menuisier', 'Carreleur', 'Peintre', 'Maçon', 'Chauffagiste', 'Serrurier', 'Pisciniste', 'Conciergerie'],
  },
  'normandie': {
    nom: 'Normandie',
    region: 'Normandie',
    villes: ['Rouen', 'Caen', 'Le Havre', 'Cherbourg', 'Évreux'],
    metiers: ['Plombier', 'Électricien', 'Menuisier', 'Carreleur', 'Peintre', 'Maçon', 'Chauffagiste', 'Serrurier', 'Pisciniste', 'Conciergerie'],
  },
  'grand-est': {
    nom: 'Grand Est',
    region: 'Grand Est',
    villes: ['Strasbourg', 'Reims', 'Metz', 'Nancy', 'Mulhouse', 'Colmar'],
    metiers: ['Plombier', 'Électricien', 'Menuisier', 'Carreleur', 'Peintre', 'Maçon', 'Chauffagiste', 'Serrurier', 'Pisciniste', 'Conciergerie'],
  },
  'bourgogne-franche-comte': {
    nom: 'Bourgogne-Franche-Comté',
    region: 'Bourgogne-Franche-Comté',
    villes: ['Dijon', 'Besançon', 'Belfort', 'Auxerre', 'Chalon-sur-Saône'],
    metiers: ['Plombier', 'Électricien', 'Menuisier', 'Carreleur', 'Peintre', 'Maçon', 'Chauffagiste', 'Serrurier', 'Pisciniste', 'Conciergerie'],
  },
  'centre-val-de-loire': {
    nom: 'Centre-Val de Loire',
    region: 'Centre-Val de Loire',
    villes: ['Orléans', 'Tours', 'Bourges', 'Blois', 'Chartres'],
    metiers: ['Plombier', 'Électricien', 'Menuisier', 'Carreleur', 'Peintre', 'Maçon', 'Chauffagiste', 'Serrurier', 'Pisciniste', 'Conciergerie'],
  },
}

export default function PageDepartement({ params }: { params: Promise<{ departement: string }> }) {
  const { departement } = use(params)
  const data = departements[departement]
  if (!data) notFound()

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
            Logiciel de devis artisan<br/>
            <span className="text-blue-600">en {data.nom}</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Vous êtes artisan en {data.nom} ? Créez vos devis professionnels en 60 secondes, faites-les signer électroniquement et facturez en 1 clic.
          </p>
          <a href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Essayer gratuitement 7 jours →
          </a>
          <p className="text-sm text-gray-400 mt-4">Sans carte bancaire · Sans engagement</p>
        </div>
      </section>

      {/* VILLES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Artisans des principales villes de {data.nom}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.villes.map((ville, i) => (
              <div key={i} className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                <p className="font-semibold text-blue-900 text-sm">📍 {ville}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MÉTIERS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Tous les métiers du bâtiment en {data.nom}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {data.metiers.map((metier, i) => (
              <Link key={i} href={`/metiers/${metier.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`}
                className="bg-white rounded-xl p-4 text-center border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition">
                <p className="font-semibold text-gray-900 text-sm">{metier}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Pourquoi les artisans de {data.nom} choisissent FaireDesDevis ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', titre: 'Devis en 60 secondes', desc: 'Depuis votre téléphone sur le chantier. L\'IA génère le document complet avec toutes les mentions légales.' },
              { icon: '✍️', titre: 'Signature électronique', desc: 'Votre client signe depuis son téléphone. Valeur légale garantie, conforme au règlement eIDAS.' },
              { icon: '🧾', titre: 'Facturation en 1 clic', desc: 'Transformez votre devis accepté en facture instantanément. Suivez vos paiements en temps réel.' },
            ].map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center">
                <p className="text-3xl mb-4">{f.icon}</p>
                <h3 className="font-bold text-gray-900 mb-2">{f.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-blue-600 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Artisan en {data.nom} ? Essayez gratuitement !
          </h2>
          <p className="text-blue-200 mb-8">7 jours gratuits — 24,99€/mois ou 249€/an ensuite</p>
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