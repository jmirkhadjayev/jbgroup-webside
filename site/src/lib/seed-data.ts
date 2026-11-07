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
  stats: { area: 12000, capacity: 5000, years: 10 }, // NAMUNA
}

export const seedWarehouses: { image: string; area: number; name: L; type: L }[] = [
  { image: 'ombor-1.jpg', area: 4000, name: { uz: 'Sklad A', ru: 'Склад A', en: 'Warehouse A' }, type: { uz: 'Umumiy saqlash', ru: 'Общее хранение', en: 'General storage' } },
  { image: 'ombor-2.jpg', area: 3500, name: { uz: 'Sklad B', ru: 'Склад B', en: 'Warehouse B' }, type: { uz: 'Ochiq maydon', ru: 'Открытая площадка', en: 'Open yard' } },
  { image: 'ombor-3.jpg', area: 2500, name: { uz: 'Sklad C', ru: 'Склад C', en: 'Warehouse C' }, type: { uz: 'Ombor binosi', ru: 'Здание склада', en: 'Warehouse building' } },
  { image: 'ombor-4.jpg', area: 2000, name: { uz: 'Sklad D', ru: 'Склад D', en: 'Warehouse D' }, type: { uz: 'Ombor binosi', ru: 'Здание склада', en: 'Warehouse building' } },
  { image: 'ombor-5.jpg', area: 3000, name: { uz: 'Sklad E', ru: 'Склад E', en: 'Warehouse E' }, type: { uz: 'Ochiq maydon', ru: 'Открытая площадка', en: 'Open yard' } },
  { image: 'ombor-6.jpg', area: 2800, name: { uz: 'Sklad F', ru: 'Склад F', en: 'Warehouse F' }, type: { uz: 'Yopiq yuklash maydoni', ru: 'Крытая погрузочная зона', en: 'Covered loading area' } },
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
