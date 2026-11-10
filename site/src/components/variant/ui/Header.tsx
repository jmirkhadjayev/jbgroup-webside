'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { LANGS, type Dict, type Lang } from '../i18n'
import { LOGO, NAV_IDS } from '../constants'

// Suzuvchi shisha navigatsiya: faol bo‘lim, til tanlagich, mobil menyu
export function Header({ lang, onLang, t }: { lang: Lang; onLang: (l: Lang) => void; t: Dict }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  // Scroll: panel zichlashadi, logotip kichrayadi
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
    }
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

  // Desktop bo‘lim havolasi: hover'da oltin marker chapdan o‘ngga surtiladi
  const renderLink = (id: (typeof NAV_IDS)[number]) => {
    const isActive = active === id
    return (
      <li key={id}>
        <a
          href={id === 'about' ? '#top' : `#${id}`}
          aria-current={isActive ? 'true' : undefined}
          className={`group relative isolate block px-1 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] no-underline transition-colors duration-300 ${
            scrolled ? 'text-navy' : 'text-paper'
          }`}
        >
          {t.nav[id]}
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 bottom-1 -z-10 h-2 origin-left bg-gold/60 transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] ${
              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`}
          />
        </a>
      </li>
    )
  }

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

      </header>

      {/* Desktop: simmetrik panel — o‘rtada panel ostiga "osilgan" logotip yorlig‘i, ikki yonida bo‘limlar; hover'da oltin marker surtiladi */}
      <header
        className={`fixed inset-x-0 top-0 z-50 hidden transition-all duration-500 lg:block ${
          scrolled
            ? 'border-b border-navy/10 bg-paper/85 backdrop-blur-xl'
            : 'border-b border-paper/10 bg-navy/20 backdrop-blur-sm'
        }`}
      >
        <div className="relative mx-auto grid h-16 max-w-[1360px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-8">
          <ul className="flex items-center justify-start gap-9">{NAV_IDS.slice(0, 3).map(renderLink)}</ul>

          {/* Osilgan logotip yorlig‘i */}
          <a
            href="#top"
            aria-label="JB GROUP"
            className="relative z-10 flex h-[92px] w-44 items-center justify-center self-start rounded-b-[34px] border-x border-b-[3px] border-gold/30 border-b-gold bg-navy shadow-[0_22px_40px_-18px_rgba(11,37,69,0.7)] transition-transform duration-500 hover:translate-y-1"
          >
            <Image src={LOGO.dark} alt="JB GROUP" width={LOGO.width} height={LOGO.height} priority className="h-12 w-auto" />
          </a>

          <div className="flex items-center justify-end gap-9">
            <ul className="flex items-center gap-9">{NAV_IDS.slice(3).map(renderLink)}</ul>

            <div role="group" aria-label={t.ui.lang} className="flex items-center gap-1 text-[11px] font-semibold tracking-widest">
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={l === lang}
                  onClick={() => onLang(l)}
                  className={`rounded-full px-2 py-1 transition-all duration-300 ${
                    l === lang
                      ? 'bg-gold text-navy'
                      : scrolled
                        ? 'text-steel hover:text-navy'
                        : 'text-paper/70 hover:text-paper'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <a
              href="#contact"
              className="group inline-flex h-10 items-center gap-2.5 rounded-full bg-gold pl-5 pr-1.5 font-sans text-[12px] font-bold uppercase tracking-[0.08em] text-navy no-underline transition-colors duration-500 hover:bg-navy hover:text-paper"
            >
              {t.ui.cta}
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-paper transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold group-hover:text-navy"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobil menyu: to‘liq ekran, doira shaklida ochiladi; bo‘limlar satr ichidan ko‘tarilib chiqadi */}
      <div
        aria-hidden={!open}
        className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-navy px-6 pb-10 pt-28 text-paper lg:hidden"
        style={{
          clipPath: open ? 'circle(150% at calc(100% - 2.5rem) 2.5rem)' : 'circle(0% at calc(100% - 2.5rem) 2.5rem)',
          visibility: open ? 'visible' : 'hidden',
          transition: `clip-path 800ms cubic-bezier(.7,0,.2,1), visibility 0s linear ${open ? 0 : 800}ms`,
        }}
      >
        <span
          aria-hidden="true"
          className={`mb-3 block h-px w-full origin-left bg-gold transition-transform duration-900 ease-out ${
            open ? 'scale-x-100' : 'scale-x-0'
          }`}
          style={{ transitionDelay: open ? '200ms' : '0ms', transitionDuration: '900ms' }}
        />
        <ul>
          {NAV_IDS.map((id, i) => (
            <li key={id} className={`overflow-hidden ${i % 2 === 1 ? 'pl-6' : ''}`}>
              <a
                href={id === 'about' ? '#top' : `#${id}`}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between gap-4 border-b border-paper/10 py-2.5 no-underline"
              >
                <span className="block overflow-hidden">
                  <span
                    className={`block font-sans text-[clamp(1.1rem,4.6vw,1.4rem)] font-light leading-tight tracking-[0.01em] transition-[transform,color] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:italic group-hover:text-gold ${
                      open ? 'translate-y-0' : 'translate-y-full'
                    }`}
                    style={{ transitionDelay: open ? `${280 + i * 80}ms` : '0ms' }}
                  >
                    {t.nav[id]}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`text-xl text-gold transition-all duration-500 group-hover:translate-x-1 ${
                    open ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: open ? `${420 + i * 80}ms` : '0ms' }}
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
