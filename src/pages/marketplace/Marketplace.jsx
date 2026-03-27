import React, { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { avgRating, money } from '../../utils/format.js'
import { Card, CardHeader, CardBody, Input, Select, Button, Badge, Stars } from '../../components/ui.jsx'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons for Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom icons for different crop types
const createCropIcon = (cropType) => {
  const colors = {
    Vegetable: '#22c55e',
    Fruit: '#f97316',
    Crop: '#f59e0b',
    Other: '#6b7280'
  }
  const color = colors[cropType] || colors.Other
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    ">${cropType === 'Vegetable' ? '🥬' : cropType === 'Fruit' ? '🍎' : cropType === 'Crop' ? '🌾' : '📦'}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  })
}

// Nepal bounds for map
const NEPAL_BOUNDS = {
  center: [28.3949, 84.1240],
  zoom: 7,
  minZoom: 6,
  maxBounds: [[25.5, 79.5], [31.0, 89.0]]
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
  if (km < 1) return `${Math.round(km * 1000)} m`
  if (km < 10) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}

export default function Marketplace() {
  const { db } = useStore()
  const { user } = useAuth()

  const [q, setQ] = useState('')
  const [type, setType] = useState('all')
  const [loc, setLoc] = useState('all')
  const [minP, setMinP] = useState('')
  const [maxP, setMaxP] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [userLocation, setUserLocation] = useState(null)
  const [locationStatus, setLocationStatus] = useState('idle') // idle, loading, success, error
  const [maxDistance, setMaxDistance] = useState('') // km filter
  const [viewMode, setViewMode] = useState('grid') // grid or map

  // Get user's location
  useEffect(() => {
    // Check for saved location
    const savedLocation = localStorage.getItem('kisanSanjalUserLocation')
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation))
      setLocationStatus('success')
    }
  }, [])

  const requestLocation = () => {
    setLocationStatus('loading')
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(loc)
          setLocationStatus('success')
          localStorage.setItem('kisanSanjalUserLocation', JSON.stringify(loc))
        },
        (error) => {
          console.error('Location error:', error)
          setLocationStatus('error')
          // Default to Kathmandu if location access denied
          const defaultLoc = { lat: 27.7172, lng: 85.3240 }
          setUserLocation(defaultLoc)
          localStorage.setItem('kisanSanjalUserLocation', JSON.stringify(defaultLoc))
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    } else {
      setLocationStatus('error')
      // Default to Kathmandu
      setUserLocation({ lat: 27.7172, lng: 85.3240 })
    }
  }

  const locations = useMemo(() => {
    const set = new Set(db.listings.map(l => l.locationName).filter(Boolean))
    return ['all', ...Array.from(set).sort()]
  }, [db.listings])

  // Add distance to listings
  const listingsWithDistance = useMemo(() => {
    return db.listings.map(l => ({
      ...l,
      distance: userLocation && l.lat && l.lng
        ? calculateDistance(userLocation.lat, userLocation.lng, l.lat, l.lng)
        : null
    }))
  }, [db.listings, userLocation])

  const filtered = useMemo(() => {
    let result = listingsWithDistance
      .filter(l => l.active)
      .filter(l => (type === 'all' ? true : l.cropType === type))
      .filter(l => (loc === 'all' ? true : l.locationName === loc))
      .filter(l => {
        const s = `${l.title} ${l.cropType} ${l.locationName} ${l.description}`.toLowerCase()
        return s.includes(q.toLowerCase())
      })
      .filter(l => {
        const p = Number(l.pricePerUnit)
        const mn = minP === '' ? -Infinity : Number(minP)
        const mx = maxP === '' ? Infinity : Number(maxP)
        return p >= mn && p <= mx
      })

    // Filter by max distance
    if (maxDistance && userLocation) {
      const maxD = Number(maxDistance)
      result = result.filter(l => l.distance !== null && l.distance <= maxD)
    }

    // Sorting
    if (sortBy === 'nearest' && userLocation) {
      result.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.pricePerUnit - b.pricePerUnit)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.pricePerUnit - a.pricePerUnit)
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.createdAt - a.createdAt)
    }

    return result
  }, [listingsWithDistance, q, type, loc, minP, maxP, sortBy, userLocation, maxDistance])

  const cropTypes = ['all','Vegetable','Crop','Fruit','Other']

  return (
    <div className="space-y-5">
      {/* Location Banner */}
      {locationStatus !== 'success' && (
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📍</span>
            <div>
              <div className="font-bold">Enable Location for Better Experience</div>
              <div className="text-sm text-brand-100">See how far each listing is from you and find nearby farms.</div>
            </div>
          </div>
          <Button
            onClick={requestLocation}
            className="bg-white text-brand-600 hover:bg-brand-50"
            disabled={locationStatus === 'loading'}
          >
            {locationStatus === 'loading' ? 'Getting location...' : 'Enable Location'}
          </Button>
        </div>
      )}

      {locationStatus === 'success' && userLocation && (
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-700">
            <span className="text-lg">📍</span>
            <span className="text-sm">
              Your location: <span className="font-bold">
                {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E
              </span>
            </span>
          </div>
          <button
            onClick={requestLocation}
            className="text-sm text-brand-600 hover:text-brand-800 underline"
          >
            Update
          </button>
        </div>
      )}

      <Card>
        <CardHeader
          title="Marketplace"
          subtitle={`${filtered.length} listings from all over Nepal. Search by crop type, location, and price.`}
          right={
            user?.role === 'farmer'
              ? <Link to="/app/farmer/new"><Button>Create listing</Button></Link>
              : <Link to="/app/buyer/cart"><Button variant="ghost">🛒 Cart</Button></Link>
          }
        />
        <CardBody>
          <div className="grid md:grid-cols-6 gap-3">
            <Input label="Search" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Tomato, Mango, Ilam..." className="md:col-span-2" />
            <Select label="Crop Type" value={type} onChange={(e)=>setType(e.target.value)}>
              {cropTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
            <Select label="Location" value={loc} onChange={(e)=>setLoc(e.target.value)}>
              {locations.map(x => <option key={x} value={x}>{x}</option>)}
            </Select>
            <Select label="Sort By" value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="nearest" disabled={!userLocation}>Nearest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </Select>
            <Input
              label="Max Distance (km)"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              placeholder="e.g. 50"
              disabled={!userLocation}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <Input label="Min Price (Rs)" value={minP} onChange={(e)=>setMinP(e.target.value)} placeholder="0" />
            <Input label="Max Price (Rs)" value={maxP} onChange={(e)=>setMaxP(e.target.value)} placeholder="500" />
          </div>
        </CardBody>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-700">{db.listings.filter(l => l.cropType === 'Vegetable').length}</div>
          <div className="text-sm text-green-600">Vegetables</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-orange-700">{db.listings.filter(l => l.cropType === 'Fruit').length}</div>
          <div className="text-sm text-orange-600">Fruits</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-amber-700">{db.listings.filter(l => l.cropType === 'Crop').length}</div>
          <div className="text-sm text-amber-600">Crops & Grains</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-700">{locations.length - 1}</div>
          <div className="text-sm text-blue-600">Locations</div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${
            viewMode === 'grid'
              ? 'bg-brand-600 text-white'
              : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
          }`}
        >
          <span>📦</span> Grid View
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${
            viewMode === 'map'
              ? 'bg-brand-600 text-white'
              : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
          }`}
        >
          <span>🗺️</span> Map View
        </button>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <Card className="overflow-hidden">
          <CardHeader title="Listings Across Nepal" subtitle={`${filtered.length} listings shown on map`} />
          <div style={{ height: '500px', width: '100%' }}>
            <MapContainer
              center={NEPAL_BOUNDS.center}
              zoom={NEPAL_BOUNDS.zoom}
              minZoom={NEPAL_BOUNDS.minZoom}
              maxBounds={NEPAL_BOUNDS.maxBounds}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filtered.map(l => {
                if (!l.lat || !l.lng) return null
                const farmer = db.users.find(u => u.id === l.farmerId)
                return (
                  <Marker
                    key={l.id}
                    position={[l.lat, l.lng]}
                    icon={createCropIcon(l.cropType)}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <div className="font-bold text-base mb-1">{l.title}</div>
                        <div className="text-sm text-gray-600 mb-2">📍 {l.locationName}</div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            l.cropType === 'Vegetable' ? 'bg-green-100 text-green-700' :
                            l.cropType === 'Fruit' ? 'bg-orange-100 text-orange-700' :
                            l.cropType === 'Crop' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {l.cropType}
                          </span>
                          <span className="font-bold text-brand-700">{money(l.pricePerUnit)}/{l.unit}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">👨‍🌾 {farmer?.name || 'Unknown'}</div>
                        <Link
                          to={`/app/listing/${l.id}`}
                          className="block w-full text-center bg-brand-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-brand-700 transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
              {/* User location marker */}
              {userLocation && (
                <Marker
                  position={[userLocation.lat, userLocation.lng]}
                  icon={L.divIcon({
                    className: 'user-location-marker',
                    html: `<div style="
                      background-color: #3b82f6;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      border: 4px solid white;
                      box-shadow: 0 0 0 2px #3b82f6, 0 2px 6px rgba(0,0,0,0.3);
                    "></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                  })}
                >
                  <Popup>
                    <div className="font-bold">📍 Your Location</div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
          {/* Map Legend */}
          <div className="p-3 bg-gray-50 border-t flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-xs">🥬</div>
              <span className="text-sm">Vegetables</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-xs">🍎</div>
              <span className="text-sm">Fruits</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-xs">🌾</div>
              <span className="text-sm">Crops & Grains</span>
            </div>
            {userLocation && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>
                <span className="text-sm">Your Location</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(l => {
          const farmer = db.users.find(u => u.id === l.farmerId)
          const reviews = db.reviews.filter(r => r.listingId === l.id)
          const rating = avgRating(reviews)

          return (
            <Link key={l.id} to={`/app/listing/${l.id}`} className="group">
              <Card className="overflow-hidden hover:shadow-md transition">
                <div className="h-40 bg-brand-100 relative">
                  <img src={l.images?.[0] || '/src/assets/Farm.jpg'} alt={l.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
                  {/* Distance Badge */}
                  {l.distance !== null && (
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-brand-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <span>📍</span>
                      {formatDistance(l.distance)}
                    </div>
                  )}
                  {/* Crop Type Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                    l.cropType === 'Vegetable' ? 'bg-green-100 text-green-700' :
                    l.cropType === 'Fruit' ? 'bg-orange-100 text-orange-700' :
                    l.cropType === 'Crop' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {l.cropType}
                  </div>
                </div>
                <CardBody className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-extrabold text-lg leading-tight">{l.title}</div>
                      <div className="text-sm text-brand-700 flex items-center gap-1">
                        <span>📍</span> {l.locationName}
                      </div>
                    </div>
                    <Badge className={l.qualityGrade === 'A' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                      Grade {l.qualityGrade || 'A'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="font-extrabold text-brand-800 text-lg">{money(l.pricePerUnit)}<span className="text-sm font-normal">/{l.unit}</span></div>
                    <div className="text-sm text-brand-700 bg-brand-50 px-2 py-0.5 rounded">Stock: <span className="font-bold">{l.quantity}</span></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Stars value={rating} />
                    <div className="text-xs text-brand-600 truncate max-w-[120px]">👨‍🌾 {farmer?.name || 'Unknown'}</div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          )
        })}

        {!filtered.length ? (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardBody className="text-center py-10">
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-brand-700 font-bold">No listings found</div>
              <div className="text-brand-600 text-sm">Try different filters or search terms.</div>
            </CardBody>
          </Card>
        ) : null}
      </div>
      )}
    </div>
  )
}
