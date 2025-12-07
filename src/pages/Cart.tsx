import React from 'react'
import { useCart } from '../context/CartContext'
import { getProductById } from '../services/data'
// icônes de paiement temporairement retirées
import icons from '../ui/PaymentIcons'

const Cart: React.FC = () => {
  const { state, dispatch } = useCart()
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 5
  const [modalOpen, setModalOpen] = React.useState(false)
  const [checkoutStep, setCheckoutStep] = React.useState(0) // 0: login, 1: payment method, 2: details, 3: confirm
  const [paymentMethod, setPaymentMethod] = React.useState('')
  const [paymentDetails, setPaymentDetails] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [pinCode, setPinCode] = React.useState('')
  const [cardNumber, setCardNumber] = React.useState('')
  const [expiryDate, setExpiryDate] = React.useState('')
  const [cvv, setCvv] = React.useState('')
  const [whatsappModalOpen, setWhatsappModalOpen] = React.useState(false)
  const [userPhone, setUserPhone] = React.useState('')

  const remove = (id: string) => dispatch({ type: 'remove', id })
  const clear = () => dispatch({ type: 'clear' })

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      remove(id)
      return
    }
    dispatch({ type: 'update', id, quantity: newQuantity })
  }

  const total = state.items.reduce((s, i) => s + i.price * i.quantity, 0)
  const totalPages = Math.ceil(state.items.length / itemsPerPage)
  const paginatedItems = state.items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const validateCart = () => {
    setModalOpen(true)
    setCheckoutStep(1) // Skip login for now, go directly to payment method
  }

  const handleLogin = () => {
    if (email && password) {
      // Simulate manual login
      localStorage.setItem('isLoggedIn', 'true')
      setCheckoutStep(1)
    } else {
      alert('Veuillez saisir email et mot de passe.')
    }
  }

  const handleGoogleLogin = () => {
    // Simulate Google login
    localStorage.setItem('isLoggedIn', 'true')
    setCheckoutStep(1)
  }

  const handlePaymentMethod = (method: string) => {
    setPaymentMethod(method)
    if (method === 'card') {
      // For card payment, require login
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      if (!isLoggedIn) {
        setCheckoutStep(0) // Go to login
        return
      }
    }
    setCheckoutStep(2) // Go to payment details
  }

  const handlePaymentDetails = () => {
    if (paymentMethod === 'wave' || paymentMethod === 'orange') {
      if (!phoneNumber.trim() || !pinCode.trim()) return
    } else if (paymentMethod === 'card') {
      if (!cardNumber.trim() || !expiryDate.trim() || !cvv.trim()) return
    } else {
      if (!paymentDetails.trim()) return
    }
    setCheckoutStep(3)
  }

  const confirmOrder = () => {
    if (state.items.length === 0) return
    const orderItems = state.items.map((i) => ({ productId: i.productId, title: i.title, price: i.price, quantity: i.quantity }))
    const orderTotal = orderItems.reduce((s, it) => s + it.price * it.quantity, 0)
    const newOrder = {
      id: `ord_${Date.now()}`,
      items: orderItems,
      total: orderTotal,
      date: new Date().toISOString(),
      status: 'pending',
    }
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const updatedOrders = [...storedOrders, newOrder]
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    alert(`Commande validée ! ID: ${newOrder.id} — Total: ${orderTotal.toFixed(2)} €`)
    dispatch({ type: 'clear' })
    setModalOpen(false)
  }

  const closeModal = () => {
    setModalOpen(false)
    setCheckoutStep(0)
    setPaymentMethod('')
    setPaymentDetails('')
  }

  const orderOnWhatsApp = () => {
    setWhatsappModalOpen(true)
  }

  const sendWhatsAppOrder = () => {
    if (!userPhone.trim()) {
      alert('Veuillez saisir votre numéro de téléphone.')
      return
    }
    const settings = JSON.parse(localStorage.getItem('settings') || '{}')
    const adminPhone = settings.contactPhone || '221XXXXXXXXX' // Fallback
    const message = state.items
      .map((item) => {
        const product = getProductById(item.productId)
        const images = product?.images?.map(img => img).join('\n') || ''
        return `${item.title} (x${item.quantity}) - ${item.price * item.quantity} €\nImages: ${images}`
      })
      .join('\n\n')
    const fullMessage = `Bonjour, je souhaite commander :\n\n${message}\n\nTotal: ${total.toFixed(2)} €\nMon numéro: ${userPhone}`
    const whatsappUrl = `https://wa.me/${adminPhone.replace(/\D/g, '')}?text=${encodeURIComponent(fullMessage)}`
    window.open(whatsappUrl, '_blank')
    setWhatsappModalOpen(false)
    setUserPhone('')
  }

  return (
    <div className="pt-20 w-full px-4">
      <section className="w-full bg-white shadow-lg border border-baby-pink/20">
        <div className="max-w-[2800px] w-full mx-auto px-2 md:px-4 lg:px-6 py-6 md:py-8">
          <h1 className="text-2xl font-bold mb-8 text-text-primary font-nunito text-center">Votre panier</h1>
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary text-xl font-nunito">Votre panier est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedItems.map((it) => {
                const product = getProductById(it.productId)
                return (
                  <div key={it.id} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {product?.images?.[0] && (
                          <img src={product.images[0]} alt={it.title} className="w-12 h-12 rounded object-cover" />
                        )}
                        <div className="font-semibold">{it.title}</div>
                      </div>
                      <button onClick={() => remove(it.id)} className="btn-muted">Supprimer</button>
                    </div>
                    <div className="mt-2 text-sm text-white/60">
                      {it.size && `Taille: ${it.size}`} {it.color && `Couleur: ${it.color}`}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQuantity(it.id, it.quantity - 1)} className="px-2 py-1 border border-gray-300 rounded text-sm">-</button>
                        <span className="px-3 py-1 bg-gray-100 text-black rounded min-w-[40px] text-center font-semibold">{it.quantity}</span>
                        <button onClick={() => updateQuantity(it.id, it.quantity + 1)} className="px-2 py-1 border border-gray-300 rounded text-sm">+</button>
                      </div>
                      <div className="text-sm font-semibold">{(it.price * it.quantity).toFixed(2)} €</div>
                    </div>
                  </div>
                )
              })}

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="font-bold text-lg">Total</div>
                <div className="text-xl font-bold text-accent">{total.toFixed(2)} €</div>
              </div>

              <div className="flex gap-3 mt-6 justify-center">
                <button onClick={clear} className="btn-muted">Vider le panier</button>
                <button onClick={validateCart} className="px-6 py-3 rounded-md border-2 border-accent bg-accent/10 text-accent font-semibold hover:bg-accent/20">
                  Valider le panier
                </button>
                <button onClick={orderOnWhatsApp} className="px-6 py-3 rounded-md bg-accent text-white hover:bg-pink-600 font-semibold">
                  Commander sur WhatsApp
                </button>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      ‹ Précédent
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
                      Suivant ›
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp Modal */}
      {whatsappModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Commander sur WhatsApp</h3>
            <p className="mb-4">Veuillez saisir votre numéro de téléphone pour que nous puissions vous contacter.</p>
            <input
              type="tel"
              placeholder="Votre numéro de téléphone"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setWhatsappModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={sendWhatsAppOrder}
                className="px-4 py-2 bg-accent text-white rounded hover:bg-pink-600"
              >
                Envoyer sur WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            {checkoutStep === 0 && (
              <>
                <h3 className="text-lg font-bold mb-4">Connexion</h3>
                <p className="mb-4">Vous devez vous connecter pour valider le panier.</p>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <button onClick={handleLogin} className="w-full px-4 py-2 border-2 border-accent bg-accent/10 text-accent font-semibold hover:bg-accent/20 rounded">
                    Se connecter
                  </button>
                  <div className="text-center text-gray-500">ou</div>
                  <button onClick={handleGoogleLogin} className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Logo Google" aria-hidden="false">
                      <path fill="#4285F4" d="M9 3.48c1.69 0 3.15.58 4.33 1.71l3.23-3.14C14.64.62 11.97 0 9 0 5.48 0 2.49 1.88 1.07 4.7l3.77 2.93C5.21 5.02 7.87 3.48 9 3.48z"/>
                      <path fill="#34A853" d="M17.64 9.2c0-.63-.06-1.25-.17-1.84H9v3.5h4.84c-.21 1.15-.83 2.13-1.78 2.8l2.73 2.11c1.6-1.49 2.55-3.64 2.55-6.57z"/>
                      <path fill="#FBBC05" d="M3.88 10.34A5.94 5.94 0 013 9c0-1.2.36-2.33.99-3.27L1.27 3.8C.44 4.95 0 6.45 0 8c0 1.55.44 3.04 1.27 4.2l2.61-1.86z"/>
                      <path fill="#EA4335" d="M9 18c2.46 0 4.53-.8 6.04-2.18l-2.74-2.11c-.75.5-1.71.79-2.71.79-2.13 0-3.9-1.44-4.53-3.36L1.07 14.54C2.49 17.32 5.48 18 9 18z"/>
                    </svg>
                    Se connecter avec Google
                  </button>
                </div>
                <button onClick={closeModal} className="w-full mt-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                  Annuler
                </button>
              </>
            )}
            {checkoutStep === 1 && (
              <>
                <h3 className="text-lg font-bold mb-4">Choisir un moyen de paiement</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handlePaymentMethod('wave')}
                    className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-left"
                    aria-label="Wave"
                  >
                    <span>Wave</span>
                  </button>

                  <button
                    onClick={() => handlePaymentMethod('orange')}
                    className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-left"
                    aria-label="Orange Money"
                  >
                    <span>Orange Money</span>
                  </button>

                  <button
                    onClick={() => handlePaymentMethod('card')}
                    className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-left"
                    aria-label="Carte bancaire"
                  >
                    <span>Carte bancaire</span>
                  </button>
                </div>
                <button onClick={() => setCheckoutStep(0)} className="w-full mt-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                  Retour
                </button>
              </>
            )}
            {checkoutStep === 2 && (
              <>
                <h3 className="text-lg font-bold mb-4">Détails de paiement</h3>
                {paymentMethod === 'wave' || paymentMethod === 'orange' ? (
                  <div className="space-y-4">
                    <input
                      type="tel"
                      placeholder="Numéro de téléphone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                      type="password"
                      placeholder="Code PIN"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                ) : paymentMethod === 'card' ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Numéro de carte"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Détails de paiement"
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                )}
                <button onClick={handlePaymentDetails} className="w-full mt-4 px-4 py-2 border-2 border-accent bg-accent/10 text-accent font-semibold hover:bg-accent/20 rounded">
                  Continuer
                </button>
                <button onClick={() => setCheckoutStep(1)} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                  Retour
                </button>
              </>
            )}
            {checkoutStep === 3 && (
              <>
                <h3 className="text-lg font-bold mb-4">Confirmer la commande</h3>
                <p className="mb-2">Total: {total.toFixed(2)} €</p>
                <p className="mb-4">Opérateur: {paymentMethod === 'wave' ? 'Wave' : paymentMethod === 'orange' ? 'Orange Money' : paymentMethod === 'card' ? 'Carte bancaire' : paymentMethod}</p>
                <button onClick={confirmOrder} className="w-full px-4 py-2 border-2 border-accent bg-accent/10 text-accent font-semibold hover:bg-accent/20 rounded">
                  Confirmer
                </button>
                <button onClick={() => setCheckoutStep(2)} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                  Retour
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
