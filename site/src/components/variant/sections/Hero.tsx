import Image from 'next/image'
import { seedSettings } from '@/lib/seed-data'
import type { Dict } from '../i18n'
import { LOGO } from '../constants'
import { BASE } from '../base'
import { fmt } from '../format'

// 1-bo‘lim: hero — sarlavha, tavsif, tugmalar, raqamlar panel
export function Hero({ t }: { t: Dict }) {
  const words = t.hero.title.split(' ')

  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[100svh] items-end overflow-hidden px-6 pb-14 pt-32 text-paper md:px-16 md:pb-20"
    >
      {/* Fon: sklad ichki ko‘rinishi — juda shaffof */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.16]"
        style={{ backgroundImage: `url(${BASE}/images/fon-ombor.jpg)` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy/80 to-transparent" />

      {/* Logotip — o‘ng yuqorida, oddiy; hover’da biroz qiyshayadi */}
      <div className="absolute right-6 top-28 hidden md:block md:right-16">
        <Image
          src={LOGO.dark}
          alt="JB GROUP"
          width={LOGO.width}
          height={LOGO.height}
          className="h-32 w-auto -rotate-3 transition-transform duration-700 ease-out hover:rotate-0 lg:h-40"
        />
      </div>

      <div className="relative max-w-4xl">
        <span
          data-fade
          className="glass relative inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-gold"
        >
          <span aria-hidden="true" className="glass-sheen" />
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          <span className="relative">{t.tagline}</span>
        </span>

        <h1
          aria-label={t.hero.title}
          className="mt-7 font-serif text-[clamp(2.2rem,8.5vw,6.4rem)] font-normal leading-[0.95] tracking-[-0.03em]"
        >
          {words.map((w, i, arr) => {
            const last = i === arr.length - 1
            return (
              <span key={`${w}-${i}`} data-hero-word className="mr-[0.2em] inline-block overflow-hidden pb-[0.08em] align-top">
                <span
                  className={`inline-block ${
                    last ? 'bg-gradient-to-r from-gold via-[#f5deA0] to-gold bg-clip-text text-transparent' : ''
                  }`}
                >
                  {w}
                </span>
              </span>
            )
          })}
        </h1>

        <p data-fade className="mt-7 max-w-[44ch] text-[15px] leading-relaxed text-paper/80 md:text-lg">
          {t.hero.lede}
        </p>

        <div data-fade className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#tariffs"
            className="group inline-flex h-12 items-center gap-3 rounded-full bg-gold pl-6 pr-1.5 text-sm font-semibold text-navy no-underline transition-colors duration-300 hover:bg-paper"
          >
            {t.hero.cta1}
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-paper transition-transform duration-500 group-hover:rotate-45"
            >
              →
            </span>
          </a>
          <a
            href="#contact"
            className="glass relative inline-flex h-12 items-center rounded-full px-6 text-sm font-semibold text-paper no-underline transition-colors duration-300 hover:text-gold"
          >
            <span aria-hidden="true" className="glass-sheen" />
            <span className="relative">{t.hero.cta2}</span>
          </a>
        </div>

        {/* Raqamlar — uchta shisha bo‘lim */}
        <div data-fade className="glass relative mt-10 grid max-w-xl grid-cols-3 rounded-[1.5rem] p-1">
          <span aria-hidden="true" className="glass-sheen" />
          {[
            { v: seedSettings.stats.area, l: t.stats.area },
            { v: seedSettings.stats.capacity, l: t.stats.capacity },
            { v: seedSettings.stats.years, l: t.stats.years },
          ].map((s, i) => (
            <div key={s.l} className={`relative px-4 py-4 md:px-6 ${i > 0 ? 'border-l border-paper/10' : ''}`}>
              <p className="font-sans text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{fmt(s.v)}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-paper/60">{s.l}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
