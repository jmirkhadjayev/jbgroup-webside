// Variant sahifasi matnlari — o‘zbekcha, ruscha, inglizcha.
// Xizmatlar, omborlar, rahbariyat, tariflar va manzil ma’lumotlari seed-data.ts da (uz/ru/en).

export type Lang = 'uz' | 'ru' | 'en'
export const LANGS: Lang[] = ['uz', 'ru', 'en']

const uz = {
  tagline: 'Bojxona Ombori & Logistika Majmuasi',
  rights: 'Barcha huquqlar himoyalangan.',
  nav: {
    about: 'Biz haqimizda',
    services: 'Xizmatlar',
    warehouses: 'Omborlar',
    admin: 'Rahbariyat',
    tariffs: 'Hujjatlar',
    contact: 'Aloqa',
  },
  ui: {
    menu: 'Menyu',
    lang: 'Til',
    cta: 'Aloqa',
    enlarge: 'Kattalashtirish',
    zoomIn: 'Yaqinlashtirish',
    zoomOut: 'Kichraytirish',
    close: 'Yopish',
    call: 'Qo‘ng‘iroq qilish',
    download: 'Yuklab olish',
    fullView: 'To‘liq ko‘rish',
    openMap: 'Yandex Xaritada ochish',
  },
  hero: {
    title: 'Yuklaringiz bojxona nazorati ostida saqlanadi',
    lede: 'Xususiy bojxona ombori: bojxona to‘lovlari rasmiylashtirilgunga qadar tovarlarni qonuniy saqlash, qayta ishlash va jo‘natish.',
    cta1: 'Tariflarni ko‘rish',
    cta2: 'Bog‘lanish',
  },
  gate: { type: 'Kirish nazorati', name: 'Kirish majmuasi' },
  sections: {
    services: { kicker: 'Nima qilamiz', title: 'Xizmatlar' },
    warehouses: { kicker: 'Ombor bloklari', title: 'Omborlar' },
    admin: { kicker: 'Jamoa', title: 'Rahbariyat' },
    docs: { kicker: 'Hujjatlar', title: 'Tariflar va hujjatlar' },
    contact: { kicker: 'Manzil va aloqa', title: 'Biz bilan bog‘laning' },
  },
  license: {
    label: 'Litsenziya',
    items: [
      { caption: 'Litsenziya', alt: 'Bojxona ombori litsenziyasi' },
      { caption: 'Ilova', alt: 'Litsenziya ilovasi: faoliyat turi va qo‘shimcha ma’lumotlar' },
    ],
  },
  tariffsLabel: 'Tariflar',
  stats: { area: 'm² maydon', capacity: 'tonna sig‘im', years: 'yil faoliyat' },
  contact: { address: 'Manzil', phone: 'Telefon', email: 'Email', hours: 'Ish vaqti', license: 'Litsenziya' },
  mapTitle: 'Xarita',
}

export type Dict = typeof uz

const ru: Dict = {
  tagline: 'Таможенный склад и логистический комплекс',
  rights: 'Все права защищены.',
  nav: {
    about: 'О нас',
    services: 'Услуги',
    warehouses: 'Склады',
    admin: 'Руководство',
    tariffs: 'Документы',
    contact: 'Контакты',
  },
  ui: {
    menu: 'Меню',
    lang: 'Язык',
    cta: 'Связаться',
    enlarge: 'Увеличить',
    zoomIn: 'Приблизить',
    zoomOut: 'Отдалить',
    close: 'Закрыть',
    call: 'Позвонить',
    download: 'Скачать',
    fullView: 'Открыть полностью',
    openMap: 'Открыть в Яндекс Картах',
  },
  hero: {
    title: 'Ваши грузы хранятся под таможенным контролем',
    lede: 'Частный таможенный склад: хранение товаров под таможенным контролем до оформления таможенных платежей, переработка и отправка.',
    cta1: 'Смотреть тарифы',
    cta2: 'Связаться',
  },
  gate: { type: 'Контрольно-пропускной пункт', name: 'Въездная группа' },
  sections: {
    services: { kicker: 'Что мы делаем', title: 'Услуги' },
    warehouses: { kicker: 'Складские блоки', title: 'Склады' },
    admin: { kicker: 'Команда', title: 'Руководство' },
    docs: { kicker: 'Документы', title: 'Тарифы и документы' },
    contact: { kicker: 'Адрес и контакты', title: 'Свяжитесь с нами' },
  },
  license: {
    label: 'Лицензия',
    items: [
      { caption: 'Лицензия', alt: 'Лицензия таможенного склада' },
      { caption: 'Приложение', alt: 'Приложение к лицензии: вид деятельности и дополнительные сведения' },
    ],
  },
  tariffsLabel: 'Тарифы',
  stats: { area: 'м² площади', capacity: 'тонн вместимости', years: 'лет работы' },
  contact: { address: 'Адрес', phone: 'Телефон', email: 'Email', hours: 'Часы работы', license: 'Лицензия' },
  mapTitle: 'Карта',
}

const en: Dict = {
  tagline: 'Customs Warehouse & Logistics Complex',
  rights: 'All rights reserved.',
  nav: {
    about: 'About us',
    services: 'Services',
    warehouses: 'Warehouses',
    admin: 'Management',
    tariffs: 'Documents',
    contact: 'Contact',
  },
  ui: {
    menu: 'Menu',
    lang: 'Language',
    cta: 'Contact',
    enlarge: 'Enlarge',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    close: 'Close',
    call: 'Call us',
    download: 'Download',
    fullView: 'View full size',
    openMap: 'Open in Yandex Maps',
  },
  hero: {
    title: 'Your cargo is stored under customs control',
    lede: 'A private bonded warehouse: goods are stored under customs control until duties are settled, then processed and dispatched.',
    cta1: 'View tariffs',
    cta2: 'Get in touch',
  },
  gate: { type: 'Access control', name: 'Entrance complex' },
  sections: {
    services: { kicker: 'What we do', title: 'Services' },
    warehouses: { kicker: 'Warehouse units', title: 'Warehouses' },
    admin: { kicker: 'Team', title: 'Management' },
    docs: { kicker: 'Documents', title: 'Tariffs and documents' },
    contact: { kicker: 'Address and contacts', title: 'Get in touch with us' },
  },
  license: {
    label: 'License',
    items: [
      { caption: 'License', alt: 'Customs warehouse license' },
      { caption: 'Annex', alt: 'License annex: activity type and additional details' },
    ],
  },
  tariffsLabel: 'Tariffs',
  stats: { area: 'm² area', capacity: 'tonnes capacity', years: 'years in operation' },
  contact: { address: 'Address', phone: 'Phone', email: 'Email', hours: 'Working hours', license: 'License' },
  mapTitle: 'Map',
}

export const T: Record<Lang, Dict> = { uz, ru, en }
