import React, { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const linkBase = 'px-3 py-2 rounded-xl text-sm font-semibold transition'
const linkActive = 'bg-brand-700 text-white'
const linkIdle = 'text-brand-900 hover:bg-brand-100'

const mobileLinkBase = 'block px-4 py-3 rounded-xl font-semibold transition'
const mobileLinkActive = 'bg-brand-700 text-white'
const mobileLinkIdle = 'text-brand-900 hover:bg-brand-100'

export default function AppLayout() {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/app', label: 'Marketplace', end: true },
    { to: '/app/trends', label: 'Price Trends' },
    { to: '/app/resources', label: 'Resources' },
    { to: '/app/chat', label: 'Chat' },
  ]

  const roleLinks = {
    farmer: [{ to: '/app/farmer', label: 'Farmer Dashboard' }],
    buyer: [
      { to: '/app/buyer', label: 'Buyer Dashboard' },
      { to: '/app/buyer/cart', label: 'Cart' },
      { to: '/app/buyer/orders', label: 'My Orders' },
    ],
    admin: [
      { to: '/app/admin', label: 'Admin Dashboard' },
      { to: '/app/admin/verify', label: 'Verify Users' },
      { to: '/app/admin/listings', label: 'Manage Listings' },
    ],
  }

  const userRoleLinks = roleLinks[user?.role] || []

  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-brand-100">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/app" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-700 grid place-items-center text-white font-black">KS</div>
              <div className="leading-tight hidden sm:block">
                <div className="font-extrabold">Kisan Sanjal</div>
                <div className="text-xs text-brand-700">Farmer • Buyer • Admin</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map(link => (
              <NavLink 
                key={link.to}
                to={link.to} 
                end={link.end}
                className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              >
                {link.label}
              </NavLink>
            ))}
            {user?.role === 'farmer' && (
              <NavLink to="/app/farmer" className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>Farmer</NavLink>
            )}
            {user?.role === 'buyer' && (
              <NavLink to="/app/buyer" className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>Buyer</NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/app/admin" className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>Admin</NavLink>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-bold">{user?.name}</div>
              <div className="text-xs text-brand-700 capitalize">
                {user?.role}{user?.verified ? '' : ' • pending verification'}
              </div>
            </div>
            
            {/* Desktop Logout - Now links to confirmation page */}
            <Link 
              to="/logout"
              className="hidden sm:block px-3 py-2 rounded-xl bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-colors"
              title="Logout"
            >
              Logout
            </Link>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center hover:bg-brand-200"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brand-100 bg-white">
            <div className="p-4 space-y-2">
              {/* User info on mobile */}
              <div className="pb-3 mb-3 border-b border-brand-100">
                <div className="font-bold text-brand-900">{user?.name}</div>
                <div className="text-xs text-brand-700 capitalize">{user?.role}</div>
              </div>
              
              {/* Main links */}
              {navLinks.map(link => (
                <NavLink 
                  key={link.to}
                  to={link.to} 
                  end={link.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({isActive}) => `${mobileLinkBase} ${isActive ? mobileLinkActive : mobileLinkIdle}`}
                >
                  {link.label}
                </NavLink>
              ))}
              
              {/* Role-specific links */}
              {userRoleLinks.length > 0 && (
                <>
                  <div className="pt-3 mt-3 border-t border-brand-100">
                    <div className="text-xs text-brand-600 font-bold mb-2 uppercase tracking-wide">
                      {user?.role} Menu
                    </div>
                  </div>
                  {userRoleLinks.map(link => (
                    <NavLink 
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({isActive}) => `${mobileLinkBase} ${isActive ? mobileLinkActive : mobileLinkIdle}`}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </>
              )}
              
              {/* Mobile Logout - Now links to confirmation page */}
              <Link 
                to="/logout"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full mt-4 block px-4 py-3 rounded-xl bg-red-50 border-2 border-red-100 text-red-700 font-semibold text-left hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout Account
                </div>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-brand-100 bg-white/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-brand-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Kisan Sanjal. All rights reserved.</span>
          <span className="text-brand-600 font-semibold">Direct farmer-to-buyer marketplace</span>
        </div>
      </footer>
    </div>
  )
}