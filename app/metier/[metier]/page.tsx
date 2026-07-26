import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use } from 'react'

const metiers: Record<string, {
  label: string
  emoji: string
  description: string
  travaux: string[]
  tva: string
  certifications: string[]
}> = {
  'plombier': {
    label: 'Plombier',
    emoji: '🔧',
    description: 'Créez vos devis de plomberie en 60 secondes. Fuite d\'eau, installation sanitaire, chauffe-eau — générez un devis professionnel et faites-le signer en ligne.',
    travaux: ['Remplacement chauffe-eau', 'Débouchage canalisation', 'Installation sanitaire', 'Réparation fuite', 'Pose robinetterie', 'Installation chauffage'],
    tva: '10% pour rénovation, 20% pour neuf',
    certifications: ['RGE', 'Qualibat', 'Assurance décennale'],
  },
  'electricien': {
    label: 'Électricien',
    emoji: '⚡',
    description: 'Devis électricité en 60 secondes. Mise aux normes, tableau électrique, installation — générez un devis professionnel conforme et faites-le signer électroniquement.',
    travaux: ['Mise aux normes NF C 15-100', 'Remplacement tableau électrique', 'Installation prises et interrupteurs', 'Pose éclairage', 'Domotique', 'Bornes de recharge'],
    tva: '10% pour rénovation, 20% pour neuf',
    certifications: ['Qualifelec', 'RGE', 'IRVE pour bornes recharge'],
  },
  'menuisier': {
    label: 'Menuisier',
    emoji: '🪵',
    description: 'Devis menuiserie en 60 secondes. Fenêtres, portes, parquet, aménagement sur mesure — créez un devis détaillé avec dimensions et faites-le signer en ligne.',
    travaux: ['Pose fenêtres double vitrage', 'Installation portes', 'Pose parquet', 'Aménagement placards', 'Escaliers sur mesure', 'Bardage extérieur'],
    tva: '10% pour rénovation, 20% pour neuf',
    certifications: ['RGE Fenêtres', 'Qualibat', 'Assurance décennale'],
  },
  'carreleur': {
    label: 'Carreleur',
    emoji: '🏠',
    description: 'Devis carrelage en 60 secondes. Pose de carrelage, faïence, salle de bain, terrasse — générez un devis au m² et faites-le signer électroniquement.',
    travaux: ['Pose carrelage sol', 'Faïence murale', 'Salle de bain complète', 'Terrasse et plage piscine', 'Ragréage', 'Dépose ancien carrelage'],
    tva: '10% pour rénovation, 20% pour neuf',
    certifications: ['Qualibat', 'Assurance décennale'],
  },
  'peintre': {
    label: 'Peintre',
    emoji: '🎨',
    description: 'Devis peinture en 60 secondes. Peinture intérieure, extérieure, ravalement — créez un devis au m² professionnel et faites-le signer en ligne.',
    travaux: ['Peinture intérieure', 'Ravalement façade', 'Papier peint', 'Enduit décoratif', 'Peinture extérieure', 'Traitement humidité'],
    tva: '10% pour rénovation, 20% pour neuf',
    certifications: ['Qualibat', 'Assurance décennale'],
  },
  'macon': {
    label: 'Maçon',
    emoji: '🧱',
    description: 'Devis maçonnerie en 60 secondes. Construction, rénovation, extension, gros œuvre — générez un devis professionnel et faites-le signer électroniquement.',
    travaux: ['Construction murs', 'Extension maison', 'Rénovation façade', 'Enduit extérieur', 'Dallage béton', 'Démolition cloison'],
    tva: '10% pour rénovation, 20% pour neuf',
    certifications: ['Qualibat', 'Assurance décennale obligatoire'],
  },
  'chauffagiste': {
    label: 'Chauffagiste',
    emoji: '🔥',
    description: 'Devis chauffage en 60 secondes. Chaudière, pompe à chaleur, radiateurs — générez un devis RGE professionnel et faites-le signer en ligne.',
    travaux: ['Installation chaudière gaz', 'Pompe à chaleur air/eau', 'Remplacement radiateurs', 'Plancher chauffant', 'Entretien chaudière', 'Installation VMC'],
    tva: '5,5% pour travaux économie énergie, 10% rénovation',
    certifications: ['RGE QualiPAC', 'RGE Qualibois', 'Assurance décennale'],
  },
  'serrurier': {
    label: 'Serrurier',
    emoji: '🔑',
    description: 'Devis serrurerie en 60 secondes. Remplacement serrure, blindage, ouverture de porte — créez un devis professionnel et faites-le signer électroniquement.',
    travaux: ['Remplacement serrure', 'Blindage porte', 'Ouverture porte claquée', 'Installation digicode', 'Coffre-fort', 'Ferme-porte automatique'],
    tva: '10% pour rénovation, 20% pour neuf',
    certifications: ['A2P', 'Assurance RC Pro'],
  },
  'pisciniste': {
    label: 'Pisciniste',
    emoji: '🏊',
    description: 'Devis piscine en 60 secondes. Installation, rénovation, entretien — créez un devis professionnel détaillé et faites-le signer en ligne.',
    travaux: ['Construction piscine béton', 'Pose liner', 'Installation pompe à chaleur piscine', 'Rénovation carrelage piscine', 'Système de filtration', 'Escalier piscine'],
    tva: '20% pour construction neuve',
    certifications: ['Qualipiscine', 'Assurance décennale'],
  },
  'conciergerie': {
    label: 'Conciergerie',
    emoji: '🏨',
    description: 'Devis conciergerie en 60 secondes. Gestion locative, accueil voyageurs, ménage, état des lieux — créez vos devis de prestation et faites-les signer en ligne.',
    travaux: ['Accueil et remise des clés', 'Ménage entre locataires', 'État des lieux entrée/sortie', 'Gestion linge de maison', 'Maintenance et petits travaux', 'Gestion calendrier Airbnb'],
    tva: '20%',
    certifications: ['RC Pro', 'Carte professionnelle immobilier (si gestion)'],
  },
}

