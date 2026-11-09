import Image from 'next/image'
import { seedWarehouses } from '@/lib/seed-data'
import type { Dict, Lang } from '../i18n'
import { BASE } from '../base'
import { GALLERY_SPAN } from '../constants'
import { fmt, pad } from '../format'
import { SectionHead } from '../ui/SectionHead'

type L = { uz: string; ru: string; en: string }
type Card = { image: string; name: L; type: L; area?: number; span: string }

// Stellaj qatorlari fotolari — ombor galereyasi oxirida, to‘liq kenglikda (maydon ma’lum emas, ko‘rsatilmaydi)
const RACK_CARDS: Card[] = [
  {
    image: 'ombor-a-qator.png',
    name: { uz: 'A. Stellaj yo‘laklari (A1–A6)', ru: 'A. Стеллажные ряды (A1–A6)', en: 'A. Racking aisles (A1–A6)' },
    type: { uz: 'Stellaj tizimi', ru: 'Стеллажная система', en: 'Racking system' },
    span: 'lg:col-span-2',
  },
  {
    image: 'ombor-b-qator.png',
    name: { uz: 'B. Stellaj yo‘laklari (B2–B6)', ru: 'B. Стеллажные ряды (B2–B6)', en: 'B. Racking aisles (B2–B6)' },
    type: { uz: 'Stellaj tizimi', ru: 'Стеллажная система', en: 'Racking system' },
    span: 'lg:col-span-2',
  },
]

const CARDS: Card[] = [
  ...seedWarehouses.map((w, i) => ({ ...w, span: GALLERY_SPAN[i] ?? '' })),
  ...RACK_CARDS,
]

// 5-bo‘lim: ombor galereyasi. Kartani bosganda to‘liq ekranda kattalashadi (openZoom).
export function Warehouses({
  lang,
  t,
  openZoom,
}: {
  lang: Lang
  t: Dict
  openZoom: (src: string, alt: string) => void
}) {
  return (
    <section id="warehouses" className="relative z-10 scroll-mt-20 bg-[#f6f6f2] px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <SectionHead index="03" kicker={t.sections.warehouses.kicker} title={t.sections.warehouses.title} />
        <div className="grid auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Kirish majmuasi: birinchi, to‘liq kenglikda */}
          <figure data-reveal className="group relative overflow-hidden rounded-3xl bg-navy lg:col-span-4">
            <button
              type="button"
              onClick={() => openZoom(`${BASE}/images/kirish-majmuasi.jpg`, t.gate.name)}
              aria-label={`${t.ui.enlarge}: ${t.gate.name}`}
              className="absolute inset-0 z-10 cursor-zoom-in"
            />
            <Image
              src={`${BASE}/images/kirish-majmuasi.jpg`}
              alt={t.gate.name}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" />
            <span className="pointer-events-none absolute right-5 top-5 z-20 rounded-full bg-navy/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-paper/90 backdrop-blur">
              {t.ui.enlarge}
            </span>
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 grid gap-2 p-6 text-paper md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold">{t.gate.type}</p>
              <h3 className="font-sans text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{t.gate.name}</h3>
            </figcaption>
          </figure>

          {CARDS.map((w, i) => (
            <figure
              key={w.image}
              data-reveal
              className={`group relative overflow-hidden rounded-3xl bg-navy ${w.span}`}
            >
              <button
                type="button"
                onClick={() => openZoom(`${BASE}/images/${w.image}`, w.name[lang])}
                aria-label={`${t.ui.enlarge}: ${w.name[lang]}`}
                className="absolute inset-0 z-10 cursor-zoom-in"
              />
              <Image
                src={`${BASE}/images/${w.image}`}
                alt={w.name[lang]}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" />
              <span className="absolute left-5 top-5 rounded-full bg-navy/50 px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-paper/90 backdrop-blur">
                {pad(i + 1)}
              </span>
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 grid gap-2 p-6 text-paper">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold">{w.type[lang]}</p>
                <div className="flex items-end justify-between gap-3">
                  <h3
                    className={`font-sans font-semibold tracking-[-0.03em] ${i === 0 ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}
                  >
                    {w.name[lang]}
                  </h3>
                  {w.area !== undefined && <p className="shrink-0 font-mono text-sm text-paper/85">{fmt(w.area)} m²</p>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </section>
  )
}
