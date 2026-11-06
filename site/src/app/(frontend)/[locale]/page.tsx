import { getTranslations, setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { getSiteData } from '@/lib/data'
import { mediaUrl } from '@/lib/media'
import Hero from '@/components/Hero'
import Counter from '@/components/Counter'
import BaysTrack from '@/components/BaysTrack'
import ContactForm from '@/components/ContactForm'
import SiteHeader from '@/components/SiteHeader'

// Ma’lumotlar Payload (CMS) dan keladi — build vaqtida emas, har so‘rovda o‘qiladi
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const [t, data] = await Promise.all([
    getTranslations('hero'),
    getSiteData(locale as Locale),
  ])
  const [tAbout, tServ, tBays, tAdmin, tTariffs, tContact, tFooter, tMeta] = await Promise.all([
    getTranslations('about'),
    getTranslations('services'),
    getTranslations('warehouses'),
    getTranslations('admin'),
    getTranslations('tariffs'),
    getTranslations('contact'),
    getTranslations('footer'),
    getTranslations('meta'),
  ])

  const { settings } = data
  const stats = settings.stats

  return (
    <>
      <SiteHeader />
      <main>
        <Hero
          title={t('title')}
          lede={t('lede')}
          cta1={t('cta1')}
          cta2={t('cta2')}
          sealText={t('sealText')}
        />

        {/* ABOUT */}
        <section id="about" className="mx-auto max-w-[1280px] px-5 py-24 md:px-18 md:py-40">
          <div className="mb-16 grid items-end gap-10 md:grid-cols-2">
            <h2 className="max-w-[18ch] text-[clamp(2.2rem,4.4vw,3.8rem)]">{tAbout('title')}</h2>
            <p className="max-w-[52ch] text-[clamp(1.05rem,1.3vw,1.2rem)] text-steel">{tAbout('lede')}</p>
          </div>
          <div className="grid gap-10 border-t border-line pt-10 md:grid-cols-3">
            <Stat value={stats.area} label={tAbout('areaLabel')} />
            <Stat value={stats.capacity} label={tAbout('capacityLabel')} />
            <Stat value={stats.years} label={tAbout('yearsLabel')} />
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="mx-auto max-w-[1280px] px-5 pb-24 md:px-18 md:pb-40">
          <h2 className="mb-14 text-[clamp(2.2rem,4.4vw,3.8rem)]">{tServ('title')}</h2>
          <div className="grid gap-x-24 md:grid-cols-2">
            {data.services.map((s) => (
              <article key={s.id} className="border-t border-line py-8 pb-10">
                <h3 className="mb-3 text-[clamp(1.5rem,2.2vw,2rem)]">{s.title}</h3>
                <p className="max-w-[44ch] text-steel">{s.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* WAREHOUSES (pinned on desktop) */}
        <section id="warehouses">
          <div className="mx-auto max-w-[1280px] px-5 pb-16 md:px-18">
            <div className="grid items-end gap-10 md:grid-cols-2">
              <h2 className="text-[clamp(2.2rem,4.4vw,3.8rem)]">{tBays('title')}</h2>
              <p className="max-w-[52ch] text-[clamp(1.05rem,1.3vw,1.2rem)] text-steel">{tBays('lede')}</p>
            </div>
          </div>
          <BaysTrack>
            {data.warehouses.map((w) => {
              const src = mediaUrl(typeof w.image === 'object' ? w.image : null, 'card')
              return (
                <article key={w.id} className="grid w-full gap-6 lg:w-[min(60vw,800px)] lg:shrink-0 lg:grid-cols-2 lg:items-center lg:gap-14">
                  <div className="relative aspect-[4/3] overflow-hidden bg-navy-2">
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt={w.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <h3 className="mb-4 text-[clamp(1.5rem,2.2vw,2rem)]">{w.name}</h3>
                    <dl className="border-t border-paper/20">
                      <div className="flex justify-between gap-6 border-b border-paper/20 py-3">
                        <dt className="text-paper/65">{tBays('areaLabel')}</dt>
                        <dd>{w.area.toLocaleString('en-US').replace(/,/g, ' ')} m²</dd>
                      </div>
                      <div className="flex justify-between gap-6 border-b border-paper/20 py-3">
                        <dt className="text-paper/65">{tBays('typeLabel')}</dt>
                        <dd className="text-right">{w.type}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              )
            })}
          </BaysTrack>
        </section>

        {/* MANAGEMENT */}
        <section id="admin" className="mx-auto max-w-[1280px] px-5 py-24 md:px-18 md:py-40">
          <h2 className="mb-14 text-[clamp(2.2rem,4.4vw,3.8rem)]">{tAdmin('title')}</h2>
          <div className="grid gap-10 md:grid-cols-3">
            {data.team.map((m) => {
              const photo = mediaUrl(typeof m.photo === 'object' ? m.photo : null, 'card')
              const initials = m.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
              return (
                <article key={m.id}>
                  <div className="relative mb-6 flex aspect-[3/4] items-center justify-center bg-gradient-to-b from-navy-2 to-navy font-serif text-6xl text-paper">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      initials
                    )}
                    <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gold" />
                  </div>
                  <h3 className="mb-1 text-2xl">{m.name}</h3>
                  <p className="mb-2.5 text-steel">{m.role}</p>
                  {m.bio ? <p className="text-[15px] text-steel">{m.bio}</p> : null}
                </article>
              )
            })}
          </div>
        </section>

        {/* TARIFFS */}
        <section id="tariffs" className="bg-[#e9ece5] py-24 md:py-40">
          <div className="mx-auto max-w-[1280px] px-5 md:px-18">
            <div className="mb-12 grid items-end gap-10 md:grid-cols-2">
              <h2 className="text-[clamp(2.2rem,4.4vw,3.8rem)]">{tTariffs('title')}</h2>
              <p className="max-w-[52ch] text-[clamp(1.05rem,1.3vw,1.2rem)] text-steel">{tTariffs('lede')}</p>
            </div>
            <ul className="border-t border-line">
              {data.tariffs.map((tr) => {
                const href = typeof tr.file === 'object' ? mediaUrl(tr.file) : null
                return (
                  <li key={tr.id} className="border-b border-line">
                    <a
                      href={href ?? '#'}
                      target="_blank"
                      rel="noopener"
                      className="group grid grid-cols-[1fr_auto] items-center gap-6 py-7 no-underline"
                    >
                      <span>
                        <span className="block font-serif text-[clamp(1.3rem,2.4vw,1.8rem)]">{tr.title}</span>
                        <span className="mt-1 block text-sm text-steel">PDF{tr.date ? ` · ${tr.date}` : ''}</span>
                      </span>
                      <span className="whitespace-nowrap font-medium text-navy underline decoration-gold decoration-2 underline-offset-[6px] group-hover:decoration-navy">
                        {tTariffs('download')}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mx-auto max-w-[1280px] px-5 py-24 md:px-18 md:py-40">
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-24">
            <div>
              <h2 className="mb-8 text-[clamp(2.2rem,4.4vw,3.8rem)]">{tContact('title')}</h2>
              <dl>
                <Row label={tContact('address')}>{settings.address}</Row>
                <Row label={tContact('phone')}>
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="border-b border-gold no-underline">
                    {settings.phone}
                  </a>
                </Row>
                <Row label={tContact('email')}>
                  <a href={`mailto:${settings.email}`} className="border-b border-gold no-underline">
                    {settings.email}
                  </a>
                </Row>
                <Row label={tContact('hours')}>{settings.hours}</Row>
                <Row label={tContact('license')}>{settings.license}</Row>
              </dl>
            </div>
            <iframe
              title="Map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[360px] w-full border-0 grayscale-[35%] contrast-105"
              src={`https://www.google.com/maps?q=${encodeURIComponent(settings.mapQuery ?? 'Tashkent')}&output=embed`}
            />
          </div>

          <div className="mt-24 md:mt-32">
            <h2 className="mb-8 text-[clamp(2.2rem,4.4vw,3.8rem)]">{tContact('formTitle')}</h2>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="bg-navy py-12 text-paper">
        <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-5 px-5 text-sm text-paper/70 md:px-18">
          <span className="font-serif text-lg text-paper">{tMeta('title')}</span>
          <span>
            {new Date().getFullYear()} · {tFooter('rights')}
          </span>
        </div>
      </footer>
    </>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="font-serif text-[clamp(3.2rem,7vw,6rem)] leading-none tracking-[-0.03em] tabular-nums">
        <Counter to={value} />
      </div>
      <div className="mt-2.5 text-[15px] text-steel">{label}</div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-t border-line py-4 md:grid-cols-[140px_1fr] md:gap-4">
      <dt className="text-[15px] text-steel">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
