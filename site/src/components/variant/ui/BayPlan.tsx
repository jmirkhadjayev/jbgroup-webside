import type { Dict } from '../i18n'
import { CAPACITY_PCT, UNITS } from '../constants'

// Jonli sklad xaritasi: har bir birlik shisha katak, bandlik suyuqlik darajasi kabi pastdan to‘ladi.
// Ma’lumot constants.ts dagi UNITS dan (hozircha namuna).
export function BayPlan({ t }: { t: Dict }) {
  return (
    <div className="relative w-[min(36vw,460px)] overflow-hidden rounded-[1.5rem] border border-paper/15 bg-navy/90 p-5 text-paper shadow-[0_30px_60px_-20px_rgba(11,37,69,0.5)] backdrop-blur-md">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-gold">
        <span>{t.board.title}</span>
        <span>{CAPACITY_PCT}%</span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {UNITS.map((u) => (
          <div key={u.id} className="relative h-20 overflow-hidden rounded-xl border border-paper/15 bg-navy-2/60">
            <div
              className={`absolute inset-x-0 bottom-0 transition-[height] duration-1000 ${
                u.occ >= 85 ? 'bg-gradient-to-t from-gold to-[#f5deA0]' : 'bg-gradient-to-t from-gold/80 to-gold/30'
              }`}
              style={{ height: `${u.occ}%` }}
            />
            <span className="absolute left-2 top-1.5 font-mono text-[10px] font-semibold">{u.id}</span>
            <span className="absolute bottom-1.5 right-2 font-mono text-[10px] text-paper/90">{u.occ}%</span>
          </div>
        ))}
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.08em] text-paper/60">{t.board.total}</p>
    </div>
  )
}
