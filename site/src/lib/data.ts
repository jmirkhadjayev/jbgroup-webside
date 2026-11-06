import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import type { Locale } from '@/i18n/routing'
import type { Service, Settings, Tariff, TeamMember, Warehouse } from './types'

// Bir so‘rovda bir xil ma’lumotni qayta-qayta so‘ramaslik uchun cache.
export const getSiteData = cache(async (locale: Locale) => {
  const payload = await getPayload({ config })

  const [settings, warehouses, services, team, tariffs] = await Promise.all([
    payload.findGlobal({ slug: 'settings', locale, depth: 0 }),
    payload.find({ collection: 'warehouses', locale, sort: 'order', limit: 100, depth: 1 }),
    payload.find({ collection: 'services', locale, sort: 'order', limit: 100 }),
    payload.find({ collection: 'team', locale, sort: 'order', limit: 50, depth: 1 }),
    payload.find({ collection: 'tariffs', locale, sort: 'order', limit: 100, depth: 1 }),
  ])

  return {
    settings: settings as unknown as Settings,
    warehouses: warehouses.docs as unknown as Warehouse[],
    services: services.docs as unknown as Service[],
    team: team.docs as unknown as TeamMember[],
    tariffs: tariffs.docs as unknown as Tariff[],
  }
})
