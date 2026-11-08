import { seedSettings } from '@/lib/seed-data'
import { BASE } from './base'
import type { Dict } from './i18n'

// Navigatsiya bo‘limlari (menyu va faol bo‘lim belgisi uchun)
export const NAV_IDS = ['about', 'services', 'warehouses', 'admin', 'tariffs', 'contact'] as const

export const LOGO = {
  src: `${BASE}/brand/jb-group-logo.png`, // och fonlar uchun (header)
  dark: `${BASE}/brand/jb-group-logo-dark.png`, // to‘q fonlar uchun (hero, footer)
  width: 988,
  height: 739,
}

export const LICENSES = [{ src: `${BASE}/licenses/litsenziya.jpg` }, { src: `${BASE}/licenses/litsenziya-ilova.jpg` }]

// Galereya: 5 ta karta — birinchi (A) katta (2×2), qolgan 4 tasi o‘ng tomonda 2×2
export const GALLERY_SPAN = ['lg:col-span-2 lg:row-span-2', '', '', '', '']

export const PHONE_HREF = `tel:${seedSettings.phone.replace(/\s/g, '')}`
export const YANDEX_PIN = 'https://yandex.com/maps/?pt=69.324979,41.269669&z=17&l=map'
export const YANDEX_MAP_SRC = 'https://yandex.com/map-widget/v1/?ll=69.324979,41.269669&z=17&pt=69.324979,41.269669,pm2rdm'

// Sklad birliklari va bandlik — NAMUNA (random). Haqiqiy ma’lumot kelganda shu yerni yangilang.
export const UNITS = [
  { id: 'A1', area: 731, occ: 72 },
  { id: 'A2', area: 814, occ: 64 },
  { id: 'A3', area: 5131, occ: 85 },
  { id: 'C', area: 3120, occ: 58 },
  { id: 'D', area: 1560, occ: 91 },
  { id: 'E', area: 1800, occ: 40 },
  { id: 'F1', area: 480, occ: 0 },
  { id: 'F2', area: 2592, occ: 77 },
]

const UNITS_AREA = UNITS.reduce((s, u) => s + u.area, 0)

// Umumiy bandlik — maydon bo‘yicha o‘rtacha
export const CAPACITY_PCT = Math.round(UNITS.reduce((s, u) => s + u.area * u.occ, 0) / UNITS_AREA)

export function unitStatus(occ: number, b: Dict['board']): string {
  if (occ === 0) return b.free
  return occ >= 85 ? b.full : b.busy
}
