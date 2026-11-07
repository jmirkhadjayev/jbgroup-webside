'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { flow } from './flow'
import { LANGS, T, type Dict, type Lang } from './i18n'
import { seedServices, seedSettings, seedTariffs, seedTeam, seedWarehouses } from '@/lib/seed-data'

// 3D sahna faqat brauzerda yuklanadi (SSR yo‘q)
const WarehouseScene = dynamic(() => import('./WarehouseScene'), { ssr: false })

const NAV_IDS = ['about', 'services', 'warehouses', 'admin', 'tariffs', 'contact'] as const
const LOGO = {
  src: '/brand/jb-group-logo.png', // och fonlar uchun (header)
  dark: '/brand/jb-group-logo-dark.png', // to‘q fonlar uchun (hero, footer)
  width: 988,
  height: 739,
}
const LICENSES = [{ src: '/licenses/litsenziya.jpg' }, { src: '/licenses/litsenziya-ilova.jpg' }]
// Galereya: 5 ta karta — birinchi (A) katta (2×2), qolgan 4 tasi o‘ng tomonda 2×2
const GALLERY_SPAN = ['lg:col-span-2 lg:row-span-2', '', '', '', '']
const PHONE_HREF = `tel:${seedSettings.phone.replace(/\s/g, '')}`
const YANDEX_PIN = 'https://yandex.com/maps/?pt=69.324979,41.269669&z=17&l=map'

// Sklad birliklari va bandlik — NAMUNA (random). Haqiqiy ma’lumot kelganda shu yerni yangilang.
const UNITS = [
  { id: 'A1', area: 731, occ: 72 },
  { id: 'A2', area: 814, occ: 64 },
  { id: 'A3', area: 5131, occ: 85 },
  { id: 'C', area: 3120, occ: 58 },
  { id: 'D', area: 1560, occ: 91 },
  { id: 'E', area: 1800, occ: 40 },
  { id: 'F1', area: 480, occ: 0 },
  { id: 'F2', area: 2592, occ: 77 },
]
const UNITS_AREA = UNITS.reduce((s, u) => s + u.area, 0)
// Umumiy bandlik — maydon bo‘yicha o‘rtacha
const CAPACITY_PCT = Math.round(UNITS.reduce((s, u) => s + u.area * u.occ, 0) / UNITS_AREA)
const unitStatus = (occ: number, b: Dict['board']) => (occ === 0 ? b.free : occ >= 85 ? b.full : b.busy)

const fmt = (n: number) => Math.round(n).toLocaleString('en-US').replace(/,/g, ' ')
const pad = (n: number) => String(n).padStart(2, '0')
const ext = (file: string) => file.split('.').pop()?.toUpperCase() ?? ''

function Stamp({ main, sub }: { main: string; sub: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="100" y="94" textAnchor="middle" fontSize="15" fontWeight="600" fill="currentColor" letterSpacing="1">
        {main}
      </text>
      <text x="100" y="120" textAnchor="middle" fontSize="11" fill="currentColor" letterSpacing="1">
        {sub}
      </text>
    </svg>
  )
}

