import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { Card, CardHeader, CardBody, Button, Badge } from '../../components/ui.jsx'

export default function BuyerDashboard() {
  const { user } = useAuth()
  const { db } = useStore()
  const myOrders = useMemo(() => db.orders.filter(o => o.buyerId === user.id), [db.orders, user.id])

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader
          title="Buyer Dashboard"
          subtitle="Track your orders and manage payments."
          right={
            <div className="flex gap-2">
              <Link to="/app/buyer/cart"><Button variant="ghost">Cart</Button></Link>
              <Link to="/app/buyer/orders"><Button>My Orders</Button></Link>
            </div>
          }
        />
        <CardBody>
          <div className="text-sm text-brand-700">Recent orders</div>
          <div className="mt-3 space-y-3">
            {myOrders.slice(0, 5).map(o => {
              const listing = db.listings.find(l => l.id === o.listingId)
              return (
                <div key={o.id} className="border border-brand-100 rounded-2xl p-4 bg-white flex items-center justify-between">
                  <div>
                    <div className="font-extrabold">{listing?.title || 'Listing'}</div>
                    <div className="text-sm text-brand-700">Status: <span className="font-bold">{o.status}</span></div>
                  </div>
                  <Badge tone={o.payment?.paid ? 'green' : 'yellow'}>{o.payment?.paid ? 'Paid' : 'Unpaid'}</Badge>
                </div>
              )
            })}
            {!myOrders.length ? <div className="text-sm text-brand-700">No orders yet. Browse the marketplace to buy.</div> : null}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
