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
const LICENSES = [
  { src: '/licenses/litsenziya.jpg' },
  { src: '/licenses/litsenziya-ilova.jpg' },
]
// Galereya: 5 ta karta — birinchi (A) katta (2×2), qolgan 4 tasi o‘ng tomonda 2×2
const GALLERY_SPAN = ['lg:col-span-2 lg:row-span-2', '', '', '', '']
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI']
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
              className={`hidden max-w-[15rem] text-[13px] leading-snug transition-colors duration-500 xl:block ${
                scrolled ? 'text-steel' : 'text-paper/75'
              }`}
            >
              {t.tagline}
            </span>
          </a>

          <nav aria-label="Asosiy" className="hidden lg:block">
            <ul className="flex items-center gap-8">
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
                      className={`group relative block py-2 text-[15px] no-underline transition-colors duration-300 ${color}`}
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
              className={`flex items-center gap-0.5 rounded-full border p-0.5 text-xs font-medium transition-colors duration-500 ${
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
              className="group hidden h-11 items-center gap-2 bg-gold px-5 text-sm font-medium text-navy no-underline transition-colors duration-300 hover:bg-paper md:inline-flex"
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
              className={`flex h-11 w-11 flex-col items-center justify-center gap-1.5 border lg:hidden ${
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

function SectionHead({ kicker, title, light = false }: { kicker: string; title: string; light?: boolean }) {
  return (
    <div data-reveal className="mb-14">
      <p className="text-xs uppercase tracking-[0.08em] text-gold">{kicker}</p>
      <h2 className={`mt-4 font-serif text-4xl leading-tight md:text-5xl ${light ? 'text-paper' : ''}`}>{title}</h2>
      <div className="mt-6 h-px w-24 bg-gold" />
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

        // Umumiy bo‘lim sarlavhalari va kartalar: yumshoq paydo bo‘lish
        q<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          })
        })

        // Galereya: rasmlar scroll bilan sekin siljiydi (parallax)
        q<HTMLElement>('[data-parallax]').forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
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

        // Sig‘im chizig‘i
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
      if (btn && !reduce) {
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

  return (
    <div ref={rootRef} className="bg-paper text-navy">
      {/* Doimiy 3D fon: scroll bilan forklift va yuk harakatlanadi */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <WarehouseScene />
      </div>

      <Header lang={lang} onLang={setLang} t={t} />

      {/* 1. HERO */}
      <section
        id="top"
        className="relative z-10 flex h-[100svh] min-h-[640px] items-end overflow-hidden px-6 pb-20 text-paper md:px-16"
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
          <p data-fade className="mb-6 text-xs uppercase tracking-[0.08em] text-gold">
            {t.tagline}
          </p>
          <h1
            aria-label={t.hero.title}
            className="font-serif text-[clamp(2.8rem,6.5vw,6rem)] leading-[0.98] font-normal tracking-[-0.02em]"
          >
            {t.hero.title.split(' ').map((w, i) => (
              <span key={`${w}-${i}`} data-hero-word className="mr-[0.2em] inline-block overflow-hidden align-top pb-[0.06em]">
                <span className="inline-block">{w}</span>
              </span>
            ))}
          </h1>
          <p data-fade className="mt-8 max-w-[46ch] text-lg text-paper/80">
            {t.hero.lede}
          </p>
          <div data-fade className="mt-10 flex flex-wrap gap-3">
            <a
              href="#tariffs"
              className="inline-flex h-12 items-center bg-gold px-6 font-medium text-navy no-underline hover:bg-paper"
            >
              {t.hero.cta1}
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center border border-paper/40 px-6 font-medium text-paper no-underline hover:border-gold hover:text-gold"
            >
              {t.hero.cta2}
            </a>
          </div>
          <p data-fade className="mt-12 text-xs uppercase tracking-[0.08em] text-paper/60">
            {t.ui.scroll}
          </p>
        </div>
      </section>

      {/* 2. BIZ HAQIMIZDA — bosqichlar, scroll bilan 3D sahna bilan sinxron */}
      <div id="about" data-beats className="relative z-10 scroll-mt-20 text-paper">
        {t.beats.map((b, i) => (
          <section key={b.title} className="flex min-h-[100svh] items-center px-6 md:px-16">
            <article data-beat className="relative max-w-md border-l-2 border-gold bg-navy/80 p-8 backdrop-blur-md">
              <p className="text-sm tracking-[0.08em] text-gold">
                0{i + 1} / 0{t.beats.length}
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-tight">{b.title}</h2>
              <p className="mt-4 text-paper/80">{b.text}</p>
              {i === t.beats.length - 1 && (
                <div data-stamp className="absolute -right-8 -top-10 w-32 -rotate-12 text-gold md:w-40">
                  <Stamp main={t.stamp.main} sub={t.stamp.sub} />
                </div>
              )}
            </article>
          </section>
        ))}
      </div>

      {/* 3. XIZMATLAR */}
      <section id="services" className="relative z-10 scroll-mt-20 bg-paper px-6 py-24 md:px-16">
        <SectionHead kicker={t.sections.services.kicker} title={t.sections.services.title} />
        <div className="grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
          {seedServices.map((s, i) => (
            <article key={s.title.uz} data-reveal className="bg-paper p-8">
              <p className="font-serif text-3xl text-gold">{ROMAN[i]}</p>
              <h3 className="mt-4 font-serif text-2xl">{s.title[lang]}</h3>
              <p className="mt-3 text-steel">{s.text[lang]}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 4. OMBORLAR — galereya + raqamlar */}
      <section id="warehouses" className="relative z-10 scroll-mt-20 bg-[#fbfbf8] px-6 py-24 md:px-16">
        <SectionHead kicker={t.sections.warehouses.kicker} title={t.sections.warehouses.title} />

        {/* Bento galereya */}
        <div className="grid auto-rows-[240px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {seedWarehouses.map((w, i) => (
            <figure key={w.name.uz} data-reveal className={`group relative overflow-hidden bg-navy ${GALLERY_SPAN[i] ?? ''}`}>
              <div data-parallax className="absolute left-0 right-0" style={{ top: '-8%', bottom: '-8%' }}>
                <Image
                  src={`/images/${w.image}`}
                  alt={w.name[lang]}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/25 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-paper">
                <p className="text-[11px] uppercase tracking-[0.08em] text-gold">{w.type[lang]}</p>
                <div className="mt-1 flex items-end justify-between gap-3">
                  <h3 className="font-serif text-2xl leading-tight">{w.name[lang]}</h3>
                  <span className="shrink-0 text-sm text-paper/80">{fmt(w.area)} m²</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-20 grid gap-12 md:grid-cols-3">
          {[
            { value: seedSettings.stats.area, label: t.stats.area },
            { value: seedSettings.stats.capacity, label: t.stats.capacity },
            { value: seedSettings.stats.years, label: t.stats.years },
          ].map((s) => (
            <div key={s.label} data-reveal className="border-t border-gold pt-6">
              <p className="font-serif text-6xl" data-count={s.value}>
                {fmt(s.value)}
              </p>
              <p className="mt-2 text-steel">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Vaqtincha yashirilgan: qayta ko‘rsatish uchun "hidden" ni olib tashlang */}
        <div className="mt-20 hidden">
          <p className="text-xs uppercase tracking-[0.08em] text-gold">{t.board.title}</p>
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
      </section>

      {/* 5. RAHBARIYAT */}
      <section id="admin" className="relative z-10 scroll-mt-20 bg-paper px-6 py-24 md:px-16">
        <SectionHead kicker={t.sections.admin.kicker} title={t.sections.admin.title} />
        <div className="grid gap-10 md:grid-cols-3">
          {seedTeam.map((m, i) => (
            <article key={`${m.role.uz}-${i}`} data-reveal className="border-t border-gold pt-6">
              <div className="flex h-20 w-20 items-center justify-center bg-navy font-serif text-2xl text-gold">
                {m.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <h3 className="mt-6 font-serif text-2xl">{m.name}</h3>
              <p className="mt-1 text-sm text-gold">{m.role[lang]}</p>
              <p className="mt-4 text-steel">{m.bio[lang]}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 6. HUJJATLAR — litsenziya + tariflar */}
      <section id="tariffs" className="relative z-10 scroll-mt-20 bg-[#fbfbf8] px-6 py-24 md:px-16">
        <SectionHead kicker={t.sections.docs.kicker} title={t.sections.docs.title} />

        {/* Litsenziya */}
        <div className="mb-20">
          <p data-reveal className="text-xs uppercase tracking-[0.08em] text-gold">
            {t.license.label}
          </p>
          <div className="mt-6 grid justify-items-center gap-8 md:grid-cols-2 md:gap-10">
            {LICENSES.map((l, i) => (
              <figure key={l.src} data-reveal className="group w-full max-w-md">
                <div className="overflow-hidden border border-line bg-white shadow-[0_10px_30px_-18px_rgba(11,37,69,0.35)] transition-transform duration-500 group-hover:-translate-y-1">
                  <Image
                    src={l.src}
                    alt={t.license.items[i].alt}
                    width={929}
                    height={1454}
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-serif text-lg">{t.license.items[i].caption}</span>
                  <a
                    href={l.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-gold text-navy no-underline"
                  >
                    {t.ui.fullView}
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Tariflar */}
        <p data-reveal className="mb-6 text-xs uppercase tracking-[0.08em] text-gold">
          {t.tariffsLabel}
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {seedTariffs.map((tf, i) => (
            <a
              key={tf.file}
              data-reveal
              href={`/files/${tf.file}`}
              download
              className="group relative flex min-h-64 flex-col justify-between overflow-hidden border border-line bg-paper p-8 text-navy no-underline transition-shadow duration-500 hover:shadow-[0_18px_40px_-18px_rgba(11,37,69,0.35)]"
            >
              <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
              <div className="flex items-start justify-between">
                <span className="font-serif text-5xl text-gold">0{i + 1}</span>
                <span className="border border-navy px-2 py-1 text-[11px] font-medium tracking-[0.08em]">
                  {tf.file.split('.').pop()?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-serif text-2xl leading-snug">{tf.title[lang]}</p>
                <p className="mt-2 text-sm text-steel">{tf.date}</p>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-line pt-4 text-sm font-medium">
                <span>{t.ui.download}</span>
                <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-y-1">
                  ↓
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 7. ALOQA */}
      <section id="contact" className="relative z-10 scroll-mt-20 bg-navy px-6 py-24 text-paper md:px-16">
        <SectionHead kicker={t.sections.contact.kicker} title={t.sections.contact.title} light />
        <div className="grid gap-12 lg:grid-cols-2">
          <dl className="grid gap-8 text-lg">
            <div>
              <dt className="text-sm uppercase tracking-[0.08em] text-gold">{t.contact.address}</dt>
              <dd className="mt-2">{seedSettings.address[lang]}</dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-[0.08em] text-gold">{t.contact.phone}</dt>
              <dd className="mt-2">
                <a href={PHONE_HREF} className="border-b border-gold no-underline">
                  {seedSettings.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-[0.08em] text-gold">{t.contact.email}</dt>
              <dd className="mt-2">
                <a href={`mailto:${seedSettings.email}`} className="border-b border-gold no-underline">
                  {seedSettings.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-[0.08em] text-gold">{t.contact.hours}</dt>
              <dd className="mt-2">{seedSettings.hours[lang]}</dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-[0.08em] text-gold">{t.contact.license}</dt>
              <dd className="mt-2">{seedSettings.license}</dd>
            </div>
            <div className="pt-2">
              <a
                data-magnet
                href={PHONE_HREF}
                className="inline-flex h-14 items-center bg-gold px-8 font-medium text-navy no-underline hover:bg-paper"
              >
                {t.ui.call}
              </a>
            </div>
          </dl>
          <div>
            <iframe
              title={t.mapTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] w-full border-0 grayscale-[30%] contrast-105"
              src="https://yandex.com/map-widget/v1/?ll=69.324979,41.269669&z=17&pt=69.324979,41.269669,pm2rdm"
            />
            <a href={YANDEX_PIN} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block border-b border-gold text-sm text-paper no-underline">
              {t.ui.openMap}
            </a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-navy-2 px-6 py-12 text-paper md:px-16">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-5">
            <Image src={LOGO.dark} alt="JB GROUP" width={LOGO.width} height={LOGO.height} className="h-16 w-auto" />
            <span className="font-serif text-xl">{t.tagline}</span>
          </div>
          <p className="text-sm text-paper/60">
            © {new Date().getFullYear()} JB GROUP. {t.rights}
          </p>
        </div>
      </footer>
    </div>
  )
}
