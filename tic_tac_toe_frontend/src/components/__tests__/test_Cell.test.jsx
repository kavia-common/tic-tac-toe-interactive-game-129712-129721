import { render, screen, fireEvent } from '@testing-library/react';
import Cell from '../Cell';

describe('Cell component', () => {
  test('renders with correct role and label', () => {
    render(<Cell index={0} value={null} isWinning={false} onClick={() => {}} />);
    const cell = screen.getByRole('gridcell', { name: /Cell 1/i });
    expect(cell).toBeInTheDocument();
  });

  test('shows X with class x and no win', () => {
    render(<Cell index={1} value="X" isWinning={false} onClick={() => {}} />);
    const cell = screen.getByRole('gridcell', { name: /Cell 2/i });
    expect(cell).toHaveTextContent('X');
    expect(cell.className).toMatch(/\bt3-cell\b/);
    expect(cell.className).toMatch(/\bx\b/);
    expect(cell.className).not.toMatch(/\bwin\b/);
  });

  test('shows O with class o and win class when isWinning', () => {
    render(<Cell index={2} value="O" isWinning={true} onClick={() => {}} />);
    const cell = screen.getByRole('gridcell', { name: /Cell 3/i });
    expect(cell).toHaveTextContent('O');
    expect(cell.className).toMatch(/\bo\b/);
    expect(cell.className).toMatch(/\bwin\b/);
  });

  test('calls onClick with index when clicked', () => {
    const onClick = jest.fn();
    render(<Cell index={4} value={null} isWinning={false} onClick={onClick} />);
    const cell = screen.getByRole('gridcell', { name: /Cell 5/i });
    fireEvent.click(cell);
    expect(onClick).toHaveBeenCalledWith(4);
  });
});
