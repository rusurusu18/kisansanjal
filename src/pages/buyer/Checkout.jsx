import React, { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { Card, CardHeader, CardBody, Button, Select, Input, Badge } from '../../components/ui.jsx'
import { money } from '../../utils/format.js'

const CART_KEY = 'kisanSanjalCart_v1'
function loadCart() {
  const raw = localStorage.getItem(CART_KEY)
  return raw ? JSON.parse(raw) : []
}
function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

const PAYMENT_METHODS = [
  { id: 'esewa', name: 'eSewa', icon: '💚', description: 'Pay via eSewa digital wallet' },
  { id: 'khalti', name: 'Khalti', icon: '💜', description: 'Pay via Khalti wallet' },
  { id: 'card', name: 'Card', icon: '💳', description: 'Visa, Mastercard, etc.' },
  { id: 'cod', name: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive the order' },
]

export default function Checkout() {
  const nav = useNavigate()
  const { user } = useAuth()
  const { db, placeOrder, markPaid } = useStore()

  const cart = useMemo(() => loadCart(), [])
  const lines = cart.map(ci => {
    const listing = db.listings.find(l => l.id === ci.listingId)
    return { ...ci, listing }
  }).filter(x => x.listing)

  const total = lines.reduce((a, x) => a + x.qty * Number(x.listing.pricePerUnit), 0)

  const [method, setMethod] = useState('esewa')
  const [step, setStep] = useState('select') // 'select' | 'pay' | 'processing'
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [walletPhone, setWalletPhone] = useState('')

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === method)

  const processPayment = () => {
    setStep('processing')
    
    // Simulate payment processing
    setTimeout(() => {
      // Create orders and mark as paid (except COD)
      lines.forEach(x => {
        const order = placeOrder({
          listingId: x.listing.id,
          buyerId: user.id,
          farmerId: x.listing.farmerId,
          qty: x.qty,
          pricePerUnit: x.listing.pricePerUnit,
          unit: x.listing.unit,
        })
        if (method !== 'cod') {
          markPaid(order.id)
        }
      })
      saveCart([])
      nav('/app/buyer/orders')
    }, 2000)
  }

  if (step === 'processing') {
    return (
      <Card>
        <CardBody className="py-12 text-center">
          <div className="text-4xl mb-4 animate-pulse">{selectedMethod?.icon}</div>
          <div className="font-extrabold text-lg">Processing Payment...</div>
          <div className="text-sm text-brand-700 mt-2">Please wait while we process your payment</div>
        </CardBody>
      </Card>
    )
  }

  if (step === 'pay') {
    return (
      <Card>
        <CardHeader 
          title={`Pay with ${selectedMethod?.name}`} 
          subtitle={selectedMethod?.description}
          right={<Button variant="ghost" onClick={() => setStep('select')}>Back</Button>}
        />
        <CardBody className="space-y-4">
          {/* Card payment form */}
          {method === 'card' && (
            <div className="space-y-4">
              <Input 
                label="Card Number" 
                value={cardNumber} 
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Expiry Date" 
                  value={cardExpiry} 
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                />
                <Input 
                  label="CVV" 
                  value={cardCvv} 
                  onChange={(e) => setCardCvv(e.target.value)}
                  placeholder="123"
                  type="password"
                />
              </div>
              <div className="text-xs text-brand-700 bg-brand-50 rounded-xl p-3">
                🔒 Your card details are secure. This is a demo - no real payment will be processed.
              </div>
            </div>
          )}

          {/* Digital wallet form */}
          {(method === 'esewa' || method === 'khalti') && (
            <div className="space-y-4">
              <Input 
                label="Mobile Number" 
                value={walletPhone} 
                onChange={(e) => setWalletPhone(e.target.value)}
                placeholder="98XXXXXXXX"
              />
              <div className="border border-brand-100 rounded-xl p-4 bg-brand-50 text-center">
                <div className="text-4xl mb-2">{selectedMethod?.icon}</div>
                <div className="text-sm text-brand-700">
                  You will receive a payment confirmation request on your {selectedMethod?.name} app
                </div>
              </div>
            </div>
          )}

          {/* COD confirmation */}
          {method === 'cod' && (
            <div className="border border-yellow-200 rounded-xl p-4 bg-yellow-50">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💵</span>
                <div>
                  <div className="font-bold text-yellow-800">Cash on Delivery</div>
                  <div className="text-sm text-yellow-700 mt-1">
                    Please keep {money(total)} ready when receiving your order. Our delivery partner will collect the payment.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order summary */}
          <div className="border border-brand-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-brand-700">Order Total</span>
              <span className="text-xl font-extrabold">{money(total)}</span>
            </div>
          </div>

          <Button className="w-full" onClick={processPayment}>
            {method === 'cod' ? 'Place Order' : `Pay ${money(total)}`}
          </Button>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader 
        title="Checkout" 
        subtitle="Select your preferred payment method" 
        right={<Link to="/app/buyer/cart"><Button variant="ghost">Back</Button></Link>} 
      />
      <CardBody className="space-y-4">
        {/* Order Summary */}
        <div className="border border-brand-100 rounded-xl p-4 bg-white space-y-3">
          <div className="font-extrabold">Order Summary</div>
          {lines.map(x => (
            <div key={x.listingId} className="flex items-center justify-between text-sm">
              <span className="text-brand-700">{x.listing.title} × {x.qty}</span>
              <span className="font-bold">{money(x.qty * x.listing.pricePerUnit)}</span>
            </div>
          ))}
          <div className="border-t border-brand-100 pt-3 flex items-center justify-between">
            <span className="font-bold">Total</span>
            <span className="text-xl font-extrabold text-brand-700">{money(total)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="font-extrabold">Payment Method</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {PAYMENT_METHODS.map(m => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`border rounded-xl p-4 text-left transition ${
                method === m.id 
                  ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200' 
                  : 'border-brand-100 bg-white hover:border-brand-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <div className="font-bold">{m.name}</div>
                  <div className="text-xs text-brand-700">{m.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {method === 'cod' && (
          <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
            ⚠️ Cash on Delivery may not be available for all locations. Extra charges may apply.
          </div>
        )}

        <Button 
          className="w-full" 
          disabled={!lines.length} 
          onClick={() => setStep('pay')}
        >
          Continue to Payment
        </Button>
      </CardBody>
    </Card>
  )
}
