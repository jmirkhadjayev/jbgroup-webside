'use client'

import { useActionState } from 'react'
import { useTranslations } from 'next-intl'
import { submitContact, type ContactState } from '@/app/actions/contact'

const initial: ContactState = { status: 'idle' }

export default function ContactForm() {
  const t = useTranslations('contact')
  const [state, formAction, pending] = useActionState(submitContact, initial)

  return (
    <form action={formAction} className="grid max-w-[640px] gap-7">
      <Field id="c-name" name="name" label={t('name')} type="text" autoComplete="name" required />
      <Field id="c-phone" name="phone" label={t('phoneField')} type="tel" autoComplete="tel" required />
      <div className="grid gap-2">
        <label htmlFor="c-msg" className="text-sm text-steel">
          {t('message')}
        </label>
        <textarea
          id="c-msg"
          name="message"
          rows={4}
          className="w-full resize-y border-0 border-b border-navy bg-transparent py-2.5 text-[17px] outline-none focus:border-b-2 focus:border-gold"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-fit items-center bg-navy px-6 text-[15px] font-medium text-paper hover:bg-gold hover:text-navy disabled:opacity-60"
      >
        {t('submit')}
      </button>
      <p role="status" aria-live="polite" className="min-h-6 text-[15px] text-navy">
        {state.status === 'ok' ? t('sent') : null}
        {state.status === 'error' ? t('error') : null}
      </p>
    </form>
  )
}

function Field({
  id,
  name,
  label,
  ...rest
}: { id: string; name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm text-steel">
        {label}
      </label>
      <input
        id={id}
        name={name}
        className="w-full border-0 border-b border-navy bg-transparent py-2.5 text-[17px] outline-none focus:border-b-2 focus:border-gold"
        {...rest}
      />
    </div>
  )
}
