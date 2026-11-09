import { seedSettings } from '@/lib/seed-data'
import type { Dict } from '../i18n'
import { fmt } from '../format'

// 6-bo‘lim: asosiy raqamlar — uchta to‘q ko‘k karta (sanoq animatsiyasi GSAP da)
export function Metrics({ t }: { t: Dict }) {
  const metrics = [
    { value: seedSettings.stats.area, label: t.stats.area },
    { value: seedSettings.stats.capacity, label: t.stats.capacity },
    { value: seedSettings.stats.years, label: t.stats.years },
  ]

  return (
    <section className="relative z-10 bg-paper px-6 pb-24 md:px-16 md:pb-32">
      <div className="mx-auto grid max-w-[1280px] gap-4 md:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="group relative overflow-hidden rounded-3xl bg-navy p-8 text-paper md:p-10">
            <span
              aria-hidden="true"
              className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gold/25 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
            />
            <p className="relative font-sans text-6xl font-semibold leading-none tracking-[-0.04em] md:text-7xl" data-count={m.value}>
              {fmt(m.value)}
            </p>
            <p className="relative mt-5 font-mono text-[11px] uppercase tracking-[0.1em] text-gold">{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
