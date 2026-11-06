# Xususiy bojxona ombori — sayt

Bitta sahifali statik sayt. Build talab qilinmaydi: `index.html` ni brauzerda ochish yetarli.

## Fayllar

- `index.html` — sayt (HTML, CSS, JS bitta faylda). GSAP CDN orqali yuklanadi.
- `images/` — ombor rasmlari: `ombor-1.jpg` … `ombor-4.jpg`. Rasm yo‘q bo‘lsa, o‘rnida fayl nomi ko‘rsatilgan bo‘sh joy chiqadi.
- `files/` — tarif PDF fayllari: `tarif-saqlash.pdf`, `tarif-konteyner.pdf`, `tarif-qoshimcha.pdf`. Hozirgi fayllar NAMUNA, ularni haqiqiylari bilan almashtiring (nom bir xil bo‘lsin).

## Ma’lumotlarni o‘zgartirish

`index.html` ichidagi `SITE` obyekti (JavaScript):

- `license` — litsenziya raqami
- `address`, `phone`, `phoneHref`, `email` — aloqa ma’lumotlari
- `mapQuery` — xarita qidiruvi
- `stats` — maydon, sig‘im, yillar (**hozir namuna qiymatlar**)
- `bays` — har bir sklad maydoni va rasmi
- `tariffFiles` — PDF fayl yo‘llari

Matnlar (uz / ru / en) `I18N` obyektida. Ism-familiya, lavozim, xizmat matnlari va tarif nomlari shu yerda.

## Ochiq qolgan joylar

- `[Litsenziya raqami]`, `[ko‘cha va uy raqami]`, `[sana]` — haqiqiy ma’lumot bilan almashtiring.
- Ma’muriyat ismlari — “Ism Familiya” placeholder.
- Aloqa formasi hozircha yuborilmaydi, faqat tasdiqlash xabarini ko‘rsatadi. Backend ulanishi kerak (`// TODO` izohi).
- Statistika qiymatlari namuna. Haqiqiy ma’lumotni qo‘ying.
