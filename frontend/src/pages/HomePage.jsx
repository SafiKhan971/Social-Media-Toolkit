import { Link } from 'react-router-dom'
import Menu from '../components/Menu'
import smtLogo from '../assets/smt-logo.svg'
import logo from '../../public/logo.png'

export default function HomePage() {
  return (
    <div className="min-h-screen app-gradient">
      <Menu />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-12">

        {/* HERO SECTION */}
        <div className="grid items-center gap-10 md:grid-cols-2">

          {/* LEFT TEXT */}
          <div className="text-white">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Create Social Media Posts in Seconds
            </h1>

            <p className="mt-4 text-lg text-white/90">
              Generate Instagram-ready posts with AI.
              Get images, captions, and downloadable content for any business instantly.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/post"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-green-700 shadow-md transition hover:bg-neutral-50 hover:shadow-lg active:scale-95"
              >
                🚀 Try Generator
              </Link>
              <Link
                to="/business"
                className="rounded-lg border-2 border-white/70 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10 active:scale-95"
              >
                📦 View Businesses
              </Link>
            </div>

            <p className="mt-4 text-sm text-white/70">
              No signup required • Free to start
            </p>
          </div>

          {/* RIGHT DEMO CARD */}
          <div className="rounded-2xl bg-white p-6 shadow-2xl">
            <img
              src={logo}
              alt="SMT logo"
              className="mx-auto mb-5 h-36 w-36 rounded-2xl object-contain"
            />
            <h2 className="text-center text-xl font-semibold text-neutral-800">What you get</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-600">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span> AI-generated captions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span> High-quality images
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span> Instagram 1080×1080 format
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span> Bulk download (ZIP)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span> Save posts to dashboard
              </li>
            </ul>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="mt-20 grid gap-5 sm:grid-cols-3">
          {[
            { icon: '⚡', title: 'Instant Generation', desc: 'Create multiple posts in seconds with AI.' },
            { icon: '📱', title: 'Instagram Ready', desc: 'Auto 1080×1080 images optimized for social media.' },
            { icon: '📦', title: 'Bulk Export', desc: 'Download all posts as ZIP with one click.' },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              <div className="mb-2 text-2xl">{icon}</div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-white/80">{desc}</p>
            </div>
          ))}
        </div>

        {/* FINAL CTA */}
        <div className="mt-20 text-center text-white">
          <h2 className="text-3xl font-bold">Start creating content in seconds</h2>
          <p className="mt-2 text-white/80">Stop wasting time designing posts manually.</p>
          <Link
            to="/post"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-green-700 shadow-md transition hover:bg-neutral-50 hover:shadow-lg active:scale-95"
          >
            🚀 Go to Generator
          </Link>
        </div>
      </div>
    </div>
  )
}
