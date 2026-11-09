import Image from 'next/image'
import type { Dict } from '../i18n'
import { LOGO } from '../constants'
import { Credit } from '../ui/Credit'

// Footer: katta serif shior, pastda konturli "JB GROUP" belgisi, huquqlar va muallif belgisi
export function Footer({ t }: { t: Dict }) {
  return (
    <footer className="relative z-10 overflow-hidden bg-navy-2 px-6 pb-8 pt-20 text-paper md:px-16">
      {/* Fon belgisi: ekran eniga yoyilgan kontur matn, pastdan chala ko‘rinadi */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.2em] left-0 right-0 select-none whitespace-nowrap text-center font-sans text-[22vw] font-black leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgba(201,162,39,0.3)]"
      >
        JB GROUP
      </div>

      <div className="relative mx-auto max-w-[1280px]">
        <p className="max-w-[18ch] font-serif text-[clamp(2.2rem,5.5vw,4.8rem)] leading-[1.02] tracking-[-0.02em]">
          {t.tagline}
        </p>

        <div className="mt-16 grid gap-8 border-t border-gold/30 pt-6 md:grid-cols-[auto_1fr_auto] md:items-center">
          <Image src={LOGO.dark} alt="JB GROUP" width={LOGO.width} height={LOGO.height} className="h-12 w-auto" />
          <p className="font-mono text-[11px] text-paper/60">
            © {new Date().getFullYear()} JB GROUP. {t.rights}
          </p>
          <Credit />
        </div>
      </div>
    </footer>
  )
}
