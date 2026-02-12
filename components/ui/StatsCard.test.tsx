import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsCard from './StatsCard';

describe('StatsCard', () => {
  test('renders title and value correctly', () => {
    render(
      <StatsCard
        title="Total Angajați"
        value={150}
        icon="users"
        color="blue"
      />
    );

    expect(screen.getByText('Total Angajați')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  test('displays trend indicator when trendValue is provided', () => {
    render(
      <StatsCard
        title="Instrumente Verificate"
        value="85%"
        icon="check-circle"
        trend="up"
        trendValue="+12% față de luna trecută"
        color="green"
      />
    );

    expect(screen.getByText('Instrumente Verificate')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('+12% față de luna trecută')).toBeInTheDocument();
  });

  test('applies correct color classes based on color prop', () => {
    const { container } = render(
      <StatsCard
        title="Alerte Active"
        value={23}
        icon="alert-triangle"
        trend="down"
        trendValue="-5 față de săptămâna trecută"
        color="red"
      />
    );

    expect(screen.getByText('Alerte Active')).toBeInTheDocument();
    expect(screen.getByText('23')).toBeInTheDocument();

    // Check if the icon container has red color classes
    const iconContainer = container.querySelector('.bg-red-100');
    expect(iconContainer).toBeInTheDocument();
  });
});
