// Muhr: SVG aylana, matn ikki qatorda
export function Stamp({ main, sub }: { main: string; sub: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="100" y="94" textAnchor="middle" fontSize="15" fontWeight="600" fill="currentColor" letterSpacing="1">
        {main}
      </text>
      <text x="100" y="120" textAnchor="middle" fontSize="11" fill="currentColor" letterSpacing="1">
        {sub}
      </text>
    </svg>
  )
}
