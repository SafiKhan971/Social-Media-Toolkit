import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BusinessPage from './pages/BusinessPage'
import PostPage from './pages/PostPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/business" element={ <ProtectedRoute> <BusinessPage /> </ProtectedRoute> } />
        <Route path="/post" element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  )
}
