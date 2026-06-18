import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BusinessPage from './pages/BusinessPage'
import PostPage from './pages/PostPage'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/post" element={<PostPage />} />
      </Routes>
    </>
  )
}
