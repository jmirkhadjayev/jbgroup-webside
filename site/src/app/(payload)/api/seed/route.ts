import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import path from 'path'
import { getPayload } from 'payload'
import {
  seedServices,
  seedSettings,
  seedTariffs,
  seedTeam,
  seedWarehouses,
} from '@/lib/seed-data'

// POST /api/seed — faqat admin tizimga kirgan holatda, bir marta ishlatiladi.
// Baza bo‘sh bo‘lsa default ma’lumotlarni yaratadi (uz/ru/en).
export async function POST() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await getHeaders() })
  if (!user) {
    return Response.json({ error: 'Admin sifatida tizimga kiring' }, { status: 401 })
  }

  const existing = await payload.count({ collection: 'warehouses' })
  if (existing.totalDocs > 0) {
    return Response.json({ skipped: true, reason: 'Ma’lumotlar allaqachon mavjud' })
  }

  const assets = path.join(process.cwd(), 'seed-assets')
  const extraLocales = ['ru', 'en'] as const

  // Settings (global): uz bilan yaratiladi, keyin ru/en qo‘shiladi
  await payload.updateGlobal({
    slug: 'settings',
    locale: 'uz',
    data: {
      license: seedSettings.license,
      phone: seedSettings.phone,
      email: seedSettings.email,
      mapQuery: seedSettings.mapQuery,
      address: seedSettings.address.uz,
      hours: seedSettings.hours.uz,
      stats: seedSettings.stats,
    },
  })
  for (const loc of extraLocales) {
    await payload.updateGlobal({
      slug: 'settings',
      locale: loc,
      data: { address: seedSettings.address[loc], hours: seedSettings.hours[loc] },
    })
  }

  // Omborlar: rasm media ga yuklanadi
  for (const [i, w] of seedWarehouses.entries()) {
    const media = await payload.create({
      collection: 'media',
      data: { alt: w.name.en },
      filePath: path.join(assets, 'images', w.image),
    })
    const doc = await payload.create({
      collection: 'warehouses',
      locale: 'uz',
      data: { name: w.name.uz, type: w.type.uz, area: w.area, image: media.id, order: i + 1 },
    })
    for (const loc of extraLocales) {
      await payload.update({
        collection: 'warehouses',
        id: doc.id,
        locale: loc,
        data: { name: w.name[loc], type: w.type[loc] },
      })
    }
  }

  // Xizmatlar
  for (const [i, s] of seedServices.entries()) {
    const doc = await payload.create({
      collection: 'services',
      locale: 'uz',
      data: { title: s.title.uz, text: s.text.uz, order: i + 1 },
    })
    for (const loc of extraLocales) {
      await payload.update({
        collection: 'services',
        id: doc.id,
        locale: loc,
        data: { title: s.title[loc], text: s.text[loc] },
      })
    }
  }

  // Rahbariyat
  for (const [i, t] of seedTeam.entries()) {
    const doc = await payload.create({
      collection: 'team',
      locale: 'uz',
      data: { name: t.name, role: t.role.uz, bio: t.bio.uz, order: i + 1 },
    })
    for (const loc of extraLocales) {
      await payload.update({
        collection: 'team',
        id: doc.id,
        locale: loc,
        data: { role: t.role[loc], bio: t.bio[loc] },
      })
    }
  }

  // Tariflar (PDF)
  for (const [i, t] of seedTariffs.entries()) {
    const media = await payload.create({
      collection: 'media',
      data: { alt: t.title.en },
      filePath: path.join(assets, 'files', t.file),
    })
    const doc = await payload.create({
      collection: 'tariffs',
      locale: 'uz',
      data: { title: t.title.uz, date: t.date, file: media.id, order: i + 1 },
    })
    for (const loc of extraLocales) {
      await payload.update({
        collection: 'tariffs',
        id: doc.id,
        locale: loc,
        data: { title: t.title[loc] },
      })
    }
  }

  return Response.json({
    ok: true,
    created: {
      warehouses: seedWarehouses.length,
      services: seedServices.length,
      team: seedTeam.length,
      tariffs: seedTariffs.length,
    },
  })
}
