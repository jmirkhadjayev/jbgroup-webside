// Muallif belgisi: ramkasiz matn; nom tagidagi oltin chiziq hover'da to‘liq ochiladi
export function Credit() {
  return (
    <a
      href="http://mirkhadjayev.uz/"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex flex-col items-start gap-1 no-underline"
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/50">created by</span>
      <span className="flex items-center gap-1.5 font-sans text-[13px] font-semibold text-gold">
        jmirkhadjayev
        <span aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-45">
          ↗
        </span>
      </span>
      <span
        aria-hidden="true"
        className="block h-px w-full origin-left scale-x-50 bg-gold transition-transform duration-700 ease-out group-hover:scale-x-100"
      />
    </a>
  )
}
