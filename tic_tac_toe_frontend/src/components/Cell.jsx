import React from 'react';

/**
 * Cell component represents a single square in the Tic Tac Toe board.
 * It is stateless and relies on props for its display and behavior.
 */

// PUBLIC_INTERFACE
export default function Cell({ index, value, isWinning, onClick }) {
  /** Renders a single grid cell button with appropriate styles and click handler. */
  const className = `t3-cell ${isWinning ? 'win' : ''} ${
    value === 'X' ? 'x' : value === 'O' ? 'o' : ''
  }`;

  return (
    <button
      role="gridcell"
      aria-label={`Cell ${index + 1}`}
      className={className}
      onClick={() => onClick(index)}
    >
      {value}
    </button>
  );
}
