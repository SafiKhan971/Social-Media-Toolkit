import Menu from '../components/Menu'
import viteLogo from '../assets/vite.svg'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-green-400">
      <Menu />
      <div className="flex flex-col items-center mt-15">
        <img src={viteLogo} alt="Vite logo" className="mb-4 h-16 w-16" />
        <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-semibold text-neutral-800">
            Welcome
          </h1>
          <p className="mt-2 text-neutral-500">
            Welcome to the Social Media Toolkit.
          </p>
        </div>
      </div>
    </div>
  )
}