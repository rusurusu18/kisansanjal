import React from 'react'

export function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border border-brand-100 bg-white shadow-sm ${className}`}>{children}</div>
}

export function CardHeader({ title, subtitle, right }) {
  return (
    <div className="p-5 border-b border-brand-100 flex items-start justify-between gap-4">
      <div>
        <div className="text-lg font-extrabold">{title}</div>
        {subtitle ? <div className="text-sm text-brand-700 mt-1">{subtitle}</div> : null}
      </div>
      {right}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-5 ${className}`}>{children}</div>
}

export function Input({ label, ...props }) {
  return (
    <label className="block">
      {label ? <div className="text-sm font-semibold text-brand-900 mb-1">{label}</div> : null}
      <input
        {...props}
        className={`w-full rounded-xl border border-brand-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-brand-200 ${props.className ?? ''}`}
      />
    </label>
  )
}

export function Select({ label, children, ...props }) {
  return (
    <label className="block">
      {label ? <div className="text-sm font-semibold text-brand-900 mb-1">{label}</div> : null}
      <select
        {...props}
        className={`w-full rounded-xl border border-brand-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-brand-200 ${props.className ?? ''}`}
      >
        {children}
      </select>
    </label>
  )
}

export function TextArea({ label, ...props }) {
  return (
    <label className="block">
      {label ? <div className="text-sm font-semibold text-brand-900 mb-1">{label}</div> : null}
      <textarea
        {...props}
        className={`w-full rounded-xl border border-brand-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-brand-200 ${props.className ?? ''}`}
      />
    </label>
  )
}

export function Button({ variant='primary', children, className='', ...props }) {
  const base = 'px-4 py-2 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed'
  const styles = {
    primary: 'bg-brand-700 text-white hover:bg-brand-600',
    ghost: 'bg-white text-brand-800 border border-brand-200 hover:bg-brand-50',
    danger: 'bg-red-600 text-white hover:bg-red-500',
  }
  return (
    <button {...props} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  )
}

export function Badge({ children, tone='green' }) {
  const tones = {
    green: 'bg-brand-100 text-brand-800',
    gray: 'bg-gray-100 text-gray-700',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-700',
  }
  return <span className={`px-2 py-1 rounded-lg text-xs font-bold ${tones[tone]}`}>{children}</span>
}

export function Stars({ value = 0 }) {
  const v = Number(value || 0)
  const full = Math.floor(v)
  const half = v - full >= 0.5
  const total = 5
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1
        const filled = idx <= full
        const halfFilled = !filled && half && idx === full + 1
        return (
          <span key={i} className={`text-sm ${filled || halfFilled ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
        )
      })}
      <span className="text-xs text-brand-700 ml-1">{v ? v.toFixed(1) : '0.0'}</span>
    </div>
  )
}
