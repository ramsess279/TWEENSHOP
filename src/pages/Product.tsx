import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductBySlug, type Product } from '../services/data'
import { useCart } from '../context/CartContext'

const ProductPage: React.FC = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | undefined>(undefined)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const { dispatch } = useCart()

  useEffect(() => {
    if (!slug) return
    getProductBySlug(slug).then((p) => setProduct(p))
  }, [slug])

  const addToCart = () => {
    if (!product) return
    dispatch({
      type: 'add',
      item: {
        id: `${product.id}_${selectedSize}_${selectedColor}_cart`,
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity,
        size: selectedSize,
        color: selectedColor,
      },
    })
  }

  if (!product) return <div>Chargement...</div>

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        {showVideo && product.video ? (
          <video src={product.video} controls className="w-full rounded-lg" />
        ) : (
          <img src={product.images?.[selectedImageIndex] || '/assets/placeholder.png'} alt={product.title} className="w-full rounded-lg cursor-pointer" onClick={() => product.video && setShowVideo(true)} />
        )}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.title} ${index + 1}`}
                className={`w-16 h-16 rounded cursor-pointer border-2 ${selectedImageIndex === index ? 'border-accent' : 'border-gray-300'}`}
                onClick={() => { setSelectedImageIndex(index); setShowVideo(false); }}
              />
            ))}
          </div>
        )}
        {product.video && (
          <button onClick={() => setShowVideo(!showVideo)} className="mt-2 px-4 py-2 bg-accent text-white rounded">
            {showVideo ? 'Voir les images' : 'Voir la vidéo'}
          </button>
        )}
      </div>
      <div className="card">
        {/* Bouton Retour */}
        <div className="mb-4">
          <Link to="/products" className="inline-flex items-center text-text-primary hover:text-accent transition-colors">
            <span className="text-xl font-bold mr-1">‹</span> Retour aux produits
          </Link>
        </div>
        <h2 className="text-2xl font-bold">{product.title}</h2>
        <p className="text-xl text-accent mt-2">{product.price} €</p>
        <p className="mt-4 text-sm text-white/60">{product.description}</p>

        {/* Options */}
        <div className="mt-4 space-y-4">
          {/* Quantité */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Quantité</label>
            <div className="flex items-center gap-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 border border-gray-300 rounded">-</button>
              <span className="px-3 py-1 border border-gray-300 rounded min-w-[40px] text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 border border-gray-300 rounded">+</button>
            </div>
          </div>

          {/* Taille */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Taille</label>
            <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded">
              <option value="">Sélectionner une taille</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>

          {/* Couleur */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Couleur</label>
            <div className="grid grid-cols-3 gap-2">
              {['Rouge', 'Bleu', 'Vert', 'Jaune', 'Noir'].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-2 py-2 border rounded text-sm ${selectedColor === color ? 'border-accent bg-accent/10' : 'border-gray-300'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bouton Ajouter au panier en bas */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button onClick={addToCart} className="w-full px-4 py-3 bg-accent text-white rounded-md font-semibold hover:bg-pink-600 transition-colors">
            Ajouter au panier
          </button>
        </div>
      </div>

      {/* Avis clients en bas */}
      <div className="md:col-span-3 mt-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Avis clients</h3>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center mb-2">
                <span className="font-medium">Marie L.</span>
                <span className="ml-2 text-yellow-400">★★★★★</span>
              </div>
              <p className="text-sm text-text-secondary">Produit de très bonne qualité, mon enfant adore ! Livraison rapide.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center mb-2">
                <span className="font-medium">Jean P.</span>
                <span className="ml-2 text-yellow-400">★★★★☆</span>
              </div>
              <p className="text-sm text-text-secondary">Bon rapport qualité-prix. Léger défaut sur la couture mais rien de grave.</p>
            </div>
            <div className="pb-4">
              <div className="flex items-center mb-2">
                <span className="font-medium">Sophie M.</span>
                <span className="ml-2 text-yellow-400">★★★★★</span>
              </div>
              <p className="text-sm text-text-secondary">Parfait pour les sorties en famille. Confortable et stylé.</p>
            </div>
          </div>

          {/* Formulaire pour ajouter un avis */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold mb-4">Ajouter un avis</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Note</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Commentaire</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded resize-none"
                  rows={3}
                  placeholder="Écrivez votre commentaire..."
                />
              </div>
              <button className="px-4 py-2 bg-accent text-white rounded hover:bg-pink-600 transition-colors">
                Soumettre l'avis
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductPage
