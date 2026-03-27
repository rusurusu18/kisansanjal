import React, { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../context/StoreContext.jsx'
import { Card, CardHeader, CardBody, Button } from '../../components/ui.jsx'
import { money } from '../../utils/format.js'

const CART_KEY = 'kisanSanjalCart_v1'

function loadCart() {
  const raw = localStorage.getItem(CART_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export default function Cart() {
  const nav = useNavigate()
  const { db } = useStore()
  const cart = useMemo(() => loadCart(), [])

  const lines = cart.map(ci => {
    const listing = db.listings.find(l => l.id === ci.listingId)
    return { ...ci, listing }
  }).filter(x => x.listing)

  const total = lines.reduce((a, x) => a + x.qty * Number(x.listing.pricePerUnit), 0)

  const remove = (listingId) => {
    const next = cart.filter(i => i.listingId !== listingId)
    saveCart(next)
    window.location.reload()
  }

  return (
    <Card>
      <CardHeader title="Cart" subtitle="Review items before checkout." right={<Link to="/app"><Button variant="ghost">Back</Button></Link>} />
      <CardBody className="space-y-4">
        {lines.map(x => (
          <div key={x.listingId} className="border border-brand-100 rounded-2xl p-4 bg-white flex items-center justify-between">
            <div>
              <div className="font-extrabold">{x.listing.title}</div>
              <div className="text-sm text-brand-700">Qty {x.qty} • {money(x.listing.pricePerUnit)}/{x.listing.unit}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={()=>remove(x.listingId)}>Remove</Button>
            </div>
          </div>
        ))}

        {!lines.length ? <div className="text-sm text-brand-700">Cart is empty.</div> : null}

        <div className="flex items-center justify-between border-t border-brand-100 pt-4">
          <div className="font-extrabold">Total: {money(total)}</div>
          <Button disabled={!lines.length} onClick={()=>nav('/app/buyer/checkout')}>Checkout</Button>
        </div>
      </CardBody>
    </Card>
  )
}
