// Muallif belgisi: ikki qator — "created by" kichik, muallif nomi pastda; sichqoncha ustida oltinga o‘tadi
export function Credit() {
  return (
    <a
      href="http://mirkhadjayev.uz/"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex flex-col items-end font-mono no-underline"
    >
      <span className="text-[10px] tracking-[0.04em] text-paper/50">created by</span>
      <span className="flex items-center gap-1.5 text-[13px] font-semibold text-gold transition-colors duration-500 group-hover:text-paper">
        jmirkhadjayev
        <span aria-hidden="true" className="text-gold transition-transform duration-500 group-hover:rotate-45">
          ↗
        </span>
      </span>
    </a>
  )
}
