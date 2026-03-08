import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardBody, Button, Badge } from '../../components/ui.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { ConfirmModal } from '../../components/Modal.jsx'
import { money } from '../../utils/format.js'

export default function AdminDashboard() {
  const { db, hardReset } = useStore()
  const [showResetModal, setShowResetModal] = useState(false)

  const stats = useMemo(() => {
    const farmers = db.users.filter(u => u.role === 'farmer')
    const buyers = db.users.filter(u => u.role === 'buyer')
    const pendingUsers = db.users.filter(u => u.role !== 'admin' && !u.verified)
    const activeListings = db.listings.filter(l => l.active)
    const totalOrders = db.orders.length
    const deliveredOrders = db.orders.filter(o => o.status === 'Delivered')
    const totalRevenue = db.orders.reduce((sum, o) => sum + (o.qty * o.pricePerUnit), 0)
    
    return {
      totalUsers: db.users.length,
      farmers: farmers.length,
      buyers: buyers.length,
      pendingUsers: pendingUsers.length,
      totalListings: db.listings.length,
      activeListings: activeListings.length,
      totalOrders,
      deliveredOrders: deliveredOrders.length,
      totalRevenue,
    }
  }, [db])

  const recentOrders = useMemo(() => {
    return db.orders
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
  }, [db.orders])

  return (
    <div className="space-y-5">
      {/* Analytics Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-extrabold text-brand-700">{stats.totalUsers}</div>
            <div className="text-sm text-brand-700 mt-1">Total Users</div>
            <div className="text-xs text-brand-600 mt-2">
              {stats.farmers} Farmers • {stats.buyers} Buyers
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-extrabold text-brand-700">{stats.totalListings}</div>
            <div className="text-sm text-brand-700 mt-1">Total Listings</div>
            <div className="text-xs text-brand-600 mt-2">
              {stats.activeListings} Active
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-extrabold text-brand-700">{stats.totalOrders}</div>
            <div className="text-sm text-brand-700 mt-1">Total Orders</div>
            <div className="text-xs text-brand-600 mt-2">
              {stats.deliveredOrders} Delivered
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-extrabold text-brand-700">{money(stats.totalRevenue)}</div>
            <div className="text-sm text-brand-700 mt-1">Total Revenue</div>
            <div className="text-xs text-brand-600 mt-2">
              All orders combined
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Pending verification alert */}
      {stats.pendingUsers > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardBody className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-bold text-yellow-800">{stats.pendingUsers} users pending verification</div>
                <div className="text-sm text-yellow-700">Review and approve user accounts</div>
              </div>
            </div>
            <Link to="/app/admin/verify"><Button>Review</Button></Link>
          </CardBody>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader title="Admin Dashboard" subtitle="Manage users, listings, and platform settings." />
        <CardBody className="flex flex-wrap gap-2">
          <Link to="/app/admin/verify"><Button>Verify Users</Button></Link>
          <Link to="/app/admin/listings"><Button variant="ghost">Manage Listings</Button></Link>
          <Button variant="danger" onClick={() => setShowResetModal(true)}>Reset Demo Data</Button>
        </CardBody>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader title="Recent Orders" subtitle="Latest orders across the platform" />
        <CardBody className="space-y-3">
          {recentOrders.map(o => {
            const listing = db.listings.find(l => l.id === o.listingId)
            const buyer = db.users.find(u => u.id === o.buyerId)
            const farmer = db.users.find(u => u.id === o.farmerId)
            return (
              <div key={o.id} className="border border-brand-100 rounded-xl p-3 bg-white flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-bold">{listing?.title || 'Unknown Product'}</div>
                  <div className="text-sm text-brand-700">
                    Buyer: {buyer?.name || '—'} → Farmer: {farmer?.name || '—'}
                  </div>
                  <div className="text-xs text-brand-600 mt-1">
                    Qty: {o.qty} • Total: {money(o.qty * o.pricePerUnit)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={o.status === 'Delivered' ? 'green' : o.status === 'In Transit' ? 'yellow' : 'gray'}>
                    {o.status}
                  </Badge>
                  <Badge tone={o.payment?.paid ? 'green' : 'red'}>
                    {o.payment?.paid ? 'Paid' : 'Unpaid'}
                  </Badge>
                </div>
              </div>
            )
          })}
          {!recentOrders.length && (
            <div className="text-sm text-brand-700">No orders yet.</div>
          )}
        </CardBody>
      </Card>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={() => {
          hardReset()
          setShowResetModal(false)
        }}
        title="Reset Demo Data"
        message="This will reset all data to initial demo state. All users, orders, and messages will be lost. Are you sure?"
        confirmText="Reset Data"
        danger
      />
    </div>
  )
}
