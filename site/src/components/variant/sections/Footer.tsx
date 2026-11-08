import Image from 'next/image'
import type { Dict } from '../i18n'
import { LOGO } from '../constants'
import { Credit } from '../ui/Credit'

// Footer: logotip, tagline, huquqlar va muallif belgisi
export function Footer({ t }: { t: Dict }) {
  return (
    <footer className="relative z-10 bg-navy-2 px-6 py-12 text-paper md:px-16">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-5">
          <Image src={LOGO.dark} alt="JB GROUP" width={LOGO.width} height={LOGO.height} className="h-14 w-auto" />
          <span className="font-sans text-base font-medium">{t.tagline}</span>
        </div>
        <p className="font-mono text-[11px] text-paper/60">
          © {new Date().getFullYear()} JB GROUP. {t.rights}
        </p>
        <Credit />
      </div>
    </footer>
  )
}
