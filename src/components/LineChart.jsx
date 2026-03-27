import React from 'react'

export default function LineChart({ data = [], height = 140 }) {
  if (!data.length) return <div className="text-sm text-brand-700">No data</div>

  const w = 520
  const h = height
  const pad = 18

  const xs = data.map((_, i) => i)
  const ys = data.map(d => Number(d.price))

  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const span = Math.max(1, maxY - minY)

  const scaleX = (i) => pad + (i / (xs.length - 1 || 1)) * (w - pad * 2)
  const scaleY = (y) => h - pad - ((y - minY) / span) * (h - pad * 2)

  const d = ys.map((y, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(y)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {/* grid */}
      <line x1={pad} y1={h-pad} x2={w-pad} y2={h-pad} stroke="#cfe8d1" />
      <line x1={pad} y1={pad} x2={pad} y2={h-pad} stroke="#cfe8d1" />

      {/* path */}
      <path d={d} fill="none" stroke="#2f7435" strokeWidth="3" />
      {/* points */}
      {ys.map((y, i) => (
        <circle key={i} cx={scaleX(i)} cy={scaleY(y)} r="4" fill="#4CAF50" stroke="#ffffff" strokeWidth="2" />
      ))}
    </svg>
  )
}
