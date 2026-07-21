'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

import { supabase } from '../../lib/supabase'
import NavBar from '../components/NavBar'
import Header from '../components/Header'

interface Devis {
  id: string
  user_id?: string
  numero: string
  client_nom: string
  montant_ttc: number
  statut: string
  created_at: string
  archive: boolean
}

interface Facture {
  id: string
  user_id?: string
  numero: string
  client_nom: string
  montant_ttc: number
  statut: string
  date_echeance: string | null
  created_at: string
}

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [devis, setDevis] = useState<Devis[]>([])
  const [factures, setFactures] = useState<Facture[]>([])
  const [loading, setLoading] = useState(true)
  const [estAffilie, setEstAffilie] = useState(false)

  useEffect(() => {
    let composantActif = true

    const initialiserDashboard = async () => {
      try {
        setLoading(true)

        /*
         * Récupération de l'utilisateur connecté
         */
        const {
          data: { user: utilisateurConnecte },
          error: erreurUtilisateur,
        } = await supabase.auth.getUser()

        if (erreurUtilisateur) {
          throw erreurUtilisateur
        }

        if (!utilisateurConnecte) {
          router.replace('/login')
          return
        }

        /*
         * Vérification de l'accès au logiciel
         */
        const metadata = utilisateurConnecte.user_metadata ?? {}

        const estVIP = metadata.actif_manuellement === true

        const statutStripe = String(
          metadata.stripe_statut ?? ''
        ).toLowerCase()

        const abonnementActif =
          metadata.abonnement_actif === true ||
          statutStripe === 'trialing' ||
          statutStripe === 'active' ||
          statutStripe === 'actif'

        const dateInscription = new Date(
          utilisateurConnecte.created_at
        )

        const maintenant = new Date()

        const differenceEnMillisecondes =
          maintenant.getTime() - dateInscription.getTime()

        const joursDepuisInscription = Math.floor(
          differenceEnMillisecondes /
            (1000 * 60 * 60 * 24)
        )

        const essaiValide =
          joursDepuisInscription >= 0 &&
          joursDepuisInscription <= 30

        if (
          !estVIP &&
          !abonnementActif &&
          !essaiValide
        ) {
          router.replace('/abonnement')
          return
        }

        if (!composantActif) {
          return
        }

        setUser(utilisateurConnecte)

        /*
         * Vérification du compte affilié
         *
         * On recherche l'affilié avec user_id.
         * La colonne statut n'est pas utilisée ici.
         */
        const { data: affilieData, error: affilieError } = await supabase
  .from('affilies')
  .select('id')
  .eq('email', utilisateurConnecte.email)
  .eq('statut', 'approuve')
  .maybeSingle()

        if (affilieError) {
          console.error(
            'Erreur lors de la vérification de l’affilié :',
            affilieError
          )
        }

        if (composantActif) {
          setEstAffilie(Boolean(affilieData))
        }

        /*
         * Chargement des devis et factures
         *
         * Chaque requête est filtrée avec user_id afin que
         * l'utilisateur ne voie que ses propres données.
         */
        const [
          resultatDevis,
          resultatFactures,
        ] = await Promise.all([
          supabase
            .from('devis')
            .select(
              `
                id,
                user_id,
                numero,
                client_nom,
                montant_ttc,
                statut,
                created_at,
                archive
              `
            )
            .eq('user_id', utilisateurConnecte.id)
            .order('created_at', {
              ascending: false,
            }),

          supabase
            .from('factures')
            .select(
              `
                id,
                user_id,
                numero,
                client_nom,
                montant_ttc,
                statut,
                date_echeance,
                created_at
              `
            )
            .eq('user_id', utilisateurConnecte.id)
            .order('created_at', {
              ascending: false,
            }),
        ])

        if (resultatDevis.error) {
          throw resultatDevis.error
        }

        if (resultatFactures.error) {
          throw resultatFactures.error
        }

        if (!composantActif) {
          return
        }

        setDevis(
          (resultatDevis.data as Devis[] | null) ?? []
        )

        setFactures(
          (resultatFactures.data as Facture[] | null) ??
            []
        )
      } catch (error) {
        console.error(
          'Erreur lors du chargement du dashboard :',
          error
        )
      } finally {
        if (composantActif) {
          setLoading(false)
        }
      }
    }

    void initialiserDashboard()

    return () => {
      composantActif = false
    }
  }, [router])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      router.replace('/')
      router.refresh()
    } catch (error) {
      console.error(
        'Erreur lors de la déconnexion :',
        error
      )
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-400">
          Chargement...
        </p>
      </main>
    )
  }

  const nom =
    typeof user?.user_metadata?.nom === 'string' &&
    user.user_metadata.nom.trim() !== ''
      ? user.user_metadata.nom
      : 'Utilisateur'

  const metier =
    typeof user?.user_metadata?.metier === 'string'
      ? user.user_metadata.metier
      : ''

  const maintenant = new Date()

  /*
   * Statistiques des devis
   */
  const devisCeMois = devis.filter((devisItem) => {
    const dateCreation = new Date(
      devisItem.created_at
    )

    return (
      dateCreation.getMonth() ===
        maintenant.getMonth() &&
      dateCreation.getFullYear() ===
        maintenant.getFullYear()
    )
  })

  const devisAcceptes = devis.filter(
    (devisItem) =>
      devisItem.statut === 'accepte' &&
      devisItem.archive !== true
  )

  const devisEnAttente = devis.filter(
    (devisItem) =>
      devisItem.statut === 'envoye' &&
      devisItem.archive !== true
  )

  const montantTotalAccepte = devisAcceptes.reduce(
    (total, devisItem) =>
      total + Number(devisItem.montant_ttc || 0),
    0
  )

  /*
   * Statistiques des factures
   */
  const facturesEnAttente = factures.filter(
    (facture) => facture.statut === 'en_attente'
  )

  const facturesPayees = factures.filter(
    (facture) => facture.statut === 'payee'
  )

  const montantEnAttente =
    facturesEnAttente.reduce(
      (total, facture) =>
        total + Number(facture.montant_ttc || 0),
      0
    )

  const montantPaye = facturesPayees.reduce(
    (total, facture) =>
      total + Number(facture.montant_ttc || 0),
    0
  )

  /*
   * On affiche seulement les cinq éléments les plus récents.
   * Les statistiques utilisent cependant toutes les données.
   */
  const derniersDevis = devis.slice(0, 5)
  const dernieresFactures = factures.slice(0, 5)

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'accepte':
        return 'bg-green-100 text-green-700'

      case 'refuse':
        return 'bg-red-100 text-red-700'

      case 'envoye':
        return 'bg-blue-100 text-blue-700'

      case 'brouillon':
        return 'bg-gray-100 text-gray-600'

      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getDevisStatutLabel = (
    statut: string
  ) => {
    switch (statut) {
      case 'accepte':
        return 'Accepté'

      case 'refuse':
        return 'Refusé'

      case 'envoye':
        return 'Envoyé'

      case 'brouillon':
        return 'Brouillon'

      default:
        return statut
    }
  }

  const getFactureStatutStyle = (
    statut: string
  ) => {
    switch (statut) {
      case 'payee':
        return 'bg-green-100 text-green-700'

      case 'en_retard':
        return 'bg-red-100 text-red-700'

      case 'en_attente':
        return 'bg-amber-100 text-amber-700'

      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getFactureStatutLabel = (
    statut: string
  ) => {
    switch (statut) {
      case 'payee':
        return 'Payée'

      case 'en_retard':
        return 'En retard'

      case 'en_attente':
        return 'En attente'

      default:
        return statut
    }
  }

  const formaterMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(Number(montant || 0))
  }

  const formaterDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      'fr-FR'
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header
        action={
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-gray-400 transition hover:text-red-500"
          >
            Déconnexion
          </button>
        }
      />

      <div className="mx-auto max-w-5xl px-6 py-8 pb-24">
        {/* Présentation */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour {nom} 👋
          </h1>

          {metier && (
            <p className="mt-1 text-sm text-gray-500">
              {metier}
            </p>
          )}
        </div>

        {/* Bannière affilié */}
        {estAffilie && (
          <a
            href="/affiliation/dashboard"
            className="mb-6 flex items-center justify-between rounded-xl bg-blue-600 px-6 py-4 text-white transition hover:bg-blue-700"
          >
            <div>
              <p className="font-bold">
                🤝 Vous êtes affilié FaireDesDevis
              </p>

              <p className="mt-0.5 text-sm text-blue-200">
                Accédez à votre espace affilié pour
                voir vos filleuls et vos commissions.
              </p>
            </div>

            <span className="ml-4 text-lg text-white">
              →
            </span>
          </a>
        )}

        {/* Statistiques des devis */}
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-2xl font-bold text-gray-900">
              {devisCeMois.length}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Devis ce mois
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/dashboard/devis?statut=accepte'
              )
            }
            className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-green-300 hover:bg-green-50"
          >
            <p className="text-2xl font-bold text-green-600">
              {devisAcceptes.length}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Acceptés
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/dashboard/devis?statut=envoye'
              )
            }
            className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
          >
            <p className="text-2xl font-bold text-blue-600">
              {devisEnAttente.length}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              En attente
            </p>
          </button>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-2xl font-bold text-gray-900">
              {formaterMontant(
                montantTotalAccepte
              )}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Montant accepté
            </p>
          </div>
        </div>

        {/* Statistiques des factures */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                '/dashboard/factures?statut=en_attente'
              )
            }
            className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-amber-300 hover:bg-amber-50"
          >
            <p className="text-2xl font-bold text-amber-600">
              {formaterMontant(montantEnAttente)}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Factures en attente
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/dashboard/factures?statut=payee'
              )
            }
            className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-green-300 hover:bg-green-50"
          >
            <p className="text-2xl font-bold text-green-600">
              {formaterMontant(montantPaye)}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Factures payées
            </p>
          </button>

          <a
            href="/dashboard/factures"
            className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-300"
          >
            <p className="text-sm font-semibold text-blue-600">
              Voir toutes les factures →
            </p>
          </a>
        </div>

        {/* Actions rapides */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <a
            href="/dashboard/devis/nouveau"
            className="rounded-xl bg-blue-600 p-6 text-white transition hover:bg-blue-700"
          >
            <p className="mb-2 text-2xl">✏️</p>

            <p className="font-semibold">
              Nouveau devis
            </p>

            <p className="mt-1 hidden text-sm text-blue-200 md:block">
              Générer en 60 secondes
            </p>
          </a>

          <a
            href="/dashboard/clients"
            className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-blue-300"
          >
            <p className="mb-2 text-2xl">👥</p>

            <p className="font-semibold text-gray-900">
              Mes clients
            </p>
          </a>

          <a
            href="/dashboard/catalogue"
            className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-blue-300"
          >
            <p className="mb-2 text-2xl">📦</p>

            <p className="font-semibold text-gray-900">
              Mon catalogue
            </p>
          </a>

          <a
            href="/dashboard/profil"
            className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-blue-300"
          >
            <p className="mb-2 text-2xl">⚙️</p>

            <p className="font-semibold text-gray-900">
              Mon profil
            </p>
          </a>
        </div>

        {/* Derniers devis */}
        <div className="mb-4 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">
              Derniers devis
            </h2>

            <a
              href="/dashboard/devis"
              className="text-sm text-blue-600 hover:underline"
            >
              Voir tous →
            </a>
          </div>

          <div className="p-4">
            {derniersDevis.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">
                  Aucun devis pour le moment
                </p>

                <a
                  href="/dashboard/devis/nouveau"
                  className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
                >
                  Créer mon premier devis
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                {derniersDevis.map((devisItem) => (
                  <button
                    type="button"
                    key={devisItem.id}
                    onClick={() =>
                      router.push(
                        `/dashboard/devis/${devisItem.id}`
                      )
                    }
                    className="flex w-full items-center justify-between rounded-xl border border-gray-100 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {devisItem.numero}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {devisItem.client_nom} ·{' '}
                        {formaterDate(
                          devisItem.created_at
                        )}
                      </p>
                    </div>

                    <div className="ml-4 flex flex-shrink-0 items-center gap-2">
                      <p className="hidden text-sm font-semibold text-gray-900 sm:block">
                        {formaterMontant(
                          devisItem.montant_ttc
                        )}
                      </p>

                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatutStyle(
                          devisItem.statut
                        )}`}
                      >
                        {getDevisStatutLabel(
                          devisItem.statut
                        )}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dernières factures */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">
              Dernières factures
            </h2>

            <a
              href="/dashboard/factures"
              className="text-sm text-blue-600 hover:underline"
            >
              Voir toutes →
            </a>
          </div>

          <div className="p-4">
            {dernieresFactures.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">
                  Aucune facture pour le moment
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Transformez un devis accepté en
                  facture.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {dernieresFactures.map(
                  (facture) => (
                    <button
                      type="button"
                      key={facture.id}
                      onClick={() =>
                        router.push(
                          `/dashboard/factures/${facture.id}`
                        )
                      }
                      className="flex w-full items-center justify-between rounded-xl border border-gray-100 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {facture.numero}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                          {facture.client_nom} ·{' '}
                          {formaterDate(
                            facture.created_at
                          )}

                          {facture.date_echeance
                            ? ` · Échéance : ${formaterDate(
                                facture.date_echeance
                              )}`
                            : ''}
                        </p>
                      </div>

                      <div className="ml-4 flex flex-shrink-0 items-center gap-2">
                        <p className="hidden text-sm font-semibold text-gray-900 sm:block">
                          {formaterMontant(
                            facture.montant_ttc
                          )}
                        </p>

                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getFactureStatutStyle(
                            facture.statut
                          )}`}
                        >
                          {getFactureStatutLabel(
                            facture.statut
                          )}
                        </span>
                      </div>
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <NavBar active="dashboard" />
    </main>
  )
}