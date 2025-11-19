import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatCard from '../components/StatCard';

describe('StatCard Component', () => {
  it('renders with title and value', () => {
    render(<StatCard title="Total Items" value={42} />);

    expect(screen.getByText('Total Items')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders with icon when provided', () => {
    render(<StatCard title="Users" value={10} icon="👤" />);

    expect(screen.getByText('👤')).toBeInTheDocument();
  });

  it('applies correct color classes', () => {
    const { container } = render(
      <StatCard title="Test" value={5} icon="✓" color="green" />
    );

    const iconElement = container.querySelector('.bg-green-100');
    expect(iconElement).toBeInTheDocument();
  });

  it('handles zero value', () => {
    render(<StatCard title="Empty" value={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles large numbers', () => {
    render(<StatCard title="Large" value={1000000} />);

    expect(screen.getByText('1000000')).toBeInTheDocument();
  });
});
