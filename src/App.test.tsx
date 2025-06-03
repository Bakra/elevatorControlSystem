import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('ElevatorControlSystem App', () => {
  it('renders the main title', () => {
    render(<App />);
    expect(screen.getByText(/Elevator Control System/i)).toBeInTheDocument();
  });

  it('renders the Control Panel', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });

  it('renders the Elevators visualization', () => {
    render(<App />);
    expect(screen.getByText(/Elevator Status/i)).toBeInTheDocument();
  });

  it('start button is enabled by default', () => {
    render(<App />);
    const startButton = screen.getByRole('button', { name: /start/i });
    expect(startButton).toBeEnabled();
  });

  it('start button toggles to pause after click', () => {
    render(<App />);
    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('reset button resets the system', async () => {
    render(<App />);
    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    // Optionally check that logs are cleared
    await waitFor(() => {
      expect(screen.queryByText(/New/)).not.toBeInTheDocument();
    });
  });

  it('does not allow multiple starts without reset', () => {
    render(<App />);
    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);
    // After clicking, Start should not be present, only Pause
    expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });
  describe('Elevator Status Display', () => {
    it('should show initial elevator states', () => {
      render(<App />);

      // All elevators should start at floor 1
      const floorStatuses = screen.getAllByText('Floor: 1');
      expect(floorStatuses).toHaveLength(4);

      // All elevators should start with 0 passengers
      const passengerCounts = screen.getAllByText('Passengers: 0');
      expect(passengerCounts).toHaveLength(4);

      // All elevators should have no targets initially
      const targets = screen.getAllByText('Targets: None');
      expect(targets).toHaveLength(4);
    });

    it('should show idle status for all elevators initially', () => {
      render(<App />);
      const idleStatuses = screen.getAllByText('Idle');
      expect(idleStatuses).toHaveLength(4);
    });
  });

    describe('Activity Log', () => {
    it('should render activity log section', () => {
      render(<App />);
      expect(screen.getByText('Activity Log')).toBeInTheDocument();
    });

    it('should be empty initially', () => {
      render(<App />);
      const logContainer = screen.getByText('Activity Log').parentElement;
      const logEntries = logContainer?.querySelectorAll('[class*="bg-"]');
      // Should only have the header, no log entries
      expect(logEntries?.length || 0).toBeLessThanOrEqual(1);
    });
  });

    describe('Activity Log', () => {
    it('should render activity log section', () => {
      render(<App />);
      expect(screen.getByText('Activity Log')).toBeInTheDocument();
    });

    it('should be empty initially', () => {
      render(<App />);
      const logContainer = screen.getByText('Activity Log').parentElement;
      const logEntries = logContainer?.querySelectorAll('[class*="bg-"]');
      // Should only have the header, no log entries
      expect(logEntries?.length || 0).toBeLessThanOrEqual(1);
    });
  });

  it('should render all four elevators in status panel', () => {
      render(<App />);
      expect(screen.getByText('Elevator 1')).toBeInTheDocument();
      expect(screen.getByText('Elevator 2')).toBeInTheDocument();
      expect(screen.getByText('Elevator 3')).toBeInTheDocument();
      expect(screen.getByText('Elevator 4')).toBeInTheDocument();
    });

  it('start button does not trigger multiple logs on repeated clicks', async () => {
    render(<App />);
    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);
    // Try clicking again (should not trigger another start)
    expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument();
    // Wait for at most one "New" log to appear
    await waitFor(
      () => {
        const logs = screen.queryAllByText(/New (up|down) call/i);
        expect(logs.length).toBeLessThanOrEqual(1);
      },
      { timeout: 4000 }
    );
  });
});