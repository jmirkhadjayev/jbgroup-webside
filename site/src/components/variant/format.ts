// Raqam, indeks va fayl formatlash yordamchilari

// 12000 -> "12 000"
export const fmt = (n: number): string => Math.round(n).toLocaleString('en-US').replace(/,/g, ' ')

// 3 -> "03"
export const pad = (n: number): string => String(n).padStart(2, '0')

// "tarif.xlsx" -> "XLSX"
export const ext = (file: string): string => file.split('.').pop()?.toUpperCase() ?? ''
