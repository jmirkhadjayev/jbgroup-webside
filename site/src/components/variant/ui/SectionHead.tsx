// Bo‘lim sarlavhasi: raqamli chip, zamonaviy sans sarlavha
export function SectionHead({
  index,
  kicker,
  title,
  light = false,
  reveal = true,
}: {
  index: string
  kicker: string
  title: string
  light?: boolean
  reveal?: boolean
}) {
  return (
    <div data-reveal={reveal ? '' : undefined} className="mb-12 md:mb-16">
      <span
        className={`inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-gold ${
          light ? 'border-paper/20' : 'border-navy/15'
        }`}
      >
        <span>{index}</span>
        <span className="h-1 w-1 rounded-full bg-gold" />
        <span className="font-sans normal-case tracking-normal">{kicker}</span>
      </span>
      <h2
        className={`mt-6 max-w-4xl font-sans text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.035em] md:text-[3.8rem] ${
          light ? 'text-paper' : 'text-navy'
        }`}
      >
        {title}
      </h2>
    </div>
  )
}
