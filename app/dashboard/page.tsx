'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import NavBar from '../components/NavBar'
import Header from '../components/Header'

interface Devis {
  id: string
  numero: string
  client_nom: string
  montant_ttc: number
  statut: string
  created_at: string
  archive: boolean
}

interface Facture {
  id: string
  numero: string
  client_nom: string
  montant_ttc: number
  statut: string
  date_echeance: string
  created_at: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [devis, setDevis] = useState<Devis[]>([])
  const [factures, setFactures] = useState<Facture[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError

        if (!user) {
          router.replace('/login')
          return
        }

      // Vérifier accès
      const meta = user.user_metadata
      const estVIP = meta?.actif_manuellement === true
      const estActif = meta?.abonnement_actif === true || meta?.stripe_statut === 'trialing' || meta?.stripe_statut === 'actif'
      const dateInscription = new Date(user.created_at)
      const joursDepuis = Math.floor((new Date().getTime() - dateInscription.getTime()) / (1000 * 60 * 60 * 24))
      const essaiValide = joursDepuis <= 30

        if (!estVIP && !estActif && !essaiValide) {
          router.replace('/abonnement')
          return
        }

        setUser(user)

        const [devisResult, facturesResult] = await Promise.all([
          supabase
            .from('devis')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('factures')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),
        ])

        if (devisResult.error) throw devisResult.error
        if (facturesResult.error) throw facturesResult.error

        setDevis((devisResult.data as Devis[] | null) ?? [])
        setFactures((facturesResult.data as Facture[] | null) ?? [])
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard :', error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  )

  const nom = (user?.user_metadata?.['nom'] as string) || 'Utilisateur'
  const metier = (user?.user_metadata?.['metier'] as string) || ''

  const now = new Date()
  const devisCeMois = devis.filter(d => {
    const date = new Date(d.created_at)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })
  const devisAcceptes = devis.filter(d => d.statut === 'accepte' && !d.archive)
  const devisEnAttente = devis.filter(d => d.statut === 'envoye' && !d.archive)
  const montantTotal = devisAcceptes.reduce((s, d) => s + Number(d.montant_ttc), 0)

  const facturesEnAttente = factures.filter(f => f.statut === 'en_attente')
  const facturesPayees = factures.filter(f => f.statut === 'payee')
  const montantEnAttente = facturesEnAttente.reduce((s, f) => s + Number(f.montant_ttc), 0)
  const montantPayee = facturesPayees.reduce((s, f) => s + Number(f.montant_ttc), 0)

  const getStatutStyle = (s: string) => {
    if (s === 'accepte') return 'bg-green-100 text-green-700'
    if (s === 'refuse') return 'bg-red-100 text-red-700'
    if (s === 'envoye') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-600'
  }

  const getFactureStatutStyle = (s: string) => {
    if (s === 'payee') return 'bg-green-100 text-green-700'
    if (s === 'en_retard') return 'bg-red-100 text-red-700'
    if (s === 'en_attente') return 'bg-amber-100 text-amber-700'
    return 'bg-gray-100 text-gray-600'
  }

