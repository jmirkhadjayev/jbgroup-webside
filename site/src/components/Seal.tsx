// Gold muhr (SVG). Matn yo‘nalishi — tilga qarab.
export default function Seal({ text, className }: { text: string; className?: string }) {
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true" className={className} fill="none">
      <defs>
        <path id="sealPath" d="M120,120 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
      </defs>
      <circle cx="120" cy="120" r="116" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="120" cy="120" r="72" stroke="currentColor" strokeWidth="1" />
      <text fontFamily="var(--font-plex), sans-serif" fontSize="12.5" letterSpacing="2.2" fill="currentColor">
        <textPath href="#sealPath">{text}</textPath>
      </text>
      <path
        d="M84 146 L120 108 L156 146 M96 146 V166 H144 V146 M108 166 V152 H132 V166"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
