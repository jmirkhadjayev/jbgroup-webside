import type { Dict } from '../i18n'
import { CAPACITY_PCT, UNITS, unitStatus } from '../constants'
import { fmt } from '../format'

// Jonli holat taxtasi: sklad birliklari bandligi (hozir yashirilgan, namuna ma’lumot)
export function LiveStatus({ t }: { t: Dict }) {
  return (
    <div className="mt-20">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold">{t.board.title}</p>
      <div data-board className="mt-6 grid grid-cols-1 gap-px bg-line sm:grid-cols-2 md:grid-cols-4">
        {UNITS.map((u) => (
          <div key={u.id} data-bay className="flex flex-col bg-paper p-6">
            <div className="flex items-start justify-between gap-3">
              <span className="font-serif text-4xl leading-none">{u.id}</span>
              <span className={`flex items-center gap-2 pt-1 text-xs ${u.occ === 0 ? 'text-steel' : 'text-navy'}`}>
                <span
                  data-live={u.occ > 0 ? '' : undefined}
                  className={`h-2 w-2 rounded-full ${u.occ === 0 ? 'bg-line' : u.occ >= 85 ? 'bg-navy' : 'bg-gold'}`}
                />
                {unitStatus(u.occ, t.board)}
              </span>
            </div>
            <p className="mt-6 text-sm text-steel">{fmt(u.area)} m²</p>
            <div className="mt-auto pt-6">
              <div className="flex justify-between text-xs text-steel">
                <span>{t.board.occupancy}</span>
                <span>{u.occ}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full bg-line">
                <div className="h-full bg-gold" style={{ width: `${u.occ}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <div className="flex justify-between text-sm text-steel">
          <span>{t.board.total}</span>
          <span>{CAPACITY_PCT}%</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden bg-line">
          <div data-capacity className="h-full bg-navy" />
        </div>
      </div>
    </div>
  )
}