export default function FicheMetier({ params }: { params: Promise<{ metier: string }> }) {
  const { metier } = use(params)
  const data = metiers[metier]
  if (!data) notFound()

  return (
    <main className="min-h-screen bg-white">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <img src="https://xkwdwragibeingoaizwq.supabase.co/storage/v1/object/public/logos/ChatGPT%20Image%2026%20juil.%202026,%2016_39_11.png" alt="FaireDesDevis" style={{ height: '40px', width: 'auto' }} />
            <span className="text-xl font-bold text-blue-600">FaireDesDevis</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-gray-600 hover:text-blue-600 text-sm">Connexion</a>
            <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Essai gratuit</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-6xl mb-6">{data.emoji}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Devis {data.label} en ligne<br/>
            <span className="text-blue-600">en 60 secondes</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            {data.description}
          </p>
          <a href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Créer mon premier devis gratuitement →
          </a>
          <p className="text-sm text-gray-400 mt-4">7 jours gratuits — aucun engagement</p>
        </div>
      </section>

      {/* TRAVAUX */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Types de prestations {data.label.toLowerCase()}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.travaux.map((t, i) => (
              <div key={i} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm font-semibold text-blue-900">✓ {t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TVA ET CERTIFICATIONS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💰 TVA applicable</h3>
            <p className="text-gray-600">{data.tva}</p>
            <p className="text-sm text-gray-400 mt-3">FaireDesDevis applique automatiquement le bon taux de TVA sur vos devis.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🏅 Certifications courantes</h3>
            <ul className="space-y-2">
              {data.certifications.map((c, i) => (
                <li key={i} className="text-gray-600 text-sm">✓ {c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Comment créer un devis {data.label.toLowerCase()} avec FaireDesDevis ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '1', titre: 'Configurez votre profil', desc: 'SIRET, assurance, logo, signature — une seule fois.' },
              { num: '2', titre: 'Créez votre devis', desc: 'Sélectionnez vos prestations depuis votre catalogue.' },
              { num: '3', titre: 'Envoyez au client', desc: 'Le client reçoit le devis par email en 1 clic.' },
              { num: '4', titre: 'Signature en ligne', desc: 'Le client signe électroniquement. Valeur légale.' },
            ].map((e, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4 mx-auto">
                  {e.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{e.titre}</h3>
                <p className="text-gray-500 text-sm">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-blue-600 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à créer votre premier devis {data.label.toLowerCase()} ?
          </h2>
          <p className="text-blue-200 mb-8">7 jours gratuits — aucun engagement — annulation en 1 clic</p>
          <a href="/register" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition">
            Commencer gratuitement →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <div className="flex justify-center gap-6 text-sm text-gray-400 flex-wrap">
          <Link href="/" className="hover:text-white">Accueil</Link>
          <Link href="/blog" className="hover:text-white">Blog</Link>
          <Link href="/legal/cgu" className="hover:text-white">CGU</Link>
          <Link href="/legal/mentions" className="hover:text-white">Mentions légales</Link>
        </div>
        <p className="text-gray-600 text-sm mt-4">© 2026 FaireDesDevis</p>
      </footer>

    </main>
  )
}