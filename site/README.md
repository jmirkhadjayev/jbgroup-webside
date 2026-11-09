# Xususiy bojxona ombori — sayt (Next.js + Payload)

Texnologiyalar:

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** — dizayn
- **GSAP + ScrollTrigger** — animatsiyalar (hero, statistika, omborlar lentasi)
- **Lenis** — silliq scroll
- **next-intl** — uz / ru / en
- **Payload CMS 3** (SQLite) — kontent boshqaruvi, admin: `/admin`

## Ishga tushirish

```bash
npm install
npm run dev          # http://localhost:5555
```

Birinchi marta:

1. `.env.local` yarating (`.env.example` dan nusxa oling) va `PAYLOAD_SECRET` ni o‘zgartiring.
2. Brauzerda `http://localhost:5555/admin` ga kiring va admin foydalanuvchi yarating.
3. Default ma’lumotlarni yuklash uchun admin sifatida tizimga kirgan holda:

   ```bash
   curl -X POST http://localhost:5555/api/seed
   ```

   (Yoki brauzer konsolida: `fetch('/api/seed', { method: 'POST' })`.) Baza bo‘sh bo‘lsa ishlaydi, qayta chaqirilsa o‘tkazib yuboriladi.

## Tuzilma

| Yo‘l | Vazifa |
|---|---|
| `src/app/(frontend)/[locale]/` | Sayt sahifalari (`/uz`, `/ru`, `/en`) |
| `src/app/(payload)/` | Payload admin va API (`/admin`, `/api/...`) |
| `src/payload/collections/` | Kolleksiyalar: omborlar, xizmatlar, rahbariyat, tariflar, media, arizalar |
| `src/payload/globals/Settings.ts` | Manzil, telefon, litsenziya, statistika |
| `src/payload.config.ts` | Payload konfiguratsiyasi (til, DB, kolleksiyalar) |
| `src/lib/data.ts` | Saytga kerakli ma’lumotlarni Payload’dan o‘qish |
| `src/lib/seed-data.ts` | Default ma’lumotlar (uz/ru/en) |
| `messages/*.json` | Interfeys matnlari (tarjimalar) |
| `src/components/` | UI komponentlar (Hero, BaysTrack, Counter, ...; yangi sayt: `variant/`) |
| `seed-assets/` | Default rasmlar va PDF tariflar |

## Muhim eslatmalar

- **Namuna ma’lumotlar:** statistika (12 000 m², 5 000 t, 10 yil), maydonlar va ma’muriyat ismlari namuna. Admin paneldan haqiqiylari bilan almashtiring.
- **Litsenziya raqami** va manzil hali to‘ldirilmagan (`[...]`).
- **Aloqa formasi** arizani `inquiries` kolleksiyasiga saqlaydi. Admin paneldan ko‘riladi.
- **Payload CLI** (`payload generate:types`) Node 26 bilan ishlamaydi (undici/tsx muammosi). Shu sababli tiplar `src/lib/types.ts` da qo‘lda yozilgan, admin importMap bo‘sh.
- Node 22 LTS yoki 24 LTS ishlatish tavsiya etiladi.

## Production

```bash
npm run build
npm run start
```

Production uchun `DATABASE_URL` va `PAYLOAD_SECRET` ni server muhitida o‘rnating.
