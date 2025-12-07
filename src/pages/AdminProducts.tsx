import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product, Category } from '../services/data'

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<Partial<Product>>({})
  const [showForm, setShowForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    // Check if admin
    const userRole = localStorage.getItem('userRole')
    if (userRole !== 'admin') {
      navigate('/')
      return
    }

    // Load products
    const storedProducts = localStorage.getItem('products')
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    } else {
      import('../data/products.json').then((data) => {
        setProducts(data.default)
        localStorage.setItem('products', JSON.stringify(data.default))
      })
    }

    // Load categories
    const storedCategories = localStorage.getItem('categories')
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    } else {
      import('../data/categories.json').then((data) => {
        setCategories(data.default)
        localStorage.setItem('categories', JSON.stringify(data.default))
      })
    }
  }, [navigate])

  useEffect(() => {
    setCurrentPage(1)
  }, [products.length])

  const totalPages = Math.ceil(products.length / itemsPerPage)
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts)
    localStorage.setItem('products', JSON.stringify(newProducts))
  }

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories)
    localStorage.setItem('categories', JSON.stringify(newCategories))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.images || form.images.length === 0) {
      alert('Veuillez ajouter au moins une image.')
      return
    }
    if (editing) {
      const updated = products.map((p) => (p.id === editing.id ? { ...p, ...form } : p))
      saveProducts(updated)
      setEditing(null)
    } else {
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        title: form.title || '',
        slug: (form.title || '').toLowerCase().replace(/\s+/g, '-'),
        price: form.price || 0,
        currency: 'EUR',
        images: form.images || [],
        video: form.video || undefined,
        description: form.description || '',
        category: form.category || '',
        stock: form.stock || 0,
        rating: 0,
        tags: [],
        created_at: new Date().toISOString(),
      }
      saveProducts([...products, newProduct])
    }
    setForm({})
    setSelectedFiles([])
    setShowForm(false)
  }

  const editProduct = (product: Product) => {
    setEditing(product)
    setForm(product)
    setShowForm(true)
  }

  const deleteProduct = (id: string) => {
    setProductToDelete(id)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      saveProducts(products.filter((p) => p.id !== productToDelete))
      setProductToDelete(null)
      setShowDeleteConfirm(false)
    }
  }

  const cancelDelete = () => {
    setProductToDelete(null)
    setShowDeleteConfirm(false)
  }

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files)
    Promise.all(files.map(file => new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    }))).then(urls => {
      setForm({ ...form, images: urls })
    })
  }

  return (
    <div className="min-h-screen">
      <div className="pt-24">
        <section className="w-[90%] mx-auto">
          <div className="w-full py-6 md:py-8">
            {/* Product management table */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Gestion des produits</h2>
                <div className="flex gap-2">
                  <button onClick={() => { setForm({}); setEditing(null); setSelectedFiles([]); setShowForm(true); }} className="px-4 py-2 bg-accent/80 backdrop-blur-sm text-white rounded">
                    Ajouter un produit
                  </button>
                  <button onClick={() => setShowAddCategory(true)} className="px-4 py-2 bg-accent/80 backdrop-blur-sm text-white rounded">
                    Nouveau catégorie
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg overflow-hidden shadow">
                    <div className="relative">
                      {product.images?.[0] && <img src={product.images[0]} alt={product.title} className="w-full h-40 object-cover" />}
                      <div className="absolute top-2 right-2">
                        <button onClick={() => editProduct(product)} className="p-2 bg-white bg-opacity-80 rounded-full shadow">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                        <button onClick={() => deleteProduct(product.id)} className="p-2 bg-white bg-opacity-80 rounded-full shadow ml-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{product.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div>Stock: {product.stock}</div>
                        <div className="font-semibold">{product.price.toFixed(2)} €</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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
          </div>
        </section>

        {/* Product form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-4">{editing ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="block w-full border rounded-md p-2 focus:ring-accent focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="block w-full border rounded-md p-2 focus:ring-accent focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                      className="block w-full border rounded-md p-2 focus:ring-accent focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-accent transition-colors"
                      onDrop={(e) => {
                        e.preventDefault()
                        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
                        handleFileSelect(files)
                      }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <p className="text-gray-500">Glissez-déposez des images ici ou cliquez pour sélectionner</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          handleFileSelect(files)
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer text-accent underline">Sélectionner des fichiers</label>
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{selectedFiles.length} fichier(s) sélectionné(s)</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vidéo (URL)</label>
                    <input
                      type="text"
                      value={form.video}
                      onChange={(e) => setForm({ ...form, video: e.target.value })}
                      className="block w-full border rounded-md p-2 focus:ring-accent focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="block w-full border rounded-md p-2 focus:ring-accent focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="block w-full border rounded-md p-2 focus:ring-accent focus:border-accent"
                      required
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90"
                  >
                    {editing ? 'Sauvegarder les modifications' : 'Ajouter le produit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(false)}>
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-4 text-accent">Confirmer la suppression</h2>
              <p className="mb-4">Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.</p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/90"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add category modal */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddCategory(false)}>
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-4">Ajouter une nouvelle catégorie</h2>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nom de la catégorie"
                className="block w-full border rounded-md p-2 focus:ring-accent focus:border-accent mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddCategory(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    if (newCategoryName.trim()) {
                      const newCat: Category = {
                        id: `cat_${Date.now()}`,
                        name: newCategoryName.trim(),
                        slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-'),
                      }
                      saveCategories([...categories, newCat])
                      setNewCategoryName('')
                      setShowAddCategory(false)
                    }
                  }}
                  className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/90"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProducts