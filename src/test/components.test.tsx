import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';

describe('StadiaIQ 2026 UI Component Integration Tests', () => {
  it('renders root application and header title cleanly', () => {
    render(<App />);
    expect(screen.getByText('StadiaIQ')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  it('displays live attendance and AI crowd routing recommendation on dashboard', () => {
    render(<App />);
    expect(screen.getByText('Live Attendance')).toBeInTheDocument();
    expect(screen.getByText(/AI Crowd Routing Recommendation/i)).toBeInTheDocument();
  });

  it('allows toggling between Fan Mode and Staff Command Center', () => {
    render(<App />);
    const switchBtn = screen.getByRole('button', { name: /Current mode: fan/i });
    expect(switchBtn).toBeInTheDocument();
    
    // Click to switch to staff mode
    fireEvent.click(switchBtn);
    expect(screen.getByText(/Switch to Fan Mode/i)).toBeInTheDocument();
  });
});
