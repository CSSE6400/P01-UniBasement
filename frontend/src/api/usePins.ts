import { DisplayCourse, PinCourse } from '@/types'
import { useEffect, useState } from 'react'

export function usePinned() {
  const [pin, setPin] = useState<string>()

  useEffect(() => {
    let value: string | null = localStorage.getItem('pinned')
    value ? setPin(value) : ''
  }, [])

  try {
    return pin ? JSON.parse(pin) : []
  } catch (error) {
    console.error('Failed to parse pin:', error)
    return []
  }
}
