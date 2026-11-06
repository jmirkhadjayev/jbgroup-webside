'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import Seal from './Seal'
import { Link } from '@/i18n/navigation'

// 3D sahna faqat brauzerda yuklanadi (SSR yo‘q)
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

type Props = {
  title: string
  lede: string
  cta1: string
  cta2: string
  sealText: string
}

export default function Hero({ title, lede, cta1, cta2, sealText }: Props) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !rootRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('[data-seal]', { scale: 0.7, rotation: -120, opacity: 0, duration: 1.6, ease: 'expo.out' })
        .from('[data-word] > span', { yPercent: 110, duration: 1, stagger: 0.07 }, '-=1.2')
        .from('[data-fade]', { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
    }, rootRef)

    return () => ctx.revert()
  }, [])

  // Sarlavhani so‘zlarga bo‘lib, har biriga maskali chiqish beramiz
  const words = title.split(' ')

  return (
    <section ref={rootRef} id="top" className="relative mx-auto grid min-h-[calc(100svh-72px)] max-w-[1280px] items-center gap-12 px-5 py-16 md:px-18 lg:grid-cols-[1.35fr_1fr]">
      <div className="relative z-10">
        <h1 className="mb-7 text-[clamp(3rem,7vw,6.6rem)]" aria-label={title}>
          {words.map((w, i) => (
            <span key={i} data-word className="inline-block overflow-hidden align-top pb-[0.08em] -mb-[0.08em] mr-[0.22em]">
              <span className="inline-block">{w}</span>
            </span>
          ))}
        </h1>
        <p data-fade className="max-w-[52ch] text-[clamp(1.05rem,1.3vw,1.2rem)] text-steel">
          {lede}
        </p>
        <div data-fade className="mt-10 flex flex-wrap gap-3">
          <Link href="/#tariffs" className="inline-flex min-h-12 items-center bg-navy px-6 text-[15px] font-medium text-paper no-underline hover:bg-gold hover:text-navy">
            {cta1}
          </Link>
          <Link href="/#contact" className="inline-flex min-h-12 items-center border border-navy px-6 text-[15px] font-medium text-navy no-underline hover:border-gold">
            {cta2}
          </Link>
        </div>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[460px]">
        <div className="absolute inset-0">
          <HeroScene />
        </div>
        <div data-seal className="absolute inset-0 flex items-center justify-center">
          <Seal text={sealText} className="w-[80%] text-gold" />
        </div>
      </div>
    </section>
  )
}
