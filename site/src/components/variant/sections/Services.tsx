import { seedServices } from '@/lib/seed-data'
import type { Dict, Lang } from '../i18n'
import { pad } from '../format'
import { SectionHead } from '../ui/SectionHead'

// Ticker: xizmat nomlari cheksiz lentada (harakat kamaytirilganda o‘chadi — CSS)
export function Ticker({ lang }: { lang: Lang }) {
  return (
    <div className="relative z-10 overflow-hidden bg-navy py-5 text-paper" aria-hidden="true">
      <div className="marquee flex w-max items-center gap-10 whitespace-nowrap font-serif text-3xl md:text-4xl">
        {[...seedServices, ...seedServices].map((s, i) => (
          <span key={i} className="flex items-center gap-10">
            {s.title[lang]}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// 3-bo‘lim: xizmatlar kartalari
export function Services({ lang, t }: { lang: Lang; t: Dict }) {
  return (
    <section id="services" className="relative z-10 scroll-mt-20 bg-paper px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <SectionHead index="02" kicker={t.sections.services.kicker} title={t.sections.services.title} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {seedServices.map((s, i) => (
            <article
              key={s.title.uz}
              data-index-row
              className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-3xl border border-navy/10 bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_60px_-30px_rgba(11,37,69,0.35)] md:p-8"
            >
              <div className="flex items-start justify-between">
                <span className="font-serif text-5xl leading-none text-gold">{pad(i + 1)}</span>
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 transition-all duration-500 group-hover:rotate-45 group-hover:bg-navy group-hover:text-paper"
                >
                  →
                </span>
              </div>
              <div className="mt-12">
                <h3 className="font-sans text-2xl font-semibold tracking-[-0.02em]">{s.title[lang]}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-steel">{s.text[lang]}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