function Header({ lang, onLang, t }: { lang: Lang; onLang: (l: Lang) => void; t: Dict }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  // Scroll: header qog‘ozga o‘tadi va logotip kichrayadi
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Faol bo‘lim: ekranning o‘rtasidan o‘tayotgan bo‘lim menyuda belgilanadi
  useEffect(() => {
    const els = NAV_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        setActive(visible.length ? visible[visible.length - 1].target.id : '')
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-500 ${
          scrolled ? 'bg-paper/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-5 transition-[padding] duration-500 md:px-16 ${
            scrolled ? 'py-2' : 'py-5'
          }`}
        >
          <a href="#top" aria-label="JB GROUP" className="flex items-center gap-5 no-underline">
            <Image
              src={scrolled ? LOGO.src : LOGO.dark}
              alt="JB GROUP"
              width={LOGO.width}
              height={LOGO.height}
              priority
              className={`w-auto transition-[height] duration-500 ${scrolled ? 'h-10' : 'h-14'}`}
            />
            <span
              className={`hidden max-w-[15rem] text-[12px] leading-snug transition-colors duration-500 xl:block ${
                scrolled ? 'text-steel' : 'text-paper/75'
              }`}
            >
              {t.tagline}
            </span>
          </a>

          <nav aria-label="Asosiy" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {NAV_IDS.map((id) => {
                const isActive = active === id
                const color = isActive
                  ? scrolled
                    ? 'text-navy'
                    : 'text-paper'
                  : scrolled
                    ? 'text-steel hover:text-navy'
                    : 'text-paper/75 hover:text-paper'
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={`group relative block py-2 text-[13px] no-underline transition-colors duration-300 ${color}`}
                    >
                      {t.nav[id]}
                      <span
                        className={`absolute inset-x-0 -bottom-0.5 h-[2px] origin-left bg-gold transition-transform duration-500 ${
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/* Til: kapsula ko‘rinishida */}
            <div
              role="group"
              aria-label={t.ui.lang}
              className={`flex items-center gap-0.5 rounded-full border p-0.5 text-[11px] font-medium transition-colors duration-500 ${
                scrolled ? 'border-line' : 'border-paper/30'
              }`}
            >
              {LANGS.map((l) => {
                const on = l === lang
                const color = on
                  ? scrolled
                    ? 'bg-navy text-paper'
                    : 'bg-gold text-navy'
                  : scrolled
                    ? 'text-steel hover:text-navy'
                    : 'text-paper/75 hover:text-paper'
                return (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onLang(l)}
                    className={`rounded-full px-3 py-1.5 transition-colors duration-300 ${color}`}
                  >
                    {l.toUpperCase()}
                  </button>
                )
              })}
            </div>

            <a
              href="#contact"
              className="group hidden h-10 items-center gap-2 bg-gold px-4 text-[13px] font-medium text-navy no-underline transition-colors duration-300 hover:bg-paper md:inline-flex"
            >
              {t.ui.cta}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>

            <button
              type="button"
              aria-expanded={open}
              aria-label={t.ui.menu}
              onClick={() => setOpen((o) => !o)}
              className={`flex h-10 w-10 flex-col items-center justify-center gap-1.5 border lg:hidden ${
                scrolled ? 'border-line text-navy' : 'border-paper/30 text-paper'
              }`}
            >
              <span
                className={`block h-px w-5 bg-current transition-transform duration-300 ${
                  open ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span className={`block h-px w-5 bg-current transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
              <span
                className={`block h-px w-5 bg-current transition-transform duration-300 ${
                  open ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>

        <div data-progress className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold" style={{ transform: 'scaleX(0)' }} />
      </header>

      {/* Mobil menyu: to‘liq ekran, linklar ketma-ket chiqadi */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col bg-navy px-6 pt-28 text-paper transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <ul>
          {NAV_IDS.map((id, i) => (
            <li
              key={id}
              className={`border-b border-paper/10 transition-all duration-500 ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${i * 60 + 120}ms` : '0ms' }}
            >
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 font-serif text-3xl no-underline"
              >
                {t.nav[id]}
                <span aria-hidden="true" className="text-gold">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a href={PHONE_HREF} className="mt-auto mb-10 font-serif text-2xl text-gold no-underline">
          {seedSettings.phone}
        </a>
      </div>
    </>
  )
}

// Bo‘lim sarlavhasi: raqam + kicker, katta serif sarlavha, nozik chiziq
function SectionHead({
  index,
  kicker,
  title,
  light = false,
  reveal = true,
}: {
  index: string
  kicker: string
  title: string
  light?: boolean
  reveal?: boolean
}) {
  return (
    <div data-reveal={reveal ? '' : undefined} className="mb-10 md:mb-14">
      <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">
        <span>{index}</span>
        <span className="h-px w-6 bg-gold" />
        <span className="font-sans">{kicker}</span>
      </p>
      <h2
        className={`mt-4 max-w-3xl font-serif text-[2.6rem] leading-[1.02] tracking-[-0.025em] md:text-[3.4rem] ${
          light ? 'text-paper' : ''
        }`}
      >
        {title}
      </h2>
    </div>
  )
}

export default function VariantDemo() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [lang, setLang] = useState<Lang>('uz')
  const t = T[lang]

  // <html lang> ni til bilan moslashtiramiz
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    gsap.registerPlugin(ScrollTrigger)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const q = <T2 extends Element>(sel: string) => Array.from(root.querySelectorAll<T2>(sel))
    const cleanups: Array<() => void> = []

    const ctx = gsap.context(() => {
      // Hero kirish
      if (!reduce) {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-hero-word] > span', { yPercent: 115, duration: 1.1, stagger: 0.08 })
          .from('[data-fade]', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.7')
      }

      // Scroll → 3D sahna: bosqichlar bloki 0..1 oralig‘ida
      const beats = root.querySelector<HTMLElement>('[data-beats]')
      if (beats) {
        if (reduce) {
          flow.p = 1
          gsap.set('[data-progress]', { scaleX: 1 })
        } else {
          ScrollTrigger.create({
            trigger: beats,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
              flow.p = self.progress
              gsap.set('[data-progress]', { scaleX: self.progress })
            },
          })
        }
      }

      if (!reduce) {
        // Bosqich panellari
        q<HTMLElement>('[data-beat]').forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            x: -40,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 60%' },
          })
        })

        // Muhr: oxirgi bosqichda bosiladi
        const last = q<HTMLElement>('[data-beat]').at(-1)
        gsap.from('[data-stamp]', {
          scale: 2.2,
          opacity: 0,
          rotate: -25,
          duration: 0.8,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: last ?? '[data-stamp]', start: 'top 35%' },
        })

        // Umumiy bo‘lim sarlavhalari: yumshoq paydo bo‘lish
        q<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 26,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          })
        })

        // Ro‘yxat qatorlari: ketma-ket chiqadi
        q<HTMLElement>('[data-index-row]').forEach((el, i) => {
          gsap.from(el, {
            x: -20,
            opacity: 0,
            duration: 0.7,
            delay: (i % 4) * 0.06,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 93%' },
          })
        })

        // Sanoqlar
        q<HTMLElement>('[data-count]').forEach((el) => {
          const target = Number(el.dataset.count)
          const obj = { v: 0 }
          gsap.to(obj, {
            v: target,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
            onUpdate: () => {
              el.textContent = fmt(obj.v)
            },
          })
        })

        // Bay taxtasi (yashirilgan bo‘lsa ham xavfsiz)
        gsap.from('[data-bay]', {
          scale: 0.7,
          opacity: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: '[data-board]', start: 'top 85%' },
        })
        q<HTMLElement>('[data-live]').forEach((el, i) =>
          gsap.to(el, { opacity: 0.2, duration: 0.8, repeat: -1, yoyo: true, delay: i * 0.2, ease: 'sine.inOut' }),
        )

        // Sig‘im chizig‘i (yashirilgan bo‘lsa ham xavfsiz)
        gsap.fromTo(
          '[data-capacity]',
          { scaleX: 0 },
          {
            scaleX: CAPACITY_PCT / 100,
            duration: 1.6,
            ease: 'power3.out',
            transformOrigin: 'left center',
            scrollTrigger: { trigger: '[data-capacity]', start: 'top 85%' },
          },
        )
      }

      // CTA: kursorga tortiladigan magnit effekti
      const btn = root.querySelector<HTMLElement>('[data-magnet]')
      if (btn && !reduce && window.matchMedia('(pointer: fine)').matches) {
        const mx = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' })
        const my = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' })
        const onMove = (e: PointerEvent) => {
          const r = btn.getBoundingClientRect()
          mx((e.clientX - r.left - r.width / 2) * 0.25)
          my((e.clientY - r.top - r.height / 2) * 0.25)
        }
        const onLeave = () => {
          mx(0)
          my(0)
        }
        btn.addEventListener('pointermove', onMove)
        btn.addEventListener('pointerleave', onLeave)
        cleanups.push(() => {
          btn.removeEventListener('pointermove', onMove)
          btn.removeEventListener('pointerleave', onLeave)
        })
      }
    }, root)

    return () => {
      cleanups.forEach((fn) => fn())
      ctx.revert()
      flow.p = 0
    }
  }, [])

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

  const metrics = [
    { value: seedSettings.stats.area, label: t.stats.area },
    { value: seedSettings.stats.capacity, label: t.stats.capacity },
    { value: seedSettings.stats.years, label: t.stats.years },
  ]

  return (
    <div ref={rootRef} className="overflow-x-clip bg-paper text-navy">
      {/* Doimiy 3D fon: scroll bilan forklift va yuk harakatlanadi */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <WarehouseScene />
      </div>

      <Header lang={lang} onLang={setLang} t={t} />

      {/* 1. HERO */}
      <section
        id="top"
        className="relative z-10 flex h-[100svh] min-h-[600px] items-end overflow-hidden px-6 pb-16 text-paper md:px-16 md:pb-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/40 to-transparent" />
        <div className="pointer-events-none absolute right-6 top-28 hidden md:block md:right-16">
          <Image
            src={LOGO.dark}
            alt="JB GROUP"
            width={LOGO.width}
            height={LOGO.height}
            className="h-32 w-auto drop-shadow-[0_12px_30px_rgba(0,0,0,0.5)]"
          />
        </div>
        <div className="relative max-w-4xl">
          <p data-fade className="mb-6 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">
            {t.tagline}
          </p>
          <h1
            aria-label={t.hero.title}
            className="font-serif text-[clamp(2.7rem,6.2vw,5.6rem)] leading-[0.98] font-normal tracking-[-0.025em]"
          >
            {t.hero.title.split(' ').map((w, i) => (
              <span key={`${w}-${i}`} data-hero-word className="mr-[0.2em] inline-block overflow-hidden align-top pb-[0.06em]">
                <span className="inline-block">{w}</span>
              </span>
            ))}
          </h1>
          <p data-fade className="mt-7 max-w-[46ch] text-[15px] leading-relaxed text-paper/80 md:text-base">
            {t.hero.lede}
          </p>
          <div data-fade className="mt-9 flex flex-wrap gap-3">
            <a
              href="#tariffs"
              className="inline-flex h-11 items-center bg-gold px-5 text-sm font-medium text-navy no-underline hover:bg-paper"
            >
              {t.hero.cta1}
            </a>
            <a
              href="#contact"
              className="inline-flex h-11 items-center border border-paper/40 px-5 text-sm font-medium text-paper no-underline hover:border-gold hover:text-gold"
            >
              {t.hero.cta2}
            </a>
          </div>
          <p data-fade className="mt-10 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/55">
            {t.ui.scroll}
          </p>
        </div>
      </section>

      {/* 2. BIZ HAQIMIZDA — bosqichlar, scroll bilan 3D sahna bilan sinxron */}
      <div id="about" data-beats className="relative z-10 scroll-mt-20 text-paper">
        {t.beats.map((b, i) => (
          <section key={b.title} className="flex min-h-[100svh] items-center px-6 md:px-16">
            <article data-beat className="relative max-w-md border-l-2 border-gold bg-navy/80 p-7 backdrop-blur-md">
              <p className="font-mono text-[10px] tracking-[0.1em] text-gold">
                0{i + 1} / 0{t.beats.length}
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-[1.05]">{b.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-paper/80">{b.text}</p>
              {i === t.beats.length - 1 && (
                <div data-stamp className="absolute -right-8 -top-10 w-28 -rotate-12 text-gold md:w-36">
                  <Stamp main={t.stamp.main} sub={t.stamp.sub} />
                </div>
              )}
            </article>
          </section>
        ))}
      </div>

      {/* 3. XIZMATLAR — sticky sarlavha + ro‘yxat */}
      <section id="services" className="relative z-10 scroll-mt-20 bg-paper px-6 py-24 md:px-16">
        <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:sticky md:top-28 md:col-span-4 md:h-fit">
            <SectionHead index="02" kicker={t.sections.services.kicker} title={t.sections.services.title} />
          </div>
          <ol className="border-t border-navy md:col-span-8">
            {seedServices.map((s, i) => (
              <li
                key={s.title.uz}
                data-index-row
                className="group grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-6 transition-colors duration-500 hover:bg-navy hover:text-paper md:px-6 md:py-7"
              >
                <span className="pt-1.5 font-mono text-[11px] text-gold">{pad(i + 1)}</span>
                <div>
                  <h3 className="font-serif text-2xl leading-tight md:text-[1.65rem]">{s.title[lang]}</h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-steel transition-colors duration-500 group-hover:text-paper/75">
                    {s.text[lang]}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. OMBORLAR — statik galereya */}
      <section id="warehouses" className="relative z-10 scroll-mt-20 bg-[#fbfbf8] px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead index="03" kicker={t.sections.warehouses.kicker} title={t.sections.warehouses.title} />
          <div className="grid auto-rows-[260px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {seedWarehouses.map((w, i) => (
              <figure key={w.name.uz} data-reveal className={`group relative overflow-hidden bg-navy ${GALLERY_SPAN[i] ?? ''}`}>
                <Image
                  src={`/images/${w.image}`}
                  alt={w.name[lang]}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/15 to-transparent" />
                <span className="absolute left-4 top-4 bg-navy/50 px-2 py-1 font-mono text-[10px] tracking-[0.1em] text-paper/85 backdrop-blur">
                  {pad(i + 1)}
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 grid gap-2 p-5 text-paper md:p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold">{w.type[lang]}</p>
                  <div className="flex items-end justify-between gap-3">
                    <h3 className={`font-serif leading-[1.02] ${i === 0 ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                      {w.name[lang]}
                    </h3>
                    <p className="shrink-0 font-mono text-sm text-paper/85">{fmt(w.area)} m²</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Vaqtincha yashirilgan: qayta ko‘rsatish uchun "hidden" ni olib tashlang */}
        <div className="hidden px-6 py-20 md:px-16">
          <div className="mx-auto max-w-[1280px]">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold">{t.board.title}</p>
            <div data-board className="mt-6 grid grid-cols-1 gap-px bg-line sm:grid-cols-2 md:grid-cols-4">
              {UNITS.map((u) => (
                <div key={u.id} data-bay className="flex flex-col bg-paper p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-serif text-4xl leading-none">{u.id}</span>
                    <span className={`flex items-center gap-2 pt-1 text-xs ${u.occ === 0 ? 'text-steel' : 'text-navy'}`}>
                      <span
                        data-live={u.occ > 0 ? '' : undefined}
                        className={`h-2 w-2 rounded-full ${u.occ === 0 ? 'bg-line' : u.occ >= 85 ? 'bg-navy' : 'bg-gold'}`}
                      />
                      {unitStatus(u.occ, t.board)}
                    </span>
                  </div>
                  <p className="mt-6 text-sm text-steel">{fmt(u.area)} m²</p>
                  <div className="mt-auto pt-6">
                    <div className="flex justify-between text-xs text-steel">
                      <span>{t.board.occupancy}</span>
                      <span>{u.occ}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-line">
                      <div className="h-full bg-gold" style={{ width: `${u.occ}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <div className="flex justify-between text-sm text-steel">
                <span>{t.board.total}</span>
                <span>{CAPACITY_PCT}%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden bg-line">
                <div data-capacity className="h-full bg-navy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RAQAMLAR — to‘liq kenglikdagi tasma */}
      <section className="relative z-10 bg-navy-2 text-paper">
        <div className="mx-auto grid max-w-[1280px] md:grid-cols-3">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`px-6 py-14 md:px-10 md:py-16 ${i > 0 ? 'border-t border-paper/10 md:border-l md:border-t-0' : ''}`}
            >
              <p className="font-serif text-6xl leading-none tracking-[-0.02em] md:text-7xl" data-count={m.value}>
                {fmt(m.value)}
              </p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. RAHBARIYAT — ro‘yxat ko‘rinishida */}
      <section id="admin" className="relative z-10 scroll-mt-20 bg-paper px-6 py-24 md:px-16">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead index="04" kicker={t.sections.admin.kicker} title={t.sections.admin.title} />
          <ul className="border-t border-navy">
            {seedTeam.map((m, i) => (
              <li
                key={`${m.role.uz}-${i}`}
                data-index-row
                className="group grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-1 border-b border-line py-6 transition-colors duration-500 hover:bg-white/70 md:grid-cols-12 md:items-center md:gap-x-6 md:px-4"
              >
                <span className="font-mono text-[11px] text-gold md:col-span-1">{pad(i + 1)}</span>
                <h3 className="font-serif text-2xl md:col-span-4">{m.name}</h3>
                <p className="col-span-2 font-mono text-[10px] uppercase tracking-[0.1em] text-gold md:col-span-3">
                  {m.role[lang]}
                </p>
                <p className="col-span-2 text-sm leading-relaxed text-steel md:col-span-4">{m.bio[lang]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. HUJJATLAR — tariflar daftari + litsenziya */}
      <section id="tariffs" className="relative z-10 scroll-mt-20 bg-[#fbfbf8] px-6 py-24 md:px-16">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead index="05" kicker={t.sections.docs.kicker} title={t.sections.docs.title} />
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p data-reveal className="mb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">
                {t.tariffsLabel}
              </p>
              <ul className="border-t border-navy">
                {seedTariffs.map((tf, i) => (
                  <li key={tf.file} data-index-row>
                    <a
                      href={`/files/${tf.file}`}
                      download
                      className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden border-b border-line py-5 text-navy no-underline"
                    >
                      <span className="absolute inset-0 origin-left scale-x-0 bg-gold/15 transition-transform duration-500 group-hover:scale-x-100" />
                      <span className="relative font-mono text-[11px] text-gold">{pad(i + 1)}</span>
                      <span className="relative">
                        <span className="block font-serif text-xl leading-tight md:text-2xl">{tf.title[lang]}</span>
                        <span className="mt-1 block font-mono text-[10px] tracking-[0.06em] text-steel">
                          {tf.date} · {ext(tf.file)}
                        </span>
                      </span>
                      <span className="relative flex items-center gap-2 text-sm font-medium">
                        <span className="hidden sm:inline">{t.ui.download}</span>
                        <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-y-0.5">
                          ↓
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <p data-reveal className="mb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">
                {t.license.label}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {LICENSES.map((l, i) => (
                  <figure key={l.src} data-reveal className="group">
                    <div className="overflow-hidden border border-line bg-white">
                      <Image
                        src={l.src}
                        alt={t.license.items[i].alt}
                        width={929}
                        height={1454}
                        sizes="(max-width: 1024px) 50vw, 240px"
                        className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <figcaption className="mt-2 flex items-center justify-between gap-2 text-xs">
                      <span className="font-serif text-base">{t.license.items[i].caption}</span>
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

      {/* 8. ALOQA — chipta ko‘rinishida */}
      <section id="contact" className="relative z-10 scroll-mt-20 bg-navy px-6 py-24 text-paper md:px-16">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead index="06" kicker={t.sections.contact.kicker} title={t.sections.contact.title} light />
          <div data-reveal className="grid overflow-hidden border border-paper/15 md:grid-cols-12">
            <div className="p-6 md:col-span-5 md:p-10">
              <dl className="divide-y divide-paper/10">
                {contactRows.map((r) => (
                  <div key={r.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3.5">
                    <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">{r.label}</dt>
                    <dd className="text-sm leading-relaxed">{r.value}</dd>
                  </div>
                ))}
              </dl>
              <a
                data-magnet
                href={PHONE_HREF}
                className="mt-8 inline-flex h-11 items-center bg-gold px-6 text-sm font-medium text-navy no-underline hover:bg-paper"
              >
                {t.ui.call}
              </a>
            </div>
            <div className="relative min-h-[340px] border-t border-dashed border-paper/15 md:col-span-7 md:border-l md:border-t-0">
              <iframe
                title={t.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 grayscale-[30%] contrast-105"
                src="https://yandex.com/map-widget/v1/?ll=69.324979,41.269669&z=17&pt=69.324979,41.269669,pm2rdm"
              />
              <a
                href={YANDEX_PIN}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-navy/90 px-3 py-2 text-xs text-paper no-underline hover:bg-gold hover:text-navy"
              >
                {t.ui.openMap}
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-navy-2 px-6 py-10 text-paper md:px-16">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-5">
            <Image src={LOGO.dark} alt="JB GROUP" width={LOGO.width} height={LOGO.height} className="h-14 w-auto" />
            <span className="font-serif text-lg">{t.tagline}</span>
          </div>
          <p className="font-mono text-[11px] text-paper/60">
            © {new Date().getFullYear()} JB GROUP. {t.rights}
          </p>
        </div>
      </footer>
    </div>
  )
}
