'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Desktopda omborlar gorizontal lentada pin bo‘lib siljiydi (ScrollTrigger).
// Mobilda oddiy ustun ro‘yxati — pin qo‘llanmaydi.
export default function BaysTrack({ children }: { children: React.ReactNode }) {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()

    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const track = trackRef.current!
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth)
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      return () => tween.kill()
    })

    return () => mm.revert()
  }, [])

  return (
    <div ref={pinRef} className="overflow-hidden bg-navy text-paper lg:flex lg:h-screen lg:items-center">
      <div
        ref={trackRef}
        className="flex flex-col gap-14 px-5 py-14 md:px-18 lg:w-max lg:flex-row lg:gap-[6vw] lg:py-0"
      >
        {children}
      </div>
    </div>
  )
}
