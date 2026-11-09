import Image from 'next/image'
import { seedSettings } from '@/lib/seed-data'
import type { Dict, Lang } from '../i18n'
import { LOGO, PHONE_HREF } from '../constants'
import { Credit } from '../ui/Credit'

// Footer: uchta teng karta — manzil, aloqa, huquqlar; pastda logotip va muallif belgisi
export function Footer({ t, lang }: { t: Dict; lang: Lang }) {
  const cardCls = 'flex flex-col gap-3 rounded-2xl border border-paper/10 bg-navy/60 p-6'
  const labelCls = 'font-mono text-[10px] uppercase tracking-[0.12em] text-gold'

  return (
    <footer className="relative z-10 bg-navy-2 px-6 py-10 text-paper md:px-16">
      <div className="mx-auto grid max-w-[1280px] gap-4 md:grid-cols-3">
        <div className={cardCls}>
          <p className={labelCls}>{t.contact.address}</p>
          <p className="text-[15px] leading-relaxed">{seedSettings.address[lang]}</p>
        </div>

        <div className={cardCls}>
          <p className={labelCls}>{t.contact.phone}</p>
          <a href={PHONE_HREF} className="text-[15px] no-underline hover:text-gold">
            {seedSettings.phone}
          </a>
          <a href={`mailto:${seedSettings.email}`} className="text-[15px] no-underline hover:text-gold">
            {seedSettings.email}
          </a>
        </div>

        <div className={cardCls}>
          <p className={labelCls}>{t.contact.license}</p>
          <p className="text-[15px]">{seedSettings.license}</p>
          <p className="font-mono text-[11px] text-paper/60">
            © {new Date().getFullYear()} JB GROUP. {t.rights}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1280px] flex-col items-center justify-between gap-4 md:flex-row">
        <Image src={LOGO.dark} alt="JB GROUP" width={LOGO.width} height={LOGO.height} className="h-9 w-auto" />
        <Credit />
      </div>
    </footer>
  )
}
