import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminProtectedRoute } from './components/AdminProtectedRoute'

import Home from './pages/Home'
import About from './pages/About'
import Packages from './pages/Packages'
import PackageBooking from './pages/PackageBooking'
import Kundli from './pages/Kundli'
import KundliMatching from './pages/KundliMatching'
import Numerology from './pages/Numerology'
import Horoscope from './pages/Horoscope'
import HoroscopeDetail from './pages/HoroscopeDetail'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Testimonials from './pages/Testimonials'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLeads from './pages/admin/AdminLeads'
import AdminPackages from './pages/admin/AdminPackages'
import AdminAstrologer from './pages/admin/AdminAstrologer'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminFaqs from './pages/admin/AdminFaqs'
import AdminHoroscopes from './pages/admin/AdminHoroscopes'
import AdminBlog from './pages/admin/AdminBlog'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/book/:slug" element={<PackageBooking />} />
        <Route path="/kundli" element={<Kundli />} />
        <Route path="/kundli-matching" element={<KundliMatching />} />
        <Route path="/numerology" element={<Numerology />} />
        <Route path="/horoscope" element={<Horoscope />} />
        <Route path="/horoscope/:sign" element={<HoroscopeDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Navigate to="leads" replace />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="astrologer" element={<AdminAstrologer />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="faqs" element={<AdminFaqs />} />
        {/* <Route path="horoscopes" element={<AdminHoroscopes />} /> */}
        <Route path="blog" element={<AdminBlog />} />
      </Route>

      <Route path="*" element={<Layout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
