import Image from 'next/image'
import { seedSettings } from '@/lib/seed-data'
import type { Dict } from '../i18n'
import { LOGO, PHONE_HREF } from '../constants'

// Footer (soddalashgan): markazda logotip, bitta qator aloqa, pastda huquqlar
export function Footer({ t }: { t: Dict }) {
  return (
    <footer className="relative z-10 bg-navy-2 px-6 py-12 text-center text-paper md:px-16">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-5">
        <Image src={LOGO.dark} alt="JB GROUP" width={LOGO.width} height={LOGO.height} className="h-10 w-auto" />

        <p className="font-mono text-[12px] tracking-[0.08em] text-paper/70">
          <a href={PHONE_HREF} className="no-underline hover:text-gold">
            {seedSettings.phone}
          </a>
          <span className="mx-3 text-gold">·</span>
          <a href={`mailto:${seedSettings.email}`} className="no-underline hover:text-gold">
            {seedSettings.email}
          </a>
        </p>

        <p className="font-mono text-[11px] text-paper/45">
          © {new Date().getFullYear()} JB GROUP. {t.rights}
        </p>
      </div>
    </footer>
  )
}
