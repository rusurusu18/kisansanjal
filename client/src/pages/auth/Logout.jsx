import React from 'react'
import { useNavigate } from 'react-router-dom'
import Farm from '../../assets/Farm.jpg'
import { useAuth } from '../../context/AuthContext.jsx'
import { Card, CardBody, Button } from '../../components/ui.jsx'

export default function Logout() {
  const { logout } = useAuth()
  const nav = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      nav('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still navigate to login even if logout fails
      nav('/login')
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
          <CardBody className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-brand-100 grid place-items-center">
              <svg className="w-12 h-12 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>

            <div className="font-extrabold text-2xl text-brand-900 mb-2">Logout</div>
            <div className="text-sm text-brand-700 mb-8 max-w-sm mx-auto">
              You are about to logout from your Kisan Sanjal account. All active sessions will be terminated.
            </div>

            <div className="space-y-3 mb-8">
              <Button 
                className="w-full bg-brand-600 hover:bg-brand-700" 
                onClick={handleLogout}
              >
                Confirm Logout
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => nav('/app')}
              >
                Stay Signed In
              </Button>
            </div>

            <div className="text-xs text-brand-600">
              This won't delete your account or any data.
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}