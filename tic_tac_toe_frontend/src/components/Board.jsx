import React from 'react';
import Cell from './Cell';

/**
 * Board component renders the 3x3 grid of cells.
 * It delegates click handling to the parent via the onPlay prop.
 */

// PUBLIC_INTERFACE
export default function Board({ squares, onPlay, winLine = [] }) {
  /** Render the grid using Cell components, passing winning status per index. */
  return (
    <div className="t3-board" role="grid" aria-label="Tic Tac Toe Board">
      {squares.map((value, idx) => (
        <Cell
          key={idx}
          index={idx}
          value={value}
          isWinning={winLine.includes(idx)}
          onClick={onPlay}
        />
      ))}
    </div>
  );
}