  const getFactureStatutLabel = (s: string) => {
    if (s === 'payee') return 'Payee'
    if (s === 'en_retard') return 'En retard'
    if (s === 'en_attente') return 'En attente'
    return s
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header action={
        <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500">
          Deconnexion
        </button>
      } />

      <div className="max-w-5xl mx-auto px-6 py-8 pb-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Bonjour {nom} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">{metier}</p>
        </div>

        {/* Stats devis */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{devisCeMois.length}</p>
            <p className="text-xs text-gray-500 mt-1">Devis ce mois</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/devis?statut=accepte')}
            className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-green-300 hover:bg-green-50 transition"
          >
            <p className="text-2xl font-bold text-green-600">{devisAcceptes.length}</p>
            <p className="text-xs text-gray-500 mt-1">Acceptes</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/devis?statut=envoye')}
            className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-blue-300 hover:bg-blue-50 transition"
          >
            <p className="text-2xl font-bold text-blue-600">{devisEnAttente.length}</p>
            <p className="text-xs text-gray-500 mt-1">En attente</p>
          </button>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{montantTotal.toFixed(0)} EUR</p>
            <p className="text-xs text-gray-500 mt-1">Montant accepte</p>
          </div>
        </div>

        {/* Stats factures */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard/factures?statut=en_attente')}
            className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-amber-300 hover:bg-amber-50 transition"
          >
            <p className="text-2xl font-bold text-amber-600">{montantEnAttente.toFixed(0)} EUR</p>
            <p className="text-xs text-gray-500 mt-1">Factures en attente</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/factures?statut=payee')}
            className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-green-300 hover:bg-green-50 transition"
          >
            <p className="text-2xl font-bold text-green-600">{montantPayee.toFixed(0)} EUR</p>
            <p className="text-xs text-gray-500 mt-1">Factures payees</p>
          </button>
          <a
            href="/dashboard/factures"
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition flex items-center justify-center"
          >
            <p className="text-sm font-semibold text-blue-600">Voir toutes les factures →</p>
          </a>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <a href="/dashboard/devis/nouveau" className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition">
            <p className="text-2xl mb-2">✏️</p>
            <p className="font-semibold">Nouveau devis</p>
            <p className="text-blue-200 text-sm mt-1 hidden md:block">Generer en 60 secondes</p>
          </a>
          <a href="/dashboard/clients" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
            <p className="text-2xl mb-2">👥</p>
            <p className="font-semibold text-gray-900">Mes clients</p>
          </a>
          <a href="/dashboard/catalogue" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
            <p className="text-2xl mb-2">📦</p>
            <p className="font-semibold text-gray-900">Mon catalogue</p>
          </a>
          <a href="/dashboard/profil" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
            <p className="text-2xl mb-2">⚙️</p>
            <p className="font-semibold text-gray-900">Mon profil</p>
          </a>
        </div>

        {/* Derniers devis */}
        <div className="bg-white rounded-xl border border-gray-200 mb-4">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Derniers devis</h2>
            <a href="/dashboard/devis" className="text-sm text-blue-600 hover:underline">Voir tous →</a>
          </div>
          <div className="p-4">
            {devis.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">Aucun devis pour le moment</p>
                <a href="/dashboard/devis/nouveau" className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Creer mon premier devis
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                {devis.map(d => (
                  <div
                    key={d.id}
                    onClick={() => router.push('/dashboard/devis/' + d.id)}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{d.numero}</p>
                      <p className="text-xs text-gray-500">{d.client_nom} · {new Date(d.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 hidden sm:block">{Number(d.montant_ttc).toFixed(2)} EUR</p>
                      <span className={'px-2 py-1 rounded-full text-xs font-medium ' + getStatutStyle(d.statut)}>
                        {d.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dernieres factures */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Dernieres factures</h2>
            <a href="/dashboard/factures" className="text-sm text-blue-600 hover:underline">Voir toutes →</a>
          </div>
          <div className="p-4">
            {factures.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">Aucune facture pour le moment</p>
                <p className="text-gray-400 text-xs mt-1">Transformez un devis accepte en facture</p>
              </div>
            ) : (
              <div className="space-y-2">
                {factures.map(f => (
                  <div
                    key={f.id}
                    onClick={() => router.push('/dashboard/factures/' + f.id)}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{f.numero}</p>
                      <p className="text-xs text-gray-500">
                        {f.client_nom} · {new Date(f.created_at).toLocaleDateString('fr-FR')}
                        {f.date_echeance && ' · Echeance : ' + new Date(f.date_echeance).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 hidden sm:block">{Number(f.montant_ttc).toFixed(2)} EUR</p>
                      <span className={'px-2 py-1 rounded-full text-xs font-medium ' + getFactureStatutStyle(f.statut)}>
                        {getFactureStatutLabel(f.statut)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <NavBar active="dashboard" />
    </main>
  )
}