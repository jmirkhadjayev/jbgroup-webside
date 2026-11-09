'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { LANGS, type Dict, type Lang } from '../i18n'
import { LOGO, NAV_IDS } from '../constants'
import { pad } from '../format'

// Suzuvchi shisha navigatsiya: faol bo‘lim, til tanlagich, mobil menyu
export function Header({ lang, onLang, t }: { lang: Lang; onLang: (l: Lang) => void; t: Dict }) {
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
      <header className="sticky top-0 z-50 px-3 pt-2 md:px-6 md:pt-3 lg:hidden">
        <div
          className={`mx-auto flex max-w-[1240px] items-center justify-between gap-4 rounded-[28px_10px_28px_10px] border py-1.5 pl-2.5 pr-1.5 backdrop-blur-xl transition-all duration-500 md:pl-3 ${panel}`}
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
              {NAV_IDS.map((id, i) => {
                const isActive = active === id
                const style = isActive
                  ? scrolled
                    ? 'text-navy'
                    : 'text-gold'
                  : scrolled
                    ? 'text-steel hover:text-navy'
                    : 'text-paper/75 hover:text-paper'
                return (
                  <li key={id} className="flex-1 text-center">
                    <a
                      href={id === 'about' ? '#top' : `#${id}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={`group relative block whitespace-nowrap px-3 py-2 font-sans text-[12px] font-medium uppercase tracking-[0.06em] no-underline transition-colors duration-300 ${style}`}
                    >
                      <span aria-hidden="true" className="mr-1.5 font-mono text-[9px] text-gold/80">
                        {pad(i + 1)}
                      </span>
                      {t.nav[id]}
                      {/* Faol belgi: pastdan chiziq — pill o‘rniga */}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-3 -bottom-px h-[2px] origin-left bg-gold transition-transform duration-500 ${
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
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
              className={`flex items-center rounded-full p-0.5 text-[10px] font-semibold transition-colors duration-500 ${
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
              className="group hidden h-9 w-[9.5rem] items-center justify-between rounded-[14px_4px_14px_4px] bg-gold pl-4 pr-1 font-sans text-[12px] font-semibold uppercase tracking-[0.06em] text-navy no-underline transition-colors duration-300 hover:bg-paper md:inline-flex"
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

      {/* Desktop: chap tomonda vertikal rels — yuqoridan pastga: logotip, bo‘limlar, til, aloqa */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-20 flex-col items-center justify-between border-r border-gold/25 bg-navy/95 py-7 text-paper backdrop-blur-xl lg:flex">
        <a href="#top" aria-label="JB GROUP" className="block">
          <Image src={LOGO.dark} alt="JB GROUP" width={LOGO.width} height={LOGO.height} className="h-9 w-auto" />
        </a>

        <nav aria-label="Asosiy" className="flex items-center">
          <ul className="flex flex-col items-center gap-8">
            {NAV_IDS.map((id) => {
              const isActive = active === id
              return (
                <li key={id}>
                  <a
                    href={id === 'about' ? '#top' : `#${id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`flex flex-col items-center gap-4 no-underline transition-colors duration-300 ${
                      isActive ? 'text-gold' : 'text-paper/55 hover:text-paper'
                    }`}
                  >
                    <span className="text-[11px] font-medium uppercase tracking-[0.22em] [writing-mode:vertical-rl] rotate-180">
                      {t.nav[id]}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex flex-col items-center gap-5">
          {/* Til: vertikal "slider" — oltin tugmacha tanlangan tilga siljiydi */}
          <div role="group" aria-label={t.ui.lang} className="relative flex w-9 flex-col rounded-full border border-paper/20 bg-paper/5 p-1">
            <span
              aria-hidden="true"
              className="absolute left-1 top-1 h-7 w-7 rounded-full bg-gold shadow-[0_6px_16px_-6px_rgba(201,162,39,0.9)] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
              style={{ transform: `translateY(${Math.max(0, LANGS.indexOf(lang)) * 28}px)` }}
            />
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={l === lang}
                onClick={() => onLang(l)}
                className={`relative z-10 flex h-7 w-7 items-center justify-center font-mono text-[10px] font-semibold transition-colors duration-300 ${
                  l === lang ? 'text-navy' : 'text-paper/55 hover:text-paper'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href="#contact"
            aria-label={t.ui.cta}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-lg text-navy no-underline transition-transform duration-500 hover:rotate-[135deg]"
          >
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </aside>

      {/* Mobil menyu: doira shaklida ochiladi (clip-path), bo‘limlar chapdan siljib chiqadi */}
      <div
        aria-hidden={!open}
        className="fixed inset-x-0 top-0 z-40 flex h-[75svh] flex-col overflow-hidden rounded-b-[2rem] bg-navy px-6 pb-8 pt-28 text-paper shadow-2xl lg:hidden"
        style={{
          clipPath: open ? 'inset(0 0 0 0 round 0 0 2rem 2rem)' : 'inset(0 0 100% 0 round 0 0 2rem 2rem)',
          visibility: open ? 'visible' : 'hidden',
          transition: `clip-path 700ms cubic-bezier(.7,0,.2,1), visibility 0s linear ${open ? 0 : 700}ms`,
        }}
      >
        <span
          aria-hidden="true"
          className={`mb-2 block h-px w-full origin-left bg-gold transition-transform duration-700 ease-out ${
            open ? 'scale-x-100' : 'scale-x-0'
          }`}
          style={{ transitionDelay: open ? '180ms' : '0ms' }}
        />
        <ul>
          {NAV_IDS.map((id, i) => (
            <li
              key={id}
              className={`transition-all duration-700 ease-out ${
                open ? 'translate-x-0 opacity-100 blur-0' : '-translate-x-6 opacity-0 blur-sm'
              }`}
              style={{ transitionDelay: open ? `${260 + i * 70}ms` : '0ms' }}
            >
              <a
                href={id === 'about' ? '#top' : `#${id}`}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between border-b border-paper/10 py-4 font-sans text-[22px] font-medium tracking-[-0.01em] no-underline transition-colors duration-300 hover:text-gold"
              >
                {t.nav[id]}
                <span
                  aria-hidden="true"
                  className="text-gold opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div role="group" aria-label={t.ui.lang} className="mt-auto flex gap-6 font-mono text-[12px] tracking-[0.14em]">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={l === lang}
              onClick={() => onLang(l)}
              className={`transition-colors duration-300 ${l === lang ? 'text-gold' : 'text-paper/45 hover:text-paper'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
