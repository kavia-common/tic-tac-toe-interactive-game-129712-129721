import { calculateWinner, findBestMove, LINES } from '../../utils/gameLogic';

describe('gameLogic: calculateWinner', () => {
  test('returns null when no winner', () => {
    const board = Array(9).fill(null);
    expect(calculateWinner(board)).toBeNull();
  });

  test('detects row winners', () => {
    const board = ['X', 'X', 'X', null, null, null, null, null, null];
    expect(calculateWinner(board)).toEqual({ winner: 'X', line: [0, 1, 2] });
  });

  test('detects column winners', () => {
    const board = ['O', null, null, 'O', null, null, 'O', null, null];
    expect(calculateWinner(board)).toEqual({ winner: 'O', line: [0, 3, 6] });
  });

  test('detects diagonal winner (0,4,8)', () => {
    const board = ['X', null, null, null, 'X', null, null, null, 'X'];
    expect(calculateWinner(board)).toEqual({ winner: 'X', line: [0, 4, 8] });
  });

  test('detects diagonal winner (2,4,6)', () => {
    const board = [null, null, 'O', null, 'O', null, 'O', null, null];
    expect(calculateWinner(board)).toEqual({ winner: 'O', line: [2, 4, 6] });
  });

  test('all LINES are valid 3-length arrays within 0..8', () => {
    expect(Array.isArray(LINES)).toBe(true);
    for (const line of LINES) {
      expect(line).toHaveLength(3);
      line.forEach(idx => {
        expect(Number.isInteger(idx)).toBe(true);
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(9);
      });
    }
  });
});

describe('gameLogic: findBestMove', () => {
  const ai = 'O';
  const human = 'X';
  const originalRandom = Math.random;

  beforeEach(() => {
    // Make randomness deterministic in tests
    Math.random = () => 0; // always pick first available from randomized lists
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  test('returns null when no moves available', () => {
    const board = ['X','O','X','X','O','X','O','X','O'];
    expect(findBestMove(board, ai, human)).toBeNull();
  });

  test('chooses immediate winning move', () => {
    // O O _ in top row -> should place at index 2
    const board = ['O','O',null, null,null,null, null,null,null];
    expect(findBestMove(board, ai, human)).toBe(2);
  });

  test('blocks opponent immediate win', () => {
    // X X _ in top row -> AI should block at index 2
    const board = ['X','X',null, null,null,null, null,null,null];
    expect(findBestMove(board, ai, human)).toBe(2);
  });

  test('takes center if available', () => {
    const board = [null,null,null, null,null,null, null,null,null];
    expect(findBestMove(board, ai, human)).toBe(4);
  });

  test('takes a corner when center is not available', () => {
    const board = [null,null,null, null,'X',null, null,null,null];
    // With deterministic Math.random=0, should pick the first available corner
    expect([0,2,6,8]).toContain(findBestMove(board, ai, human));
    // and specifically the first in filtered list (0) due to Math.random = 0
    expect(findBestMove(board, ai, human)).toBe(0);
  });

  test('takes a side when neither center nor corners available', () => {
    // Fill center and corners
    const board = Array(9).fill(null);
    [0,2,4,6,8].forEach(i => (board[i] = 'X'));
    const move = findBestMove(board, ai, human);
    expect([1,3,5,7]).toContain(move);
    expect(move).toBe(1); // first due to Math.random=0
  });
});
