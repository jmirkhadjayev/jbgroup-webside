'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const fmt = (n: number) => Math.round(n).toLocaleString('en-US').replace(/,/g, ' ')

// Raqam 0 dan maqsadgacha sanaladi (bir marta, ekranga kirganda)
export default function Counter({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      el.textContent = fmt(to)
      return
    }
    gsap.registerPlugin(ScrollTrigger)
    const o = { v: 0 }
    el.textContent = fmt(0)
    const tween = gsap.to(o, {
      v: to,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => {
        el.textContent = fmt(o.v)
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [to])

  return (
    <span ref={ref} className={className}>
      {fmt(to)}
    </span>
  )
}
