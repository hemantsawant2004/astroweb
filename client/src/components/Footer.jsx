import { Link } from 'react-router-dom'
import { siteConfig } from '../data/siteConfig'

export default function Footer() {
  return (
    <footer className="bg-cosmic-950 text-white/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
            <span className="text-gold-400">&#10022;</span>
            {siteConfig.name}
          </div>
          <p className="text-sm">{siteConfig.tagline}</p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/packages" className="hover:text-gold-400">Book a Consultation</Link></li>
            <li><Link to="/kundli" className="hover:text-gold-400">Kundli Request</Link></li>
            <li><Link to="/horoscope" className="hover:text-gold-400">Daily Horoscope</Link></li>
            <li><Link to="/testimonials" className="hover:text-gold-400">Testimonials</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-gold-400">About Amit Joshi</Link></li>
            <li><Link to="/faq" className="hover:text-gold-400">FAQs</Link></li>
            <li><Link to="/contact" className="hover:text-gold-400">Contact Us</Link></li>
            <li><Link to="/admin" className="hover:text-gold-400">Astrologer / Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>{siteConfig.contact.email}</li>
            <li>{siteConfig.contact.phone}</li>
            <li>{siteConfig.contact.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  )
}
