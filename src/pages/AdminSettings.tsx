import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CogIcon, BuildingOfficeIcon, UserIcon, PaintBrushIcon } from '@heroicons/react/24/outline'

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteTitle: '',
    currency: '',
    theme: '',
    locale: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    description: '',
    adminName: '',
    adminPassword: ''
  })
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('general')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if admin
    const userRole = localStorage.getItem('userRole')
    if (userRole !== 'admin') {
      navigate('/')
      return
    }

    // Load settings
    const stored = localStorage.getItem('settings')
    if (stored) {
      setSettings({ ...settings, ...JSON.parse(stored) })
    } else {
      import('../data/settings.json').then((data) => {
        setSettings({ ...settings, ...data.default })
        localStorage.setItem('settings', JSON.stringify({ ...settings, ...data.default }))
      })
    }
  }, [navigate])

  const saveSettings = () => {
    localStorage.setItem('settings', JSON.stringify(settings))
    setMessage('Paramètres sauvegardés avec succès!')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings({ ...settings, [name]: value })
  }

  return (
    <div className="min-h-screen">
      <div className="pt-24">
        <section className="w-[90%] mx-auto">
          <div className="w-full py-6 md:py-8">
            <div className="card p-4">
              <h2 className="text-lg font-semibold mb-4">Paramètres du site</h2>

              {/* Tabs */}
              <div className="flex flex-wrap border-b mb-6">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'general' ? 'border-b-2 border-accent text-accent bg-accent/5' : 'text-gray-600 hover:text-accent'}`}
                >
                  <CogIcon className="w-5 h-5" />
                  Général
                </button>
                <button
                  onClick={() => setActiveTab('company')}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'company' ? 'border-b-2 border-accent text-accent bg-accent/5' : 'text-gray-600 hover:text-accent'}`}
                >
                  <BuildingOfficeIcon className="w-5 h-5" />
                  Entreprise
                </button>
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'personal' ? 'border-b-2 border-accent text-accent bg-accent/5' : 'text-gray-600 hover:text-accent'}`}
                >
                  <UserIcon className="w-5 h-5" />
                  Personnel
                </button>
                <button
                  onClick={() => setActiveTab('appearance')}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'appearance' ? 'border-b-2 border-accent text-accent bg-accent/5' : 'text-gray-600 hover:text-accent'}`}
                >
                  <PaintBrushIcon className="w-5 h-5" />
                  Apparence
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Configuration générale</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Titre du site</label>
                        <input
                          type="text"
                          name="siteTitle"
                          value={settings.siteTitle}
                          onChange={handleChange}
                          placeholder="Ex: TweenShop"
                          className="block w-full border rounded-lg p-3 focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">Le nom affiché dans l'en-tête du site</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
                        <select
                          name="currency"
                          value={settings.currency}
                          onChange={handleChange}
                          className="block w-full border rounded-lg p-3 focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                        >
                          <option value="EUR">EUR (€)</option>
                          <option value="USD">USD ($)</option>
                          <option value="XOF">XOF (CFA)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Devise utilisée pour les prix</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                        <select
                          name="locale"
                          value={settings.locale}
                          onChange={handleChange}
                          className="block w-full border rounded-lg p-3 focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                        >
                          <option value="fr-FR">Français</option>
                          <option value="en-US">English</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Langue par défaut du site</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'company' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Informations de l'entreprise</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={settings.contactEmail}
                          onChange={handleChange}
                          placeholder="contact@tweenshop.com"
                          className="block w-full border rounded-lg p-3 focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">Adresse email pour les demandes clients</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone de contact (WhatsApp)</label>
                        <input
                          type="tel"
                          name="contactPhone"
                          value={settings.contactPhone}
                          onChange={handleChange}
                          placeholder="+221 XX XXX XX XX"
                          className="block w-full border rounded-lg p-3 focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">Numéro pour accéder à WhatsApp</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                        <textarea
                          name="address"
                          value={settings.address}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Adresse complète de l'entreprise"
                          className="block w-full border rounded-lg p-3 focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">Adresse physique de l'entreprise</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description du site</label>
                        <textarea
                          name="description"
                          value={settings.description}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Description de votre boutique en ligne"
                          className="block w-full border rounded-lg p-3 focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">Texte descriptif affiché sur le site</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Paramètres personnels</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur admin</label>
                        <input
                          type="text"
                          name="adminName"
                          value={settings.adminName}
                          onChange={handleChange}
                          placeholder="admin"
                          className="block w-full border rounded-lg p-3 focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">Identifiant pour la connexion admin</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe admin</label>
                        <input
                          type="password"
                          name="adminPassword"
                          value={settings.adminPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="block w-full border rounded-lg p-3 focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">Mot de passe sécurisé pour l'accès admin</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Paramètres d'apparence</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                        <select
                          name="theme"
                          value={settings.theme}
                          onChange={handleChange}
                          className="block w-full border rounded-lg p-3 focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                        >
                          <option value="light">Clair</option>
                          <option value="dark">Sombre</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Thème visuel du site</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={saveSettings}
                  className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/90"
                >
                  Sauvegarder les paramètres
                </button>
                {message && (
                  <span className="text-accent font-medium">{message}</span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminSettings