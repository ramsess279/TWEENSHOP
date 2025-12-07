import React from 'react'
import logo from '../../public/assets/logo2.jpg'

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-baby-pink/20 mt-8 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto p-6 text-sm text-text-secondary flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="TweenShop Logo" className="w-8 h-8 rounded shadow-sm" />
          <span className="font-nunito">© {new Date().getFullYear()} TweenShop</span>
        </div>
        <span className="font-nunito font-medium">Design doux • Pour bébés et familles</span>
      </div>
    </footer>
  )
}

export default Footer
