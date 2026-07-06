const COLOR_STYLES = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  neutral: "bg-neutral-100 text-neutral-700",
}

export function Badge({ children, color = "neutral", prefixIcon, className = "" }) {
  const colorClass = COLOR_STYLES[color] || COLOR_STYLES.neutral

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${colorClass} ${className}`}
    >
      {prefixIcon}
      {children}
    </span>
  )
}