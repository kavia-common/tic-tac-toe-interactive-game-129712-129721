import { render, screen, fireEvent, within } from '@testing-library/react';
import Board from '../Board';

describe('Board component', () => {
  test('renders a 3x3 board with 9 cells', () => {
    const squares = Array(9).fill(null);
    render(<Board squares={squares} onPlay={() => {}} winLine={[]} />);
    const grid = screen.getByRole('grid', { name: /Tic Tac Toe Board/i });
    const cells = within(grid).getAllByRole('gridcell');
    expect(cells).toHaveLength(9);
  });

  test('marks winning cells with win class', () => {
    const squares = ['X','X','X', null,null,null, null,null,null];
    const winLine = [0,1,2];
    render(<Board squares={squares} onPlay={() => {}} winLine={winLine} />);
    winLine.forEach(i => {
      const cell = screen.getByRole('gridcell', { name: new RegExp(`Cell ${i+1}`, 'i') });
      expect(cell.className).toMatch(/\bwin\b/);
    });
  });

  test('calls onPlay with index when a cell is clicked', () => {
    const squares = Array(9).fill(null);
    const onPlay = jest.fn();
    render(<Board squares={squares} onPlay={onPlay} winLine={[]} />);
    const cell5 = screen.getByRole('gridcell', { name: /Cell 5/i });
    fireEvent.click(cell5);
    expect(onPlay).toHaveBeenCalledWith(4);
  });
});
