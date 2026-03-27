import React, { useMemo, useState } from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { Card, CardHeader, CardBody, Select, Badge } from '../../components/ui.jsx'
import LineChart from '../../components/LineChart.jsx'

export default function PriceTrends() {
  const { db } = useStore()
  const crops = useMemo(() => ['Tomato','Potato', ...Object.keys(db.priceTrends || {})], [db.priceTrends])
  const uniq = Array.from(new Set(crops))
  const [crop, setCrop] = useState(uniq[0] || 'Tomato')

  const series = db.priceTrends?.[crop] || []

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader
          title="Price Trend Dashboard"
          subtitle="Simple charts showing recent price movement for selected crops."
          right={<Badge>Transparent pricing</Badge>}
        />
        <CardBody className="space-y-4">
          <Select label="Crop" value={crop} onChange={(e)=>setCrop(e.target.value)}>
            {uniq.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>

          <div className="border border-brand-100 rounded-2xl p-4">
            <LineChart data={series} />
          </div>

          <div className="text-sm text-brand-700">
            Tip: later you can connect this to real market data from your backend.
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
