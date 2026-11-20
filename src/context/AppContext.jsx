import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { creators as seedCreators } from '../data/creators'
import { services as seedServices } from '../data/services'
import { seedInquiries } from '../data/seedInquiries'
import { uid } from '../utils/helpers'
import { poolImage } from '../data/images'

const AppContext = createContext(null)

const defaultSettings = {
  currentCreatorId: 'c1',
  emailNotifications: true,
  showEmailPublicly: true,
  availableForWork: true,
  compactDashboard: false,
}

export function AppProvider({ children }) {
  const [creators, setCreators] = useLocalStorage('creatorspace:creators', seedCreators)
  const [services, setServices] = useLocalStorage('creatorspace:services', seedServices)
  const [inquiries, setInquiries] = useLocalStorage('creatorspace:inquiries', seedInquiries)
  const [settings, setSettings] = useLocalStorage('creatorspace:settings', defaultSettings)

  const currentCreator = creators.find((c) => c.id === settings.currentCreatorId) || creators[0]

  const getCreator = useCallback((id) => creators.find((c) => c.id === id), [creators])
  const getService = useCallback((id) => services.find((s) => s.id === id), [services])

  // ---- Creators / profile ----
  const updateCreator = (id, changes) =>
    setCreators((prev) => prev.map((c) => (c.id === id ? { ...c, ...changes } : c)))

  // ---- Services ----
  const addService = (creatorId, data) => {
    const category = data.category
    const price = Number(data.price)
    const image = data.image || poolImage(category, 0, 900)
    const service = {
      id: uid('s'),
      creatorId,
      title: data.title,
      category,
      shortDescription: data.shortDescription,
      description: data.description || data.shortDescription,
      image,
      gallery: [image],
      price,
      deliveryDays: Number(data.deliveryDays) || 3,
      rating: 0,
      reviewsCount: 0,
      skills: data.skills || [],
      packages: [
        { name: 'Basic', price, delivery: Number(data.deliveryDays) || 3, features: ['Core deliverable', 'One revision'] },
        { name: 'Standard', price: Math.round(price * 2), delivery: (Number(data.deliveryDays) || 3) + 2, features: ['Core deliverable', 'Three revisions', 'Source files'] },
        { name: 'Premium', price: Math.round(price * 3.5), delivery: (Number(data.deliveryDays) || 3) + 5, features: ['Core deliverable', 'Unlimited revisions', 'Source files', 'Priority support'] },
      ],
    }
    setServices((prev) => [service, ...prev])
    return service
  }

  const updateService = (id, data) =>
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        const price = Number(data.price)
        const delivery = Number(data.deliveryDays) || s.deliveryDays
        const image = data.image || s.image
        return {
          ...s,
          ...data,
          price,
          deliveryDays: delivery,
          image,
          gallery: s.gallery && s.gallery.length ? [image, ...s.gallery.slice(1)] : [image],
          packages: [
            { ...s.packages[0], price, delivery },
            { ...s.packages[1], price: Math.round(price * 2), delivery: delivery + 2 },
            { ...s.packages[2], price: Math.round(price * 3.5), delivery: delivery + 5 },
          ],
        }
      })
    )

  const deleteService = (id) => setServices((prev) => prev.filter((s) => s.id !== id))

  // ---- Portfolio ----
  const addProject = (creatorId, data) =>
    setCreators((prev) =>
      prev.map((c) =>
        c.id === creatorId
          ? {
              ...c,
              portfolio: [
                { id: uid('p'), ...data, image: data.image || poolImage(data.category, 1, 800) },
                ...c.portfolio,
              ],
            }
          : c
      )
    )
  const updateProject = (creatorId, projectId, data) =>
    setCreators((prev) =>
      prev.map((c) =>
        c.id === creatorId
          ? { ...c, portfolio: c.portfolio.map((p) => (p.id === projectId ? { ...p, ...data, image: data.image || p.image } : p)) }
          : c
      )
    )
  const deleteProject = (creatorId, projectId) =>
    setCreators((prev) =>
      prev.map((c) => (c.id === creatorId ? { ...c, portfolio: c.portfolio.filter((p) => p.id !== projectId) } : c))
    )

  // ---- Inquiries ----
  const addInquiry = (data) => {
    const inquiry = { id: uid('inq'), status: 'Pending', createdAt: new Date().toISOString(), ...data }
    setInquiries((prev) => [inquiry, ...prev])
    return inquiry
  }
  const updateInquiryStatus = (id, status) =>
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
  const deleteInquiry = (id) => setInquiries((prev) => prev.filter((i) => i.id !== id))

  const updateSettings = (changes) => setSettings((prev) => ({ ...prev, ...changes }))

  const resetDemoData = () => {
    setCreators(seedCreators)
    setServices(seedServices)
    setInquiries(seedInquiries)
    setSettings(defaultSettings)
  }

  const value = useMemo(
    () => ({
      creators, services, inquiries, settings, currentCreator,
      getCreator, getService,
      updateCreator, addService, updateService, deleteService,
      addProject, updateProject, deleteProject,
      addInquiry, updateInquiryStatus, deleteInquiry,
      updateSettings, resetDemoData,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [creators, services, inquiries, settings, getCreator, getService]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
