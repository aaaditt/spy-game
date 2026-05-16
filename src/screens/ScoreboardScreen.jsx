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

function Confetti() {
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

function PlayerCard({ player, rank, maxScore, animDelay }) {
  const [barAnimated, setBarAnimated] = useState(false)
  const isWinner = rank === 0
  const hasTrophy = rank < 3
  const pct = maxScore > 0 ? (player.score / maxScore) * 100 : 0
  const initials = getInitials(player.name)

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
      {isWinner && player.score > 0 && <Confetti />}

      <div className={`sb-rank ${hasTrophy ? 'sb-rank-trophy' : ''}`}>
        {hasTrophy ? TROPHY[rank] : <span className="sb-rank-num">{rank + 1}</span>}
      </div>

      <div className={`sb-avatar ${isWinner ? 'sb-avatar-winner' : ''}`}>
        {initials}
      </div>

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
  const players        = useGameStore((s) => s.players)
  const screen         = useGameStore((s) => s.screen)
  const currentRound   = useGameStore((s) => s.currentRound)
  const winner         = useGameStore((s) => s.winner)
  const playAgain      = useGameStore((s) => s.playAgain)
  const resetGame      = useGameStore((s) => s.resetGame)
  const startNextRound = useGameStore((s) => s.startNextRound)
  const setScreen      = useGameStore((s) => s.setScreen)

  const isFinal = screen === 'final'
  const sorted = [...players].sort((a, b) => b.score - a.score)
  const maxScore = sorted[0]?.score ?? 0
  const topPlayer = sorted[0] ?? null
  const isTie = sorted.length > 1 && sorted[0].score === sorted[1].score

  const headline = isFinal
    ? (winner === 'spy'
        ? '🕵️ Spy Wins!'
        : winner === 'crewmates'
          ? '🛡️ Crewmates Win!'
          : isTie
            ? "It's a Tie! 🤝"
            : topPlayer
              ? `${topPlayer.name} Wins! 🎉`
              : 'Game Over')
    : `Round ${currentRound} Complete`

  const subline = isFinal
    ? (winner === 'spy'
        ? 'The spy survived to the end.'
        : winner === 'crewmates'
          ? 'The spy was found out.'
          : 'Final standings')
    : 'Scores so far — get ready for the next round'

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
            <span>{isFinal ? '🏆' : '📊'}</span>
            <span>{isFinal ? 'Final Scoreboard' : 'Scoreboard'}</span>
          </div>
          <h1 className="sb-headline">{headline}</h1>
          <p className="sb-sub">{subline}</p>
        </div>
      </header>

      {/* ── Rankings list ── */}
      <section
        className="sb-body"
        aria-label={isFinal ? 'Final rankings' : 'Current scores'}
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
        <div className="sb-body-spacer" aria-hidden="true" />
      </section>

      {/* ── Footer actions ── */}
      <footer className="sb-footer animate-slide-up">
        {isFinal ? (
          <>
            <button
              id="btn-play-again"
              className="sb-btn sb-btn-primary"
              onClick={playAgain}
              aria-label="Play again with the same players and settings"
            >
              <span aria-hidden="true">▶</span>
              Play Again
            </button>
            <button
              id="btn-edit-settings"
              className="sb-btn sb-btn-secondary"
              onClick={() => setScreen('setup')}
              aria-label="Edit players and settings before playing again"
            >
              <span aria-hidden="true">⚙️</span>
              Edit Settings
            </button>
            <button
              id="btn-go-home"
              className="sb-btn sb-btn-ghost"
              onClick={resetGame}
              aria-label="Return to the home screen"
            >
              <span aria-hidden="true">🏠</span>
              Home
            </button>
          </>
        ) : (
          <button
            id="btn-next-round"
            className="sb-btn sb-btn-primary"
            onClick={startNextRound}
            aria-label="Start the next round"
          >
            <span aria-hidden="true">▶</span>
            Start Next Round
          </button>
        )}
      </footer>

    </main>
  )
}
