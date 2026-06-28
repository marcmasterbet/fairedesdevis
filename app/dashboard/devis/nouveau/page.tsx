'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import { useRouter } from 'next/navigation'

interface Client {
  id: string
  nom: string
  email: string
  telephone: string
  adresse: string
  siret: string
}

interface Produit {
  id: string
  nom: string
  reference: string
  categorie: string
  prix_ht: number
  unite: string
}

interface Ligne {
  produit_id: string
  nom: string
  reference: string
  quantite: number
  prix_ht: number
  total_ht: number
  unite: string
}

export default function NouveauDevis() {
  const [clients, setClients] = useState<Client[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [clientId, setClientId] = useState('')
  const [description, setDescription] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [delai, setDelai] = useState('')
  const [penalite, setPenalite] = useState(false)
  const [penaliteTexte, setPenaliteTexte] = useState('')
  const [annulation, setAnnulation] = useState(false)
  const [annulationTexte, setAnnulationTexte] = useState('')
  const [lignes, setLignes] = useState<Ligne[]>([])
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tva, setTva] = useState(20)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const [{ data: c }, { data: p }] = await Promise.all([
        supabase.from('clients').select('*').order('nom'),
        supabase.from('catalogue').select('*').order('categorie')
      ])
      setClients(c || [])
      setProduits(p || [])
      const tvaUser = user.user_metadata?.['tva']
      if (tvaUser) setTva(parseFloat(tvaUser))
      setLoading(false)
    }
    init()
  }, [router])

  const toggleProduit = (produit: Produit) => {
    const exists = lignes.find(l => l.produit_id === produit.id)
    if (exists) {
      setLignes(l => l.filter(li => li.produit_id !== produit.id))
    } else {
      setLignes(l => [...l, {
        produit_id: produit.id,
        nom: produit.nom,
        reference: produit.reference,
        quantite: 1,
        prix_ht: produit.prix_ht,
        total_ht: produit.prix_ht,
        unite: produit.unite
      }])
    }
  }

  const updateQuantite = (produit_id: string, qty: number) => {
    setLignes(l => l.map(li => li.produit_id === produit_id
      ? { ...li, quantite: qty, total_ht: li.prix_ht * qty }
      : li
    ))
  }

  const totalHT = lignes.reduce((s, l) => s + l.total_ht, 0)
  const totalTVA = totalHT * tva / 100
  const totalTTC = totalHT + totalTVA

  const categories = [...new Set(produits.map(p => p.categorie || 'Autre'))]

  const handleGenerer = async () => {
    if (!clientId) { alert('Sélectionnez un client'); return }
    if (lignes.length === 0) { alert('Sélectionnez au moins un produit'); return }
    if (!description) { alert('Décrivez le chantier'); return }
    setGenerating(true)

    const { data: { user } } = await supabase.auth.getUser()
    const client = clients.find(c => c.id === clientId)
    const numero = `DEV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`

    const prompt = `Tu es un expert en rédaction de devis professionnels français.
Génère un devis complet et professionnel avec ces informations :

PRESTATAIRE :
- Nom : ${user?.user_metadata?.['nom']}
- Métier : ${user?.user_metadata?.['metier']}
- SIRET : ${user?.user_metadata?.['siret'] || 'Non renseigné'}
- Adresse : ${user?.user_metadata?.['adresse'] || 'Non renseignée'}
- Téléphone : ${user?.user_metadata?.['telephone'] || 'Non renseigné'}
- Mentions légales : ${user?.user_metadata?.['mentions_legales'] || ''}

CLIENT :
- Nom : ${client?.nom}
- Email : ${client?.email}
- Adresse : ${client?.adresse || 'Non renseignée'}
- SIRET : ${client?.siret || 'Particulier'}

DEVIS N° ${numero}
Date : ${new Date().toLocaleDateString('fr-FR')}
Validité : ${user?.user_metadata?.['delai_validite'] || 30} jours

DESCRIPTION DU CHANTIER : ${description}
DATE DE DÉBUT : ${dateDebut || 'À définir'}
DÉLAI : ${delai || 'À définir'}

LIGNES DU DEVIS :
${lignes.map(l => `- ${l.nom} (réf: ${l.reference || 'N/A'}) : ${l.quantite} ${l.unite} × ${l.prix_ht}€ HT = ${l.total_ht}€ HT`).join('\n')}

MONTANTS :
- Total HT : ${totalHT.toFixed(2)}€
- TVA ${tva}% : ${totalTVA.toFixed(2)}€
- Total TTC : ${totalTTC.toFixed(2)}€
- Acompte ${user?.user_metadata?.['acompte'] || 30}% : ${(totalTTC * (parseInt(user?.user_metadata?.['acompte'] || '30')) / 100).toFixed(2)}€

${penalite ? `PÉNALITÉ DE RETARD : ${penaliteTexte}` : ''}
${annulation ? `CONDITIONS D'ANNULATION : ${annulationTexte}` : ''}

Rédige le devis de façon professionnelle et complète en français. Inclus toutes les sections habituelles d'un devis professionnel français. Utilise les informations fournies exactement.`

    try {
      const response = await fetch('/api/generer-devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const result = await response.json()
      const contenu = result.contenu

      const { data: devisData } = await supabase.from('devis').insert({
        user_id: user?.id,
        numero,
        client_id: clientId,
        client_nom: client?.nom,
        client_email: client?.email,
        client_adresse: client?.adresse,
        client_siret: client?.siret,
        description,
        date_debut: dateDebut,
        delai,
        penalite_retard: penalite,
        penalite_texte: penaliteTexte,
        condition_annulation: annulation,
        annulation_texte: annulationTexte,
        montant_ht: totalHT,
        tva,
        montant_ttc: totalTTC,
        statut: 'brouillon',
        contenu
      }).select()

      if (devisData && devisData[0]) {
        await supabase.from('devis_lignes').insert(
          lignes.map(l => ({ ...l, devis_id: devisData[0].id }))
        )
        router.push(`/dashboard/devis/${devisData[0].id}`)
      }
    } catch {
      alert('Erreur lors de la génération — réessayez')
      setGenerating(false)
    }
  }

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <a href="/dashboard" className="text-blue-600 font-bold text-xl">FaireDesDevis</a>
        <a href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← Dashboard</a>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouveau devis</h1>

        {/* Client */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">1. Client</h2>
          <select
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            value={clientId}
            onChange={e => setClientId(e.target.value)}
          >
            <option value="">Sélectionner un client...</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.nom} — {c.email}</option>
            ))}
          </select>
          {clients.length === 0 && (
            <p className="text-sm text-gray-400 mt-2">Aucun client — <a href="/dashboard/clients" className="text-blue-600">ajouter un client</a></p>
          )}
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">2. Description du chantier</h2>
          <textarea
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 h-24 resize-none"
            placeholder="Décrivez le chantier ou la mission..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Date de début</label>
              <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={dateDebut} onChange={e => setDateDebut(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Délai</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="ex: 2 semaines" value={delai} onChange={e => setDelai(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Produits */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">3. Produits et prestations</h2>
          {produits.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun produit — <a href="/dashboard/catalogue" className="text-blue-600">ajouter au catalogue</a></p>
          ) : (
            <div className="space-y-4">
              {categories.map(cat => (
                <div key={cat}>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{cat}</p>
                  <div className="space-y-2">
                    {produits.filter(p => (p.categorie || 'Autre') === cat).map(produit => {
                      const ligne = lignes.find(l => l.produit_id === produit.id)
                      return (
                        <div key={produit.id} onClick={() => toggleProduit(produit)} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${ligne ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="checkbox" readOnly checked={!!ligne} className="accent-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{produit.nom}</p>
                            {produit.reference && <p className="text-xs text-gray-400">{produit.reference}</p>}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{produit.prix_ht}€ / {produit.unite}</span>
                          {ligne && (
                            <input
                              type="number"
                              min="1"
                              value={ligne.quantite}
                              onClick={e => e.stopPropagation()}
                              onChange={e => updateQuantite(produit.id, parseInt(e.target.value) || 1)}
                              className="w-16 border border-blue-300 rounded px-2 py-1 text-sm text-center"
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          {lignes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500 mb-1"><span>Total HT</span><span>{totalHT.toFixed(2)} €</span></div>
              <div className="flex justify-between text-sm text-gray-500 mb-1"><span>TVA {tva}%</span><span>{totalTVA.toFixed(2)} €</span></div>
              <div className="flex justify-between font-bold text-gray-900"><span>Total TTC</span><span>{totalTTC.toFixed(2)} €</span></div>
            </div>
          )}
        </div>

        {/* Conditions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">4. Conditions particulières</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={penalite} onChange={e => setPenalite(e.target.checked)} className="accent-blue-600 w-4 h-4" />
                <span className="text-sm text-gray-700">Pénalité de retard</span>
              </label>
              {penalite && (
                <textarea className="w-full mt-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 h-16 resize-none" placeholder="Ex: 1% du montant par semaine de retard..." value={penaliteTexte} onChange={e => setPenaliteTexte(e.target.value)} />
              )}
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={annulation} onChange={e => setAnnulation(e.target.checked)} className="accent-blue-600 w-4 h-4" />
                <span className="text-sm text-gray-700">Conditions d'annulation</span>
              </label>
              {annulation && (
                <textarea className="w-full mt-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 h-16 resize-none" placeholder="Ex: En cas d'annulation, l'acompte reste acquis..." value={annulationTexte} onChange={e => setAnnulationTexte(e.target.value)} />
              )}
            </div>
          </div>
        </div>

        {/* Bouton générer */}
        <button
          onClick={handleGenerer}
          disabled={generating}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {generating ? '⏳ Génération en cours...' : '✨ Générer mon devis avec l\'IA →'}
        </button>
      </div>
    </main>
  )
}