import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import ExploreServices from './pages/ExploreServices'
import ServiceDetails from './pages/ServiceDetails'
import Creators from './pages/Creators'
import CreatorProfile from './pages/CreatorProfile'
import Categories from './pages/Categories'
import Wishlist from './pages/Wishlist'
import Inquiry from './pages/Inquiry'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import Overview from './dashboard/Overview'
import MyProfile from './dashboard/MyProfile'
import MyServices from './dashboard/MyServices'
import MyPortfolio from './dashboard/MyPortfolio'
import Inquiries from './dashboard/Inquiries'
import Settings from './dashboard/Settings'

export default function App() {
  const { pathname } = useLocation()
  const inDashboard = pathname.startsWith('/dashboard')

  return (
    <div className="flex min-h-screen flex-col" id="top">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ExploreServices />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/creators/:id" element={<CreatorProfile />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Overview />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="services" element={<MyServices />} />
            <Route path="portfolio" element={<MyPortfolio />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!inDashboard && <Footer />}
    </div>
  )
}
