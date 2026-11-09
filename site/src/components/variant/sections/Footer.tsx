import type { Dict } from '../i18n'
import { Credit } from '../ui/Credit'

// Footer: faqat huquqlar va muallif belgisi (logotip va aloqa ma’lumoti Aloqa bo‘limiga ko‘chirildi)
export function Footer({ t }: { t: Dict }) {
  return (
    <footer className="relative z-10 bg-navy-2 px-6 py-6 text-paper md:px-16">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 md:flex-row">
        <p className="font-mono text-[11px] text-paper/50">
          © {new Date().getFullYear()} JB GROUP. {t.rights}
        </p>
        <Credit />
      </div>
    </footer>
  )
}
