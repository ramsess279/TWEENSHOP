import React from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../services/data'
import { useCart } from '../context/CartContext'

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { dispatch } = useCart()

  const addToCart = () => {
    dispatch({
      type: 'add',
      item: {
        id: `${product.id}_cart`,
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
      },
    })
  }

  return (
    <article className="card h-full flex flex-col justify-between min-h-[520px]">
      <Link to={`/product/${product.slug}`} className="block h-full">
        <img
          src={product.images?.[0] || '/assets/placeholder.png'}
          alt={product.title}
          className="w-full h-56 md:h-80 object-cover rounded-lg mb-4 transition-transform duration-300 hover:scale-105"
        />
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary font-nunito">{product.title}</h3>
          <span className="text-sm font-semibold text-accent">{product.price} €</span>
        </div>
        <p className="text-sm text-text-secondary mt-2">{product.description}</p>
      </Link>
      <div className="mt-4 flex items-center gap-2">
        <button onClick={addToCart} className="flex-1 px-4 py-3 rounded-lg border-2 border-accent bg-accent/10 text-accent font-semibold hover:bg-accent/20 transition-colors duration-200 shadow-md">
          + Panier
        </button>
        <Link to={`/product/${product.slug}`} className="btn-muted px-4 py-2 text-sm font-medium">
          Voir
        </Link>
      </div>
    </article>
  )
}

export default ProductCard
