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
function PlayerCard({ player, rank, maxScore, animDelay }) {
  const [barAnimated, setBarAnimated] = useState(false)
  const isWinner = rank === 0
  const hasTrophy = rank < 3
  const pct = maxScore > 0 ? (player.score / maxScore) * 100 : 0
  const initials = getInitials(player.name)

  // Animate bar after mount
  useEffect(() => {
    const t = setTimeout(() => setBarAnimated(true), animDelay + 100)
    return () => clearTimeout(t)
  }, [animDelay])

  return (
    <div
      className={`sb-card animate-fade-in ${isWinner ? 'sb-card-winner' : ''}`}
      style={{ animationDelay: `${animDelay}ms` }}
      role="listitem"
      aria-label={`${player.name} – ${player.score} points – rank ${rank + 1}`}
    >
      {/* Confetti burst for winner */}
      {isWinner && player.score > 0 && <Confetti />}

      {/* Rank badge */}
      <div className={`sb-rank ${hasTrophy ? 'sb-rank-trophy' : ''}`}>
        {hasTrophy ? TROPHY[rank] : <span className="sb-rank-num">{rank + 1}</span>}
      </div>

      {/* Avatar */}
      <div className={`sb-avatar ${isWinner ? 'sb-avatar-winner' : ''}`}>
        {initials}
      </div>

      {/* Name + score bar */}
      <div className="sb-info">
        <span className={`sb-name ${isWinner ? 'sb-name-winner' : ''}`}>
          {player.name}
        </span>
        <div
          className="sb-track"
          role="progressbar"
          aria-valuenow={player.score}
          aria-valuemin={0}
          aria-valuemax={maxScore || 1}
          aria-label={`${player.score} points`}
        >
          <div
            className={`sb-bar ${isWinner ? 'sb-bar-winner' : ''}`}
            style={{ width: barAnimated ? `${Math.max(pct, player.score > 0 ? 4 : 0)}%` : '0%' }}
          />
        </div>
      </div>

      {/* Score */}
      <div className="sb-score">
        <span className={`sb-score-num ${isWinner ? 'sb-score-num-winner' : ''}`}>
          {player.score}
        </span>
        <span className="sb-score-label">pts</span>
      </div>
    </div>
  )
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function ScoreboardScreen() {
  const players = useGameStore((s) => s.players)
  const settings = useGameStore((s) => s.settings)
  const playAgain = useGameStore((s) => s.playAgain)
  const setScreen = useGameStore((s) => s.setScreen)
  const resetGame = useGameStore((s) => s.resetGame)

  const sorted = [...players].sort((a, b) => b.score - a.score)
  const maxScore = sorted[0]?.score ?? 0
  const winner = sorted[0] ?? null
  const isTie = sorted.length > 1 && sorted[0].score === sorted[1].score

  return (
    <main className="sb-screen">

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
            <span>Final Scoreboard</span>
          </div>
          <h1 className="sb-headline">
            {isTie
              ? "It's a Tie! 🤝"
              : winner
                ? `${winner.name} Wins! 🎉`
                : 'Game Over'}
          </h1>
          <p className="sb-sub">
            {settings.rounds} round{settings.rounds !== 1 ? 's' : ''} complete
          </p>
        </div>
      </header>

      {/* ── Rankings list ── */}
      <section
        className="sb-body"
        aria-label="Final rankings"
        role="list"
      >
        {sorted.map((player, i) => (
          <PlayerCard
            key={player.id}
            player={player}
            rank={i}
            maxScore={maxScore}
            animDelay={i * 80}
          />
        ))}

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
