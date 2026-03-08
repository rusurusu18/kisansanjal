import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { Card, CardBody, Button, Input, Select } from '../../components/ui.jsx'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()

  const [role, setRole] = useState('buyer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [district, setDistrict] = useState('')
  const [phone, setPhone] = useState('')
  const [licenseId, setLicenseId] = useState('')
  const [terms, setTerms] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    if (!terms) return setErr('Please agree to the terms & policy')
    setLoading(true)
    try {
      await register({
        name,
        email,
        password,
        role,
        extra: role === 'farmer' ? { district, phone, licenseId } : {},
      })
      nav('/app')
    } catch (e2) {
      setErr(e2.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardBody className="p-8">
          <div className="mb-6">
            <div className="text-2xl font-extrabold text-brand-900">Create your account</div>
            <div className="text-sm text-brand-700">Choose Farmer or Buyer role during signup.</div>
          </div>

          {err ? <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-100 rounded-xl p-3">{err}</div> : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <Select label="Role" value={role} onChange={(e)=>setRole(e.target.value)}>
              <option value="buyer">Buyer</option>
              <option value="farmer">Farmer</option>
            </Select>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" value={name} onChange={(e)=>setName(e.target.value)} required />
              <Input label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>

            <Input label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />

            {role === 'farmer' ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="District" value={district} onChange={(e)=>setDistrict(e.target.value)} placeholder="e.g., Kavre" />
                <Input label="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="98XXXXXXXX" />
                <Input label="Farming License / ID (optional)" value={licenseId} onChange={(e)=>setLicenseId(e.target.value)} className="sm:col-span-2" />
                <div className="sm:col-span-2 text-xs text-brand-700 bg-brand-50 border border-brand-100 rounded-xl p-3">
                  Farmers may require verification by Admin before full access (demo behavior).
                </div>
              </div>
            ) : null}

            <label className="flex items-center gap-2 text-sm text-brand-800">
              <input type="checkbox" checked={terms} onChange={(e)=>setTerms(e.target.checked)} />
              I agree to the Terms & Policy
            </label>

            <Button className="w-full" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</Button>
          </form>

          <div className="mt-6 text-sm text-brand-700">
            Already have an account? <Link to="/login" className="font-bold text-brand-800 hover:underline">Login</Link>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
