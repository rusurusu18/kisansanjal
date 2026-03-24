import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import Farm from '../assets/Farm.jpg';

function LandingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  const homeRef = useRef(null);
  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMenuOpen(false);
  };

  const goToLogin = () => navigate('/login');
  const goToRegister = () => navigate('/register');
  
  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px 0px 0px' }
    );

    [homeRef, servicesRef, aboutRef, contactRef].forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const services = [
    { icon: '🥬', title: 'Fresh Produce', desc: 'Farm fresh delivery direct from source', color: 'ring-green-500/20 border-green-200 shadow-green-100/50' },
    { icon: '🌱', title: 'Organic Farming', desc: '100% chemical-free certified produce', color: 'ring-emerald-500/20 border-emerald-200 shadow-emerald-100/50' },
    { icon: '⚖️', title: 'Fair Pricing', desc: 'No middlemen - best market rates', color: 'ring-blue-500/20 border-blue-200 shadow-blue-100/50' },
    { icon: '📦', title: 'Order Tracking', desc: 'Real-time delivery updates', color: 'ring-orange-500/20 border-orange-200 shadow-orange-100/50' },
    { icon: '🚚', title: 'Fast Delivery', desc: 'Same-day delivery in your area', color: 'ring-purple-500/20 border-purple-200 shadow-purple-100/50' },
    { icon: '💰', title: 'Secure Payments', desc: 'Multiple payment options available', color: 'ring-amber-500/20 border-amber-200 shadow-amber-100/50' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 text-green-600 hover:text-green-700 transition-all group">
              <span className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Kisan Sanjal
              </span>
            </Link>

            <nav className="hidden xl:flex items-center gap-10">
              <a 
                href="#home" 
                onClick={(e) => {e.preventDefault(); scrollToSection(homeRef);}}
                className={`font-semibold py-2 px-3 rounded-xl transition-all duration-300 ${
                  activeSection === 'home' 
                    ? 'bg-green-50 text-green-600 shadow-md' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                Home
              </a>
              <a 
                href="#services" 
                onClick={(e) => {e.preventDefault(); scrollToSection(servicesRef);}}
                className={`font-semibold py-2 px-3 rounded-xl transition-all duration-300 ${
                  activeSection === 'services' 
                    ? 'bg-green-50 text-green-600 shadow-md' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                Services
              </a>
              <a 
                href="#about" 
                onClick={(e) => {e.preventDefault(); scrollToSection(aboutRef);}}
                className={`font-semibold py-2 px-3 rounded-xl transition-all duration-300 ${
                  activeSection === 'about' 
                    ? 'bg-green-50 text-green-600 shadow-md' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                About
              </a>

              {/* Auth Section */}
              <div className="flex items-center gap-4 ml-8">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-2xl shadow-sm">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="hidden lg:block">
                        <p className="text-sm font-semibold text-green-800 max-w-[120px] truncate">
                          {user.name || user.email}
                        </p>
                        <p className="text-xs text-green-600">Dashboard</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={goToLogin}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={goToRegister}
                      className="px-6 py-3 bg-white border-2 border-green-600 text-green-600 font-bold rounded-2xl hover:bg-green-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-green-50 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <svg className={`w-7 h-7 transition-all ${isMenuOpen ? 'text-green-600 rotate-90' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className={`${isMenuOpen ? 'hidden' : ''}`} d="M4 6h16M4 12h16M4 18h16" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className={`${isMenuOpen ? '' : 'hidden'}`} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl">
              <nav className="py-6 px-4 space-y-2">
                <button 
                  onClick={() => scrollToSection(homeRef)} 
                  className="w-full flex items-center gap-3 py-4 px-6 rounded-2xl hover:bg-green-50 font-semibold text-gray-800 hover:text-green-600 transition-all duration-300"
                >
                  <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">🏠</span>
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection(servicesRef)} 
                  className="w-full flex items-center gap-3 py-4 px-6 rounded-2xl hover:bg-green-50 font-semibold text-gray-800 hover:text-green-600 transition-all duration-300"
                >
                  <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">🌾</span>
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection(aboutRef)} 
                  className="w-full flex items-center gap-3 py-4 px-6 rounded-2xl hover:bg-green-50 font-semibold text-gray-800 hover:text-green-600 transition-all duration-300"
                >
                  <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">ℹ️</span>
                  About
                </button>
                
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-green-800">{user.name || 'User'}</p>
                          <p className="text-sm text-green-600">Go to Dashboard</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={goToLogin} 
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        🔐 Sign In
                      </button>
                      <button 
                        onClick={goToRegister} 
                        className="w-full bg-white border-2 border-green-600 text-green-600 py-4 px-6 rounded-2xl font-bold hover:bg-green-600 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        ➕ Get Started
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero - Background Image Only */}
      <section id="home" ref={homeRef} className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600">
        {/* Full background image */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${Farm})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center py-20">
            <div className="text-white space-y-10 animate-fade-in">
              <div className="space-y-4">
                <span className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white/95 border border-white/30">
                  🚀 Direct Farmer-to-Buyer
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent drop-shadow-2xl">
                  Kisan Sanjal
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl font-light opacity-95 leading-relaxed max-w-2xl drop-shadow-xl">
                  Connecting farmers directly with buyers. 
                  <span className="block text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    No middlemen. Pure profits.
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-6 pt-8">
                <button 
                  onClick={() => scrollToSection(servicesRef)}
                  className="group relative px-10 py-5 bg-white text-green-700 font-black rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 text-lg overflow-hidden border-2 border-white/20"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-3">
                    🌾 Explore Services
                  </span>
                </button>
                {user ? (
                  <Link 
                    to="/app" 
                    className="px-10 py-5 bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white font-bold rounded-3xl hover:bg-white/30 hover:border-white/70 transition-all duration-300 text-lg flex items-center gap-3 hover:-translate-y-1"
                  >
                    📊 My Dashboard
                  </Link>
                ) : (
                  <button 
                    onClick={goToLogin}
                    className="px-10 py-5 bg-transparent border-2 border-white/70 text-white font-bold rounded-3xl hover:bg-white/20 hover:border-white transition-all duration-300 text-lg flex items-center gap-3 hover:-translate-y-1"
                  >
                    🔐 Get Started Free
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services*/}
      <section id="services" ref={servicesRef} className="py-32 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-24">
            <h2 className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-green-900 to-gray-900 bg-clip-text">
              Our Services
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {user ? `Welcome back ${user.name}! Discover premium services tailored for you.` : 'Premium agriculture solutions built for farmers and buyers.'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div 
                key={i} 
                className={`group relative p-10 bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 cursor-pointer border border-gray-100 hover:border-gray-200 ${service.color}`}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl" />
                <div className="relative z-10">
                  <div className={`w-20 h-20 ${service.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg border-4 border-white`}>
                    <span className="text-3xl drop-shadow-md">{service.icon}</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">{service.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" ref={aboutRef} className="py-32 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 pr-12">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 font-bold rounded-full text-lg shadow-md">
                🌾 About Kisan Sanjal
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
                Revolutionizing 
                <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Agriculture Commerce
                </span>
              </h2>
              <div className="space-y-6 text-xl text-gray-700 leading-relaxed">
                <p>
                  We eliminate middlemen and connect farmers directly with buyers, ensuring fair prices and maximum profits for farmers.
                </p>
                <p className="text-2xl font-bold text-green-600">
                  100K+ farmers • 50K+ buyers • ₹500Cr+ transacted
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 pt-8">
                <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-100 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="text-4xl font-black text-green-600 mb-2">100K+</div>
                  <div className="text-sm font-semibold text-green-800 uppercase tracking-wide">Farmers</div>
                </div>
                <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="text-4xl font-black text-emerald-600 mb-2">50K+</div>
                  <div className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">Buyers</div>
                </div>
                <div className="text-center p-8 bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl border border-teal-100 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="text-4xl font-black text-teal-600 mb-2">₹500Cr+</div>
                  <div className="text-sm font-semibold text-teal-800 uppercase tracking-wide">Transacted</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-500/3 to-emerald-500/3 backdrop-blur-xl rounded-4xl p-12 border border-green-100/50 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="group bg-white/80 hover:bg-white rounded-3xl p-8 shadow-xl border border-gray-100/60 hover:border-green-200 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🚜</div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2">Direct Connection</h4>
                    <p className="text-sm text-gray-600 font-medium">Farmers to buyers</p>
                  </div>
                  <div className="group bg-white/80 hover:bg-white rounded-3xl p-8 shadow-xl border border-gray-100/60 hover:border-green-200 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💰</div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2">Fair Pricing</h4>
                    <p className="text-sm text-gray-600 font-medium">No middlemen fees</p>
                  </div>
                  <div className="group bg-white/80 hover:bg-white rounded-3xl p-8 shadow-xl border border-gray-100/60 hover:border-green-200 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📱</div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2">Mobile App</h4>
                    <p className="text-sm text-gray-600 font-medium">Easy to use</p>
                  </div>
                  <div className="group bg-white/80 hover:bg-white rounded-3xl p-8 shadow-xl border border-gray-100/60 hover:border-green-200 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🚚</div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2">Fast Delivery</h4>
                    <p className="text-sm text-gray-600 font-medium">Same day service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" ref={contactRef} className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-green-900 bg-clip-text">
              Get In Touch
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Questions? Need help? We're here for you 24/7
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-12 bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-gray-100 hover:border-green-200">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-all duration-300">
                <span className="text-3xl">📧</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Email</h4>
              <p className="text-gray-600 mb-6 text-lg font-medium">support@kisansanjal.com</p>
              <a href="mailto:support@kisansanjal.com" className="inline-flex items-center gap-2 text-green-600 font-bold text-lg hover:text-green-700 group-hover:translate-x-2 transition-all duration-300">
                Send Message 
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
            <div className="group text-center p-12 bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-gray-100 hover:border-emerald-200">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-all duration-300">
                <span className="text-3xl">📱</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Phone</h4>
              <p className="text-gray-600 mb-6 text-lg font-medium">+977 9801234567</p>
              <a href="tel:+9779801234567" className="inline-flex items-center gap-2 text-emerald-600 font-bold text-lg hover:text-emerald-700 group-hover:translate-x-2 transition-all duration-300">
                Call Now 
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
            <div className="md:col-span-1 group text-center p-12 bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-gray-100 hover:border-teal-200">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-all duration-300">
                <span className="text-3xl">💬</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">WhatsApp</h4>
              <p className="text-gray-600 mb-6 text-lg font-medium">Instant Support</p>
              <a href="https://wa.me/9779801234567" className="inline-flex items-center gap-2 text-teal-600 font-bold text-lg hover:text-teal-700 group-hover:translate-x-2 transition-all duration-300" target="_blank" rel="noopener noreferrer">
                Chat Now 
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
       <footer className="border-t border-brand-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-brand-700 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Kisan Sanjal</span>
          <span className="hidden sm:block">Direct farmer-to-buyer marketplace</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;