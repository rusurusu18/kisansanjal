import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext.jsx'
import { Card, CardHeader, CardBody, Button, Badge } from '../../components/ui.jsx'

export default function VerifyUsers() {
  const { db, setUserVerified } = useStore()

  const pending = useMemo(() => db.users.filter(u => u.role !== 'admin' && !u.verified), [db.users])
  const verified = useMemo(() => db.users.filter(u => u.role !== 'admin' && u.verified), [db.users])

  return (
    <Card>
      <CardHeader title="User Verification" subtitle="Approve Farmer/Buyer accounts to build trust and reduce fraud." right={<Link to="/app/admin"><Button variant="ghost">Back</Button></Link>} />
      <CardBody className="space-y-6">
        <div>
          <div className="font-extrabold mb-2">Pending</div>
          <div className="space-y-3">
            {pending.map(u => (
              <div key={u.id} className="border border-brand-100 rounded-2xl p-4 bg-white flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-extrabold">{u.name}</div>
                  <div className="text-sm text-brand-700">{u.email} • {u.role}</div>
                  {u.role === 'farmer' ? <div className="text-xs text-brand-700 mt-1">District: {u.district || '—'} • License: {u.licenseId || '—'}</div> : null}
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="yellow">Pending</Badge>
                  <Button onClick={()=>setUserVerified(u.id, true)}>Verify</Button>
                </div>
              </div>
            ))}
            {!pending.length ? <div className="text-sm text-brand-700">No pending users.</div> : null}
          </div>
        </div>

        <div>
          <div className="font-extrabold mb-2">Verified</div>
          <div className="space-y-3">
            {verified.map(u => (
              <div key={u.id} className="border border-brand-100 rounded-2xl p-4 bg-white flex items-center justify-between">
                <div>
                  <div className="font-extrabold">{u.name}</div>
                  <div className="text-sm text-brand-700">{u.email} • {u.role}</div>
                </div>
                <Badge tone="green">Verified</Badge>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
