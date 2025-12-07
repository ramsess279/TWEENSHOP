import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Sidebar: React.FC = () => {
  const { state } = useCart()
  const totalCount = state.items.reduce((s, i) => s + i.quantity, 0)
  const location = useLocation()
  const navigate = useNavigate()
  const userRole = localStorage.getItem('userRole')

  const logout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    navigate('/')
  }

  const menuItems = [
    { path: '/', label: 'Accueil', icon: '🏠' },
    { path: '/products', label: 'Produits', icon: '🛍️' },
    { path: '/cart', label: 'Panier', icon: '🛒', badge: totalCount > 0 ? totalCount : null },
    ...(userRole === 'admin' ? [
      { path: '/admin', label: 'Dashboard Admin', icon: '⚙️' },
      { path: '/admin/products', label: 'Gestion Produits', icon: '📦' },
      { path: '/admin/orders', label: 'Commandes', icon: '📋' },
      { path: '/admin/users', label: 'Utilisateurs', icon: '👥' },
      { path: '/admin/settings', label: 'Paramètres', icon: '🔧' },
    ] : []),
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-md shadow-xl border-r border-baby-pink/20 z-40">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 mb-8">
          <img src="/assets/logo1.png" alt="TweenShop Logo" className="w-10 h-10 rounded-lg shadow-sm" />
          <span className="font-bold text-lg font-nunito text-text-primary">TweenShop</span>
        </Link>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-accent/10 text-accent border-l-4 border-accent'
                  : 'text-text-primary hover:bg-accent/5 hover:text-accent'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-1 rounded-full text-xs bg-accent text-white font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="text-lg">🚪</span>
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar