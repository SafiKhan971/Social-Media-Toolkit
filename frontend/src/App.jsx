import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BusinessForm from './pages/businesses/BusinessForm'
import BusinessIndex from './pages/businesses/BusinessIndex'
import PostPage from './pages/posts/PostPage'
import PackagesIndex from './pages/packages/PackagesIndex'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import CategoryPage from './pages/categories/CategoryPage'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/business" element={<ProtectedRoute> <BusinessIndex /> </ProtectedRoute>} />
        <Route path="/post" element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
        <Route path="/category" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/businesses/:businessId/packages"
          element={<PackagesIndex />}
        />
      </Routes>
    </>
  )
}
