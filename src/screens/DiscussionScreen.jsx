import { useState, useCallback } from 'react'
import { useGameStore, WORD_BANK } from '../store/gameStore'
import Timer from '../components/Timer'
import './DiscussionScreen.css'

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Derive the category label for the current secretWord from the WORD_BANK.
 * Returns e.g. "Animals", "Food & Drink", etc.
 */
function getCategoryLabel(secretWord) {
  if (!secretWord) return null
  for (const [, cat] of Object.entries(WORD_BANK)) {
    if (cat.entries?.some((e) => e.word === secretWord)) return cat.label
  }
  return null
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RoundBadge({ current, total }) {
  return (
    <div className="ds-round-badge" aria-label={`Round ${current} of ${total}`}>
      <span className="ds-round-badge-icon">🎯</span>
      <span className="ds-round-badge-text">
        Round <strong>{current}</strong>
        <span className="ds-round-badge-total"> of {total}</span>
      </span>
    </div>
  )
}

function CategoryPill({ label }) {
  return (
    <div className="ds-category-pill" aria-label={`Category: ${label}`}>
      <span className="ds-category-icon">🗂️</span>
      <span className="ds-category-label">{label}</span>
    </div>
  )
}

function PlayerChip({ name, index }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className="ds-player-chip animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
      title={name}
    >
      <span className="ds-player-chip-avatar">{initials}</span>
      <span className="ds-player-chip-name">{name}</span>
    </div>
  )
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function DiscussionScreen() {
  const players       = useGameStore((s) => s.players)
  const currentRound  = useGameStore((s) => s.currentRound)
  const settings      = useGameStore((s) => s.settings)
  const secretWord    = useGameStore((s) => s.secretWord)
  const setScreen     = useGameStore((s) => s.setScreen)

  const { rounds, timerMinutes } = settings
  const totalSeconds = timerMinutes * 60
  const categoryLabel = getCategoryLabel(secretWord)

  // Track whether the timer has fired naturally (so the CTA pulses)
  const [timerExpired, setTimerExpired] = useState(false)

  const handleTimerExpire = useCallback(() => {
    setTimerExpired(true)
  }, [])

  const handleStartVoting = useCallback(() => {
    setScreen('vote')
  }, [setScreen])

  return (
    <main className="ds-screen">

      {/* ── Ambient background orbs ── */}
      <div className="ds-bg" aria-hidden="true">
        <div className="ds-orb ds-orb-1" />
        <div className="ds-orb ds-orb-2" />
        <div className="ds-orb ds-orb-3" />
      </div>

      {/* ── Header row ── */}
      <header className="ds-header animate-slide-down">
        <RoundBadge current={currentRound} total={rounds} />
      </header>

      {/* ── Body ── */}
      <div className="ds-body">

        {/* Category name (NOT the secret word) */}
        {categoryLabel && (
          <div className="ds-category-wrap animate-fade-in stagger-1">
            <p className="ds-category-eyebrow">Category</p>
            <CategoryPill label={categoryLabel} />
          </div>
        )}

        {/* ── Timer ── */}
        <div className="ds-timer-wrap animate-scale-in stagger-2">
          <Timer
            totalSeconds={totalSeconds}
            onExpire={handleTimerExpire}
          />
          <p className="ds-timer-hint">
            {timerExpired ? 'Timer ended — vote whenever you\'re ready!' : 'Discuss freely. Ask questions. Find the spy.'}
          </p>
        </div>

        {/* ── Player chips ── */}
        <section className="ds-players-section" aria-label="Players in this round">
          <p className="ds-players-label">Players</p>
          <div className="ds-players-list" role="list">
            {players.map((p, i) => (
              <PlayerChip key={p.id} name={p.name} index={i} />
            ))}
          </div>
        </section>

      </div>

      {/* ── CTA ── */}
      <footer className="ds-footer animate-slide-up">
        <button
          id="btn-start-voting"
          className={[
            'ds-vote-btn',
            timerExpired ? 'ds-vote-btn-pulse' : '',
          ].join(' ')}
          onClick={handleStartVoting}
          aria-label="Skip timer and start voting"
        >
          <span className="ds-vote-btn-icon">🗳️</span>
          Start Voting
          {!timerExpired && (
            <span className="ds-vote-btn-skip">Skip timer</span>
          )}
        </button>
      </footer>

    </main>
  )
}
