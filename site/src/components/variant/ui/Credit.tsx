// Muallif belgisi: aylanadigan matn halqasi ichida oltin nuqta; bosilganda muallif sayti ochiladi
export function Credit() {
  return (
    <a
      href="http://mirkhadjayev.uz/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="created by jmirkhadjayev"
      className="group relative inline-flex h-16 w-16 items-center justify-center text-paper/60 no-underline transition-colors duration-500 hover:text-gold"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <path id="credit-ring" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
        </defs>
        <g style={{ transformOrigin: '50px 50px', animation: 'credit-spin 22s linear infinite' }}>
          <text fontSize="9.5" letterSpacing="2.4" fill="currentColor" fontFamily="var(--font-mono), monospace">
            <textPath href="#credit-ring">CREATED BY · JMIRKHADJAYEV · </textPath>
          </text>
        </g>
      </svg>
      <span className="h-2 w-2 rounded-full bg-gold transition-transform duration-500 group-hover:scale-150" />
    </a>
  )
}
