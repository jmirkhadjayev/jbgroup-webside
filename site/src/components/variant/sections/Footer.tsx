import Image from 'next/image'
import { seedSettings } from '@/lib/seed-data'
import type { Dict, Lang } from '../i18n'
import { LOGO } from '../constants'
import { Credit } from '../ui/Credit'

// Footer: yuk xatidagi ko‘rinish — oq "chek" kartasi (pastki chetida perforatsiya), shtrix-kod va ma’lumotlar
export function Footer({ t, lang }: { t: Dict; lang: Lang }) {
  const rows = [
    { label: t.contact.address, value: seedSettings.address[lang] },
    { label: t.contact.phone, value: seedSettings.phone },
    { label: t.contact.email, value: seedSettings.email },
    { label: t.contact.hours, value: seedSettings.hours[lang] },
  ]

  return (
    <footer className="relative z-10 bg-navy-2 px-6 pb-8 pt-16 text-paper md:px-16">
      <div className="relative mx-auto max-w-[1280px] rounded-2xl bg-paper px-6 py-8 text-navy md:px-10">
        {/* Perforatsiya: karta pastki chetidagi nuqtali kesik chiziq */}
        <span
          aria-hidden="true"
          className="absolute inset-x-6 -bottom-px h-px border-t border-dashed border-navy/30 md:inset-x-10"
        />

        <div className="grid gap-8 md:grid-cols-[auto_1fr_1fr] md:items-start">
          <div className="flex flex-col gap-4">
            <Image src={LOGO.src} alt="JB GROUP" width={LOGO.width} height={LOGO.height} className="h-14 w-auto" />
            <p className="font-serif text-xl leading-tight">{t.tagline}</p>
          </div>

          <dl className="grid grid-cols-[6rem_1fr] gap-x-4 gap-y-3 text-sm">
            {rows.map((r) => (
              <div key={r.label} className="contents">
                <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-navy/55">{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-navy/55">{t.contact.license}</p>
            <p className="text-sm">{seedSettings.license}</p>
            {/* Shtrix-kod: matn o‘rniga dekorativ chiziqlar */}
            <div
              aria-hidden="true"
              className="mt-2 h-12 w-full bg-[repeating-linear-gradient(90deg,#0b2545_0_2px,transparent_2px_4px,#0b2545_4px_5px,transparent_5px_8px,#0b2545_8px_11px,transparent_11px_13px,#0b2545_13px_14px,transparent_14px_17px)] opacity-80"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-[1280px] flex-col items-center justify-between gap-4 md:flex-row">
        <p className="font-mono text-[11px] text-paper/60">
          © {new Date().getFullYear()} JB GROUP. {t.rights}
        </p>
        <Credit />
      </div>
    </footer>
  )
}
