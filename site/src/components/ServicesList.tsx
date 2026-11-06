'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Item = { id: number; title: string; text: string }

// Chapda sarlavha yopishib turadi, o‘ngda xizmatlar ketma-ket chiqadi
export default function ServicesList({ items }: { items: Item[] }) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !listRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.batch('[data-svc]', {
        start: 'top 82%',
        once: true,
        onEnter: (batch) =>
          gsap.from(batch, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12 }),
      })
    }, listRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={listRef} className="divide-y divide-line border-y border-line">
      {items.map((s, i) => (
        <article key={s.id} data-svc className="grid gap-4 py-10 md:grid-cols-[88px_1fr] md:gap-8">
          <span aria-hidden="true" className="mt-4 hidden h-px w-12 bg-gold md:block" data-idx={i} />
          <div>
            <h3 className="mb-3 text-[clamp(1.5rem,2.4vw,2.1rem)] font-normal">{s.title}</h3>
            <p className="max-w-[46ch] text-steel">{s.text}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
