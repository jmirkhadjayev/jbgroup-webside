import Image from 'next/image'
import { seedTariffs } from '@/lib/seed-data'
import type { Dict, Lang } from '../i18n'
import { BASE } from '../base'
import { LICENSES } from '../constants'
import { ext, pad } from '../format'
import { SectionHead } from '../ui/SectionHead'

// 8-bo‘lim: hujjatlar — yuklab olinadigan fayllar va litsenziya
export function Documents({ lang, t }: { lang: Lang; t: Dict }) {
  return (
    <section id="tariffs" className="relative z-10 scroll-mt-20 bg-paper px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <SectionHead index="05" kicker={t.sections.docs.kicker} title={t.sections.docs.title} />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p data-reveal className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-gold">
              {t.tariffsLabel}
            </p>
            <ul className="overflow-hidden rounded-3xl border border-navy/10 bg-white">
              {seedTariffs.map((tf, i) => (
                <li key={tf.file} data-index-row className="border-b border-navy/10 last:border-b-0">
                  <a
                    href={`${BASE}/files/${tf.file}`}
                    download
                    className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden px-6 py-6 text-navy no-underline"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-gold/10 transition-transform duration-500 group-hover:scale-x-100" />
                    <span className="relative font-mono text-[11px] text-gold">{pad(i + 1)}</span>
                    <span className="relative">
                      <span className="block font-sans text-lg font-semibold tracking-[-0.02em] md:text-xl">{tf.title[lang]}</span>
                      <span className="mt-1 block font-mono text-[10px] tracking-[0.06em] text-steel">
                        {tf.date} · {ext(tf.file)}
                      </span>
                    </span>
                    <span className="relative flex items-center gap-2 rounded-full border border-navy/15 px-4 py-2 text-sm font-medium transition-colors duration-300 group-hover:border-navy group-hover:bg-navy group-hover:text-paper">
                      <span className="hidden sm:inline">{t.ui.download}</span>
                      <span aria-hidden="true">↓</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <p data-reveal className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-gold">
              {t.license.label}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {LICENSES.map((l, i) => (
                <figure key={l.src} data-reveal className="group">
                  <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_20px_40px_-28px_rgba(11,37,69,0.4)]">
                    <Image
                      src={l.src}
                      alt={t.license.items[i].alt}
                      width={929}
                      height={1454}
                      sizes="(max-width: 1024px) 50vw, 240px"
                      className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-center justify-between gap-2 text-sm">
                    <span className="font-sans font-semibold">{t.license.items[i].caption}</span>
                    <a href={l.src} target="_blank" rel="noopener noreferrer" className="border-b border-gold text-navy no-underline">
                      {t.ui.fullView}
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
