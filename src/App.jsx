import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import Marketplace from './pages/marketplace/Marketplace.jsx'
import ProductDetail from './pages/marketplace/ProductDetail.jsx'
import PriceTrends from './pages/dashboard/PriceTrends.jsx'
import Resources from './pages/resources/Resources.jsx'
import Chat from './pages/chat/Chat.jsx'
import FarmerDashboard from './pages/farmer/FarmerDashboard.jsx'
import NewListing from './pages/farmer/NewListing.jsx'
import EditListing from './pages/farmer/EditListing.jsx'
import BuyerDashboard from './pages/buyer/BuyerDashboard.jsx'
import Cart from './pages/buyer/Cart.jsx'
import Checkout from './pages/buyer/Checkout.jsx'
import Orders from './pages/buyer/Orders.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import VerifyUsers from './pages/admin/VerifyUsers.jsx'
import ManageListings from './pages/admin/ManageListings.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Marketplace />} />
          <Route path="listing/:id" element={<ProductDetail />} />
          <Route path="trends" element={<PriceTrends />} />
          <Route path="resources" element={<Resources />} />
          <Route path="chat" element={<Chat />} />

          <Route element={<ProtectedRoute allow={['farmer']} />}>
            <Route path="farmer" element={<FarmerDashboard />} />
            <Route path="farmer/new" element={<NewListing />} />
            <Route path="farmer/edit/:id" element={<EditListing />} />
          </Route>

          <Route element={<ProtectedRoute allow={['buyer']} />}>
            <Route path="buyer" element={<BuyerDashboard />} />
            <Route path="buyer/cart" element={<Cart />} />
            <Route path="buyer/checkout" element={<Checkout />} />
            <Route path="buyer/orders" element={<Orders />} />
          </Route>

          <Route element={<ProtectedRoute allow={['admin']} />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/verify" element={<VerifyUsers />} />
            <Route path="admin/listings" element={<ManageListings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
