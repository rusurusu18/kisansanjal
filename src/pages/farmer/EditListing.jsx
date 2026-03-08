import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { Card, CardHeader, CardBody, Input, Select, TextArea, Button } from '../../components/ui.jsx'

export default function EditListing() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const { db, updateListing } = useStore()

  const listing = useMemo(() => db.listings.find(l => l.id === id), [db.listings, id])
  const mine = listing && listing.farmerId === user.id

  const [form, setForm] = useState(() => ({
    title: listing?.title || '',
    cropType: listing?.cropType || 'Vegetable',
    pricePerUnit: listing?.pricePerUnit || 0,
    unit: listing?.unit || 'kg',
    quantity: listing?.quantity || 0,
    locationName: listing?.locationName || '',
    lat: listing?.lat ?? '',
    lng: listing?.lng ?? '',
    qualityGrade: listing?.qualityGrade || 'A',
    harvestDate: listing?.harvestDate || '',
    description: listing?.description || '',
    imageUrl: listing?.images?.[0] || '',
    active: listing?.active ?? true,
  }))

  if (!listing) return <Card><CardBody>Listing not found.</CardBody></Card>
  if (!mine) return <Card><CardBody>You cannot edit this listing.</CardBody></Card>

  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const onSubmit = (e) => {
    e.preventDefault()
    updateListing(id, {
      title: form.title,
      cropType: form.cropType,
      pricePerUnit: Number(form.pricePerUnit),
      unit: form.unit,
      quantity: Number(form.quantity),
      locationName: form.locationName,
      lat: form.lat === '' ? null : Number(form.lat),
      lng: form.lng === '' ? null : Number(form.lng),
      qualityGrade: form.qualityGrade,
      harvestDate: form.harvestDate,
      description: form.description,
      images: [form.imageUrl || '/src/assets/Farm.jpg'],
      active: Boolean(form.active),
    })
    nav('/app/farmer')
  }

  return (
    <Card>
      <CardHeader title="Edit Listing" subtitle="Update listing details or hide it from marketplace." />
      <CardBody>
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
          <Input label="Title" value={form.title} onChange={(e)=>onChange('title', e.target.value)} required />
          <Select label="Crop Type" value={form.cropType} onChange={(e)=>onChange('cropType', e.target.value)}>
            <option>Vegetable</option><option>Crop</option><option>Fruit</option><option>Other</option>
          </Select>

          <Input label="Price per unit" type="number" value={form.pricePerUnit} onChange={(e)=>onChange('pricePerUnit', e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Unit" value={form.unit} onChange={(e)=>onChange('unit', e.target.value)} />
            <Input label="Quantity" type="number" value={form.quantity} onChange={(e)=>onChange('quantity', e.target.value)} required />
          </div>

          <Input label="Location name" value={form.locationName} onChange={(e)=>onChange('locationName', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Latitude" value={form.lat} onChange={(e)=>onChange('lat', e.target.value)} />
            <Input label="Longitude" value={form.lng} onChange={(e)=>onChange('lng', e.target.value)} />
          </div>

          <Input label="Harvest date" type="date" value={form.harvestDate} onChange={(e)=>onChange('harvestDate', e.target.value)} />
          <Select label="Quality grade" value={form.qualityGrade} onChange={(e)=>onChange('qualityGrade', e.target.value)}>
            <option>A</option><option>B</option><option>C</option>
          </Select>

          <Input label="Image URL (optional)" value={form.imageUrl} onChange={(e)=>onChange('imageUrl', e.target.value)} className="md:col-span-2" />
          <TextArea label="Description" value={form.description} onChange={(e)=>onChange('description', e.target.value)} rows={4} className="md:col-span-2" />

          <label className="flex items-center gap-2 text-sm text-brand-800 md:col-span-2">
            <input type="checkbox" checked={form.active} onChange={(e)=>onChange('active', e.target.checked)} />
            Active listing (uncheck to hide from marketplace)
          </label>

          <div className="md:col-span-2 flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="ghost" onClick={()=>nav('/app/farmer')}>Cancel</Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
