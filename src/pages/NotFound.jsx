import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, Button } from '../components/ui.jsx'

export default function NotFound() {
  return (
    <Card>
      <CardBody className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-extrabold">Page not found</div>
          <div className="text-sm text-brand-700">The page you requested does not exist.</div>
        </div>
        <Link to="/app"><Button>Go to Marketplace</Button></Link>
      </CardBody>
    </Card>
  )
}
