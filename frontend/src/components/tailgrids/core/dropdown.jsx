import { useState, useRef, useEffect, createContext, useContext } from "react"
import { createPortal } from "react-dom"

const DropdownContext = createContext(null)

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        contentRef.current && !contentRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export function DropdownMenuTrigger({ children, className = "" }) {
  const { open, setOpen, triggerRef } = useContext(DropdownContext)
  return (
    <button
      type="button"
      ref={triggerRef}
      onClick={() => setOpen(!open)}
      className={className}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({ children, className = "", placement = "bottom end" }) {
  const { open, triggerRef, contentRef } = useContext(DropdownContext)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const alignEnd = placement.includes("end")

      setPosition({
        top: rect.bottom + window.scrollY + 4, // mt-1 jaisa gap
        left: alignEnd
          ? rect.right + window.scrollX - 160 // 160 = min-width, right align
          : rect.left + window.scrollX,
      })
    }
  }, [open, placement])

  if (!open) return null

  return createPortal(
    <div
      ref={contentRef}
      style={{ position: "absolute", top: position.top, left: position.left }}
      className={`z-50 min-w-[160px] rounded-lg border border-neutral-200 bg-white shadow-lg ${className}`}
    >
      {children}
    </div>,
    document.body
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
      className={`block w-full rounded-md px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 cursor-pointer ${className}`}
    >
      {children}
    </button>
  )
}