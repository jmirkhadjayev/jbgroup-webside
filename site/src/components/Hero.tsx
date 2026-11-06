'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from '@/i18n/navigation'
import { heroScroll } from '@/lib/scroll-store'

// 3D sahna faqat brauzerda yuklanadi (SSR yo‘q)
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

type Props = {
  title: string
  lede: string
  cta1: string
  cta2: string
}

export default function Hero({ title, lede, cta1, cta2 }: Props) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    gsap.registerPlugin(ScrollTrigger)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (!reduce) {
        // 1) Kirish sekvensi: sarlavha so‘zlari, matn, tugmalar
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-word] > span', { yPercent: 115, duration: 1.1, stagger: 0.06 })
          .from('[data-fade]', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.7')
          .from('[data-rule]', { scaleX: 0, duration: 1.4, ease: 'expo.inOut' }, '-=1')

        // 2) Scroll: 3D kamera yo‘lak bo‘ylab siljiydi
        ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            heroScroll.progress = self.progress
          },
        })
      } else {
        gsap.set('[data-rule]', { scaleX: 1 })
      }
    }, root)

    return () => ctx.revert()
  }, [])

  // Sarlavhani so‘zlarga bo‘lib, har biriga maskali chiqish beramiz
  const words = title.split(' ')

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-navy text-paper"
    >
      <div className="absolute inset-0 -z-10">
        <HeroScene />
      </div>
      {/* Matn o‘qilishi uchun chapdan qorong‘i gradient */}
      <div className="pointer-events-none absolute inset-0 -z-[5] bg-gradient-to-r from-navy via-navy/75 to-navy/10" />

      <div className="mx-auto flex h-full max-w-[1280px] flex-col justify-end px-5 pb-16 md:px-18 md:pb-24">
        <h1
          aria-label={title}
          className="max-w-[16ch] text-[clamp(3.2rem,7vw,7rem)] leading-[0.92] font-light tracking-[-0.035em]"
        >
          {words.map((w, i) => (
            <span key={i} data-word className="mr-[0.2em] inline-block overflow-hidden align-top pb-[0.06em] -mb-[0.06em]">
              <span className="inline-block">{w}</span>
            </span>
          ))}
        </h1>
        <p data-fade className="mt-8 max-w-[46ch] text-[clamp(1.05rem,1.3vw,1.2rem)] text-paper/75">
          {lede}
        </p>
        <div data-fade className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/#tariffs"
            className="inline-flex min-h-12 items-center bg-gold px-6 text-[15px] font-medium text-navy no-underline hover:bg-paper"
          >
            {cta1}
          </Link>
          <Link
            href="/#contact"
            className="inline-flex min-h-12 items-center border border-paper/40 px-6 text-[15px] font-medium text-paper no-underline hover:border-gold hover:text-gold"
          >
            {cta2}
          </Link>
        </div>
      </div>

      {/* Scroll progressi — pastki chiziq */}
      <div data-rule className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold" />
    </section>
  )
}
