import { useState, useRef, useEffect, createContext, useContext } from "react"

const DropdownContext = createContext(null)

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block" ref={ref}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export function DropdownMenuTrigger({ children, className = "" }) {
  const { open, setOpen } = useContext(DropdownContext)
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={className}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({ children, className = "", placement = "bottom end" }) {
  const { open } = useContext(DropdownContext)
  if (!open) return null

  const alignClass = placement.includes("end") ? "right-0" : "left-0"

  return (
    <div
      className={`absolute ${alignClass} top-full z-50 mt-1 min-w-[160px] rounded-lg border border-neutral-200 bg-white shadow-lg ${className}`}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, onClick, className = "" }) {
  const { setOpen } = useContext(DropdownContext)
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.()
        setOpen(false)
      }}
      className={`block w-full rounded-md px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 ${className}`}
    >
      {children}
    </button>
  )
}