'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

export type ContactState = { status: 'idle' | 'ok' | 'error'; message?: string }

// Formadan kelgan murojaatni Payload'dagi "inquiries" kolleksiyasiga saqlaydi.
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get('name') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (name.length < 2 || phone.length < 5) {
    return { status: 'error', message: 'error' }
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'inquiries',
      data: { name: name.slice(0, 200), phone: phone.slice(0, 50), message: message.slice(0, 2000) },
    })
    return { status: 'ok', message: 'ok' }
  } catch {
    return { status: 'error', message: 'error' }
  }
}
