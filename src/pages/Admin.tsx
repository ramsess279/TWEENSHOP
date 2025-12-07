import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../services/data'
import { getAllProducts } from '../services/data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

type OrderItem = { productId: string; title: string; price: number; quantity: number }
type Order = { id: string; items: OrderItem[]; total: number; date: string; status?: string }

const Admin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [chartPeriod, setChartPeriod] = useState<'7d' | '30d' | 'all'>('7d')
  const [products, setProducts] = useState<Product[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    // Check if admin
    const userRole = localStorage.getItem('userRole')
    if (userRole !== 'admin') {
      navigate('/')
      return
    }
  }, [navigate])

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders')
    if (storedOrders) setOrders(JSON.parse(storedOrders))
  }, [])

  // Derived stats
  const totalProducts = products.length
  const totalOrders = orders.filter(o => !o.status || o.status === 'pending').length
  const totalRevenue = useMemo(() => orders.filter(o => o.status === 'completed' || o.status === 'validée').reduce((s, o) => s + (Number(o.total) || 0), 0), [orders])
  const lowStockThreshold = 5
  const lowStockProducts = products.filter((p) => (p as Product).stock <= lowStockThreshold).length

  // Simulated data for charts
  const lowStockData = products
    .filter((p) => (p as Product).stock <= lowStockThreshold)
    .map((p) => ({ name: p.title, stock: p.stock }))

  const topProductsData = useMemo(() => {
    const counts: Record<string, number> = {}
    orders.forEach((o) => {
      o.items.forEach((it) => {
        counts[it.productId] = (counts[it.productId] || 0) + (it.quantity || 0)
      })
    })
    const arr = Object.entries(counts).map(([productId, sales]) => {
      const prod = products.find((p) => p.id === productId)
      return { name: prod?.title ?? productId, sales }
    })
    arr.sort((a, b) => b.sales - a.sales)
    return arr.slice(0, 6)
  }, [orders, products])

  const reviewsData = [
    { name: 'Positifs', value: 85, color: '#F472B6' },
    { name: 'Négatifs', value: 15, color: '#D1D5DB' },
  ]

  const last7DaysOrders = useMemo(() => {
    const days = 7
    const result: { date: string; count: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const count = orders.filter((o) => o.date?.slice(0, 10) === key).length
      result.push({ date: key, count })
    }
    return result
  }, [orders])

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders)
    localStorage.setItem('orders', JSON.stringify(newOrders))
  }

  const logout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    navigate('/')
  }

  useEffect(() => {
    let mounted = true
    getAllProducts().then((res) => {
      if (mounted) setProducts(res)
    })
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen">
      <div className="pt-16">
        <section className="w-[90%] mx-auto">
          <div className="w-full py-6 md:py-8">
            <div className="flex items-center justify-between mb-8">
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="card p-4">
                <div className="text-sm text-gray-500">Produits</div>
                <div className="text-2xl font-bold">{totalProducts}</div>
              </div>
              <div className="card p-4">
                <div className="text-sm text-gray-500">Commandes en attente</div>
                <div className="text-2xl font-bold">{totalOrders}</div>
              </div>
              <div className="card p-4">
                <div className="text-sm text-gray-500">Chiffre d'affaires</div>
                <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} €</div>
              </div>
              <div className="card p-4">
                <div className="text-sm text-gray-500">Produits en stock faible (&le; {lowStockThreshold})</div>
                <div className="text-2xl font-bold">{lowStockProducts}</div>
              </div>
            </div>


            {/* Additional Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="card p-4">
                <h2 className="text-lg font-semibold mb-4">Produits en rupture de stock</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={lowStockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="stock" fill="#D1D5DB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-4">
                <h2 className="text-lg font-semibold mb-4">Produits les plus vendus</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topProductsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#F472B6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-4">
                <h2 className="text-lg font-semibold mb-4">Avis clients</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={reviewsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reviewsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts & lists */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Evolution des commandes (7 derniers jours)</h2>
              </div>
              <div className="w-full h-40 flex items-end gap-2">
                {last7DaysOrders.map((d) => {
                  const max = Math.max(...last7DaysOrders.map((x) => x.count), 1)
                  const height = Math.round((d.count / max) * 100)
                  return (
                    <div key={d.date} className="flex-1 h-full flex flex-col items-center justify-end">
                      <div className="w-full bg-accent rounded-t" style={{ height: `${height}%` }} title={`${d.date}: ${d.count} commandes`} />
                      <div className="text-xs mt-2 text-gray-500">{d.date.slice(5)}</div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Dernières commandes</h3>
                <div className="space-y-2">
                  {orders.length === 0 ? (
                    <div className="text-sm text-gray-500">Aucune commande pour le moment.</div>
                  ) : (
                    orders.slice().reverse().slice(0, 5).map((o) => (
                      <div key={o.id} className="flex items-center justify-between p-2 border border-gray-100 rounded">
                        <div className="text-sm">{o.id} — {new Date(o.date).toLocaleString()}</div>
                        <div className="text-sm font-semibold">{o.total.toFixed(2)} €</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}

export default Admin