import Image from 'next/image'
import { seedSettings } from '@/lib/seed-data'
import type { Dict } from '../i18n'
import { LOGO } from '../constants'
import { Credit } from '../ui/Credit'

// Footer: ixcham konveyer lentasi (ma’lumotlar sirpanadi) va yorliq ko‘rinishidagi uchta katakcha
export function Footer({ t }: { t: Dict }) {
  const items = [t.tagline, seedSettings.phone, seedSettings.email, 'JB GROUP']

  return (
    <footer className="relative z-10 bg-navy-2 text-paper">
      {/* Konveyer lentasi */}
      <div className="overflow-hidden border-y border-gold/25 bg-navy py-3" aria-hidden="true">
        <div className="marquee flex w-max items-center gap-8 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
          {[...items, ...items].map((s, i) => (
            <span key={i} className="flex items-center gap-8">
              {s}
              <span className="text-paper/40">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Yorliqlar: punktir chegarali, sklad etiketkalariga o‘xshash */}
      <div className="mx-auto grid max-w-[1280px] gap-3 px-6 py-8 md:grid-cols-3 md:px-16">
        <div className="flex items-center rounded-lg border border-dashed border-paper/25 p-4">
          <Image src={LOGO.dark} alt="JB GROUP" width={LOGO.width} height={LOGO.height} className="h-10 w-auto" />
        </div>
        <p className="flex items-center rounded-lg border border-dashed border-paper/25 p-4 font-mono text-[11px] text-paper/60">
          © {new Date().getFullYear()} JB GROUP. {t.rights}
        </p>
        <div className="flex items-center rounded-lg border border-dashed border-paper/25 p-4">
          <Credit />
        </div>
      </div>
    </footer>
  )
}
