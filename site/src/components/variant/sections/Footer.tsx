import Image from 'next/image'
import type { Dict } from '../i18n'
import { LOGO } from '../constants'
import { Credit } from '../ui/Credit'

// Footer: bitta qator — logotip chapda, huquqlar o‘rtada, muallif o‘ngda
export function Footer({ t }: { t: Dict }) {
  return (
    <footer className="relative z-10 border-t border-paper/10 bg-navy-2 px-6 py-6 text-paper md:px-16">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 md:flex-row">
        <Image src={LOGO.dark} alt="JB GROUP" width={LOGO.width} height={LOGO.height} className="h-9 w-auto" />
        <p className="font-mono text-[11px] text-paper/60">
          © {new Date().getFullYear()} JB GROUP. {t.rights}
        </p>
        <Credit />
      </div>
    </footer>
  )
}
