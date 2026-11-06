'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Sig‘im chizig‘i: scroll bilan 0 dan to‘lgunga qadar to‘ladi
export default function CapacityBar({ label, value }: { label: string; value: string }) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !barRef.current) return
    const tween = gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: barRef.current, start: 'top 90%', end: 'bottom 60%', scrub: 0.5 },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <div className="mt-16">
      <div className="mb-3 flex items-baseline justify-between gap-6 text-[15px] text-steel">
        <span>{label}</span>
        <span className="font-serif text-2xl text-navy">{value}</span>
      </div>
      <div className="h-[3px] w-full bg-line">
        <div ref={barRef} className="h-full origin-left bg-gold" />
      </div>
    </div>
  )
}
