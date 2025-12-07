import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type OrderItem = { productId: string; title: string; price: number; quantity: number }
type Order = { id: string; items: OrderItem[]; total: number; date: string; status?: string }

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 5
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if admin
    const userRole = localStorage.getItem('userRole')
    if (userRole !== 'admin') {
      navigate('/')
      return
    }

    // Load orders
    const storedOrders = localStorage.getItem('orders')
    if (storedOrders) setOrders(JSON.parse(storedOrders))
  }, [navigate])

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
  }

  const deleteOrder = (orderId: string) => {
    setOrderToDelete(orderId)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (orderToDelete) {
      const updatedOrders = orders.filter(order => order.id !== orderToDelete)
      setOrders(updatedOrders)
      localStorage.setItem('orders', JSON.stringify(updatedOrders))
      setOrderToDelete(null)
      setShowDeleteConfirm(false)
    }
  }

  const cancelDelete = () => {
    setOrderToDelete(null)
    setShowDeleteConfirm(false)
  }

  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen">
      <div className="pt-24">
        <section className="w-[90%] mx-auto">
          <div className="w-full py-6 md:py-8">
            {/* Product management table */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Gestion des Commandes</h2>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-text-secondary text-xl font-nunito">Aucune commande pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedOrders.map((order) => (
                    <div key={order.id} className="card p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">Commande {order.id}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium self-start ${getStatusColor(order.status)}`}>
                            {order.status || 'pending'}
                          </span>
                          <span className="text-xl font-bold text-accent">{order.total.toFixed(2)} €</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Articles:</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1">
                              <div className="flex-1">
                                <span className="font-medium">{item.title}</span>
                                <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                              </div>
                              <span className="font-semibold sm:text-right">{(item.price * item.quantity).toFixed(2)} €</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded"
                        >
                          <option value="pending">En attente</option>
                          <option value="completed">Traitée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="px-4 py-2 bg-pink-500/80 backdrop-blur-sm text-white rounded hover:bg-pink-600/90"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
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

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold mb-4 text-red-600">Confirmer la suppression</h2>
              <p className="mb-4">Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.</p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders