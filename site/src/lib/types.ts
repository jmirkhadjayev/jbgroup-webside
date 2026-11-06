// Payload'dan keladigan hujjatlar uchun qo‘lda yozilgan tiplar.
// (payload generate:types CLI Node 26 bilan ishlamagani uchun shu yerda.)

export type MediaDoc = {
  id: number
  url?: string | null
  alt?: string | null
  sizes?: {
    card?: { url?: string | null } | null
    full?: { url?: string | null } | null
  } | null
}

export type Warehouse = {
  id: number
  name: string
  type?: string | null
  area: number
  image: MediaDoc | number
  order?: number | null
}

export type Service = { id: number; title: string; text: string; order?: number | null }

export type TeamMember = {
  id: number
  name: string
  role: string
  bio?: string | null
  photo?: MediaDoc | number | null
  order?: number | null
}

export type Tariff = {
  id: number
  title: string
  date?: string | null
  file: MediaDoc | number
  order?: number | null
}

export type Settings = {
  license: string
  address: string
  phone: string
  email: string
  hours?: string | null
  mapQuery?: string | null
  stats: { area: number; capacity: number; years: number }
}
