import Image from 'next/image'
import { BASE } from '../base'

// Muallif belgisi: JM monogrammasi + ikki qator — "created by" kichik, muallif nomi pastda
export function Credit() {
  return (
    <a
      href="http://mirkhadjayev.uz/"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 font-mono no-underline"
    >
      <Image src={`${BASE}/images/jm-logo.png`} alt="" width={32} height={32} className="h-8 w-8" />
      <span className="flex flex-col items-end">
        <span className="text-[10px] tracking-[0.04em] text-paper/50">created by</span>
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-gold transition-colors duration-500 group-hover:text-paper">
          jmirkhadjayev
          <span aria-hidden="true" className="text-gold transition-transform duration-500 group-hover:rotate-45">
            ↗
          </span>
        </span>
      </span>
    </a>
  )
}
