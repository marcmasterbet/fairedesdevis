'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

const ADMIN_EMAIL = 'marc.masterbet@gmail.com'

interface Utilisateur {
  id: string
  email: string
  created_at: string
  banned_until?: string
  suspendu?: boolean
  actifManuellement?: boolean
  user_metadata: {
    nom: string
    metier: string
    siret: string
    telephone: string
    adresse: string
  }
  nbDevis?: number
  nbFactures?: number
  joursDepuisInscription?: number
  joursRestants?: number
  essaiActif?: boolean
}

interface Affilie {
  id: string
  nom: string
  email: string
  code: string
  societe: string
  description: string
  created_at: string
  statut: string
}

export default function Admin() {
  const [users, setUsers] = useState<Utilisateur[]>([])
  const [affilies, setAffilies] = useState<Affilie[]>([])
  const [loading, setLoading] = useState(true)
  const [onglet, setOnglet] = useState<'users' | 'affilies'>('users')
  const [stats, setStats] = useState({ totalUsers: 0, totalDevis: 0, totalFactures: 0, totalMontant: 0, essaisActifs: 0, essaisExpires: 0, suspendus: 0, vip: 0 })
  const [search, setSearch] = useState('')
  const [filtre, setFiltre] = useState('tous')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showEmailModal, setShowEmailModal] = useState<Utilisateur | null>(null)
  const [emailMessage, setEmailMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      if (user.email !== ADMIN_EMAIL) { router.push('/'); return }
      chargerUsers()
      chargerAffilies()
    }
    init()
  }, [router])

  const chargerUsers = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    setUsers(data.users || [])
    setStats(data.stats || {})
    setLoading(false)
  }

  const chargerAffilies = async () => {
    const { data } = await supabase.from('affilies').select('*').order('created_at', { ascending: false })
    setAffilies(data || [])
  }

  const handleAction = async (action: string, user: Utilisateur) => {
    if (action === 'supprimer' && !confirm('Supprimer définitivement ' + user.email + ' et toutes ses données ?')) return
    if (action === 'suspendre' && !confirm('Suspendre le compte de ' + user.email + ' ?')) return
    if (action === 'reactiver' && !confirm('Réactiver le compte de ' + user.email + ' ?')) return

    setActionLoading(user.id + action)
    const res = await fetch('/api/admin/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, userId: user.id, email: user.email })
    })
    if (res.ok) {
      alert('Action effectuée avec succès')
      chargerUsers()
    } else {
      alert('Erreur lors de l action')
    }
    setActionLoading(null)
  }

  const handleEnvoyerEmail = async () => {
    if (!emailMessage.trim()) { alert('Écrivez un message'); return }
    setActionLoading('email')
    const res = await fetch('/api/admin/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'email', userId: showEmailModal?.id, email: showEmailModal?.email, message: emailMessage })
    })
    if (res.ok) {
      alert('Email envoyé !')
      setShowEmailModal(null)
      setEmailMessage('')
    } else {
      alert('Erreur envoi email')
    }
    setActionLoading(null)
  }

  const handleApprouverAffilie = async (affilie: Affilie) => {
    await supabase.from('affilies').update({ statut: 'approuve' }).eq('id', affilie.id)
    // Envoyer email avec le lien
    await fetch('/api/admin/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'email',
        email: affilie.email,
        message: `Bonjour ${affilie.nom},\n\nVotre demande d'affiliation FaireDesDevis a été approuvée !\n\nVotre lien d'affiliation unique :\nhttps://fairedesdevis.fr/?ref=${affilie.code}\n\nVous toucherez 4€/mois pour chaque artisan qui s'abonne via votre lien.\n\nBonne chance !\n\nMarc Bretzner\nFaireDesDevis`
      })
    })
    chargerAffilies()
    alert('Affilié approuvé et email envoyé avec son lien !')
  }

  const handleRefuserAffilie = async (affilie: Affilie) => {
    if (!confirm('Refuser ' + affilie.nom + ' ?')) return
    await supabase.from('affilies').update({ statut: 'refuse' }).eq('id', affilie.id)
    chargerAffilies()
  }

  const handleSupprimerAffilie = async (affilie: Affilie) => {
    if (!confirm('Supprimer ' + affilie.nom + ' ?')) return
    await supabase.from('affilies').delete().eq('id', affilie.id)
    chargerAffilies()
  }

  const filtered = users.filter(u => {
    const matchSearch = u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.user_metadata?.nom?.toLowerCase().includes(search.toLowerCase()) ||
      u.user_metadata?.metier?.toLowerCase().includes(search.toLowerCase())
    const matchFiltre = filtre === 'tous' ||
      (filtre === 'actif' && u.essaiActif && !u.suspendu && !u.actifManuellement) ||
      (filtre === 'expire' && !u.essaiActif && !u.suspendu && !u.actifManuellement) ||
      (filtre === 'suspendu' && u.suspendu) ||
      (filtre === 'vip' && u.actifManuellement)
    return matchSearch && matchFiltre
  })

  const affiliesEnAttente = affilies.filter(a => !a.statut || a.statut === 'en_attente')
  const affiliesApprouves = affilies.filter(a => a.statut === 'approuve')

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Modal email */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-900">Email à {showEmailModal.user_metadata?.nom}</h2>
              <button onClick={() => setShowEmailModal(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <p className="text-sm text-gray-500 mb-3">À : {showEmailModal.email}</p>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 h-32 resize-none mb-4"
              placeholder="Votre message..."
              value={emailMessage}
              onChange={e => setEmailMessage(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={handleEnvoyerEmail} disabled={actionLoading === 'email'} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
                {actionLoading === 'email' ? 'Envoi...' : 'Envoyer'}
              </button>
              <button onClick={() => setShowEmailModal(null)} className="px-4 text-gray-400 hover:text-gray-600 text-sm">Annuler</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-blue-600">FaireDesDevis</h1>
          <p className="text-xs text-gray-400">Dashboard Admin</p>
        </div>
        <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">← Mon compte</a>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Admin</h2>

        {/* Stats globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
            <p className="text-xs text-gray-500 mt-1">Utilisateurs</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.essaisActifs}</p>
            <p className="text-xs text-gray-500 mt-1">Essais actifs</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{stats.essaisExpires}</p>
            <p className="text-xs text-gray-500 mt-1">Essais expirés</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{stats.suspendus}</p>
            <p className="text-xs text-gray-500 mt-1">Suspendus</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.vip}</p>
            <p className="text-xs text-gray-500 mt-1">VIP offerts</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.totalDevis}</p>
            <p className="text-xs text-gray-500 mt-1">Devis</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.totalFactures}</p>
            <p className="text-xs text-gray-500 mt-1">Factures</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{Number(stats.totalMontant).toFixed(0)}€</p>
            <p className="text-xs text-gray-500 mt-1">Montant devis</p>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setOnglet('users')}
            className={'px-6 py-2 rounded-lg text-sm font-semibold transition ' + (onglet === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}
          >
            👥 Utilisateurs ({users.length})
          </button>
          <button
            onClick={() => setOnglet('affilies')}
            className={'px-6 py-2 rounded-lg text-sm font-semibold transition relative ' + (onglet === 'affilies' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}
          >
            🤝 Affiliés ({affilies.length})
            {affiliesEnAttente.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {affiliesEnAttente.length}
              </span>
            )}
          </button>
        </div>

        {/* Onglet Utilisateurs */}
        {onglet === 'users' && (
          <>
            <div className="flex gap-2 mb-4 flex-wrap">
              {[
                { key: 'tous', label: 'Tous' },
                { key: 'actif', label: '🟢 Essai actif' },
                { key: 'expire', label: '🟠 Essai expiré' },
                { key: 'vip', label: '⭐ VIP' },
                { key: 'suspendu', label: '🔒 Suspendu' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFiltre(f.key)}
                  className={'px-4 py-2 rounded-lg text-sm font-medium transition ' + (
                    filtre === f.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 mb-4"
              placeholder="Rechercher par nom, email, métier..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b">
                <p className="text-xs font-semibold text-gray-500 uppercase">{filtered.length} utilisateurs</p>
              </div>
              <div className="divide-y divide-gray-100">
                {filtered.map(u => (
                  <div key={u.id} className={'px-6 py-4 ' + (u.suspendu ? 'bg-red-50' : u.actifManuellement ? 'bg-purple-50' : '')}>
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold text-gray-900">{u.user_metadata?.nom || '—'}</p>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{u.user_metadata?.metier || '—'}</span>
                          {u.suspendu && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">🔒 Suspendu</span>}
                          {u.actifManuellement && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">⭐ VIP</span>}
                          {!u.suspendu && !u.actifManuellement && u.essaiActif && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🟢 Essai — {u.joursRestants} jours restants</span>}
                          {!u.suspendu && !u.actifManuellement && !u.essaiActif && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">🟠 Essai expiré — J+{u.joursDepuisInscription}</span>}
                        </div>
                        <p className="text-sm text-gray-500">{u.email}</p>
                        {u.user_metadata?.siret && <p className="text-xs text-gray-400 mt-1">SIRET : {u.user_metadata.siret}</p>}
                        {u.user_metadata?.telephone && <p className="text-xs text-gray-400">Tel : {u.user_metadata.telephone}</p>}
                        {u.user_metadata?.adresse && <p className="text-xs text-gray-400">{u.user_metadata.adresse}</p>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400">Inscrit le {new Date(u.created_at).toLocaleDateString('fr-FR')}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">{u.nbDevis || 0} devis</p>
                        <p className="text-sm text-gray-500">{u.nbFactures || 0} factures</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <button onClick={() => setShowEmailModal(u)} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-100">✉️ Email</button>
                      {u.actifManuellement ? (
                        <button onClick={() => handleAction('desactiver_vip', u)} disabled={actionLoading === u.id + 'desactiver_vip'} className="bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-purple-100 disabled:opacity-50">
                          {actionLoading === u.id + 'desactiver_vip' ? '...' : '⭐ Retirer VIP'}
                        </button>
                      ) : (
                        <button onClick={() => handleAction('activer_vip', u)} disabled={actionLoading === u.id + 'activer_vip'} className="bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-purple-100 disabled:opacity-50">
                          {actionLoading === u.id + 'activer_vip' ? '...' : '⭐ Offrir accès'}
                        </button>
                      )}
                      {u.suspendu ? (
                        <button onClick={() => handleAction('reactiver', u)} disabled={actionLoading === u.id + 'reactiver'} className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-100 disabled:opacity-50">
                          {actionLoading === u.id + 'reactiver' ? '...' : '✅ Réactiver'}
                        </button>
                      ) : (
                        <button onClick={() => handleAction('suspendre', u)} disabled={actionLoading === u.id + 'suspendre'} className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-amber-100 disabled:opacity-50">
                          {actionLoading === u.id + 'suspendre' ? '...' : '🔒 Suspendre'}
                        </button>
                      )}
                      <button onClick={() => handleAction('supprimer', u)} disabled={actionLoading === u.id + 'supprimer'} className="bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 disabled:opacity-50">
                        {actionLoading === u.id + 'supprimer' ? '...' : '🗑️ Supprimer'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Onglet Affiliés */}
        {onglet === 'affilies' && (
          <div>
            {affiliesEnAttente.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  ⏳ En attente d'approbation
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{affiliesEnAttente.length}</span>
                </h3>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {affiliesEnAttente.map(a => (
                      <div key={a.id} className="px-6 py-4 bg-amber-50">
                        <div className="flex justify-between items-start flex-wrap gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{a.nom}</p>
                            <p className="text-sm text-gray-500">{a.email}</p>
                            {a.societe && <p className="text-xs text-gray-400 mt-1">Société : {a.societe}</p>}
                            {a.description && <p className="text-xs text-gray-500 mt-1 italic">"{a.description}"</p>}
                            <p className="text-xs text-gray-400 mt-1">Inscrit le {new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400 mb-2">Code : <span className="font-mono font-bold text-blue-600">{a.code}</span></p>
                            <p className="text-xs text-gray-400 mb-2">Lien : fairedesdevis.fr/?ref={a.code}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => handleApprouverAffilie(a)} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-700">
                            ✅ Approuver et envoyer le lien
                          </button>
                          <button onClick={() => handleRefuserAffilie(a)} className="bg-red-50 text-red-500 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100">
                            ❌ Refuser
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-bold text-gray-900 mb-3">✅ Affiliés approuvés ({affiliesApprouves.length})</h3>
              {affiliesApprouves.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <p className="text-gray-400 text-sm">Aucun affilié approuvé pour l instant</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {affiliesApprouves.map(a => (
                      <div key={a.id} className="px-6 py-4">
                        <div className="flex justify-between items-start flex-wrap gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{a.nom}</p>
                            <p className="text-sm text-gray-500">{a.email}</p>
                            {a.societe && <p className="text-xs text-gray-400">Société : {a.societe}</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Code : <span className="font-mono font-bold text-blue-600">{a.code}</span></p>
                            <p className="text-xs text-blue-600">fairedesdevis.fr/?ref={a.code}</p>
                            <p className="text-xs text-gray-400 mt-1">Depuis le {new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => handleSupprimerAffilie(a)} className="bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100">
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}