import React, { useMemo, useState } from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { Card, CardHeader, CardBody, Select, Badge } from '../../components/ui.jsx'

export default function Resources() {
  const { db } = useStore()
  const cats = useMemo(() => ['All', ...Array.from(new Set(db.resources.map(r => r.category)))], [db.resources])
  const [cat, setCat] = useState('All')

  const items = useMemo(() => {
    return db.resources.filter(r => (cat === 'All' ? true : r.category === cat))
  }, [db.resources, cat])

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader
          title="Resource Information"
          subtitle="Guides for seeds, fertilizer, and seasonal crop management."
          right={<Badge tone="yellow">Farmer support</Badge>}
        />
        <CardBody className="space-y-4">
          <Select label="Category" value={cat} onChange={(e)=>setCat(e.target.value)}>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>

          <div className="grid md:grid-cols-2 gap-4">
            {items.map(r => (
              <div key={r.id} className="border border-brand-100 rounded-2xl p-4 bg-white">
                <div className="text-xs text-brand-700 font-bold">{r.category}</div>
                <div className="text-lg font-extrabold mt-1">{r.title}</div>
                <div className="text-sm text-brand-800 mt-2">{r.body}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
