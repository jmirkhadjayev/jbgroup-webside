// Scroll holati: sahifa (GSAP ScrollTrigger) yozadi, 3D sahna (useFrame) o‘qiydi.
// React state ishlatilmaydi — har kadrda re-render bo‘lmasin deb oddiy obyekt.
export const flow = { p: 0 }

// Bosqichlar boshlanish nuqtalari — WarehouseScene dagi harakat bilan mos:
// 0: yuk keldi (forklift kirmoqda) · 0.36: olish · 0.55: joylash · 0.72: saqlash
export const STAGE_STARTS = [0, 0.36, 0.55, 0.72]

export function stageOf(p: number): number {
  let idx = 0
  for (let k = 0; k < STAGE_STARTS.length; k++) {
    if (p >= STAGE_STARTS[k]) idx = k
  }
  return idx
}
