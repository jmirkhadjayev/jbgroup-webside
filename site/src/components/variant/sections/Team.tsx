import { seedTeam } from '@/lib/seed-data'
import type { Dict, Lang } from '../i18n'
import { SectionHead } from '../ui/SectionHead'

// 7-bo‘lim: rahbariyat kartalari
export function Team({ lang, t }: { lang: Lang; t: Dict }) {
  return (
    <section id="admin" className="relative z-10 scroll-mt-20 bg-white px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <SectionHead index="04" kicker={t.sections.admin.kicker} title={t.sections.admin.title} />
        <div className="grid gap-4 md:grid-cols-3">
          {seedTeam.map((m, i) => (
            <article
              key={`${m.role.uz}-${i}`}
              data-reveal
              className="group rounded-3xl border border-navy/10 bg-paper p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(11,37,69,0.35)]"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy font-sans text-xl font-semibold text-gold ring-4 ring-gold/20">
                {m.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <h3 className="mt-7 font-sans text-2xl font-semibold tracking-[-0.02em]">{m.name}</h3>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-gold">{m.role[lang]}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-steel">{m.bio[lang]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
