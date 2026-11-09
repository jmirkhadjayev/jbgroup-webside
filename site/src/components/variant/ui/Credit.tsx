// Muallif belgisi: ixcham, ramkasiz; harflar sakraydi, signal nuqtasi pulsatsiya qiladi
export function Credit() {
  return (
    <a
      href="http://mirkhadjayev.uz/"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2.5 no-underline"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/50">created by</span>
      <span className="flex font-sans text-[13px] font-semibold tracking-[-0.01em]">
        {'jmirkhadjayev'.split('').map((ch, i) => (
          <span
            key={i}
            className="inline-block bg-gradient-to-b from-paper to-gold bg-clip-text text-transparent transition-transform duration-500 group-hover:-translate-y-0.5"
            style={{ transitionDelay: `${i * 35}ms` }}
          >
            {ch}
          </span>
        ))}
      </span>
      <span aria-hidden="true" className="text-[11px] text-gold transition-transform duration-500 group-hover:rotate-45">
        ↗
      </span>
    </a>
  )
}
