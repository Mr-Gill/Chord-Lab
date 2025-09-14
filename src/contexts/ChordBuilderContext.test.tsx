import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ReactNode } from 'react'
import { ChordBuilderProvider, useChordBuilder } from './ChordBuilderContext'

describe('ChordBuilderContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('restores chords and selected key from localStorage', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ChordBuilderProvider>{children}</ChordBuilderProvider>
    )

    const { result, unmount } = renderHook(() => useChordBuilder(), { wrapper })

    act(() => {
      result.current.setChords([{ id: '1', name: 'C', key: 'C' }])
      result.current.setSelectedKey('G')
    })

    unmount()

    const { result: result2 } = renderHook(() => useChordBuilder(), { wrapper })

    expect(result2.current.chords).toEqual([{ id: '1', name: 'C', key: 'C' }])
    expect(result2.current.selectedKey).toBe('G')
  })
})
