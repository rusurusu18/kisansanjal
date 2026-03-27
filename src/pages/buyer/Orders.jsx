import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Input, TextArea, Stars } from '../../components/ui.jsx'
import { money } from '../../utils/format.js'

const ORDER_STATUSES = ['Confirmed', 'In Transit', 'Delivered']

function OrderTimeline({ status }) {
  const currentIdx = ORDER_STATUSES.indexOf(status)
  
  return (
    <div className="flex items-center gap-1 mt-3">
      {ORDER_STATUSES.map((s, idx) => {
        const isCompleted = idx <= currentIdx
        const isCurrent = idx === currentIdx
        
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                isCompleted 
                  ? 'bg-brand-600 text-white' 
                  : 'bg-brand-100 text-brand-400'
              } ${isCurrent ? 'ring-2 ring-brand-300' : ''}`}>
                {isCompleted ? '✓' : idx + 1}
              </div>
              <div className={`text-xs mt-1 ${isCompleted ? 'text-brand-700 font-bold' : 'text-brand-400'}`}>
                {s}
              </div>
            </div>
            {idx < ORDER_STATUSES.length - 1 && (
              <div className={`flex-1 h-1 rounded ${
                idx < currentIdx ? 'bg-brand-500' : 'bg-brand-100'
              }`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function ReviewForm({ order, onSubmit }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ rating: Number(rating), comment })
    setRating(5)
    setComment('')
  }
  
  return (
    <form onSubmit={handleSubmit} className="border-t border-brand-100 pt-3 mt-3 space-y-3">
      <div className="text-sm font-bold text-brand-800">Rate this order</div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-brand-700 mb-1 block">Rating (1-5 stars)</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <Input 
          label="Comment (optional)" 
          value={comment} 
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
        />
      </div>
      <Button type="submit" variant="ghost">Submit Review</Button>
    </form>
  )
}

export default function Orders() {
  const { user } = useAuth()
  const { db, addReview } = useStore()

  const myOrders = useMemo(() => 
    db.orders
      .filter(o => o.buyerId === user.id)
      .sort((a, b) => b.createdAt - a.createdAt)
  , [db.orders, user.id])

  const getExistingReview = (listingId) => {
    return db.reviews.find(r => r.listingId === listingId && r.buyerId === user.id)
  }

  const handleReview = (order) => ({ rating, comment }) => {
    addReview({
      listingId: order.listingId,
      farmerId: order.farmerId,
      buyerId: user.id,
      rating,
      comment,
    })
  }

  return (
    <Card>
      <CardHeader 
        title="My Orders" 
        subtitle="Track your orders and leave reviews after delivery" 
        right={<Link to="/app"><Button variant="ghost">Back</Button></Link>} 
      />
      <CardBody className="space-y-4">
        {myOrders.map(o => {
          const listing = db.listings.find(l => l.id === o.listingId)
          const farmer = db.users.find(u => u.id === o.farmerId)
          const total = o.qty * Number(o.pricePerUnit)
          const existingReview = getExistingReview(o.listingId)
          const canReview = o.status === 'Delivered' && !existingReview

          return (
            <div key={o.id} className="border border-brand-100 rounded-2xl p-4 bg-white">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <div className="font-extrabold text-lg">{listing?.title || 'Product'}</div>
                    <Badge tone={o.payment?.paid ? 'green' : 'yellow'}>
                      {o.payment?.paid ? 'Paid' : 'Unpaid'}
                    </Badge>
                  </div>
                  <div className="text-sm text-brand-700 mt-1">
                    Farmer: <span className="font-bold">{farmer?.name || '—'}</span> • 
                    Qty: {o.qty} {o.unit}
                  </div>
                  <div className="text-sm font-bold text-brand-800 mt-1">
                    Total: {money(total)}
                  </div>
                  
                  {/* Order Timeline */}
                  <OrderTimeline status={o.status} />
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-brand-600">
                    {new Date(o.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <Link to={`/app/listing/${o.listingId}`}>
                    <Button variant="ghost">View Product</Button>
                  </Link>
                </div>
              </div>
              
              {/* Existing Review */}
              {existingReview && (
                <div className="mt-3 pt-3 border-t border-brand-100">
                  <div className="text-sm text-brand-700 mb-1">Your review:</div>
                  <div className="flex items-center gap-2">
                    <Stars value={existingReview.rating} />
                    <span className="text-sm text-brand-800">{existingReview.comment}</span>
                  </div>
                </div>
              )}
              
              {/* Review Form */}
              {canReview && (
                <ReviewForm order={o} onSubmit={handleReview(o)} />
              )}
            </div>
          )
        })}

        {!myOrders.length && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📦</div>
            <div className="font-bold text-brand-800">No orders yet</div>
            <div className="text-sm text-brand-700 mt-1">Browse the marketplace to start shopping</div>
            <Link to="/app" className="mt-4 inline-block">
              <Button>Go to Marketplace</Button>
            </Link>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
