import { useState, useRef } from "react"

export function LogoHoverPreview({ src, alt }) {
  const [show, setShow] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const imgRef = useRef(null)

  function handleMouseEnter() {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      })
    }
    setShow(true)
  }

  function handleMouseLeave() {
    setShow(false)
  }

  return (
    <>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="h-10 w-10 rounded-full object-cover border border-neutral-200 cursor-pointer"
      />

      {show && (
        <div
          className="fixed z-[9999] -translate-x-1/2 rounded-lg border border-neutral-300 bg-white p-1 shadow-xl"
          style={{ top: coords.top, left: coords.left }}
        >
          <img
            src={src}
            alt={alt}
            className="h-40 w-40 rounded-md object-cover"
          />
        </div>
      )}
    </>
  )
}