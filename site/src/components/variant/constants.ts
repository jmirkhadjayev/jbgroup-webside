import { seedSettings } from '@/lib/seed-data'
import { BASE } from './base'

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

