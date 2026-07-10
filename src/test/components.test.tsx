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

  it('displays Fan NFC Match Pass and allows simulating turnstile scan', () => {
    render(<App />);
    const nfcBtn = screen.getByRole('button', { name: /Simulate NFC Turnstile Scan/i });
    expect(nfcBtn).toBeInTheDocument();
    
    // Click to simulate check-in scan
    fireEvent.click(nfcBtn);
    expect(screen.getByText(/Checked In via Turnstile/i)).toBeInTheDocument();
  });
});
