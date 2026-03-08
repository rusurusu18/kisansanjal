import React, { createContext, useContext, useMemo, useState } from 'react'
import { loadDB, saveDB, resetDB } from '../data/storage.js'
import { uid } from '../utils/format.js'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [db, setDb] = useState(() => loadDB())

  const refresh = () => setDb(loadDB())

  const update = (next) => {
    saveDB(next)
    setDb(next)
  }

  // LISTINGS
  const createListing = (listing) => {
    const next = { ...db, listings: [{ ...listing, id: uid('l'), createdAt: Date.now(), active: true }, ...db.listings] }
    update(next)
  }

  const updateListing = (id, patch) => {
    const next = {
      ...db,
      listings: db.listings.map(l => (l.id === id ? { ...l, ...patch } : l)),
    }
    update(next)
  }

  // ORDERS
  const placeOrder = ({ listingId, buyerId, farmerId, qty, pricePerUnit, unit }) => {
    const order = {
      id: uid('ord'),
      listingId,
      buyerId,
      farmerId,
      qty,
      pricePerUnit,
      unit,
      status: 'Confirmed', // Confirmed -> In Transit -> Delivered
      createdAt: Date.now(),
      payment: { method: 'digital', paid: false },
    }
    const next = { ...db, orders: [order, ...db.orders] }
    update(next)
    return order
  }

  const updateOrderStatus = (orderId, status) => {
    const next = { ...db, orders: db.orders.map(o => (o.id === orderId ? { ...o, status } : o)) }
    update(next)
  }

  const markPaid = (orderId) => {
    const next = { ...db, orders: db.orders.map(o => (o.id === orderId ? { ...o, payment: { ...o.payment, paid: true } } : o)) }
    update(next)
  }

  // REVIEWS
  const addReview = ({ listingId, farmerId, buyerId, rating, comment }) => {
    const review = { id: uid('r'), listingId, farmerId, buyerId, rating, comment, createdAt: Date.now() }
    const next = { ...db, reviews: [review, ...db.reviews] }
    update(next)
  }

  // CHAT
  const sendMessage = ({ threadId, fromId, toId, text }) => {
    const msg = { id: uid('m'), threadId, fromId, toId, text, createdAt: Date.now() }
    const next = { ...db, messages: [...db.messages, msg] }
    update(next)
    return msg
  }

  // USERS (admin verify)
  const setUserVerified = (userId, verified) => {
    const next = { ...db, users: db.users.map(u => (u.id === userId ? { ...u, verified } : u)) }
    update(next)
  }

  const hardReset = () => {
    resetDB()
    setDb(loadDB())
  }

  const value = useMemo(() => ({
    db,
    refresh,
    createListing,
    updateListing,
    placeOrder,
    updateOrderStatus,
    markPaid,
    addReview,
    sendMessage,
    setUserVerified,
    hardReset,
  }), [db])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}
