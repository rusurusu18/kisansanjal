import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { avgRating, money } from '../../utils/format.js'
import { Card, CardHeader, CardBody, Button, Badge, Input, Stars } from '../../components/ui.jsx'

const CART_KEY = 'kisanSanjalCart_v1'
function loadCart() {
  const raw = localStorage.getItem(CART_KEY)
  return raw ? JSON.parse(raw) : []
}
function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

function mapEmbedUrl(lat, lng) {
  if (lat == null || lng == null) return null
  const q = `${lat},${lng}`
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=14&output=embed`
}

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Format distance for display
const formatDistance = (km) => {
  if (km < 1) return `${Math.round(km * 1000)} m away`
  if (km < 10) return `${km.toFixed(1)} km away`
  return `${Math.round(km)} km away`
}

export default function ProductDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { db, placeOrder, addReview } = useStore()
  const { user } = useAuth()

  const listing = db.listings.find(l => l.id === id)
  const farmer = db.users.find(u => u.id === listing?.farmerId)
  const reviews = db.reviews.filter(r => r.listingId === id)
  const rating = avgRating(reviews)

  const [qty, setQty] = useState(1)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [userLocation, setUserLocation] = useState(null)

  // Load user location
  useEffect(() => {
    const savedLocation = localStorage.getItem('kisanSanjalUserLocation')
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation))
    }
  }, [])

  // Calculate distance
  const distance = useMemo(() => {
    if (userLocation && listing?.lat && listing?.lng) {
      return calculateDistance(userLocation.lat, userLocation.lng, listing.lat, listing.lng)
    }
    return null
  }, [userLocation, listing?.lat, listing?.lng])

  const canBuy = user?.role === 'buyer'
  const canEdit = user?.role === 'farmer' && user?.id === listing?.farmerId

  const embed = useMemo(() => mapEmbedUrl(listing?.lat, listing?.lng), [listing?.lat, listing?.lng])

  if (!listing) {
    return (
      <Card>
        <CardBody>Listing not found. <Link to="/app" className="text-brand-800 font-bold">Go back</Link></CardBody>
      </Card>
    )
  }

    const addToCart = () => {
    if (!canBuy) return
    const qn = Math.max(1, Math.min(Number(qty), Number(listing.quantity)))
    const cart = loadCart()
    const existing = cart.find(i => i.listingId === listing.id)
    const next = existing
      ? cart.map(i => i.listingId === listing.id ? { ...i, qty: qn } : i)
      : [...cart, { listingId: listing.id, qty: qn }]
    saveCart(next)
    nav('/app/buyer/cart')
  }

const onPlaceOrder = () => {
    if (!canBuy) return
    const qn = Math.max(1, Math.min(Number(qty), Number(listing.quantity)))
    placeOrder({
      listingId: listing.id,
      buyerId: user.id,
      farmerId: listing.farmerId,
      qty: qn,
      pricePerUnit: listing.pricePerUnit,
      unit: listing.unit,
    })
    nav('/app/buyer/orders')
  }

  const onReview = (e) => {
    e.preventDefault()
    if (!canBuy) return
    addReview({ listingId: listing.id, farmerId: listing.farmerId, buyerId: user.id, rating: Number(reviewRating), comment: reviewText })
    setReviewText('')
    setReviewRating(5)
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader
          title={listing.title}
          subtitle={
            <span>
              {listing.cropType} • {listing.locationName}
              {distance !== null && <span className="text-brand-600"> • 📍 {formatDistance(distance)}</span>}
              {listing.harvestDate && <span> • Harvest: {listing.harvestDate}</span>}
            </span>
          }
          right={
            <div className="flex items-center gap-2">
              <Badge>{listing.qualityGrade || 'A'}</Badge>
              {canEdit ? <Link to={`/app/farmer/edit/${listing.id}`}><Button variant="ghost">Edit</Button></Link> : null}
              <Link to="/app"><Button variant="ghost">Back</Button></Link>
            </div>
          }
        />
        <CardBody className="grid lg:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden border border-brand-100">
              <img src={listing.images?.[0] || '/src/assets/Farm.jpg'} alt={listing.title} className="w-full h-72 object-cover" />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-2xl font-extrabold text-brand-800">{money(listing.pricePerUnit)} / {listing.unit}</div>
              <div className="text-sm text-brand-700">Available: <span className="font-bold">{listing.quantity}</span></div>
            </div>

            <div className="flex items-center justify-between">
              <Stars value={rating} />
              <div className="text-sm text-brand-700">Farmer: <span className="font-bold">{farmer?.name || 'Unknown'}</span></div>
            </div>

            <p className="text-sm text-brand-800">{listing.description}</p>

            {canBuy ? (
              <div className="grid sm:grid-cols-3 gap-3 items-end">
                <Input label="Quantity" type="number" min={1} max={listing.quantity} value={qty} onChange={(e)=>setQty(e.target.value)} />
                <div className="sm:col-span-2">
                  <div className="grid sm:grid-cols-2 gap-2">
                    <Button className="w-full" onClick={onPlaceOrder}>Place Order</Button>
                    <Button className="w-full" variant="ghost" onClick={addToCart}>Add to Cart</Button>
                  </div>
                  <div className="text-xs text-brand-700 mt-2">Order status flow: Confirmed → In Transit → Delivered.</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-brand-700 bg-brand-50 border border-brand-100 rounded-xl p-3">
                Login as a Buyer to place orders and pay digitally (COD not supported).
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader title="Pickup / Store Location" subtitle="View the store/branch location on map." />
              <CardBody>
                {embed ? (
                  <div className="rounded-2xl overflow-hidden border border-brand-100">
                    <iframe title="map" src={embed} width="100%" height="240" loading="lazy" />
                  </div>
                ) : (
                  <div className="text-sm text-brand-700">No location coordinates provided.</div>
                )}
                <div className="mt-3 text-sm text-brand-700 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    Location: <span className="font-bold">{listing.locationName}</span>
                  </div>
                  {distance !== null && (
                    <div className="bg-brand-100 text-brand-800 px-3 py-1 rounded-full text-sm font-semibold">
                      📍 {formatDistance(distance)}
                    </div>
                  )}
                </div>
                {!userLocation && (
                  <div className="mt-3 text-xs text-brand-600 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                    💡 Enable location in Marketplace to see how far this product is from you.
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Reviews" subtitle="What buyers say about this product / farmer." right={<Stars value={rating} />} />
              <CardBody className="space-y-3">
                {reviews.slice(0, 6).map(r => {
                  const buyer = db.users.find(u => u.id === r.buyerId)
                  return (
                    <div key={r.id} className="border border-brand-100 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold">{buyer?.name || 'Buyer'}</div>
                        <div className="text-xs text-brand-700">Rating: <span className="font-bold">{r.rating}</span>/5</div>
                      </div>
                      <div className="text-sm text-brand-800 mt-1">{r.comment}</div>
                    </div>
                  )
                })}
                {!reviews.length ? <div className="text-sm text-brand-700">No reviews yet.</div> : null}

                {canBuy ? (
                  <form onSubmit={onReview} className="border-t border-brand-100 pt-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input label="Rating (1-5)" type="number" min={1} max={5} value={reviewRating} onChange={(e)=>setReviewRating(e.target.value)} />
                      <Input label="Comment" value={reviewText} onChange={(e)=>setReviewText(e.target.value)} placeholder="Write a short review..." />
                    </div>
                    <Button type="submit" variant="ghost">Submit review</Button>
                  </form>
                ) : null}
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
