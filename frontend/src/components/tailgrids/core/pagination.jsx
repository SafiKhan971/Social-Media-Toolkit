function ArrowLeft({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  )
}

function ArrowRight({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  )
}

export function Pagination({ currentPage, totalPages, onPageChange, sideLayout = "full" }) {
  function getPageItems() {
    // Always show first, last, current, and one on each side of current
    const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1])

    const sorted = [...pages]
      .filter(p => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b)

    const items = []
    let prev = 0
    for (const page of sorted) {
      if (prev && page - prev > 1) {
        items.push({ type: "ellipsis", key: `ellipsis-${page}` })
      }
      items.push({ type: "page", value: page, key: page })
      prev = page
    }

    return items
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </button>

      {sideLayout === "full" && (
        <div className="flex items-center gap-1">
          {getPageItems().map(item =>
            item.type === "ellipsis" ? (
              <span key={item.key} className="px-1 text-sm text-neutral-400">
                ...
              </span>
            ) : (
              <button
                key={item.key}
                type="button"
                onClick={() => onPageChange(item.value)}
                className={`h-8 w-8 rounded-md text-sm font-medium transition cursor-pointer ${
                  item.value === currentPage
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {item.value}
              </button>
            )
          )}
        </div>
      )}

      {sideLayout !== "full" && (
        <span className="text-sm text-neutral-600 cursor-pointer">
          Page {currentPage} of {totalPages}
        </span>
      )}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
      >
        Next
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}