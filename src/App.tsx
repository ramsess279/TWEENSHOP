import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductPage from './pages/Product'
import Cart from './pages/Cart'
import Admin from './pages/Admin'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import AdminSettings from './pages/AdminSettings'
import Login from './pages/Login'
import Header from './components/Header'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={
            <div className="min-h-screen flex flex-col">
              <div className="flex-1 w-full p-4">
                <Products />
              </div>
            </div>
          } />
          <Route path="/product/:slug" element={
            <div className="min-h-screen flex flex-col pt-20">
              <div className="flex-1 container mx-auto p-4">
                <ProductPage />
              </div>
            </div>
          } />
          <Route path="/cart" element={
            <div className="min-h-screen flex flex-col pt-20">
              <div className="flex-1 container mx-auto p-4">
                <Cart />
              </div>
            </div>
          } />
          <Route path="/admin" element={
            <div className="min-h-screen flex flex-col">
              <div className="flex-1">
                <Admin />
              </div>
            </div>
          } />
          <Route path="/admin/products" element={
            <div className="min-h-screen flex flex-col">
              <div className="flex-1">
                <AdminProducts />
              </div>
            </div>
          } />
          <Route path="/admin/orders" element={
            <div className="min-h-screen flex flex-col">
              <div className="flex-1">
                <AdminOrders />
              </div>
            </div>
          } />
          <Route path="/admin/settings" element={
            <div className="min-h-screen flex flex-col">
              <div className="flex-1">
                <AdminSettings />
              </div>
            </div>
          } />
          <Route path="/login" element={
            <div className="min-h-screen flex flex-col">
              <Login />
            </div>
          } />
          <Route path="*" element={<div>404 - Page introuvable</div>} />
        </Routes>
      </main>
    </div>
  )
}
