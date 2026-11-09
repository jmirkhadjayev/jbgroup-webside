'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { T, type Lang } from './i18n'
import { CAPACITY_PCT } from './constants'
import { fmt } from './format'
import { Header } from './ui/Header'
import { Lightbox, type ZoomState } from './ui/Lightbox'
import { Hero } from './sections/Hero'
import { Services } from './sections/Services'
import { Warehouses } from './sections/Warehouses'
import { Metrics } from './sections/Metrics'
import { Team } from './sections/Team'
import { Documents } from './sections/Documents'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'


// Sahifa: bo‘limlar. Holat (til, kattalashtirish) va GSAP animatsiyalari shu yerda.
export default function VariantDemo({ initialLang = 'uz' }: { initialLang?: Lang }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [lang, setLang] = useState<Lang>(initialLang)
  const t = T[lang]
  const [zoom, setZoom] = useState<ZoomState>(null)
  const [zoomed, setZoomed] = useState(false)

  const openZoom = (src: string, alt: string) => {
    setZoomed(false)
    setZoom({ src, alt })
  }

  // Lightbox: Escape bilan yopiladi, fon aylanmaydi
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

  // GSAP animatsiyalari. Til o‘zgarganda qayta bog‘lanadi (yangi DOM elementlari uchun).
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

        // Bay taxtasi va sig‘im chizig‘i (yashirilgan bo‘lsa ham xavfsiz)
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

      // CTA: kursorga tortiladigan magnit effekti (faqat sichqoncha bilan)
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
    }
  }, [lang])

  return (
    <div ref={rootRef} className="overflow-x-clip bg-paper text-navy lg:pl-20">
      <Header lang={lang} onLang={setLang} t={t} />
      <Hero t={t} />
      <Services lang={lang} t={t} />
      <Warehouses lang={lang} t={t} openZoom={openZoom} />
      <Metrics t={t} />
      <Team lang={lang} t={t} />
      <Documents lang={lang} t={t} />
      <Contact lang={lang} t={t} />

      {zoom && (
        <Lightbox zoom={zoom} zoomed={zoomed} onClose={() => setZoom(null)} onToggleZoom={() => setZoomed((z) => !z)} t={t} />
      )}

      <Footer t={t} />
    </div>
  )
}
