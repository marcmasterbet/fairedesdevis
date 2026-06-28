<div className="space-y-3">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <div>
      <label className="text-xs text-gray-500 mb-1 block">Nom / Société *</label>
      <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="M. Dupont" />
    </div>
    <div>
      <label className="text-xs text-gray-500 mb-1 block">Email *</label>
      <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.email} onChange={e => set('email', e.target.value)} placeholder="dupont@email.fr" />
    </div>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <div>
      <label className="text-xs text-gray-500 mb-1 block">Téléphone mobile</label>
      <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="06 12 34 56 78" />
    </div>
    <div>
      <label className="text-xs text-gray-500 mb-1 block">Téléphone fixe</label>
      <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.telephone_fixe} onChange={e => set('telephone_fixe', e.target.value)} placeholder="03 88 12 34 56" />
    </div>
  </div>
  <div>
    <label className="text-xs text-gray-500 mb-1 block">Adresse</label>
    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.adresse} onChange={e => set('adresse', e.target.value)} placeholder="12 rue des Roses" />
  </div>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
    <div>
      <label className="text-xs text-gray-500 mb-1 block">Code postal</label>
      <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.code_postal} onChange={e => set('code_postal', e.target.value)} placeholder="67000" />
    </div>
    <div>
      <label className="text-xs text-gray-500 mb-1 block">Ville</label>
      <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.ville} onChange={e => set('ville', e.target.value)} placeholder="Strasbourg" />
    </div>
    <div>
      <label className="text-xs text-gray-500 mb-1 block">Pays</label>
      <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.pays} onChange={e => set('pays', e.target.value)} placeholder="France" />
    </div>
  </div>
  <div>
    <label className="text-xs text-gray-500 mb-1 block">SIRET (si entreprise)</label>
    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={form.siret} onChange={e => set('siret', e.target.value)} placeholder="123 456 789 00012" />
  </div>
  <div className="flex gap-3 pt-2">
    <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
      {saving ? 'Sauvegarde...' : 'Ajouter le client'}
    </button>
    <button onClick={() => setShowForm(false)} className="text-gray-400 text-sm hover:text-gray-600 px-4">Annuler</button>
  </div>
</div>