import { render, screen, fireEvent, within, act } from '@testing-library/react';
import App from '../App';

// Helper to click a cell by index (0-based)
const clickCell = (idx) => {
  const cell = screen.getByRole('gridcell', { name: new RegExp(`Cell ${idx+1}`, 'i') });
  fireEvent.click(cell);
};

describe('App integration', () => {
  const originalRandom = Math.random;

  beforeEach(() => {
    jest.useFakeTimers();
    Math.random = () => 0; // deterministic AI corner/side selection
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    Math.random = originalRandom;
  });

  test('renders base UI and status', () => {
    render(<App />);
    expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/Turn: X/i)).toBeInTheDocument();
    const grid = screen.getByRole('grid', { name: /Board/i });
    const cells = within(grid).getAllByRole('gridcell');
    expect(cells).toHaveLength(9);
  });

  test('two-player mode plays and detects a win with score update and notification', () => {
    render(<App />);
    // X: 0 O: 0 Draw: 0 initially
    expect(screen.getByText(/X:\s*0/)).toBeInTheDocument();
    expect(screen.getByText(/O:\s*0/)).toBeInTheDocument();
    expect(screen.getByText(/Draw:\s*0/)).toBeInTheDocument();

    // X wins top row: X at 0, O at 3, X at 1, O at 4, X at 2
    clickCell(0); // X
    clickCell(3); // O
    clickCell(1); // X
    clickCell(4); // O
    clickCell(2); // X -> win

    expect(screen.getByText(/Winner:\s*X/i)).toBeInTheDocument();
    expect(screen.getByText(/Player X wins!/i)).toBeInTheDocument();

    // Score should update
    expect(screen.getByText(/X:\s*1/)).toBeInTheDocument();
    expect(screen.getByText(/O:\s*0/)).toBeInTheDocument();
    expect(screen.getByText(/Draw:\s*0/)).toBeInTheDocument();
  });

  test('AI mode: human plays X, AI responds as O after delay, and can reach draw', () => {
    render(<App />);

    // Switch to AI mode
    const aiModeRadio = screen.getByRole('radio', { name: /Play vs AI/i });
    fireEvent.click(aiModeRadio);

    // Human X plays center
    clickCell(4);

    // AI should think and then move after 550ms
    expect(screen.getByText(/AI is thinking/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(600);
    });

    // After AI move, it should be X's turn again
    expect(screen.getByText(/Turn:\s*X.*\(You\)/i)).toBeInTheDocument();

    // Ensure AI placed an O somewhere
    const grid = screen.getByRole('grid', { name: /Board/i });
    const cells = within(grid).getAllByRole('gridcell');
    const values = cells.map(c => c.textContent);
    expect(values.filter(v => v === 'O').length).toBe(1);
  });

  test('Reset Board clears cells but keeps scores', () => {
    render(<App />);
    // Make a few moves
    clickCell(0);
    clickCell(3);
    // Reset
    const resetBtn = screen.getByRole('button', { name: /Reset board/i });
    fireEvent.click(resetBtn);

    const grid = screen.getByRole('grid', { name: /Board/i });
    const cells = within(grid).getAllByRole('gridcell');
    cells.forEach(cell => expect(cell).toHaveTextContent(''));
    // Scores remain displayed (initially 0/0/0)
    expect(screen.getByText(/X:\s*0/)).toBeInTheDocument();
  });

  test('New Match clears board and resets scores', () => {
    render(<App />);
    // Achieve one X win quickly
    clickCell(0); // X
    clickCell(3); // O
    clickCell(1); // X
    clickCell(4); // O
    clickCell(2); // X -> win

    expect(screen.getByText(/X:\s*1/)).toBeInTheDocument();

    // New Match
    const newMatchBtn = screen.getByRole('button', { name: /New match/i });
    fireEvent.click(newMatchBtn);

    // Scores reset to 0
    expect(screen.getByText(/X:\s*0/)).toBeInTheDocument();
    expect(screen.getByText(/O:\s*0/)).toBeInTheDocument();
    expect(screen.getByText(/Draw:\s*0/)).toBeInTheDocument();

    // Board is empty
    const grid = screen.getByRole('grid', { name: /Board/i });
    const cells = within(grid).getAllByRole('gridcell');
    cells.forEach(cell => expect(cell).toHaveTextContent(''));
  });

  test('detects draw and increments draw score', () => {
    render(<App />);
    // Play moves that lead to a draw (no winner)
    // Sequence (indices): 0,1,2,4,3,5,7,6,8
    [0,1,2,4,3,5,7,6,8].forEach(i => clickCell(i));

    expect(screen.getByText(/Draw$/i)).toBeInTheDocument();
    expect(screen.getByText(/It’s a draw\./i)).toBeInTheDocument();
    expect(screen.getByText(/Draw:\s*1/)).toBeInTheDocument();
  });
});
