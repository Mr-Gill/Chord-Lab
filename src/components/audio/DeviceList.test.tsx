import React from 'react';
import { render, screen } from '@testing-library/react';
import DeviceList from './DeviceList';

const mockNoteName = (note: number) => `N${note}`;

const mockDevice = {
  id: '1',
  name: 'Keyboard',
  manufacturer: 'Yamaha',
  state: 'connected' as const,
  type: 'input' as const,
};

describe('DeviceList', () => {
  it('renders connected devices', () => {
    render(
      <DeviceList
        connectedDevices={[mockDevice]}
        inputDevices={[mockDevice]}
        lastNote={null}
        noteNumberToName={mockNoteName}
      />
    );

    expect(screen.getByText('Keyboard')).toBeInTheDocument();
  });

  it('shows last played note when available', () => {
    render(
      <DeviceList
        connectedDevices={[mockDevice]}
        inputDevices={[mockDevice]}
        lastNote={{ note: 60, velocity: 100, channel: 0, timestamp: Date.now() }}
        noteNumberToName={mockNoteName}
      />
    );

    expect(screen.getByText('N60')).toBeInTheDocument();
  });
});
