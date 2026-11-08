import type { Metadata } from 'next'
import { BASE } from '@/components/variant/base'

export const metadata: Metadata = {
  title: 'Qo‘shimcha takliflar',
  description: 'Xususiy bojxona ombori sayti uchun qo‘shimcha imkoniyatlar va tavsiyalar',
  robots: { index: false, follow: false },
}

type Item = { t: string; d: string }
type Group = { no: string; kicker: string; title: string; tone: 'live' | 'server' | 'trust' | 'ux'; items: Item[] }

const GROUPS: Group[] = [
  {
    no: '01',
    kicker: 'Statik sayt · hozir mumkin',
    title: 'Tez qo‘shiladigan imkoniyatlar',
    tone: 'live',
    items: [
      { t: 'Tarif kalkulyatori', d: 'Yuk maydoni yoki og‘irligi va saqlash muddati bo‘yicha taxminiy narx.' },
      { t: 'Hujjatlar ro‘yxati', d: 'Bojxona rasmiylashtiruvi uchun chek-list; oxirida PDF yuklab olish.' },
      { t: 'Jarayon va muddatlar', d: 'Kirish, rasmiylashtirish, saqlash, chiqish va har bosqichda mijoz vazifasi.' },
      { t: 'Savol-javob (FAQ)', d: 'Saqlash muddati, bojxona to‘lovlari, sug‘urta, ish vaqti.' },
      { t: 'To‘liq ko‘p tilli kontent', d: 'Barcha bo‘limlar uch tilda; hozir hero va bosqichlar tayyor.' },
      { t: 'Sklad katalogi', d: 'Har bir birlikning maydoni, turi va holati. Hozir namuna ma’lumot.' },
    ],
  },
  {
    no: '02',
    kicker: 'Server kerak',
    title: 'Mijoz bilan aloqa va xizmatlar',
    tone: 'server',
    items: [
      { t: 'Ariza formasi', d: 'Yuk turi, og‘irlik, kelish sanasi va telefon. Sizga Telegram yoki email xabar keladi.' },
      { t: 'Onlayn bron', d: 'Sklad birligi va sana oralig‘ini tanlab band qilish.' },
      { t: 'Mijoz kabineti', d: 'Yuk holati (qabul, tekshiruv, saqlash, chiqarish) va hujjatlar.' },
      { t: 'Jonli bandlik', d: 'Admin paneldan o‘zgarsa, sayt avtomatik yangilanadi.' },
    ],
  },
  {
    no: '03',
    kicker: 'Ishonch va huquq',
    title: 'Majburiy va ishonchli elementlar',
    tone: 'trust',
    items: [
      { t: 'Litsenziya ma’lumotlari', d: 'Raqam, sana va berilgan organ. Hozir placeholder qiymatlar.' },
      { t: 'Maxfiylik siyosati', d: 'Forma ma’lumot yig‘adigan joyda shart; foydalanish shartlari.' },
      { t: 'Yo‘l yo‘riqnomasi', d: 'Transport, kirish tartibi va mo‘ljal. Xarita yonida ko‘rsatiladi.' },
      { t: 'Sertifikat va a’zoliklar', d: 'Bo‘lsa, rasmlari bilan birga.' },
    ],
  },
  {
    no: '04',
    kicker: 'Tajriba (UX)',
    title: 'Mijozni ushlab turish',
    tone: 'ux',
    items: [
      { t: 'Doimiy tez tugmalar', d: '"Narx hisoblash", "Ariza", "Qo‘ng‘iroq". Ayniqsa mobil qurilmalar uchun.' },
      { t: 'Mijoz sharhlari', d: 'Haqiqiy mijozlardan, ruxsat bilan.' },
      { t: 'Yangiliklar bo‘limi', d: 'Tarif va bojxona qoidalaridagi o‘zgarishlar haqida qisqa xabarlar.' },
    ],
  },
]

const TONE: Record<Group['tone'], string> = {
  live: 'bg-gold',
  server: 'bg-steel',
  trust: 'bg-navy',
  ux: 'bg-gold',
}

