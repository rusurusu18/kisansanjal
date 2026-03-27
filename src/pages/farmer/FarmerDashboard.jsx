import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { money, avgRating } from '../../utils/format.js'
import { Card, CardHeader, CardBody, Button, Badge, Stars } from '../../components/ui.jsx'
import { ConfirmModal } from '../../components/Modal.jsx'

export default function FarmerDashboard() {
  const { user } = useAuth()
  const { db, updateOrderStatus, updateListing } = useStore()
  const [deleteModal, setDeleteModal] = useState({ open: false, listingId: null })

  const myListings = useMemo(() => db.listings.filter(l => l.farmerId === user.id), [db.listings, user.id])
  const myOrders = useMemo(() => db.orders.filter(o => o.farmerId === user.id), [db.orders, user.id])
  const myReviews = useMemo(() => db.reviews.filter(r => r.farmerId === user.id), [db.reviews, user.id])

  // Calculate farmer rating summary
  const ratingsSummary = useMemo(() => {
    if (!myReviews.length) return { avg: 0, total: 0, distribution: {} }
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    myReviews.forEach(r => {
      const rating = Math.round(r.rating)
      if (distribution[rating] !== undefined) {
        distribution[rating]++
      }
    })
    
    return {
      avg: avgRating(myReviews),
      total: myReviews.length,
      distribution,
    }
  }, [myReviews])

  // Stats
  const stats = useMemo(() => ({
    activeListings: myListings.filter(l => l.active).length,
    totalListings: myListings.length,
    pendingOrders: myOrders.filter(o => o.status !== 'Delivered').length,
    deliveredOrders: myOrders.filter(o => o.status === 'Delivered').length,
    totalRevenue: myOrders.reduce((sum, o) => sum + (o.qty * o.pricePerUnit), 0),
  }), [myListings, myOrders])

  const handleDeleteListing = () => {
    if (deleteModal.listingId) {
      updateListing(deleteModal.listingId, { active: false })
    }
    setDeleteModal({ open: false, listingId: null })
  }

  return (
    <div className="space-y-5">
      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-extrabold text-brand-700">{stats.activeListings}</div>
            <div className="text-sm text-brand-700 mt-1">Active Listings</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-extrabold text-brand-700">{stats.pendingOrders}</div>
            <div className="text-sm text-brand-700 mt-1">Pending Orders</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-extrabold text-brand-700">{stats.deliveredOrders}</div>
            <div className="text-sm text-brand-700 mt-1">Delivered Orders</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-extrabold text-brand-700">{money(stats.totalRevenue)}</div>
            <div className="text-sm text-brand-700 mt-1">Total Revenue</div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Listings and Orders - 2 columns */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader
              title="My Listings"
              subtitle="Manage your crop listings"
              right={<Link to="/app/farmer/new"><Button>Create Listing</Button></Link>}
            />
            <CardBody className="space-y-3">
              {myListings.slice(0, 5).map(l => {
                const reviews = db.reviews.filter(r => r.listingId === l.id)
                const rating = avgRating(reviews)
                return (
                  <div key={l.id} className="border border-brand-100 rounded-xl p-4 bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-extrabold">{l.title}</div>
                          <Badge tone={l.active ? 'green' : 'gray'}>{l.active ? 'Active' : 'Hidden'}</Badge>
                        </div>
                        <div className="text-sm text-brand-700 mt-1">
                          {l.cropType} • {l.locationName} • {money(l.pricePerUnit)}/{l.unit}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <Stars value={rating} />
                          <span className="text-xs text-brand-600">{reviews.length} reviews</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Link to={`/app/listing/${l.id}`}><Button variant="ghost">View</Button></Link>
                          <Link to={`/app/farmer/edit/${l.id}`}><Button variant="ghost">Edit</Button></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {!myListings.length && (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">🌱</div>
                  <div className="text-sm text-brand-700">No listings yet. Create your first listing!</div>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Orders"
              subtitle="Update order status for your customers"
            />
            <CardBody className="space-y-3">
              {myOrders.slice(0, 5).map(o => {
                const listing = db.listings.find(l => l.id === o.listingId)
                const buyer = db.users.find(u => u.id === o.buyerId)
                return (
                  <div key={o.id} className="border border-brand-100 rounded-xl p-4 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-extrabold">{listing?.title || 'Product'}</div>
                        <div className="text-sm text-brand-700">
                          Buyer: <span className="font-bold">{buyer?.name || '—'}</span> • 
                          Qty: {o.qty} {o.unit} • 
                          Total: {money(o.qty * o.pricePerUnit)}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge tone={o.status === 'Delivered' ? 'green' : o.status === 'In Transit' ? 'yellow' : 'gray'}>
                            {o.status}
                          </Badge>
                          <Badge tone={o.payment?.paid ? 'green' : 'red'}>
                            {o.payment?.paid ? 'Paid' : 'Unpaid'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {o.status !== 'Confirmed' && (
                          <Button variant="ghost" onClick={() => updateOrderStatus(o.id, 'Confirmed')}>Confirmed</Button>
                        )}
                        {o.status !== 'In Transit' && (
                          <Button variant="ghost" onClick={() => updateOrderStatus(o.id, 'In Transit')}>In Transit</Button>
                        )}
                        {o.status !== 'Delivered' && (
                          <Button onClick={() => updateOrderStatus(o.id, 'Delivered')}>Delivered</Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {!myOrders.length && (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-sm text-brand-700">No orders yet. Share your listings to get customers!</div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Ratings Summary - 1 column */}
        <div className="space-y-5">
          <Card>
            <CardHeader
              title="Your Ratings"
              subtitle="Customer feedback summary"
            />
            <CardBody>
              {myReviews.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-brand-700">{ratingsSummary.avg}</div>
                    <Stars value={ratingsSummary.avg} />
                    <div className="text-sm text-brand-600 mt-1">{ratingsSummary.total} reviews</div>
                  </div>
                  
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = ratingsSummary.distribution[star] || 0
                      const percent = ratingsSummary.total > 0 ? (count / ratingsSummary.total) * 100 : 0
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-sm w-6">{star}★</span>
                          <div className="flex-1 h-2 bg-brand-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-500 rounded-full transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-xs text-brand-600 w-8">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-sm text-brand-700">No reviews yet</div>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Recent Reviews" />
            <CardBody className="space-y-3">
              {myReviews.slice(0, 5).map(r => {
                const buyer = db.users.find(u => u.id === r.buyerId)
                const listing = db.listings.find(l => l.id === r.listingId)
                return (
                  <div key={r.id} className="border border-brand-100 rounded-xl p-3 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold">{buyer?.name || 'Buyer'}</span>
                      <Stars value={r.rating} />
                    </div>
                    <div className="text-xs text-brand-600 mb-1">{listing?.title || 'Product'}</div>
                    <div className="text-sm text-brand-800">{r.comment}</div>
                  </div>
                )
              })}
              {!myReviews.length && (
                <div className="text-sm text-brand-700">No reviews yet.</div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <ConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, listingId: null })}
        onConfirm={handleDeleteListing}
        title="Hide Listing"
        message="This will hide the listing from the marketplace. You can re-enable it later from the edit page."
        confirmText="Hide"
        danger
      />
    </div>
  )
}
