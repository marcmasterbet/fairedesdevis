'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AffiliationDashboard() {
  const router = useRouter()
  const [parrain, setParrain] = useState<any>(null)
  const [filleuls, setFilleuls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [iban, setIban] = useState('')
  const [titulaire, setTitulaire] = useState('')
  const [savingRib, setSavingRib] = useState(false)
  const [ribSaved, setRibSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: parrainData } = await supabase
        .from('parrains')
        .select('*')
        .eq('email', user.email)
        .eq('statut', 'approuve')
        .single()

      if (!parrainData) { router.push('/'); return }

      setParrain(parrainData)
      setIban(parrainData.iban || '')
      setTitulaire(parrainData.titulaire || '')

      const { data: filleulsData } = await supabase
        .from('filleuls')
        .select('*')
        .eq('ref_code', parrainData.code)

      setFilleuls(filleulsData || [])
      setLoading(false)
    }
    load()
  }, [router])

  const copierLien = () => {
    navigator.clipboard.writeText(`https://fairedesdevis.fr/?ref=${parrain.code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sauvegarderRib = async () => {
    if (!iban.trim()) return
    setSavingRib(true)
    await supabase
      .from('parrains')
      .update({ iban: iban.trim(), titulaire: titulaire.trim() })
      .eq('id', parrain.id)
    setSavingRib(false)
    setRibSaved(true)
    setTimeout(() => setRibSaved(false), 3000)
  }

  const clientsValides = filleuls.filter(f => f.commission_active).length
  const gainsTotal = clientsValides * 15

  // Clients ce mois (inscrits ce mois-ci)
  const maintenant = new Date()
  const clientsCeMois = filleuls.filter(f => {
    const date = new Date(f.created_at)
    return date.getMonth() === maintenant.getMonth() && date.getFullYear() === maintenant.getFullYear()
  }).length
  const quotaRestant = Math.max(0, 10 - clientsCeMois)

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-blue-600">FaireDesDevis</a>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">Espace apporteur — {parrain.nom}</p>
            <a href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">Mon compte →</a>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
            <p className="text-4xl font-bold text-gray-900">{filleuls.length}</p>
            <p className="text-gray-500 text-sm mt-1">Clients apportés</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
            <p className="text-4xl font-bold text-emerald-600">{clientsValides}</p>
            <p className="text-gray-500 text-sm mt-1">Clients validés</p>
          </div>
          <div className="bg-emerald-600 rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-white">{gainsTotal}€</p>
            <p className="text-emerald-200 text-sm mt-1">Gains totaux</p>
          </div>
          <div className={`rounded-2xl p-6 text-center ${quotaRestant === 0 ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
            <p className={`text-4xl font-bold ${quotaRestant === 0 ? 'text-red-500' : 'text-blue-600'}`}>{quotaRestant}</p>
            <p className="text-gray-500 text-sm mt-1">Quota restant ce mois</p>
          </div>
        </div>

        {/* Alerte quota */}
        {quotaRestant === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
            <p className="text-red-700 text-sm font-semibold">⚠️ Quota mensuel atteint</p>
            <p className="text-red-600 text-xs mt-1">Vous avez atteint la limite de 10 clients ce mois-ci. Les nouveaux clients apportés ce mois ne seront pas comptabilisés. Votre quota se renouvelle le 1er du mois prochain.</p>
          </div>
        )}

        {/* Lien apporteur */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="font-bold text-gray-900 text-lg mb-4">🔗 Votre lien d'apporteur</h2>
          <div className="flex gap-3 items-center">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 font-mono truncate">
              https://fairedesdevis.fr/?ref={parrain.code}
            </div>
            <button
              onClick={copierLien}
              className="bg-emerald-600 text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition whitespace-nowrap"
            >
              {copied ? '✓ Copié !' : 'Copier'}
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-3">Chaque client validé vous rapporte <strong className="text-emerald-600">15€</strong> — versé le 5 du mois suivant la validation</p>
        </div>

        {/* Simulateur */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="font-bold text-gray-900 text-lg mb-4">💶 Simulation de gains</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 3, 5, 10].map(n => (
              <div key={n} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{n * 15}€</p>
                <p className="text-gray-500 text-xs mt-1">{n} client{n > 1 ? 's' : ''} validé{n > 1 ? 's' : ''}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">Maximum 10 clients validés par mois = 150€/mois maximum</p>
        </div>

        {/* Liste clients */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="font-bold text-gray-900 text-lg mb-4">👥 Vos clients apportés ({filleuls.length})</h2>
          {filleuls.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">🔗</p>
              <p className="text-gray-500 text-sm">Aucun client apporté pour l'instant.</p>
              <p className="text-gray-400 text-xs mt-1">Partagez votre lien pour commencer à gagner !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filleuls.map((f, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{f.email}</p>
                    <p className="text-xs text-gray-400">
                      Inscrit le {new Date(f.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    f.commission_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {f.commission_active ? '✓ Validé — 15€' : 'En attente'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conditions de validation */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">✅ Conditions de validation d'un client</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🏢', titre: 'SIRET valide', desc: 'Le client doit avoir renseigné un SIRET valide sur son compte.' },
              { icon: '💳', titre: '2 mois payants', desc: 'Le client doit avoir payé 2 mois d\'abonnement après l\'essai gratuit.' },
              { icon: '📄', titre: '1 devis créé', desc: 'Le client doit avoir créé au moins un devis sur le logiciel.' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center">
                <p className="text-2xl mb-2">{c.icon}</p>
                <p className="font-semibold text-gray-900 text-sm mb-1">{c.titre}</p>
                <p className="text-gray-500 text-xs">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIB */}
        <div className={`rounded-2xl p-6 border-2 ${parrain.iban ? 'bg-white border-emerald-200' : 'bg-amber-50 border-amber-300'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-lg">🏦 Vos coordonnées bancaires</h2>
            {parrain.iban && (
              <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                ✓ RIB enregistré
              </span>
            )}
          </div>

          {!parrain.iban && (
            <div className="bg-amber-100 border border-amber-200 rounded-lg px-4 py-3 mb-4">
              <p className="text-amber-800 text-sm font-semibold">⚠️ RIB manquant — vos virements ne pourront pas être effectués</p>
              <p className="text-amber-700 text-xs mt-1">Renseignez votre IBAN pour recevoir vos 15€ par client validé.</p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Titulaire du compte</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                placeholder="Jean-Pierre Moreau"
                value={titulaire}
                onChange={e => setTitulaire(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">IBAN</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                placeholder="FR76 3000 6000 0112 3456 7890 189"
                value={iban}
                onChange={e => setIban(e.target.value.toUpperCase())}
              />
            </div>
            <button
              onClick={sauvegarderRib}
              disabled={savingRib || !iban.trim()}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              {savingRib ? 'Enregistrement...' : ribSaved ? '✓ RIB enregistré !' : 'Enregistrer mon RIB'}
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-3">
            🔒 Vos coordonnées bancaires sont sécurisées et uniquement utilisées pour les virements de commissions.
          </p>
        </div>

        {/* Infos virement */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-2">📅 Calendrier des virements</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Les 15€ par client validé sont versés le <strong>5 du mois suivant la validation</strong>.
            Dès le premier client — pas de seuil minimum. Une question ?{' '}
            <a href="mailto:support@fairedesdevis.fr" className="text-emerald-600 underline">support@fairedesdevis.fr</a>
          </p>
        </div>

      </div>
    </main>
  )
}