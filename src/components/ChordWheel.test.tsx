import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ChordWheel from './ChordWheel';

import { ThemeProvider } from '../contexts/ThemeContext'

const initAudio = vi.fn()
const playChord = vi.fn()

vi.mock('../contexts/AudioProvider', () => ({
  useAudioContext: () => ({ initAudio, playChord }),
}))

beforeEach(() => {
  initAudio.mockClear()
  playChord.mockClear()
})

describe('ChordWheel', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <MemoryRouter>
        <ThemeProvider>{ui}</ThemeProvider>
      </MemoryRouter>
    )
  }

  it('should render the chord wheel with the default key of C', () => {
    renderWithProviders(<ChordWheel />)

    expect(screen.getByText('Chord Wheel')).toBeInTheDocument()
    expect(screen.getByText('C major')).toBeInTheDocument()
  })

  it('should highlight the correct diatonic chords for the key of C', () => {
    renderWithProviders(<ChordWheel />)

    // Diatonic chords in C major: C, F, G
    const diatonicMajors = ['C', 'F', 'G']
    diatonicMajors.forEach(chord => {
      const sector = screen.getByTestId(`sector-${chord}`)
      const path = sector.querySelector('path:first-of-type')
      expect(path).toHaveAttribute('filter', 'url(#glow)')
    })
  })

  it('should change the key and update the diatonic chords', () => {
    renderWithProviders(<ChordWheel />)

    const keySelector = screen.getByLabelText('Key')
    fireEvent.change(keySelector, { target: { value: 'G' } })

    expect(screen.getByText('G major')).toBeInTheDocument()

    // Diatonic chords in G major: G, C, D
    const diatonicMajors = ['G', 'C', 'D']
    diatonicMajors.forEach(chord => {
      const sector = screen.getByTestId(`sector-${chord}`)
      const path = sector.querySelector('path:first-of-type')
      expect(path).toHaveAttribute('filter', 'url(#glow)')
    })
  })

  it('plays chord audio when a sector is selected', () => {
    renderWithProviders(<ChordWheel />)
    const sector = screen.getByLabelText('Select C major')
    fireEvent.click(sector)
    expect(initAudio).toHaveBeenCalled()
    expect(playChord).toHaveBeenCalledWith(['C4', 'E4', 'G4'], 0.8)
  })

  it('throttles rapid repeated clicks to prevent overlapping playback', () => {
    vi.useFakeTimers()
    renderWithProviders(<ChordWheel />)
    const sector = screen.getByLabelText('Select C major')
    fireEvent.click(sector)
    fireEvent.click(sector)
    expect(playChord).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(300)
    fireEvent.click(sector)
    expect(playChord).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })
})
