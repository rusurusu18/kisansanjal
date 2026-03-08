import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { Card, CardHeader, CardBody, Input, Select, TextArea, Button } from '../../components/ui.jsx'

export default function NewListing() {
  const { user } = useAuth()
  const { createListing } = useStore()
  const nav = useNavigate()

  const [form, setForm] = useState({
    title: '',
    cropType: 'Vegetable',
    pricePerUnit: 0,
    unit: 'kg',
    quantity: 0,
    locationName: '',
    lat: '',
    lng: '',
    qualityGrade: 'A',
    harvestDate: '',
    description: '',
    imageUrl: '',
  })

  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const onSubmit = (e) => {
    e.preventDefault()
    createListing({
      farmerId: user.id,
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
    })
    nav('/app/farmer')
  }

  return (
    <Card>
      <CardHeader title="Create Crop Listing" subtitle="Add price, quantity, photos, and pickup/shipping location." />
      <CardBody>
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
          <Input label="Title" value={form.title} onChange={(e)=>onChange('title', e.target.value)} required />
          <Select label="Crop Type" value={form.cropType} onChange={(e)=>onChange('cropType', e.target.value)}>
            <option>Vegetable</option>
            <option>Crop</option>
            <option>Fruit</option>
            <option>Other</option>
          </Select>

          <Input label="Price per unit" type="number" value={form.pricePerUnit} onChange={(e)=>onChange('pricePerUnit', e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Unit" value={form.unit} onChange={(e)=>onChange('unit', e.target.value)} placeholder="kg" />
            <Input label="Quantity" type="number" value={form.quantity} onChange={(e)=>onChange('quantity', e.target.value)} required />
          </div>

          <Input label="Location name" value={form.locationName} onChange={(e)=>onChange('locationName', e.target.value)} placeholder="e.g., Banepa" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Latitude" value={form.lat} onChange={(e)=>onChange('lat', e.target.value)} placeholder="27.63" />
            <Input label="Longitude" value={form.lng} onChange={(e)=>onChange('lng', e.target.value)} placeholder="85.52" />
          </div>

          <Input label="Harvest date" type="date" value={form.harvestDate} onChange={(e)=>onChange('harvestDate', e.target.value)} />
          <Select label="Quality grade" value={form.qualityGrade} onChange={(e)=>onChange('qualityGrade', e.target.value)}>
            <option>A</option><option>B</option><option>C</option>
          </Select>

          <Input label="Image URL (optional)" value={form.imageUrl} onChange={(e)=>onChange('imageUrl', e.target.value)} placeholder="https://..." className="md:col-span-2" />
          <TextArea label="Description" value={form.description} onChange={(e)=>onChange('description', e.target.value)} rows={4} className="md:col-span-2" />

          <div className="md:col-span-2 flex gap-2">
            <Button type="submit">Create</Button>
            <Button type="button" variant="ghost" onClick={()=>nav('/app/farmer')}>Cancel</Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
