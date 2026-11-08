'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { flow, stageOf, STAGE_STARTS } from './flow'
import { LANGS, T, type Dict, type Lang } from './i18n'
import { BASE } from './base'
import { seedServices, seedSettings, seedTariffs, seedTeam, seedWarehouses } from '@/lib/seed-data'

// 3D sahna faqat brauzerda yuklanadi (SSR yo‘q)
const WarehouseScene = dynamic(() => import('./WarehouseScene'), { ssr: false })

const NAV_IDS = ['about', 'services', 'warehouses', 'admin', 'tariffs', 'contact'] as const
const LOGO = {
  src: `${BASE}/brand/jb-group-logo.png`, // och fonlar uchun (header)
  dark: `${BASE}/brand/jb-group-logo-dark.png`, // to‘q fonlar uchun (hero, footer)
  width: 988,
  height: 739,
}
const LICENSES = [{ src: `${BASE}/licenses/litsenziya.jpg` }, { src: `${BASE}/licenses/litsenziya-ilova.jpg` }]
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

  // Scroll: panel zichlashadi, logotip kichrayadi
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Faol bo‘lim: ekranning o‘rtasidan o‘tayotgan bo‘lim belgilanadi
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

  // Mobil menyu ochiq bo‘lganda fon aylanmaydi
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const panel = scrolled
    ? 'border-navy/10 bg-paper/80 shadow-[0_18px_40px_-20px_rgba(11,37,69,0.35)]'
    : 'border-paper/15 bg-navy/25'

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-2 md:px-6 md:pt-3">
        <div
          className={`mx-auto flex max-w-[1240px] items-center justify-between gap-4 rounded-full border py-1.5 pl-2.5 pr-1.5 backdrop-blur-xl transition-all duration-500 md:pl-3 ${panel}`}
        >
          <a href="#top" aria-label="JB GROUP" className="flex min-w-0 items-center gap-3 no-underline">
            <Image
              src={scrolled ? LOGO.src : LOGO.dark}
              alt="JB GROUP"
              width={LOGO.width}
              height={LOGO.height}
              priority
              className={`w-auto transition-[height] duration-500 ${scrolled ? 'h-7' : 'h-8'}`}
            />
            </a>

          <nav aria-label="Asosiy" className="hidden min-w-0 flex-1 justify-center lg:flex">
            <ul className="flex w-full max-w-xl items-center justify-center gap-1">
              {NAV_IDS.map((id) => {
                const isActive = active === id
                const style = isActive
                  ? scrolled
                    ? 'bg-navy text-paper shadow-[0_8px_18px_-8px_rgba(11,37,69,0.6)]'
                    : 'bg-gold text-navy shadow-[0_8px_18px_-8px_rgba(201,162,39,0.7)]'
                  : scrolled
                    ? 'text-steel hover:bg-navy/5 hover:text-navy'
                    : 'text-paper/80 hover:bg-paper/10 hover:text-paper'
                return (
                  <li key={id} className="flex-1 text-center">
                    <a
                      href={`#${id}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={`block whitespace-nowrap rounded-full px-3 py-1.5 font-sans text-[12px] font-medium no-underline transition-all duration-300 ${style}`}
                    >
                      {t.nav[id]}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div
              role="group"
              aria-label={t.ui.lang}
              className={`hidden items-center rounded-full p-0.5 text-[10px] font-semibold transition-colors duration-500 sm:flex ${
                scrolled ? 'bg-navy/5' : 'bg-paper/10'
              }`}
            >
              {LANGS.map((l) => {
                const on = l === lang
                const style = on
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
                    className={`rounded-full px-2 py-1 transition-all duration-300 ${style}`}
                  >
                    {l.toUpperCase()}
                  </button>
                )
              })}
            </div>

            <a
              href="#contact"
              className="group hidden h-9 w-[9.5rem] items-center justify-between rounded-full bg-gold pl-4 pr-1 font-sans text-[12px] font-semibold text-navy no-underline transition-colors duration-300 hover:bg-paper md:inline-flex"
            >
              {t.ui.cta}
              <span
                aria-hidden="true"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-paper transition-transform duration-500 group-hover:rotate-45"
              >
                →
              </span>
            </a>

            <button
              type="button"
              aria-expanded={open}
              aria-label={t.ui.menu}
              onClick={() => setOpen((o) => !o)}
              className={`flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full transition-colors duration-500 lg:hidden ${
                scrolled ? 'bg-navy/5 text-navy' : 'bg-paper/10 text-paper'
              }`}
            >
              <span
                className={`block h-px w-4 bg-current transition-transform duration-300 ${
                  open ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span className={`block h-px w-4 bg-current transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
              <span
                className={`block h-px w-4 bg-current transition-transform duration-300 ${
                  open ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>

        <div data-progress className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold" style={{ transform: 'scaleX(0)' }} />
      </header>

      {/* Mobil menyu: to‘liq ekran, raqamli linklar ketma-ket chiqadi */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col bg-navy px-6 pb-10 pt-28 text-paper transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <ul className="space-y-1">
          {NAV_IDS.map((id, i) => (
            <li
              key={id}
              className={`transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: open ? `${i * 60 + 120}ms` : '0ms' }}
            >
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 rounded-2xl px-2 py-3 font-sans text-3xl font-semibold tracking-[-0.03em] no-underline transition-colors hover:bg-paper/5"
              >
                <span className="font-mono text-[11px] text-gold">{pad(i + 1)}</span>
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>
        <a href={PHONE_HREF} className="mt-auto font-sans text-2xl font-semibold text-gold no-underline">
          {seedSettings.phone}
        </a>
      </div>
    </>
  )
}

// Bo‘lim sarlavhasi: raqamli chip, zamonaviy sans sarlavha
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
    <div data-reveal={reveal ? '' : undefined} className="mb-12 md:mb-16">
      <span
        className={`inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-gold ${
          light ? 'border-paper/20' : 'border-navy/15'
        }`}
      >
        <span>{index}</span>
        <span className="h-1 w-1 rounded-full bg-gold" />
        <span className="font-sans normal-case tracking-normal">{kicker}</span>
      </span>
      <h2
        className={`mt-6 max-w-4xl font-sans text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.035em] md:text-[3.8rem] ${
          light ? 'text-paper' : 'text-navy'
        }`}
      >
        {title}
      </h2>
    </div>
  )
}

// Muallif belgisi: ixcham, ramkasiz; harflar sakraydi, signal nuqtasi pulsatsiya qiladi
function Credit() {
  return (
    <a
      href="http://mirkhadjayev.uz/"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2.5 no-underline"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/50">created by</span>
      <span className="flex font-sans text-[13px] font-semibold tracking-[-0.01em]">
        {'jmirkhadjayev'.split('').map((ch, i) => (
          <span
            key={i}
            className="inline-block bg-gradient-to-b from-paper to-gold bg-clip-text text-transparent transition-transform duration-500 group-hover:-translate-y-0.5"
            style={{ transitionDelay: `${i * 35}ms` }}
          >
            {ch}
          </span>
        ))}
      </span>
      <span
        aria-hidden="true"
        className="text-[11px] text-gold transition-transform duration-500 group-hover:rotate-45"
      >
        ↗
      </span>
    </a>
  )
}

export default function VariantDemo({ initialLang = 'uz' }: { initialLang?: Lang }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [lang, setLang] = useState<Lang>(initialLang)
  const t = T[lang]
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null)
  const [zoomed, setZoomed] = useState(false)
  const openZoom = (src: string, alt: string) => {
    setZoomed(false)
    setZoom({ src, alt })
  }
  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(null)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [zoom])

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
      // Bo‘lim: qisqa yopishqoq sahna — 3D progress va matn birga almashadi
      const beats = root.querySelector<HTMLElement>('[data-beats]')
      if (beats) {
        const items = q<HTMLElement>('[data-beat]')
        const dots = q<HTMLElement>('[data-step-dot]')
        const stamp = root.querySelector<HTMLElement>('[data-stamp]')
        const segs = q<HTMLElement>('[data-seg]')
        const show = (idx: number) => {
          items.forEach((el, i) => {
            gsap.to(el, {
              autoAlpha: i === idx ? 1 : 0,
              y: i === idx ? 0 : i < idx ? -28 : 28,
              duration: 0.55,
              ease: 'power3.out',
              overwrite: true,
            })
          })
          // Faol kartadagi so‘zlar pastdan ketma-ket chiqadi
          const words = items[idx]?.querySelectorAll('[data-word]')
          if (words && words.length && !reduce) {
            gsap.fromTo(
              words,
              { yPercent: 115 },
              { yPercent: 0, duration: 0.9, stagger: 0.07, ease: 'power4.out', delay: 0.15, overwrite: true },
            )
          }
          dots.forEach((el, i) => {
            el.classList.toggle('text-gold', i <= idx)
            el.classList.toggle('text-paper/40', i > idx)
          })
        }
        // Skanerlash chizig‘i: sahna ustidan doimiy o‘tadi
        const scan = root.querySelector<HTMLElement>('[data-scan]')
        if (scan && !reduce) {
          gsap.fromTo(scan, { top: '0%' }, { top: '100%', duration: 5, ease: 'none', repeat: -1 })
        }
        if (reduce) {
          flow.p = 1
          show(items.length - 1)
          gsap.set('[data-progress]', { scaleX: 1 })
          segs.forEach((sg) => gsap.set(sg, { scaleX: 1 }))
          if (stamp) gsap.set(stamp, { autoAlpha: 1, scale: 1 })
        } else {
          show(0)
          let last = -1
          ScrollTrigger.create({
            trigger: beats,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
              flow.p = self.progress
              gsap.set('[data-progress]', { scaleX: self.progress })
              segs.forEach((sg, k) => {
                const lo = STAGE_STARTS[k]
                const hi = k + 1 < STAGE_STARTS.length ? STAGE_STARTS[k + 1] : 1
                gsap.set(sg, { scaleX: Math.min(1, Math.max(0, (self.progress - lo) / (hi - lo))) })
              })
              const idx = stageOf(self.progress)
              if (idx !== last) {
                last = idx
                show(idx)
              }
              if (stamp) {
                const done = self.progress > 0.8
                gsap.to(stamp, {
                  autoAlpha: done ? 1 : 0,
                  scale: done ? 1 : 1.6,
                  rotate: -12,
                  duration: 0.5,
                  ease: 'back.out(2)',
                  overwrite: true,
                })
              }
            },
          })
        }
      }
      if (!reduce) {
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
  }, [lang])

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
        className="relative z-10 flex min-h-[100svh] items-end overflow-hidden px-6 pb-14 pt-32 text-paper md:px-16 md:pb-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy/80 to-transparent" />

        {/* Logotip — shisha kartada, o‘ng yuqorida */}
        <div className="glass absolute right-6 top-28 hidden rounded-[1.5rem] p-4 md:block md:right-16">
          <span aria-hidden="true" className="glass-sheen" />
          <div className="relative">
            <Image src={LOGO.dark} alt="JB GROUP" width={LOGO.width} height={LOGO.height} className="h-20 w-auto" />
          </div>
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
            {t.hero.title.split(' ').map((w, i, arr) => {
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

          <p data-fade className="mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/55">
            <span className="flex h-9 w-5 justify-center rounded-full border border-paper/30 p-1">
              <span className="block h-2 w-full animate-bounce rounded-full bg-gold" />
            </span>
            {t.ui.scroll}
          </p>
        </div>
      </section>

      {/* 2. BIZ HAQIMIZDA — yopishqoq sahna: markazda suyuq shisha karta, chap pastda telemetriya */}
      <div id="about" data-beats className="relative z-10 h-[230svh] scroll-mt-20 text-paper">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* Fon: to‘r va skanerlash chizig‘i */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />
          <div
            data-scan
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold/70 shadow-[0_0_24px_4px_rgba(201,162,39,0.35)]"
          />

          {/* Markaz: suyuq shisha kartalar (bosqichlar almashadi) */}
          <div className="absolute bottom-6 left-6 w-[min(22rem,calc(100%-3rem))] md:bottom-10 md:left-16 md:w-[min(24rem,40vw)]">
            <div className="relative h-[230px] w-full max-w-[22rem] md:h-[240px] md:max-w-sm">
              {t.beats.map((b, i) => (
                <article
                  key={b.title}
                  data-beat
                  className="glass invisible absolute inset-0 flex flex-col justify-center p-6 opacity-0 md:p-7"
                >
                  <span aria-hidden="true" className="glass-sheen" />
                  <div className="relative">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold">
                      {pad(i + 1)} / {pad(t.beats.length)}
                    </p>
                    <h2 className="mt-3 font-sans text-2xl font-semibold leading-tight tracking-[-0.03em] md:text-3xl">
                      {b.title.split(' ').map((w, k) => (
                        <span key={k} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-top">
                          <span data-word className="inline-block">
                            {w}
                          </span>
                        </span>
                      ))}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-paper/80">{b.text}</p>
                  </div>
                </article>
              ))}
              <div
                data-stamp
                className="pointer-events-none absolute -right-5 -top-9 w-24 -rotate-12 text-gold opacity-0 md:w-28"
              >
                <Stamp main={t.stamp.main} sub={t.stamp.sub} />
              </div>
            </div>
          </div>

          {/* Chap pastki: bosqichlar va telemetriya (suyuq shisha panel) */}
          <div className="glass absolute left-6 right-6 top-28 rounded-[1.5rem] p-4 md:left-auto md:right-16 md:top-auto md:bottom-10 md:w-[min(20rem,calc(100%-3rem))]">
            <span aria-hidden="true" className="glass-sheen rounded-[1.5rem]" />
            <div className="relative">
              <div className="mb-3 grid grid-cols-4 gap-1.5">
                {t.beats.map((b) => (
                  <div key={b.title} className="h-1 overflow-hidden rounded-full bg-paper/15">
                    <div data-seg className="h-full origin-left rounded-full bg-gold" style={{ transform: 'scaleX(0)' }} />
                  </div>
                ))}
              </div>
              <ol className="grid grid-cols-2 gap-x-4 gap-y-2">
                {t.beats.map((b, i) => (
                  <li
                    key={b.title}
                    data-step-dot
                    className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-paper/40 transition-colors duration-500"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[9px]">
                      {pad(i + 1)}
                    </span>
                    <span className="truncate">{b.title}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Lenta (ticker) — xizmatlar nomlari */}
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

      {/* 4. XIZMATLAR */}
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

      {/* 5. OMBORLAR — galereya (bosilganda kattalashadi) */}
      <section id="warehouses" className="relative z-10 scroll-mt-20 bg-[#f6f6f2] px-6 py-24 md:px-16 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead index="03" kicker={t.sections.warehouses.kicker} title={t.sections.warehouses.title} />
          <div className="grid auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Kirish majmuasi: birinchi, to‘liq kenglikda */}
            <figure data-reveal className="group relative overflow-hidden rounded-3xl bg-navy lg:col-span-4">
              <button
                type="button"
                onClick={() => openZoom(`${BASE}/images/kirish-majmuasi.jpg`, t.gate.name)}
                aria-label={`${t.ui.enlarge}: ${t.gate.name}`}
                className="absolute inset-0 z-10 cursor-zoom-in"
              />
              <Image
                src={`${BASE}/images/kirish-majmuasi.jpg`}
                alt={t.gate.name}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" />
              <span className="pointer-events-none absolute right-5 top-5 z-20 rounded-full bg-navy/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-paper/90 backdrop-blur">
                {t.ui.enlarge}
              </span>
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 grid gap-2 p-6 text-paper md:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold">{t.gate.type}</p>
                <h3 className="font-sans text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{t.gate.name}</h3>
              </figcaption>
            </figure>

            {seedWarehouses.map((w, i) => (
              <figure
                key={w.name.uz}
                data-reveal
                className={`group relative overflow-hidden rounded-3xl bg-navy ${GALLERY_SPAN[i] ?? ''}`}
              >
                <button
                  type="button"
                  onClick={() => openZoom(`${BASE}/images/${w.image}`, w.name[lang])}
                  aria-label={`${t.ui.enlarge}: ${w.name[lang]}`}
                  className="absolute inset-0 z-10 cursor-zoom-in"
                />
                <Image
                  src={`${BASE}/images/${w.image}`}
                  alt={w.name[lang]}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-navy/50 px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-paper/90 backdrop-blur">
                  {pad(i + 1)}
                </span>
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 grid gap-2 p-6 text-paper">
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold">{w.type[lang]}</p>
                  <div className="flex items-end justify-between gap-3">
                    <h3
                      className={`font-sans font-semibold tracking-[-0.03em] ${
                        i === 0 ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'
                      }`}
                    >
                      {w.name[lang]}
                    </h3>
                    <p className="shrink-0 font-mono text-sm text-paper/85">{fmt(w.area)} m²</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Vaqtincha yashirilgan: qayta ko‘rsatish uchun "hidden" ni olib tashlang */}
          <div className="hidden">
            <div className="mt-20">
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
        </div>
      </section>

      {/* 6. RAQAMLAR */}
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

      {/* 7. RAHBARIYAT */}
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

      {/* 8. HUJJATLAR */}
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

      {/* 9. ALOQA */}
      <section id="contact" className="relative z-10 scroll-mt-20 bg-navy px-6 py-24 text-paper md:px-16 md:py-32">
        <div className="mx-auto max-w-[1280px]">
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
                src="https://yandex.com/map-widget/v1/?ll=69.324979,41.269669&z=17&pt=69.324979,41.269669,pm2rdm"
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
        </div>
      </section>

      {zoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={zoom.alt}
          onClick={() => setZoom(null)}
          className="fixed inset-0 z-[60] bg-navy/95 backdrop-blur-sm"
        >
          <div className="absolute left-4 top-4 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setZoomed((z) => !z)
              }}
              className="h-10 rounded-full border border-paper/30 bg-paper/10 px-5 text-sm text-paper backdrop-blur-md transition-colors hover:border-gold hover:text-gold"
            >
              {zoomed ? t.ui.zoomOut : t.ui.zoomIn}
            </button>
          </div>
          <button
            type="button"
            aria-label={t.ui.close}
            onClick={() => setZoom(null)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 bg-paper/10 text-xl text-paper backdrop-blur-md transition-colors hover:border-gold hover:text-gold"
          >
            ×
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute inset-0 p-4 pt-20 md:p-10 md:pt-24 ${zoomed ? 'overflow-auto' : 'overflow-hidden'}`}
          >
            <div className={`relative mx-auto ${zoomed ? 'h-[200%] w-[200%]' : 'h-full w-full'}`}>
              <Image src={zoom.src} alt={zoom.alt} fill sizes="100vw" className="object-contain" />
            </div>
          </div>
        </div>
      )}

      <footer className="relative z-10 bg-navy-2 px-6 py-12 text-paper md:px-16">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-5">
            <Image src={LOGO.dark} alt="JB GROUP" width={LOGO.width} height={LOGO.height} className="h-14 w-auto" />
            <span className="font-sans text-base font-medium">{t.tagline}</span>
          </div>
          <p className="font-mono text-[11px] text-paper/60">
            © {new Date().getFullYear()} JB GROUP. {t.rights}
          </p>
          <Credit />
        </div>
      </footer>
    </div>
  )
}
