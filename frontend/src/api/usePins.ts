import { PinCourse } from '@/types'

export function getPinned() {
  const pinnedItems = localStorage.getItem('pinned')

  return {
    pinnedItems,
  }
}

export function setPinned() {
  localStorage.setItem('pinned', 'test')
}
