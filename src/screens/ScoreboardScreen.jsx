import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import './ScoreboardScreen.css'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const TROPHY = ['🥇', '🥈', '🥉']

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * Confetti burst — 30 particles that animate out from centre then fade.
 * Rendered once over the winner card.
 */
function Confetti() {
  // 30 particles; angles spread 360°
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    angle: (i / 30) * 360,
    distance: 60 + Math.random() * 80,
    color: ['#8b5cf6', '#ec4899', '#f59e0b', '#34d399', '#60a5fa'][i % 5],
    size: 5 + Math.random() * 5,
    delay: Math.random() * 300,
  }))

  return (
    <div className="sb-confetti" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="sb-confetti-dot"
          style={{
            '--angle': `${p.angle}deg`,
            '--dist': `${p.distance}px`,
            '--color': p.color,
            '--size': `${p.size}px`,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Individual player ranking card.
 * rank 0 = winner → glowing border + confetti.
 */
function PlayerCard({ player, isWinnerTeam, animDelay }) {
  const initials = getInitials(player.name)
  const roleEmoji = player.role === 'spy' ? '🕵️' : '🛡️'
  const roleName = player.role === 'spy' ? 'Spy' : 'Crewmate'

  return (
    <div
      className={`sb-card animate-fade-in ${isWinnerTeam ? 'sb-card-winner' : ''}`}
      style={{ animationDelay: `${animDelay}ms` }}
      role="listitem"
    >
      <div className={`sb-avatar ${isWinnerTeam ? 'sb-avatar-winner' : ''}`}>
        {initials}
      </div>

      <div className="sb-info">
        <span className={`sb-name ${isWinnerTeam ? 'sb-name-winner' : ''}`}>
          {player.name}
        </span>
        <span className="sb-role" style={{ fontSize: '0.8rem', opacity: 0.8 }}>
          {roleEmoji} {roleName}
        </span>
      </div>
    </div>
  )
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function ScoreboardScreen() {
  const players   = useGameStore((s) => s.players)
  const settings  = useGameStore((s) => s.settings)
  const playAgain = useGameStore((s) => s.playAgain)
  const setScreen = useGameStore((s) => s.setScreen)
  const resetGame = useGameStore((s) => s.resetGame)

  const roundResults = useGameStore((s) => s.roundResults)
  
  const voteResult = roundResults.find(r => r.type === 'vote')
  const guessResult = roundResults.find(r => r.type === 'spyGuess')

  let spyWins = false;
  if (voteResult && !voteResult.spyVotedOut) {
    spyWins = true;
  } else if (guessResult && guessResult.correct) {
    spyWins = true;
  }

  const winnerTitle = spyWins ? 'Spy Wins! 🕵️' : 'Crewmates Win! 🛡️'
  const winnerSubtitle = spyWins 
    ? (guessResult?.correct ? 'The Spy guessed the secret word!' : 'The Spy escaped the vote!')
    : 'The Spy was caught and failed to guess the word!'

  return (
    <main className="sb-screen">

      <Confetti />

      {/* ── Ambient background ── */}
      <div className="sb-bg" aria-hidden="true">
        <div className="sb-orb sb-orb-1" />
        <div className="sb-orb sb-orb-2" />
        <div className="sb-orb sb-orb-3" />
      </div>

      {/* ── Header ── */}
      <header className="sb-header animate-slide-down">
        <div className="sb-header-inner">
          <div className="sb-header-badge">
            <span>🏆</span>
            <span>Final Results</span>
          </div>
          <h1 className="sb-headline">
            {winnerTitle}
          </h1>
          <p className="sb-sub">
            {winnerSubtitle}
          </p>
        </div>
      </header>

      {/* ── Rankings list ── */}
      <section
        className="sb-body"
        aria-label="Final rankings"
        role="list"
      >
        {players.map((player, i) => {
          const isWinnerTeam = spyWins ? player.role === 'spy' : player.role === 'innocent';
          return (
            <PlayerCard
              key={player.id}
              player={player}
              isWinnerTeam={isWinnerTeam}
              animDelay={i * 80}
            />
          )
        })}

        {/* Spacer so footer doesn't occlude last card */}
        <div className="sb-body-spacer" aria-hidden="true" />
      </section>

      {/* ── Footer actions ── */}
      <footer className="sb-footer animate-slide-up">
        {/* Play Again — same players + settings, reset round state */}
        <button
          id="btn-play-again"
          className="sb-btn sb-btn-primary"
          onClick={playAgain}
          aria-label="Play again with the same players and settings"
        >
          <span aria-hidden="true">▶</span>
          Play Again
        </button>

        {/* New Game — go to home / setup */}
        <button
          id="btn-new-game"
          className="sb-btn sb-btn-secondary"
          onClick={() => setScreen('home')}
          aria-label="Start a new game with different settings"
        >
          <span aria-hidden="true">⚙️</span>
          New Game
        </button>

        {/* Home — full reset */}
        <button
          id="btn-go-home"
          className="sb-btn sb-btn-ghost"
          onClick={resetGame}
          aria-label="Return to the home screen"
        >
          <span aria-hidden="true">🏠</span>
          Home
        </button>
      </footer>

    </main>
  )
}
