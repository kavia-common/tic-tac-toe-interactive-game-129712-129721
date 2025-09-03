 /**
  * Game logic utilities for Tic Tac Toe:
  * - LINES: All winning line combinations
  * - calculateWinner: Determines winner and winning line
  * - findBestMove: Basic AI strategy
  */

export const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

// PUBLIC_INTERFACE
export function calculateWinner(squares) {
  /** Returns { winner: 'X'|'O', line: [a,b,c] } when a winner exists, otherwise null. */
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
export function findBestMove(squares, aiMark, humanMark) {
  /**
   * Very basic AI:
   * 1) Try to win
   * 2) Block opponent
   * 3) Take center
   * 4) Random corner
   * 5) Random side
   * Returns the chosen index or null when no moves are available.
   */
  const emptyIndices = squares
    .map((v, i) => (v ? null : i))
    .filter((v) => v !== null);

  // 1) Try to win
  for (const idx of emptyIndices) {
    const clone = squares.slice();
    clone[idx] = aiMark;
    if (calculateWinner(clone)?.winner === aiMark) return idx;
  }

  // 2) Block human
  for (const idx of emptyIndices) {
    const clone = squares.slice();
    clone[idx] = humanMark;
    if (calculateWinner(clone)?.winner === humanMark) return idx;
  }

  // 3) Center
  if (emptyIndices.includes(4)) return 4;

  // 4) Corners
  const corners = [0, 2, 6, 8].filter((i) => emptyIndices.includes(i));
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

  // 5) Sides
  const sides = [1, 3, 5, 7].filter((i) => emptyIndices.includes(i));
  if (sides.length) return sides[Math.floor(Math.random() * sides.length)];

  return null;
}
