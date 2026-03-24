import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Farm from '../../assets/Farm.jpg'
import { useAuth } from '../../context/AuthContext.jsx'
import { Card, CardBody, Button, Input } from '../../components/ui.jsx'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      await login({ email, password })
      nav('/app')
    } catch (e2) {
      setErr(e2.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-800 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative hidden md:block">
          <img src={Farm} alt="Farm" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-900/40" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <div className="text-3xl font-extrabold">Kisan Sanjal</div>
            <div className="text-sm opacity-90 mt-2">
              Direct marketplace for farmers and buyers — transparent pricing, order tracking, and location support.
            </div>
          </div>
        </div>

        <Card className="rounded-none">
          <CardBody className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-brand-700 grid place-items-center text-white font-black">KS</div>
              <div>
                <div className="font-extrabold text-xl">Welcome back</div>
                <div className="text-sm text-brand-700">Login to continue</div>
              </div>
            </div>

            {err ? <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-100 rounded-xl p-3">{err}</div> : null}

            <form onSubmit={onSubmit} className="space-y-4">
              <Input label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="buyer@demo.com" required />
              <Input label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="123456" required />

              <Button className="w-full" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</Button>
            </form>

            <div className="mt-6 text-sm text-brand-700">
              Don’t have an account? <Link to="/register" className="font-bold text-brand-800 hover:underline">Create one</Link>
            </div>

            <div className="mt-6 text-xs text-brand-700 bg-brand-50 border border-brand-100 rounded-xl p-3">
              <div className="font-bold mb-1">Demo accounts</div>
              <div>Buyer: buyer@demo.com / 123456</div>
              <div>Farmer: farmer@demo.com / 123456</div>
              <div>Admin: admin@demo.com / 123456</div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
