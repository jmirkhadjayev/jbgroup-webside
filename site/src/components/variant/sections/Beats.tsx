import type { Dict } from '../i18n'
import { pad } from '../format'
import { Stamp } from '../ui/Stamp'

// 2-bo‘lim: yopishqoq sahna — markazda suyuq shisha karta, chap pastda telemetriya.
// Matn, qadamlar va muhr GSAP (VariantDemo) orqali 3D progress bilan boshqariladi.
export function Beats({ t }: { t: Dict }) {
  return (
    <div id="about" data-beats className="relative z-10 h-[230svh] scroll-mt-20 text-paper">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Fon: to‘r va skanerlash chizig‘i */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div
          data-scan
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold/70 shadow-[0_0_24px_4px_rgba(201,162,39,0.35)]"
        />

        {/* Markaz: suyuq shisha kartalar (bosqichlar almashadi) */}
        <div className="absolute bottom-6 left-6 w-[min(22rem,calc(100%-3rem))] md:bottom-10 md:left-16 md:w-[min(24rem,40vw)]">
          <div className="relative h-[230px] w-full max-w-[22rem] md:h-[240px] md:max-w-sm">
            {t.beats.map((b, i) => (
              <article
                key={b.title}
                data-beat
                className="glass invisible absolute inset-0 flex flex-col justify-center p-6 opacity-0 md:p-7"
              >
                <span aria-hidden="true" className="glass-sheen" />
                <div className="relative">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold">
                    {pad(i + 1)} / {pad(t.beats.length)}
                  </p>
                  <h2 className="mt-3 font-sans text-2xl font-semibold leading-tight tracking-[-0.03em] md:text-3xl">
                    {b.title.split(' ').map((w, k) => (
                      <span key={k} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-top">
                        <span data-word className="inline-block">
                          {w}
                        </span>
                      </span>
                    ))}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-paper/80">{b.text}</p>
                </div>
              </article>
            ))}
            <div data-stamp className="pointer-events-none absolute -right-5 -top-9 w-24 -rotate-12 text-gold opacity-0 md:w-28">
              <Stamp main={t.stamp.main} sub={t.stamp.sub} />
            </div>
          </div>
        </div>

        {/* Chap pastki (desktopda o‘ng pastki): bosqichlar va telemetriya */}
        <div className="glass absolute left-6 right-6 top-28 rounded-[1.5rem] p-4 md:left-auto md:right-16 md:top-auto md:bottom-10 md:w-[min(20rem,calc(100%-3rem))]">
          <span aria-hidden="true" className="glass-sheen rounded-[1.5rem]" />
          <div className="relative">
            <div className="mb-3 grid grid-cols-4 gap-1.5">
              {t.beats.map((b) => (
                <div key={b.title} className="h-1 overflow-hidden rounded-full bg-paper/15">
                  <div data-seg className="h-full origin-left rounded-full bg-gold" style={{ transform: 'scaleX(0)' }} />
                </div>
              ))}
            </div>
            <ol className="grid grid-cols-2 gap-x-4 gap-y-2">
              {t.beats.map((b, i) => (
                <li
                  key={b.title}
                  data-step-dot
                  className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-paper/40 transition-colors duration-500"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[9px]">
                    {pad(i + 1)}
                  </span>
                  <span className="truncate">{b.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
