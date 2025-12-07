import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import type { Product, Category } from '../services/data'
import { getAllProducts, getCategories } from '../services/data'

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    Promise.all([getAllProducts(), getCategories()]).then(([prods, cats]) => {
      setProducts(prods)
      setCategories(cats)
    })
  }, [])

  const filteredProducts = (selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products
  ).filter(product => product.images && product.images.length > 0) // only show products that have images

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="pt-20 w-full">

      {/* Catégories */}
      <section className="mb-8 w-[90vw] mx-auto max-w-none px-0">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-lg border-2 ${selectedCategory === '' ? 'border-accent bg-accent/10' : 'border-gray-300'} hover:border-accent transition-colors duration-200 font-medium text-text-primary font-nunito`}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-lg border-2 ${selectedCategory === cat.slug ? 'border-accent bg-accent/10' : 'border-gray-300'} hover:border-accent transition-colors duration-200 font-medium text-text-primary font-nunito`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Produits */}
      <section className="w-[90%] mx-auto max-w-[1800px] bg-white shadow-lg border border-baby-pink/20 px-0">
        <div className="w-full py-6 md:py-8 px-0 md:px-4">
          <h2 className="text-2xl font-bold mb-8 text-text-primary font-nunito text-center">
            {selectedCategory ? `Produits - ${categories.find(c => c.slug === selectedCategory)?.name}` : 'Tous nos Produits'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {paginatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary text-xl font-nunito">Aucun produit trouvé dans cette catégorie.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <span className="hidden sm:inline">‹ Précédent</span>
                  <span className="sm:hidden">‹</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded ${
                      currentPage === page
                        ? 'bg-accent text-white border-accent'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <span className="hidden sm:inline">Suivant ›</span>
                  <span className="sm:hidden">›</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Products