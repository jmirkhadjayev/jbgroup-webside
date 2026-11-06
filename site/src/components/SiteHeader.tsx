'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { locales, type Locale } from '@/i18n/routing'

const sections = [
  { id: 'about', key: 'about' },
  { id: 'services', key: 'services' },
  { id: 'warehouses', key: 'warehouses' },
  { id: 'admin', key: 'admin' },
  { id: 'tariffs', key: 'tariffs' },
  { id: 'contact', key: 'contact' },
] as const

export default function SiteHeader() {
  const t = useTranslations('nav')
  const tMeta = useTranslations('meta')
  const locale = useLocale() as Locale
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-18 max-w-[1280px] items-center justify-between gap-6 px-5 md:px-18">
        <Link href="/" className="font-serif text-xl whitespace-nowrap no-underline">
          {tMeta('title')}
        </Link>

        <nav aria-label="Asosiy" className="hidden gap-7 text-[15px] lg:flex">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="text-steel no-underline hover:text-navy">
              {t(s.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex gap-0.5" role="group" aria-label="Til">
            {locales.map((loc) => (
              <Link
                key={loc}
                href={pathname}
                locale={loc}
                aria-current={loc === locale ? 'true' : undefined}
                className={`px-2 py-1.5 text-sm font-medium no-underline ${
                  loc === locale ? 'text-navy shadow-[inset_0_-2px_0_var(--color-gold)]' : 'text-steel'
                }`}
              >
                {loc.toUpperCase()}
              </Link>
            ))}
          </div>
          <a
            href="#contact"
            className="hidden h-10 items-center bg-navy px-4 text-sm font-medium text-paper no-underline hover:bg-gold hover:text-navy md:inline-flex"
          >
            {t('contact')}
          </a>
        </div>
      </div>
    </header>
  )
}
