import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Board from './components/Board';
import { calculateWinner, findBestMove } from './utils/gameLogic';

/**
 * Minimalistic Tic Tac Toe built with React.
 * - Interactive 3x3 grid
 * - Local two-player and basic AI opponent
 * - Win/draw detection with lightweight notifications
 * - Reset / Replay controls
 * - Header and score/status bar
 * - Responsive, light theme with modern look
 *
 * Color palette:
 *  - Primary: #1976d2
 *  - Accent: #e53935
 *  - Secondary: #ffffff
 */

// PUBLIC_INTERFACE
export default function App() {
  /**
   * App state is fully local; no backend or env vars required.
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [mode, setMode] = useState('2p'); // '2p' | 'ai'
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [notification, setNotification] = useState('');
  const [aiThinking, setAiThinking] = useState(false);

  const currentPlayer = xIsNext ? 'X' : 'O';
  const result = useMemo(() => calculateWinner(squares), [squares]);
  const isBoardFull = squares.every(Boolean);
  const gameOver = !!result || (isBoardFull && !result);

  // Clear transient notifications after a short period
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(''), 1800);
    return () => clearTimeout(t);
  }, [notification]);

  // AI move effect
  useEffect(() => {
    if (mode !== 'ai' || gameOver) return;
    // AI plays as 'O' by default when it's O's turn
    const aiMark = 'O';
    const humanMark = 'X';
    if (!xIsNext) {
      setAiThinking(true);
      const timer = setTimeout(() => {
        const idx = findBestMove(squares, aiMark, humanMark);
        if (idx !== null) {
          setSquares((prev) => {
            if (prev[idx]) return prev; // guard if changed
            const next = prev.slice();
            next[idx] = aiMark;
            return next;
          });
          setXIsNext(true);
        }
        setAiThinking(false);
      }, 550); // subtle delay for UX
      return () => clearTimeout(timer);
    }
  }, [mode, xIsNext, squares, gameOver]);

  // Update scores when game ends
  useEffect(() => {
    if (!gameOver) return;
    if (result?.winner) {
      setScores((prev) => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
      setNotification(`Player ${result.winner} wins!`);
    } else {
      setScores((prev) => ({ ...prev, draw: prev.draw + 1 }));
      setNotification('It’s a draw.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  function handleSquareClick(index) {
    if (gameOver || squares[index]) return;
    // If AI mode and it's not human's turn, do nothing
    if (mode === 'ai' && !xIsNext) return;

    setSquares((prev) => {
      if (prev[index]) return prev;
      const next = prev.slice();
      next[index] = currentPlayer;
      return next;
    });
    setXIsNext((prev) => !prev);
  }

  function handleResetBoard() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setAiThinking(false);
  }

  function handleNewMatch() {
    handleResetBoard();
    setScores({ X: 0, O: 0, draw: 0 });
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    handleResetBoard();
  }

  const statusText = result
    ? `Winner: ${result.winner}`
    : isBoardFull
    ? 'Draw'
    : mode === 'ai'
    ? aiThinking
      ? 'AI is thinking...'
      : `Turn: ${currentPlayer} ${xIsNext ? '(You)' : '(AI)'}`
    : `Turn: ${currentPlayer}`;

  return (
    <div className="t3-app">
      <header className="t3-header">
        <h1 className="t3-title">Tic Tac Toe</h1>
        <div className="t3-mode">
          <label className="t3-seg">
            <input
              type="radio"
              name="mode"
              value="2p"
              checked={mode === '2p'}
              onChange={() => handleModeChange('2p')}
            />
            <span>Two Players</span>
          </label>
          <label className="t3-seg">
            <input
              type="radio"
              name="mode"
              value="ai"
              checked={mode === 'ai'}
              onChange={() => handleModeChange('ai')}
            />
            <span>Play vs AI</span>
          </label>
        </div>
      </header>

      <main className="t3-main">
        <div className="t3-panel">
          <section className="t3-statusbar" role="status" aria-live="polite">
            <div className="t3-status">
              <span className="t3-status-label">Status</span>
              <span className="t3-status-value">{statusText}</span>
            </div>
            <div className="t3-score">
              <span className="score x">X: {scores.X}</span>
              <span className="score o">O: {scores.O}</span>
              <span className="score draw">Draw: {scores.draw}</span>
            </div>
          </section>

          <section className="t3-board-wrap">
            <Board
              squares={squares}
              onPlay={handleSquareClick}
              winLine={result?.line || []}
            />
            {notification && (
              <div className="t3-toast" role="alert" aria-live="assertive">
                {notification}
              </div>
            )}
          </section>

          <section className="t3-actions">
            <button className="btn primary" onClick={handleResetBoard} aria-label="Reset board">
              Reset Board
            </button>
            <button className="btn outline" onClick={handleNewMatch} aria-label="New match">
              New Match
            </button>
          </section>
        </div>
      </main>

      <footer className="t3-footer">
        <span>Made with React</span>
      </footer>
    </div>
  );
}
