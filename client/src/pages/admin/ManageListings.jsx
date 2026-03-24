import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext.jsx'
import { Card, CardHeader, CardBody, Button, Badge } from '../../components/ui.jsx'

export default function ManageListings() {
  const { db, updateListing } = useStore()
  const listings = useMemo(() => db.listings, [db.listings])

  return (
    <Card>
      <CardHeader title="Manage Listings" subtitle="Enable/disable crop listings for moderation." right={<Link to="/app/admin"><Button variant="ghost">Back</Button></Link>} />
      <CardBody className="space-y-3">
        {listings.map(l => {
          const farmer = db.users.find(u => u.id === l.farmerId)
          return (
            <div key={l.id} className="border border-brand-100 rounded-2xl p-4 bg-white flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-extrabold">{l.title}</div>
                <div className="text-sm text-brand-700">{l.cropType} • {l.locationName} • Farmer: {farmer?.name || '—'}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={l.active ? 'green' : 'gray'}>{l.active ? 'Active' : 'Hidden'}</Badge>
                <Link to={`/app/listing/${l.id}`}><Button variant="ghost">View</Button></Link>
                <Button variant="ghost" onClick={()=>updateListing(l.id, { active: !l.active })}>{l.active ? 'Hide' : 'Enable'}</Button>
              </div>
            </div>
          )
        })}
      </CardBody>
    </Card>
  )
}
