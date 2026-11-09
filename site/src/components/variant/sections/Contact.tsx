import { Credit } from '../ui/Credit'
import { seedSettings } from '@/lib/seed-data'
import type { Dict, Lang } from '../i18n'
import { PHONE_HREF, YANDEX_MAP_SRC, YANDEX_PIN } from '../constants'
import { BASE } from '../base'
import { SectionHead } from '../ui/SectionHead'

// 9-bo‘lim: aloqa — ma’lumotlar paneli va xarita
export function Contact({ lang, t }: { lang: Lang; t: Dict }) {
  const contactRows = [
    { label: t.contact.address, value: seedSettings.address[lang] },
    {
      label: t.contact.phone,
      value: (
        <a href={PHONE_HREF} className="border-b border-gold no-underline">
          {seedSettings.phone}
        </a>
      ),
    },
    {
      label: t.contact.email,
      value: (
        <a href={`mailto:${seedSettings.email}`} className="border-b border-gold no-underline">
          {seedSettings.email}
        </a>
      ),
    },
    { label: t.contact.hours, value: seedSettings.hours[lang] },
    { label: t.contact.license, value: seedSettings.license },
  ]

  return (
    <section id="contact" className="relative z-10 scroll-mt-20 overflow-hidden bg-navy px-6 py-24 text-paper md:px-16 md:py-32">
      {/* Fon: sklad ichki ko‘rinishi — bosh sahifadagidek juda shaffof */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.16]"
        style={{ backgroundImage: `url(${BASE}/images/fon-ombor.jpg)` }}
      />
      <div className="relative mx-auto max-w-[1280px]">
        <SectionHead index="06" kicker={t.sections.contact.kicker} title={t.sections.contact.title} light />
        <div data-reveal className="grid overflow-hidden rounded-3xl border border-paper/10 bg-navy-2/50 md:grid-cols-12">
          <div className="p-6 md:col-span-5 md:p-10">
            <dl className="divide-y divide-paper/10">
              {contactRows.map((r) => (
                <div key={r.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-4">
                  <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">{r.label}</dt>
                  <dd className="text-[15px] leading-relaxed">{r.value}</dd>
                </div>
              ))}
            </dl>
            <a
              data-magnet
              href={PHONE_HREF}
              className="mt-8 inline-flex h-12 items-center rounded-full bg-gold px-7 text-sm font-semibold text-navy no-underline transition-colors duration-300 hover:bg-paper"
            >
              {t.ui.call}
            </a>
          </div>
          <div className="relative min-h-[360px] md:col-span-7">
            <iframe
              title={t.mapTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale-[30%] contrast-105"
              src={YANDEX_MAP_SRC}
            />
            <a
              href={YANDEX_PIN}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 rounded-full bg-navy/90 px-4 py-2 text-xs text-paper no-underline transition-colors hover:bg-gold hover:text-navy"
            >
              {t.ui.openMap}
            </a>
          </div>
        </div>

        {/* Pastki chiziq: huquqlar va muallif — ixcham, bitta qatorda */}
        <div data-reveal className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-dashed border-paper/15 pt-5 md:flex-row">
          <p className="font-mono text-[10px] tracking-[0.06em] text-paper/45">
            © {new Date().getFullYear()} JB GROUP. {t.rights}
          </p>
          <Credit />
        </div>
      </div>
    </section>
  )
}
