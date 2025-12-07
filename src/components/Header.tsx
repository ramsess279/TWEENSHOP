import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { GoogleIcon } from '../ui/PaymentIcons'
import { HomeIcon, CubeIcon, ClipboardDocumentListIcon, Cog6ToothIcon, ShoppingBagIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import logo from '../../public/assets/logo1.png'

const Header: React.FC = () => {
  const { state } = useCart()
  const totalCount = state.items.reduce((s, i) => s + i.quantity, 0)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const userRole = localStorage.getItem('userRole')

  const logout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    window.location.href = '/'
  }

  return (
    <>
    <header className={`fixed top-0 left-0 right-0 z-50 ${isHome ? 'bg-transparent backdrop-blur-sm' : 'bg-white/90 backdrop-blur-md shadow-lg'}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4">
            <img src={logo} alt="TweenShop Logo" className={`${isHome ? 'w-20 h-16' : 'w-12 h-12'} rounded-lg shadow-sm`} />
            <span className={`font-bold text-xl font-nunito ${isHome ? 'text-white drop-shadow-lg' : 'text-text-primary'}`}>TweenShop</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {userRole === 'admin' && (
                  <>
                    <Link to="/admin" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-lg ${location.pathname === '/admin' ? 'bg-white/20 backdrop-blur-sm text-accent' : `hover:text-accent ${isHome ? 'text-white drop-shadow-lg' : 'text-text-primary'}`}`}>
                      <HomeIcon className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link to="/admin/products" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-lg ${location.pathname === '/admin/products' ? 'bg-white/20 backdrop-blur-sm text-accent' : `hover:text-accent ${isHome ? 'text-white drop-shadow-lg' : 'text-text-primary'}`}`}>
                      <CubeIcon className="w-5 h-5" />
                      Ges Produits
                    </Link>
                    <Link to="/admin/orders" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-lg ${location.pathname === '/admin/orders' ? 'bg-white/20 backdrop-blur-sm text-accent' : `hover:text-accent ${isHome ? 'text-white drop-shadow-lg' : 'text-text-primary'}`}`}>
                      <ClipboardDocumentListIcon className="w-5 h-5" />
                      Commandes
                    </Link>
                    <Link to="/admin/settings" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-lg ${location.pathname === '/admin/settings' ? 'bg-white/20 backdrop-blur-sm text-accent' : `hover:text-accent ${isHome ? 'text-white drop-shadow-lg' : 'text-text-primary'}`}`}>
                      <Cog6ToothIcon className="w-5 h-5" />
                      Paramètres
                    </Link>
                  </>
                )}
                {!userRole && (
                  <>
                    <Link to="/" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-lg ${location.pathname === '/' ? 'bg-white/20 backdrop-blur-sm text-accent' : `hover:text-accent ${isHome ? 'text-white drop-shadow-lg' : 'text-text-primary'}`}`}>
                      <HomeIcon className="w-5 h-5" />
                      Accueil
                    </Link>
                    <Link to="/admin/products" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-lg ${location.pathname === '/admin/products' ? 'bg-white/20 backdrop-blur-sm text-accent' : `hover:text-accent ${isHome ? 'text-white drop-shadow-lg' : 'text-text-primary'}`}`}>
                      <CubeIcon className="w-5 h-5" />
                      Ges Produits
                    </Link>
                    <Link to="/cart" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-lg relative ${location.pathname === '/cart' ? 'bg-white/20 backdrop-blur-sm text-accent' : `hover:text-accent ${isHome ? 'text-white drop-shadow-lg' : 'text-text-primary'}`}`}>
                     <ShoppingBagIcon className="w-5 h-5" />
                     Panier
                     {totalCount > 0 && (
                       <span className="ml-2 px-2 py-1 rounded-full text-xs bg-accent text-white font-semibold">{totalCount}</span>
                     )}
                   </Link>
                  </>
                )}
                <button onClick={logout} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-lg hover:text-accent ${isHome ? 'text-white drop-shadow-lg' : 'text-text-primary'}`}>
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-lg ${location.pathname === '/' ? 'bg-white/20 backdrop-blur-sm text-accent' : `hover:text-accent ${isHome ? 'text-white drop-shadow-lg' : 'text-text-primary'}`}`}>
                  <HomeIcon className="w-5 h-5" />
                  Accueil
                </Link>
                <Link to="/products" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-lg ${location.pathname === '/products' ? 'bg-white/20 backdrop-blur-sm text-accent' : `hover:text-accent ${isHome ? 'text-white drop-shadow-lg' : 'text-text-primary'}`}`}>
                  <CubeIcon className="w-5 h-5" />
                  Produits
                </Link>
                <Link to="/cart" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-lg relative ${location.pathname === '/cart' ? 'bg-white/20 backdrop-blur-sm text-accent' : `hover:text-accent ${isHome ? 'text-white drop-shadow-lg' : 'text-text-primary'}`}`}>
                 <ShoppingBagIcon className="w-5 h-5" />
                 Panier
                 {totalCount > 0 && (
                   <span className="ml-2 px-2 py-1 rounded-full text-xs bg-accent text-white font-semibold">{totalCount}</span>
                 )}
               </Link>
                <Link to="/login" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-lg ${location.pathname === '/login' ? 'bg-white/20 backdrop-blur-sm text-accent' : `hover:text-accent ${isHome ? 'text-white drop-shadow-lg' : 'text-text-primary'}`}`}>
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Se connecter</span>
                </Link>
              </>
            )}
          </nav>
      </div>
    </header>

    {/* Mobile Navigation */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg border-t border-gray-200 z-40">
      <div className="flex justify-around items-center py-2">
        {isLoggedIn ? (
          userRole === 'admin' ? (
            <>
              <Link to="/admin" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location.pathname === '/admin' ? 'text-accent' : 'text-gray-600'}`}>
                <HomeIcon className="w-6 h-6" />
                <span className="text-xs">Dashboard</span>
              </Link>
              <Link to="/admin/products" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location.pathname === '/admin/products' ? 'text-accent' : 'text-gray-600'}`}>
                <CubeIcon className="w-6 h-6" />
                <span className="text-xs">Produits</span>
              </Link>
              <Link to="/admin/orders" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location.pathname === '/admin/orders' ? 'text-accent' : 'text-gray-600'}`}>
                <ClipboardDocumentListIcon className="w-6 h-6" />
                <span className="text-xs">Commandes</span>
              </Link>
              <Link to="/admin/settings" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location.pathname === '/admin/settings' ? 'text-accent' : 'text-gray-600'}`}>
                <Cog6ToothIcon className="w-6 h-6" />
                <span className="text-xs">Paramètres</span>
              </Link>
              <button onClick={logout} className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors text-gray-600">
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                <span className="text-xs">Déco</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location.pathname === '/' ? 'text-accent' : 'text-gray-600'}`}>
                <HomeIcon className="w-6 h-6" />
                <span className="text-xs">Accueil</span>
              </Link>
              <Link to="/admin/products" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location.pathname === '/admin/products' ? 'text-accent' : 'text-gray-600'}`}>
                <CubeIcon className="w-6 h-6" />
                <span className="text-xs">Produits</span>
              </Link>
              <Link to="/cart" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative ${location.pathname === '/cart' ? 'text-accent' : 'text-gray-600'}`}>
                <ShoppingBagIcon className="w-6 h-6" />
                <span className="text-xs">Panier</span>
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{totalCount}</span>
                )}
              </Link>
              <button onClick={logout} className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors text-gray-600">
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                <span className="text-xs">Déco</span>
              </button>
            </>
          )
        ) : (
          <>
            <Link to="/" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location.pathname === '/' ? 'text-accent' : 'text-gray-600'}`}>
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">Accueil</span>
            </Link>
            <Link to="/products" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location.pathname === '/products' ? 'text-accent' : 'text-gray-600'}`}>
              <CubeIcon className="w-6 h-6" />
              <span className="text-xs">Produits</span>
            </Link>
            <Link to="/cart" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative ${location.pathname === '/cart' ? 'text-accent' : 'text-gray-600'}`}>
              <ShoppingBagIcon className="w-6 h-6" />
              <span className="text-xs">Panier</span>
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{totalCount}</span>
              )}
            </Link>
            <Link to="/login" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location.pathname === '/login' ? 'text-accent' : 'text-gray-600'}`}>
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
              <span className="text-xs">Connexion</span>
            </Link>
          </>
        )}
      </div>
    </nav>
    </>
  )
}

export default Header
