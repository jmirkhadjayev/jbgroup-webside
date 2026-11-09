// Muallif belgisi: kapsula ichida, hover’da oltin yorug‘lik o‘tadi, nomi serif kursivda, harflar sakraydi
export function Credit() {
  return (
    <a
      href="http://mirkhadjayev.uz/"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-gold/40 py-1.5 pl-3 pr-4 no-underline transition-colors duration-500 hover:border-gold"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-gold/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
      </span>
      <span className="relative font-mono text-[9px] uppercase tracking-[0.18em] text-paper/50">created by</span>
      <span className="relative flex font-serif text-[15px] italic text-gold">
        {'jmirkhadjayev'.split('').map((ch, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-500 group-hover:-translate-y-0.5"
            style={{ transitionDelay: `${i * 30}ms` }}
          >
            {ch}
          </span>
        ))}
      </span>
      <span
        aria-hidden="true"
        className="relative flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] text-navy transition-transform duration-500 group-hover:rotate-45"
      >
        ↗
      </span>
    </a>
  )
}
