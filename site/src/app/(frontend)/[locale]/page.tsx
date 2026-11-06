import { getTranslations, setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { getSiteData } from '@/lib/data'
import { mediaUrl } from '@/lib/media'
import Hero from '@/components/Hero'
import Counter from '@/components/Counter'
import CapacityBar from '@/components/CapacityBar'
import BaysTrack from '@/components/BaysTrack'
import ServicesList from '@/components/ServicesList'
import ContactForm from '@/components/ContactForm'
import SiteHeader from '@/components/SiteHeader'
import Seal from '@/components/Seal'

// Ma’lumotlar Payload (CMS) dan keladi — build vaqtida emas, har so‘rovda o‘qiladi
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

const fmt = (n: number) => n.toLocaleString('en-US').replace(/,/g, ' ')

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const data = await getSiteData(locale as Locale)
  const [tHero, tAbout, tServ, tBays, tAdmin, tTariffs, tContact, tFooter, tMeta] = await Promise.all([
    getTranslations('hero'),
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
        <Hero title={tHero('title')} lede={tHero('lede')} cta1={tHero('cta1')} cta2={tHero('cta2')} />

        {/* ABOUT */}
        <section id="about" className="mx-auto max-w-[1280px] px-5 py-28 md:px-18 md:py-44">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <div>
              <h2 className="max-w-[16ch] text-[clamp(2.6rem,5.4vw,4.8rem)] font-light leading-[1] tracking-[-0.03em]">
                {tAbout('title')}
              </h2>
              <p className="mt-8 max-w-[50ch] text-[clamp(1.05rem,1.3vw,1.2rem)] text-steel">{tAbout('lede')}</p>
            </div>
            <Seal text={tHero('sealText')} className="mx-auto w-[min(70%,300px)] text-gold lg:mx-0 lg:justify-self-end" />
          </div>

          <div className="mt-20 grid gap-10 border-t border-line pt-12 md:grid-cols-3">
            <Stat value={stats.area} label={tAbout('areaLabel')} />
            <Stat value={stats.capacity} label={tAbout('capacityLabel')} />
            <Stat value={stats.years} label={tAbout('yearsLabel')} />
          </div>
          <CapacityBar label={tAbout('capacityLabel')} value={`${fmt(stats.capacity)} t`} />
        </section>

        {/* SERVICES: sarlavha yopishib turadi, ro‘yxat scroll bilan chiqadi */}
        <section id="services" className="mx-auto max-w-[1280px] px-5 pb-28 md:px-18 md:pb-44">
          <div className="grid gap-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-24">
            <div className="md:sticky md:top-28 md:self-start">
              <h2 className="text-[clamp(2.6rem,5vw,4.4rem)] font-light leading-[1] tracking-[-0.03em]">
                {tServ('title')}
              </h2>
            </div>
            <ServicesList items={data.services} />
          </div>
        </section>

        {/* WAREHOUSES: gorizontal lenta (desktopda pin) */}
        <section id="warehouses">
          <div className="mx-auto max-w-[1280px] px-5 pb-14 pt-28 md:px-18 md:pt-44">
            <div className="grid items-end gap-10 md:grid-cols-2">
              <h2 className="text-[clamp(2.6rem,5vw,4.4rem)] font-light leading-[1] tracking-[-0.03em]">{tBays('title')}</h2>
              <p className="max-w-[50ch] text-[clamp(1.05rem,1.3vw,1.2rem)] text-steel">{tBays('lede')}</p>
            </div>
          </div>
          <BaysTrack>
            {data.warehouses.map((w) => {
              const src = mediaUrl(typeof w.image === 'object' ? w.image : null, 'card')
              return (
                <article
                  key={w.id}
                  className="grid w-full gap-6 lg:w-[min(56vw,780px)] lg:shrink-0 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-12"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-navy-2">
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt={w.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="pb-2">
                    <h3 className="mb-5 text-[clamp(1.6rem,2.4vw,2.3rem)] font-light">{w.name}</h3>
                    <dl className="border-t border-paper/20 text-[15px]">
                      <div className="flex justify-between gap-6 border-b border-paper/20 py-3">
                        <dt className="text-paper/60">{tBays('areaLabel')}</dt>
                        <dd>{fmt(w.area)} m²</dd>
                      </div>
                      <div className="flex justify-between gap-6 border-b border-paper/20 py-3">
                        <dt className="text-paper/60">{tBays('typeLabel')}</dt>
                        <dd className="text-right">{w.type}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              )
            })}
          </BaysTrack>
        </section>

        {/* MANAGEMENT: qatorlar, kartalar emas */}
        <section id="admin" className="mx-auto max-w-[1280px] px-5 py-28 md:px-18 md:py-44">
          <h2 className="mb-16 text-[clamp(2.6rem,5vw,4.4rem)] font-light leading-[1] tracking-[-0.03em]">
            {tAdmin('title')}
          </h2>
          <div className="divide-y divide-line border-y border-line">
            {data.team.map((m) => {
              const photo = mediaUrl(typeof m.photo === 'object' ? m.photo : null, 'card')
              const initials = m.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
              return (
                <article key={m.id} className="grid items-center gap-6 py-10 md:grid-cols-[120px_1fr_1fr] md:gap-12">
                  <div className="flex aspect-square w-24 items-center justify-center overflow-hidden bg-navy font-serif text-3xl text-paper md:w-[120px]">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div>
                    <h3 className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-light">{m.name}</h3>
                    <p className="mt-1 text-steel">{m.role}</p>
                  </div>
                  {m.bio ? <p className="max-w-[40ch] text-[15px] text-steel">{m.bio}</p> : <span />}
                </article>
              )
            })}
          </div>
        </section>

        {/* TARIFFS: qator hover bo‘lganda oltin fon ochiladi */}
        <section id="tariffs" className="bg-[#e7eae2] py-28 md:py-44">
          <div className="mx-auto max-w-[1280px] px-5 md:px-18">
            <div className="mb-14 grid items-end gap-10 md:grid-cols-2">
              <h2 className="text-[clamp(2.6rem,5vw,4.4rem)] font-light leading-[1] tracking-[-0.03em]">{tTariffs('title')}</h2>
              <p className="max-w-[50ch] text-[clamp(1.05rem,1.3vw,1.2rem)] text-steel">{tTariffs('lede')}</p>
            </div>
            <ul className="border-t border-navy/20">
              {data.tariffs.map((tr) => {
                const href = typeof tr.file === 'object' ? mediaUrl(tr.file) : null
                return (
                  <li
                    key={tr.id}
                    className="group relative isolate border-b border-navy/20 before:absolute before:inset-y-0 before:left-0 before:-z-10 before:w-0 before:bg-gold/25 before:transition-[width] before:duration-500 hover:before:w-full"
                  >
                    <a
                      href={href ?? '#'}
                      target="_blank"
                      rel="noopener"
                      className="grid grid-cols-[1fr_auto] items-center gap-6 px-1 py-8 no-underline md:px-4"
                    >
                      <span>
                        <span className="block font-serif text-[clamp(1.4rem,2.6vw,2rem)] font-light">{tr.title}</span>
                        <span className="mt-1 block text-sm text-steel">PDF{tr.date ? ` · ${tr.date}` : ''}</span>
                      </span>
                      <span className="whitespace-nowrap border-b border-navy pb-0.5 font-medium text-navy">
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
        <section id="contact" className="mx-auto max-w-[1280px] px-5 py-28 md:px-18 md:py-44">
          <div className="grid gap-14 md:grid-cols-[1fr_1.2fr] md:gap-24">
            <div>
              <h2 className="mb-10 text-[clamp(2.6rem,5vw,4.4rem)] font-light leading-[1] tracking-[-0.03em]">
                {tContact('title')}
              </h2>
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
              <iframe
                title="Map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="mt-10 h-[260px] w-full border-0 grayscale-[40%] contrast-105"
                src={`https://www.google.com/maps?q=${encodeURIComponent(settings.mapQuery ?? 'Tashkent')}&output=embed`}
              />
            </div>
            <div>
              <h3 className="mb-8 text-2xl font-light">{tContact('formTitle')}</h3>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="relative isolate overflow-hidden bg-navy py-20 text-paper">
        <Seal
          text={tHero('sealText')}
          className="pointer-events-none absolute -right-24 -top-24 -z-10 w-[420px] text-gold/20 md:-right-10"
        />
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-8 px-5 md:px-18">
          <span className="font-serif text-2xl font-light">{tMeta('title')}</span>
          <span className="text-sm text-paper/65">
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
      <div className="font-serif text-[clamp(3.4rem,7.5vw,6.6rem)] leading-none font-light tracking-[-0.03em] tabular-nums">
        <Counter to={value} />
      </div>
      <div className="mt-3 text-[15px] text-steel">{label}</div>
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
