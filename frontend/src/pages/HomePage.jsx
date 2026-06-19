import { Link } from 'react-router-dom'
import Menu from '../components/Menu'
import smtLogo from '../assets/smt-logo.svg'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700">
      <Menu />

      <div className="mx-auto max-w-6xl px-6 py-16">
        
        {/* HERO SECTION */}
        <div className="grid items-center gap-10 md:grid-cols-2">

          {/* LEFT TEXT */}
          <div className="text-white">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Create Social Media Posts in Seconds
            </h1>

            <p className="mt-4 text-white/90 text-lg">
              Generate Instagram-ready posts with AI. 
              Get images, captions, and downloadable content for any business instantly.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-6 flex gap-4">
              <Link
                to="/post"
                className="cursor-pointer rounded-md bg-white px-5 py-3 font-semibold text-green-700"
              >
                🚀 Try Generator
              </Link>

              <Link
                to="/business"
                className="cursor-pointer rounded-md border border-white px-5 py-3 text-white"
              >
                📦 View Demo
              </Link>
            </div>

            <p className="mt-3 text-sm text-white/80">
              No signup required • Free to start
            </p>
          </div>

          {/* RIGHT DEMO CARD */}
          <div className="rounded-xl bg-white p-6 shadow-xl">
            <img
              src={smtLogo}
              alt="SMT logo"
              className="mx-auto mb-4 h-20 w-20"
            />

            <h2 className="text-xl font-semibold text-gray-800">
              What you get
            </h2>

            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>✔ AI-generated captions</li>
              <li>✔ High-quality images</li>
              <li>✔ Instagram 1080x1080 format</li>
              <li>✔ Bulk download (ZIP)</li>
              <li>✔ Save posts to dashboard</li>
            </ul>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="mt-20 grid gap-6 md:grid-cols-3 text-white">

          <div className="rounded-lg bg-white/10 p-6 backdrop-blur">
            <h3 className="font-semibold">⚡ Instant Generation</h3>
            <p className="mt-2 text-sm text-white/80">
              Create multiple posts in seconds with AI.
            </p>
          </div>

          <div className="rounded-lg bg-white/10 p-6 backdrop-blur">
            <h3 className="font-semibold">📱 Instagram Ready</h3>
            <p className="mt-2 text-sm text-white/80">
              Auto 1080x1080 images optimized for social media.
            </p>
          </div>

          <div className="rounded-lg bg-white/10 p-6 backdrop-blur">
            <h3 className="font-semibold">📦 Bulk Export</h3>
            <p className="mt-2 text-sm text-white/80">
              Download all posts as ZIP with one click.
            </p>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="mt-20 text-center text-white">
          <h2 className="text-3xl font-bold">
            Start creating content in seconds
          </h2>

          <p className="mt-2 text-white/80">
            Stop wasting time designing posts manually.
          </p>

          <Link
            to="/post"
            className="mt-6 inline-block cursor-pointer rounded-md bg-white px-6 py-3 font-semibold text-green-700"
          >
            🚀 Go to Generator
          </Link>
        </div>
      </div>
    </div>
  )
}
