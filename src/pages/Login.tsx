import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../public/assets/logo1.png'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'rama.gueye@tweenshop.sn' && password === 'passer') {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userRole', 'admin')
      navigate('/admin')
    } else {
      // Simulate regular user login
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userRole', 'user')
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Image à gauche */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-accent/20 to-accent/10 items-center justify-center">
        <img src={logo} alt="TweenShop" className="max-w-md rounded-lg" />
      </div>

      {/* Formulaire à droite */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-text-primary font-nunito text-center">Connexion</h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 border-2 border-accent bg-accent/10 text-accent font-semibold hover:bg-accent/20 rounded-lg transition-colors"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-gray-500 mb-4">ou</div>
            <button
              onClick={() => alert('Connexion Google - à implémenter')}
              className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Logo Google" aria-hidden="false">
                <path fill="#4285F4" d="M9 3.48c1.69 0 3.15.58 4.33 1.71l3.23-3.14C14.64.62 11.97 0 9 0 5.48 0 2.49 1.88 1.07 4.7l3.77 2.93C5.21 5.02 7.87 3.48 9 3.48z"/>
                <path fill="#34A853" d="M17.64 9.2c0-.63-.06-1.25-.17-1.84H9v3.5h4.84c-.21 1.15-.83 2.13-1.78 2.8l2.73 2.11c1.6-1.49 2.55-3.64 2.55-6.57z"/>
                <path fill="#FBBC05" d="M3.88 10.34A5.94 5.94 0 013 9c0-1.2.36-2.33.99-3.27L1.27 3.8C.44 4.95 0 6.45 0 8c0 1.55.44 3.04 1.27 4.2l2.61-1.86z"/>
                <path fill="#EA4335" d="M9 18c2.46 0 4.53-.8 6.04-2.18l-2.74-2.11c-.75.5-1.71.79-2.71.79-2.13 0-3.9-1.44-4.53-3.36L1.07 14.54C2.49 17.32 5.48 18 9 18z"/>
              </svg>
              Se connecter avec Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login