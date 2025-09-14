import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useMidi } from './useMidi'

describe('useMidi', () => {
  let mockInput: any
  let mockAccess: any

  beforeEach(() => {
    mockInput = {
      id: '1',
      name: 'Input',
      manufacturer: 'Test',
      state: 'connected',
      type: 'input',
      onmidimessage: null as any,
    }

    mockAccess = {
      inputs: new Map([[mockInput.id, mockInput]]),
      outputs: new Map(),
      onstatechange: null as any,
    }

    ;(navigator as any).requestMIDIAccess = vi.fn().mockResolvedValue(mockAccess)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete (navigator as any).requestMIDIAccess
  })

  it('initializes and cleans up MIDI listeners', async () => {
    const { result, unmount } = renderHook(() => useMidi())

    await waitFor(() => expect(result.current.isConnected).toBe(true))

    expect((navigator as any).requestMIDIAccess).toHaveBeenCalled()
    expect(result.current.devices).toHaveLength(1)
    expect(typeof mockAccess.onstatechange).toBe('function')
    expect(typeof mockInput.onmidimessage).toBe('function')

    unmount()

    expect(mockAccess.onstatechange).toBeNull()
    expect(mockInput.onmidimessage).toBeNull()
  })

  it('handles MIDI messages and recording', async () => {
    const { result } = renderHook(() => useMidi())
    await waitFor(() => expect(result.current.isConnected).toBe(true))

    act(() => {
      result.current.startRecording()
    })

    const event = { data: [0x90, 60, 100], timeStamp: 123 }
    act(() => {
      mockInput.onmidimessage(event as any)
    })

    expect(result.current.lastNote).toEqual({
      note: 60,
      velocity: 100,
      channel: 0,
      timestamp: 123,
    })
    expect(result.current.recordedNotes).toHaveLength(1)

    act(() => {
      result.current.stopRecording()
    })
    act(() => {
      mockInput.onmidimessage({ data: [0x90, 62, 110], timeStamp: 200 } as any)
    })
    expect(result.current.recordedNotes).toHaveLength(1)

    act(() => {
      result.current.clearRecording()
    })
    expect(result.current.recordedNotes).toHaveLength(0)
  })
})
