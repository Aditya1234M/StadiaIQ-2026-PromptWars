import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';

describe('StadiaIQ 2026 Fan Persona UI Integration Tests', () => {
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

  it('does NOT render any Staff Command Center or mode toggle button', () => {
    render(<App />);
    const staffButtons = screen.queryAllByText(/Staff Command/i);
    expect(staffButtons.length).toBe(0);
    const modeToggle = screen.queryByRole('button', { name: /Current mode/i });
    expect(modeToggle).toBeNull();
  });

  it('renders stadium selector with MetLife, Azteca, and SoFi options', () => {
    render(<App />);
    const stadiumSelect = screen.getByLabelText(/Select FIFA World Cup Stadium/i);
    expect(stadiumSelect).toBeInTheDocument();
    const metlifeElements = screen.getAllByText(/MetLife Stadium/i);
    expect(metlifeElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders language selector with all 5 language options', () => {
    render(<App />);
    const langSelect = screen.getByLabelText(/Select Language/i);
    expect(langSelect).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('ES')).toBeInTheDocument();
    expect(screen.getByText('FR')).toBeInTheDocument();
    expect(screen.getByText('AR')).toBeInTheDocument();
    expect(screen.getByText('DE')).toBeInTheDocument();
  });

  it('renders core navigation tabs for Fan Persona pages', () => {
    render(<App />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    const copilotElements = screen.getAllByText(/StadiaCopilot AI/i);
    expect(copilotElements.length).toBeGreaterThanOrEqual(1);
  });

  it('displays NFC Match Pass ticket ID and seating details', () => {
    render(<App />);
    expect(screen.getByText(/TKT-FIFA-2026-8942/i)).toBeInTheDocument();
    const sectionElements = screen.getAllByText(/Section 114/i);
    expect(sectionElements.length).toBeGreaterThanOrEqual(1);
  });

  it('displays gate congestion overview with live telemetry', () => {
    render(<App />);
    expect(screen.getByText(/Live Gate Congestion/i)).toBeInTheDocument();
  });

  it('renders footer with fan persona target and emergency info', () => {
    render(<App />);
    expect(screen.getByText(/INTERNATIONAL FANS/i)).toBeInTheDocument();
    expect(screen.getByText(/Security Hotline/i)).toBeInTheDocument();
    const medicalElements = screen.getAllByText(/Medical Aid/i);
    expect(medicalElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders SOS Emergency button on dashboard', () => {
    render(<App />);
    expect(screen.getByText(/EMERGENCY SOS/i)).toBeInTheDocument();
    expect(screen.getByText(/Fan Safety/i)).toBeInTheDocument();
  });
});