const PRIORITY = [
  { t: 'Ariza formasi', d: 'Server kerak. Eng muhim: hozir forma ishlamaydi.' },
  { t: 'Kalkulyator va FAQ', d: 'Statik, tez qilinadi. Mijoz savollariga darhol javob beradi.' },
  { t: 'Litsenziya va maxfiylik', d: 'Ishonch va huquqiy talab. Shart bo‘lgan ma’lumot.' },
]

export default function TakliflarPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f2] text-navy">
      {/* Yopishqoq shisha header */}
      <header className="sticky top-0 z-50 px-3 pt-3 md:px-6">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between rounded-full border border-navy/10 bg-paper/80 py-2 pl-4 pr-2 shadow-[0_18px_40px_-20px_rgba(11,37,69,0.3)] backdrop-blur-xl">
          <a href={`${BASE}/variant`} className="font-sans text-sm font-semibold no-underline">
            ← Variant sahifasi
          </a>
          <span className="rounded-full bg-navy px-3 py-1.5 font-sans text-[11px] font-medium text-paper">Takliflar</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-5 pb-24 pt-14 md:px-10 md:pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2.25rem] bg-navy px-7 py-14 text-paper md:px-14 md:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />
          <span aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/25 blur-3xl" />
          <div className="relative">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-paper/15 bg-paper/5 px-3.5 py-1.5 font-sans text-[11px] font-medium text-gold backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Xususiy bojxona ombori · sayt
            </p>
            <h1 className="mt-6 max-w-3xl font-sans text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[4rem]">
              Qo‘shimcha <span className="bg-gradient-to-r from-gold via-[#f5deA0] to-gold bg-clip-text text-transparent">imkoniyatlar</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-paper/75">
              Saytni keyingi bosqichga olib chiqish uchun tavsiyalar: nima hozir qilinadi, nima server talab qiladi.
            </p>
          </div>
        </section>

        {/* Tartib */}
        <section className="mt-6 grid gap-3 md:grid-cols-3">
          {PRIORITY.map((p, i) => (
            <div
              key={p.t}
              className="group relative overflow-hidden rounded-3xl border border-navy/10 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(11,37,69,0.35)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-sans text-sm font-semibold text-navy">
                  {i + 1}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-steel">Ustuvorlik</span>
              </div>
              <h2 className="mt-5 font-sans text-lg font-semibold tracking-[-0.02em]">{p.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-steel">{p.d}</p>
            </div>
          ))}
        </section>

        {/* Guruhlar */}
        <div className="mt-16 grid gap-12">
          {GROUPS.map((g) => (
            <section key={g.no}>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2.5 rounded-full border border-navy/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-gold">
                    <span>{g.no}</span>
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    <span className="font-sans normal-case tracking-normal text-steel">{g.kicker}</span>
                  </span>
                  <h2 className="mt-4 font-sans text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{g.title}</h2>
                </div>
                <span className={`hidden h-2 w-16 rounded-full md:block ${TONE[g.tone]}`} aria-hidden="true" />
              </div>
              <ul className="grid gap-3 md:grid-cols-2">
                {g.items.map((it, i) => (
                  <li
                    key={it.t}
                    className="group flex gap-4 rounded-3xl border border-navy/10 bg-white p-5 transition-all duration-300 hover:border-gold/50 hover:bg-navy hover:text-paper md:p-6"
                  >
                    <span className="pt-0.5 font-mono text-[11px] text-gold">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-sans text-lg font-semibold tracking-[-0.02em]">{it.t}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-steel transition-colors duration-300 group-hover:text-paper/75">
                        {it.d}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-16 rounded-3xl border border-navy/10 bg-white p-6 text-sm text-steel">
          Qaysi band birinchi bo‘lib amalga oshsin, shuni tanlang. Shu bo‘yicha ishni boshlaymiz.
        </p>
      </main>
    </div>
  )
}
