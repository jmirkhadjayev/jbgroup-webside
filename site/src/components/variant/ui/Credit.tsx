import Image from 'next/image'
import { BASE } from '../base'

// Muallif belgisi: JM monogrammasi kichik shisha (liquid glass) ramkada + ikki qator matn
export function Credit() {
  return (
    <a
      href="http://mirkhadjayev.uz/"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 font-mono no-underline"
    >
      <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] border border-white/25 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_20px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"
        />
        <Image src={`${BASE}/images/jm-logo.png`} alt="" width={256} height={256} className="relative h-8 w-8 object-contain" />
      </span>
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
