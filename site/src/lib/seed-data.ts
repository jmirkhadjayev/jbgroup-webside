// Boshlang‘ich (default) ma’lumotlar. Hammasi admin paneldan o‘zgartiriladi.
// Maydon va namuna raqamlar hali haqiqiy emas — `[...]` bilan belgilangan joylarni to‘ldiring.

type L = { uz: string; ru: string; en: string }

export const seedSettings = {
  license: '[Litsenziya raqami]',
  phone: '+998 93 523 53 00',
  email: 'zulfiya1023@mail.ru',
  mapQuery: '41.269669,69.324979',
  address: {
    uz: 'Toshkent shahri, Yashnobod tumani, Do‘stobod MFY, Maxtumquli ko‘chasi, 99-uy, 25-xona',
    ru: 'г. Ташкент, Яшнабадский район, МФЙ Дустобод, ул. Махтумкули, дом 99, офис 25',
    en: 'Tashkent city, Yashnobod district, Do‘stobod neighborhood, Maxtumquli street, building 99, room 25',
  } as L,
  hours: {
    uz: 'Du–Ju 09:00–18:00',
    ru: 'Пн–Пт 09:00–18:00',
    en: 'Mon–Fri 09:00–18:00',
  } as L,
  // area — jadvaldan (B skladsiz: 16 228 m²); capacity va years — NAMUNA
  stats: { area: 16228, capacity: 4350, years: 7 },
}

export const seedWarehouses: { image: string; area: number; name: L; type: L }[] = [
  // Maydonlar: "Omborxonalar turlari va maydoni" jadvalidan (jami 17 593 m²)
  {
    image: 'ombor-1.jpg',
    area: 6676,
    name: { uz: 'A. Bojxona ombori', ru: 'A. Таможенный склад', en: 'A. Customs warehouse' },
    type: {
      uz: 'A1 · 731 m²  |  A2 · 814 m²  |  A3 · 5 131 m²',
      ru: 'A1 · 731 м²  |  A2 · 814 м²  |  A3 · 5 131 м²',
      en: 'A1 · 731 m²  |  A2 · 814 m²  |  A3 · 5,131 m²',
    },
  },
  { image: 'ombor-3.jpg', area: 3120, name: { uz: 'C. Sklad', ru: 'C. Склад', en: 'C. Warehouse' }, type: { uz: 'Umumiy sklad', ru: 'Склад', en: 'Warehouse' } },
  { image: 'ombor-4.jpg', area: 3072, name: { uz: 'F. Sklad + garaj', ru: 'F. Склад + гараж', en: 'F. Warehouse + garage' }, type: { uz: 'F1 · 480 m²  |  F2 · 2 592 m²', ru: 'F1 · 480 м²  |  F2 · 2 592 м²', en: 'F1 · 480 m²  |  F2 · 2,592 m²' } },
  { image: 'ombor-5.jpg', area: 1560, name: { uz: 'D. Sklad', ru: 'D. Склад', en: 'D. Warehouse' }, type: { uz: 'Umumiy sklad', ru: 'Склад', en: 'Warehouse' } },
  { image: 'ombor-6.jpg', area: 1800, name: { uz: 'E. Sklad', ru: 'E. Склад', en: 'E. Warehouse' }, type: { uz: 'Umumiy sklad', ru: 'Склад', en: 'Warehouse' } },
]

export const seedServices: { title: L; text: L }[] = [
  {
    title: { uz: 'Bojxona saqlash', ru: 'Таможенное хранение', en: 'Customs storage' },
    text: {
      uz: 'Tovarlarni bojxona nazorati ostida, bojxona to‘lovlarini to‘lamasdan saqlash.',
      ru: 'Хранение товаров под таможенным контролем без уплаты пошлин до выпуска.',
      en: 'Goods held under customs control, with duties deferred until release.',
    },
  },
  {
    title: { uz: 'Rasmiylashtirishga tayyorlash', ru: 'Подготовка к оформлению', en: 'Preparation for clearance' },
    text: {
      uz: 'Partiyalarni saralash, belgilash va deklaratsiyaga tayyorlash.',
      ru: 'Сортировка, маркировка и комплектация партий перед декларированием.',
      en: 'Sorting, marking and grouping consignments ahead of declaration.',
    },
  },
  {
    title: { uz: 'Konteynerlarni qayta yuklash', ru: 'Перегрузка контейнеров', en: 'Container handling' },
    text: {
      uz: 'Konteynerlarni tushirish, saralash va yuklash.',
      ru: 'Выгрузка, пересортировка и погрузка контейнеров.',
      en: 'Unloading, re-sorting and loading of containers.',
    },
  },
  {
    title: { uz: 'Yuk tashish va ekspeditorlik', ru: 'Перевозка и экспедирование', en: 'Transport and forwarding' },
    text: {
      uz: 'Yuklarni ombordan va omborga yetkazib berish.',
      ru: 'Доставка грузов до склада и от склада.',
      en: 'Delivery of cargo to and from the warehouse.',
    },
  },
  {
    title: { uz: 'Yuk sug‘urtasi', ru: 'Страхование груза', en: 'Cargo insurance' },
    text: {
      uz: 'Saqlash davridagi tovarlarni sug‘urta bilan himoyalash.',
      ru: 'Страховое покрытие на время хранения.',
      en: 'Insurance cover for goods during storage.',
    },
  },
  {
    title: { uz: 'Hujjatlar bo‘yicha maslahat', ru: 'Консультации по документам', en: 'Documentation advice' },
    text: {
      uz: 'Bojxona hujjatlari va saqlash qoidalari bo‘yicha yordam.',
      ru: 'Помощь с таможенной документацией и правилами хранения.',
      en: 'Help with customs paperwork and storage rules.',
    },
  },
]

export const seedTeam: { name: string; role: L; bio: L }[] = [
  { name: 'Ism Familiya', role: { uz: 'Bosh direktor', ru: 'Генеральный директор', en: 'General director' }, bio: { uz: 'Qisqa biografiya.', ru: 'Краткая биография.', en: 'Short biography.' } },
  { name: 'Ism Familiya', role: { uz: 'Bojxona bo‘yicha direktor', ru: 'Директор по таможне', en: 'Customs director' }, bio: { uz: 'Qisqa biografiya.', ru: 'Краткая биография.', en: 'Short biography.' } },
  { name: 'Ism Familiya', role: { uz: 'Operatsiyalar direktori', ru: 'Директор по операциям', en: 'Operations director' }, bio: { uz: 'Qisqa biografiya.', ru: 'Краткая биография.', en: 'Short biography.' } },
]

export const seedTariffs: { file: string; date: string; title: L }[] = [
  { file: 'tarif-saqlash.pdf', date: '[sana]', title: { uz: 'Bojxona saqlash tarifi', ru: 'Тариф на таможенное хранение', en: 'Customs storage tariff' } },
  { file: 'tarif-konteyner.pdf', date: '[sana]', title: { uz: 'Konteyner xizmatlari tarifi', ru: 'Тариф на контейнерные услуги', en: 'Container services tariff' } },
  { file: 'tarif-qoshimcha.pdf', date: '[sana]', title: { uz: 'Qo‘shimcha xizmatlar tarifi', ru: 'Тариф на дополнительные услуги', en: 'Additional services tariff' } },
]
