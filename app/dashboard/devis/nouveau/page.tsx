'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import { useRouter } from 'next/navigation'
import NavBar from '../../../components/NavBar'
import Header from '../../../components/Header'

interface Client {
  id: string
  nom: string
  email: string
  telephone: string
  telephone_fixe: string
  adresse: string
  code_postal: string
  ville: string
  pays: string
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
  type: 'produit' | 'main_oeuvre'
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
  const [tauxHoraire, setTauxHoraire] = useState(0)
  const [search, setSearch] = useState('')
  const [heuresMainOeuvre, setHeuresMainOeuvre] = useState('')
  const [remiseValeur, setRemiseValeur] = useState('')
  const [remiseType, setRemiseType] = useState<'pourcent' | 'euro'>('pourcent')
  const [ligneLibreNom, setLigneLibreNom] = useState('')
  const [ligneLibrePrix, setLigneLibrePrix] = useState('')
  const [ligneLibreQte, setLigneLibreQte] = useState('1')
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
      const taux = user.user_metadata?.['taux_horaire']
      if (taux) setTauxHoraire(parseFloat(taux))
      setLoading(false)
    }
    init()
  }, [router])

  const ajouterProduit = (produit: Produit) => {
    const exists = lignes.find(l => l.produit_id === produit.id)
    if (exists) {
      updateQuantite(produit.id, exists.quantite + 1)
    } else {
      setLignes(l => [...l, {
        produit_id: produit.id,
        nom: produit.nom,
        reference: produit.reference,
        quantite: 1,
        prix_ht: produit.prix_ht,
        total_ht: produit.prix_ht,
        unite: produit.unite,
        type: 'produit'
      }])
    }
    setSearch('')
  }

  const updateQuantite = (produit_id: string, qty: number) => {
    setLignes(l => l.map(li => li.produit_id === produit_id
      ? { ...li, quantite: qty, total_ht: li.prix_ht * qty }
      : li
    ))
  }

  const supprimerLigne = (produit_id: string) => {
    setLignes(l => l.filter(li => li.produit_id !== produit_id))
  }

  const ajouterMainOeuvre = () => {
    const heures = parseFloat(heuresMainOeuvre.replace(',', '.'))
    if (!heures || heures <= 0) { alert('Indiquez un nombre d heures valide'); return }
    if (!tauxHoraire) { alert('Renseignez votre taux horaire dans votre profil'); return }
    const total = heures * tauxHoraire
    const h = Math.floor(heures)
    const m = Math.round((heures - h) * 60)
    const dureeLabel = m > 0 ? h + 'h' + m.toString().padStart(2, '0') : h + 'h'
    setLignes(l => [...l.filter(li => li.type !== 'main_oeuvre'), {
      produit_id: 'main_oeuvre',
      nom: 'Main d oeuvre (' + dureeLabel + ')',
      reference: '',
      quantite: heures,
      prix_ht: tauxHoraire,
      total_ht: total,
      unite: 'h',
      type: 'main_oeuvre'
    }])
    setHeuresMainOeuvre('')
  }

  const ajouterLigneLibre = () => {
    if (!ligneLibreNom.trim()) { alert('Indiquez un libelle'); return }
    const prixHT = parseFloat(ligneLibrePrix) || 0
    const qte = parseFloat(ligneLibreQte) || 1
    const total = prixHT * qte
    setLignes(l => [...l, {
      produit_id: 'libre_' + Date.now(),
      nom: ligneLibreNom,
      reference: '',
      quantite: qte,
      prix_ht: prixHT,
      total_ht: total,
      unite: 'forfait',
      type: 'produit'
    }])
    setLigneLibreNom('')
    setLigneLibrePrix('')
    setLigneLibreQte('1')
  }

  const totalHTBrut = lignes.reduce((s, l) => s + l.total_ht, 0)
  const remiseMontant = remiseValeur && parseFloat(remiseValeur) > 0
    ? remiseType === 'pourcent'
      ? totalHTBrut * parseFloat(remiseValeur) / 100
      : parseFloat(remiseValeur)
    : 0
  const totalHT = totalHTBrut - remiseMontant
  const totalTVA = totalHT * tva / 100
  const totalTTC = totalHT + totalTVA

  const resultats = search.length >= 1
    ? produits.filter(p =>
        p.nom.toLowerCase().includes(search.toLowerCase()) ||
        p.reference?.toLowerCase().includes(search.toLowerCase()) ||
        p.categorie?.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8)
    : []

  const mainOeuvreLigne = lignes.find(l => l.type === 'main_oeuvre')
  const lignesProduits = lignes.filter(l => l.type === 'produit')

  const handleGenerer = async () => {
    if (!clientId) { alert('Selectionnez un client'); return }
    if (lignes.length === 0) { alert('Ajoutez au moins un produit'); return }
    if (!description) { alert('Decrivez le chantier ou la mission'); return }
    setGenerating(true)

    const { data: { user } } = await supabase.auth.getUser()
    const client = clients.find(c => c.id === clientId)
    const numero = 'DEV-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-4)
    const acompteVal = user?.user_metadata?.['acompte'] || '30'
    const acompteMontant = (totalTTC * parseInt(acompteVal) / 100).toFixed(2)
    const soldeMontant = (totalTTC * (1 - parseInt(acompteVal) / 100)).toFixed(2)
    const logoUrl = user?.user_metadata?.['logo_url'] || ''
    const signatureProUrl = user?.user_metadata?.['signature_url'] || ''

    const prompt = `Tu es un expert en creation de documents commerciaux professionnels francais.

Genere un devis en HTML avec CSS inline. Le rendu doit etre MAGNIFIQUE, professionnel, et OBLIGATOIREMENT responsive.

REGLES ABSOLUES :
- HTML pur avec CSS inline uniquement
- Pas de markdown, pas de #, pas de **, pas de backticks
- Pas de balises html, head, body, style
- Couleur principale : #2563eb
- Police : Arial, sans-serif
- RESPONSIVE : utilise des largeurs en % ou max-width
- Sur le tableau utilise overflow-x:auto
- NE JAMAIS RECALCULER LES MONTANTS - utilise EXACTEMENT les montants fournis

STYLE EXACT A REPRODUIRE :
- En-tete : nom prestataire bold a gauche, mot "DEVIS" en grand bleu #2563eb a droite avec numero et date en gris
- Ligne bleue separatrice fine
- Section client sur fond #f8fafc avec bordure gauche bleue #2563eb
- Tableau prestations : header bleu #2563eb texte blanc, lignes alternees blanc/#f8fafc, TOUTES les lignes dans UN SEUL tableau
- Recapitulatif a droite : Total HT brut, remise si presente, Total HT net, TVA, puis TOTAL TTC dans bloc bleu #2563eb texte blanc bold
- Conditions paiement : acompte et solde
- Zone signature en bas

PRESTATAIRE :
Nom : ${user?.user_metadata?.['nom'] || ''}
Metier : ${user?.user_metadata?.['metier'] || ''}
SIRET : ${user?.user_metadata?.['siret'] || ''}
Adresse : ${user?.user_metadata?.['adresse'] || ''}
Telephone : ${user?.user_metadata?.['telephone'] || ''}
Email : ${user?.email || ''}
Mentions : ${user?.user_metadata?.['mentions_legales'] || ''}
${logoUrl ? 'Logo : <img src="' + logoUrl + '" style="max-height:60px;max-width:160px;object-fit:contain;margin-bottom:8px;display:block" alt="Logo" />' : ''}

CLIENT :
Nom : ${client?.nom || ''}
Email : ${client?.email || ''}
Telephone mobile : ${client?.telephone || ''}
Telephone fixe : ${client?.telephone_fixe || ''}
Adresse : ${client?.adresse || ''} ${client?.code_postal || ''} ${client?.ville || ''} ${client?.pays || ''}
SIRET : ${client?.siret || 'Particulier'}

DEVIS N : ${numero}
Date : ${new Date().toLocaleDateString('fr-FR')}
Validite : ${user?.user_metadata?.['delai_validite'] || 30} jours
Description : ${description}
Date debut : ${dateDebut || 'A convenir'}
Delai : ${delai || 'A convenir'}

TOUTES LES PRESTATIONS (format: Designation|Reference|Qte|Unite|Prix HT|Total HT) :
${lignes.map(l => l.nom + '|' + (l.reference || '-') + '|' + l.quantite + '|' + l.unite + '|' + l.prix_ht.toFixed(2) + ' EUR|' + l.total_ht.toFixed(2) + ' EUR').join('\n')}

MONTANTS EXACTS A UTILISER SANS RECALCULER :
Total HT brut : ${totalHTBrut.toFixed(2)} EUR
${remiseMontant > 0 ? 'Remise (' + (remiseType === 'pourcent' ? remiseValeur + '%' : remiseValeur + ' EUR') + ') : -' + remiseMontant.toFixed(2) + ' EUR' : ''}
Total HT net : ${totalHT.toFixed(2)} EUR
TVA ${tva}% : ${totalTVA.toFixed(2)} EUR
TOTAL TTC : ${totalTTC.toFixed(2)} EUR
Acompte ${acompteVal}% a la commande : ${acompteMontant} EUR
Solde a reception des travaux : ${soldeMontant} EUR
${user?.user_metadata?.['iban'] ? 'IBAN : ' + user?.user_metadata?.['iban'] : ''}
${user?.user_metadata?.['bic'] ? 'BIC : ' + user?.user_metadata?.['bic'] : ''}

${penalite && penaliteTexte ? 'PENALITE DE RETARD : ' + penaliteTexte : ''}
${annulation && annulationTexte ? 'CONDITIONS ANNULATION : ' + annulationTexte : ''}

ZONE SIGNATURE en bas du document (display:flex, justify-content:space-between, gap:40px, margin-top:40px) :
GAUCHE (flex:1, border-top:2px solid #e2e8f0, padding-top:12px) :
  titre "Signature du client" (font-size:13px, font-weight:bold, color:#1e293b)
  texte "En signant electroniquement ce devis, le client declare avoir lu et approuve l ensemble des conditions." (font-size:11px, color:#94a3b8, margin-top:4px)
  zone vide OBLIGATOIRE : <div id="zone-signature-client" style="height:80px"></div>
DROITE (flex:1, border-top:2px solid #e2e8f0, padding-top:12px) :
  titre "Signature du prestataire" (font-size:13px, font-weight:bold, color:#1e293b)
  nom prestataire (font-size:12px, color:#64748b, margin-top:4px)
  ${signatureProUrl ? '<img src="' + signatureProUrl + '" style="max-height:70px;object-fit:contain;display:block;margin-top:8px" alt="Signature" />' : 'ligne vide height:60px'}

Genere UNIQUEMENT le HTML. Rien avant, rien apres.`

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
        client_adresse: (client?.adresse || '') + ' ' + (client?.code_postal || '') + ' ' + (client?.ville || ''),
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
          lignes.map(l => ({
            produit_id: l.produit_id.startsWith('libre_') ? null : l.type === 'main_oeuvre' ? null : l.produit_id,
            nom: l.nom,
            reference: l.reference,
            quantite: l.quantite,
            prix_ht: l.prix_ht,
            total_ht: l.total_ht,
            devis_id: devisData[0].id
          }))
        )
        router.push('/dashboard/devis/' + devisData[0].id)
      }
    } catch {
      alert('Erreur lors de la generation')
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
      <Header back="/dashboard/devis" backLabel="Mes devis" />

      <div className="max-w-3xl mx-auto px-6 py-8 pb-24">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouveau devis</h1>

        {/* 1. Client */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">1. Client</h2>
          <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500" value={clientId} onChange={e => setClientId(e.target.value)}>
            <option value="">Selectionner un client...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.nom} — {c.email}</option>)}
          </select>
          {clients.length === 0 && <p className="text-sm text-gray-400 mt-2">Aucun client — <a href="/dashboard/clients" className="text-blue-600">ajouter un client</a></p>}
        </div>

        {/* 2. Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">2. Description du chantier</h2>
          <textarea className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 h-24 resize-none" placeholder="Decrivez le chantier ou la mission..." value={description} onChange={e => setDescription(e.target.value)} />
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Date de debut</label>
              <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={dateDebut} onChange={e => setDateDebut(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Delai d execution</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="ex: 2 semaines" value={delai} onChange={e => setDelai(e.target.value)} />
            </div>
          </div>
        </div>

        {/* 3. Produits */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">3. Produits et prestations</h2>

          {produits.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun produit — <a href="/dashboard/catalogue" className="text-blue-600">ajouter au catalogue</a></p>
          ) : (
            <div className="relative mb-4">
              <input className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500" placeholder="Rechercher un produit..." value={search} onChange={e => setSearch(e.target.value)} />
              {resultats.length > 0 && (
                <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
                  {resultats.map(produit => (
                    <div key={produit.id} onClick={() => ajouterProduit(produit)} className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{produit.nom}</p>
                        <p className="text-xs text-gray-400">{produit.categorie}{produit.reference ? ' · ' + produit.reference : ''}</p>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">{produit.prix_ht} EUR</span>
                    </div>
                  ))}
                </div>
              )}
              {search.length >= 1 && resultats.length === 0 && (
                <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-400">
                  Aucun produit trouve
                </div>
              )}
            </div>
          )}

          {lignesProduits.length > 0 && (
            <div className="space-y-2 mb-4">
              {lignesProduits.map(ligne => (
                <div key={ligne.produit_id} className="flex items-center gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{ligne.nom}</p>
                    {ligne.reference && <p className="text-xs text-gray-400">{ligne.reference}</p>}
                  </div>
                  <input
                    type="number" min="1" inputMode="numeric"
                    value={ligne.quantite === 0 ? '' : ligne.quantite}
                    onChange={e => { const val = e.target.value; if (val === '') updateQuantite(ligne.produit_id, 0); else { const num = parseInt(val); if (!isNaN(num)) updateQuantite(ligne.produit_id, num) } }}
                    onBlur={e => { if (e.target.value === '' || parseInt(e.target.value) < 1) updateQuantite(ligne.produit_id, 1) }}
                    className="w-16 border border-blue-300 rounded px-2 py-1 text-sm text-center bg-white"
                  />
                  <span className="text-sm font-semibold text-gray-900 w-20 text-right">{ligne.total_ht.toFixed(2)} EUR</span>
                  <button onClick={() => supprimerLigne(ligne.produit_id)} className="text-red-400 hover:text-red-600 text-sm px-1">X</button>
                </div>
              ))}
            </div>
          )}

          {/* Main d oeuvre */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Main d oeuvre</p>
            {mainOeuvreLigne ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-green-200 bg-green-50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{mainOeuvreLigne.nom}</p>
                  <p className="text-xs text-gray-400">{tauxHoraire} EUR/h</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">{mainOeuvreLigne.total_ht.toFixed(2)} EUR</span>
                <button onClick={() => supprimerLigne('main_oeuvre')} className="text-red-400 hover:text-red-600 text-sm px-1">X</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input type="text" inputMode="decimal" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="Heures ex: 1.5 pour 1h30" value={heuresMainOeuvre} onChange={e => setHeuresMainOeuvre(e.target.value)} />
                <button onClick={ajouterMainOeuvre} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 whitespace-nowrap">+ Ajouter</button>
              </div>
            )}
            {!tauxHoraire && <p className="text-xs text-amber-600 mt-2">Renseignez votre taux horaire dans <a href="/dashboard/profil" className="underline">votre profil</a></p>}
          </div>

          {/* Ligne libre */}
          <div className="border-t border-gray-100 pt-4 mt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Ligne libre (hors catalogue)</p>
            <div className="flex items-center gap-2 flex-wrap">
              <input type="text" className="flex-1 min-w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="Ex: Trajet, Materiel special..." value={ligneLibreNom} onChange={e => setLigneLibreNom(e.target.value)} />
              <input type="number" className="w-16 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="Qte" value={ligneLibreQte} onChange={e => setLigneLibreQte(e.target.value)} />
              <input type="number" className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="Prix HT" value={ligneLibrePrix} onChange={e => setLigneLibrePrix(e.target.value)} />
              <button onClick={ajouterLigneLibre} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 whitespace-nowrap">+ Ajouter</button>
            </div>
          </div>

          {/* Remise */}
          <div className="border-t border-gray-100 pt-4 mt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Remise</p>
            <div className="flex items-center gap-2">
              <input type="number" className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="0" value={remiseValeur} onChange={e => setRemiseValeur(e.target.value)} />
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={remiseType} onChange={e => setRemiseType(e.target.value as 'pourcent' | 'euro')}>
                <option value="pourcent">%</option>
                <option value="euro">EUR</option>
              </select>
              {remiseValeur && parseFloat(remiseValeur) > 0 && (
                <span className="text-sm text-green-600 font-medium">- {remiseMontant.toFixed(2)} EUR HT</span>
              )}
            </div>
          </div>

          {/* Recapitulatif */}
          {lignes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              {remiseMontant > 0 && (
                <div className="flex justify-between text-sm text-green-600 mb-1">
                  <span>Remise {remiseType === 'pourcent' ? remiseValeur + '%' : ''}</span>
                  <span>- {remiseMontant.toFixed(2)} EUR</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500 mb-1"><span>Total HT</span><span>{totalHT.toFixed(2)} EUR</span></div>
              <div className="flex justify-between text-sm text-gray-500 mb-1"><span>TVA {tva}%</span><span>{totalTVA.toFixed(2)} EUR</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-lg"><span>Total TTC</span><span>{totalTTC.toFixed(2)} EUR</span></div>
            </div>
          )}
        </div>

        {/* 4. Conditions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">4. Conditions particulieres</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={penalite} onChange={e => setPenalite(e.target.checked)} className="accent-blue-600 w-4 h-4" />
                <span className="text-sm text-gray-700">Penalite de retard</span>
              </label>
              {penalite && <textarea className="w-full mt-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 h-16 resize-none" placeholder="Ex: 1% du montant par semaine de retard..." value={penaliteTexte} onChange={e => setPenaliteTexte(e.target.value)} />}
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={annulation} onChange={e => setAnnulation(e.target.checked)} className="accent-blue-600 w-4 h-4" />
                <span className="text-sm text-gray-700">Conditions d annulation</span>
              </label>
              {annulation && <textarea className="w-full mt-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 h-16 resize-none" placeholder="Ex: En cas d annulation, l acompte reste acquis..." value={annulationTexte} onChange={e => setAnnulationTexte(e.target.value)} />}
            </div>
          </div>
        </div>

        <button onClick={handleGenerer} disabled={generating} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition">
          {generating ? 'Generation en cours...' : 'Generer mon devis avec l IA'}
        </button>
      </div>

      <NavBar active="devis" />
    </main>
  )
}