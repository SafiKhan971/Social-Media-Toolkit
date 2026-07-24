import { useState, useEffect } from 'react'

const themes = [
  {
    id: 'default',
    name: 'Default',
    desc: 'Original Green Gradient',
    bg: '#22c55e',
    card: '#ffffff'
  },
  {
    id: 'combo1',
    name: 'Mint & Charcoal',
    desc: 'Mint green background, dark charcoal cards',
    bg: '#B8F7E4',
    card: '#25272C'
  },
  {
    id: 'combo2',
    name: 'Cream & Orange',
    desc: 'Cream background, bright orange cards',
    bg: '#FFF4D6',
    card: '#FC6C26'
  },
  {
    id: 'combo3',
    name: 'Off-White & Olive',
    desc: 'Off-white background, dark olive green cards',
    bg: '#F4F6E8',
    card: '#5F8651'
  }
]

export default function ThemeSelector() {
  const [activeTheme, setActiveTheme] = useState('default')
  const [hoveredTheme, setHoveredTheme] = useState(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'default'
    setActiveTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (themeId) => {
    localStorage.setItem('app-theme', themeId)
    setActiveTheme(themeId)

    if (themeId === 'default') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', themeId)
    }
  }

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[9999] flex flex-col items-center gap-3 bg-white/95 dark:bg-neutral-900/95 p-3 rounded-full shadow-2xl border border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-md transition-all duration-300">
      <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider select-none mb-1">
        Theme
      </div>

      <div className="flex flex-col gap-3">
        {themes.map((theme) => {
          const isActive = activeTheme === theme.id
          return (
            <div key={theme.id} className="relative group">
              <button
                onClick={() => applyTheme(theme.id)}
                onMouseEnter={() => setHoveredTheme(theme.id)}
                onMouseLeave={() => setHoveredTheme(null)}
                aria-label={`Switch to ${theme.name} theme`}
                className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer relative ${isActive
                  ? 'border-indigo-500 dark:border-indigo-400 scale-105 shadow-md ring-2 ring-indigo-200 dark:ring-indigo-800'
                  : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400'
                  }`}
              >
                {/* Visual split color circle */}
                <div className="absolute inset-0 flex rotate-45 scale-120">
                  <div
                    className="w-1/2 h-full"
                    style={{ backgroundColor: theme.bg }}
                  />
                  <div
                    className="w-1/2 h-full"
                    style={{ backgroundColor: theme.card }}
                  />
                </div>
              </button>

              {/* Enhanced Tooltip */}
              <div
                className={`absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 ${hoveredTheme === theme.id
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-2'
                  }`}
              >
                <div className="bg-neutral-900 dark:bg-neutral-850 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-neutral-800 flex flex-col">
                  <span className="font-bold text-neutral-100">{theme.name}</span>
                  <span className="text-[10px] text-neutral-400">{theme.desc}</span>
                </div>
                {/* Tooltip caret */}
                <div className="absolute top-1/2 -translate-y-1/2 right-[-4px] w-2 h-2 bg-neutral-900 border-r border-t border-neutral-800 rotate-45" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
