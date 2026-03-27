import { seed } from './seed.js'

const KEY = 'kisanSanjalDB_v1'

export function loadDB() {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    const s = seed()
    localStorage.setItem(KEY, JSON.stringify(s))
    return s
  }
  try {
    return JSON.parse(raw)
  } catch {
    const s = seed()
    localStorage.setItem(KEY, JSON.stringify(s))
    return s
  }
}

export function saveDB(db) {
  localStorage.setItem(KEY, JSON.stringify(db))
}

export function resetDB() {
  localStorage.removeItem(KEY)
}
