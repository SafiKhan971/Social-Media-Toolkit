export function TableRoot({ children, fullBleed = false, className = "" }) {
  return (
    <div
      className={`w-full overflow-x-auto rounded-xl border border-neutral-200 shadow-sm ${
        fullBleed ? "" : "p-2"
      } ${className}`}
    >
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  )
}

export function TableHeader({ children, className = "" }) {
  return (
    <thead className={`bg-success text-white ${className}`}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className = "" }) {
  return <tbody className={className}>{children}</tbody>
}

export function TableRow({ children, className = "" }) {
  return (
    <tr
      className={`border-b border-neutral-100 hover:bg-green transition ${className}`}
    >
      {children}
    </tr>
  )
}

export function TableHead({ children, scope = "col", className = "" }) {
  return (
    <th
      scope={scope}
      className={`px-4 py-3 text-sm font-semibold ${className}`}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, scope, className = "" }) {
  return (
    <td scope={scope} className={`px-4 py-3 text-sm text-neutral-800 ${className}`}>
      {children}
    </td>
  )
}