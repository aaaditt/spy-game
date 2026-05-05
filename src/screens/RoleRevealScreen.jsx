import { useState } from 'react'
import { useGameStore, WORD_BANK } from '../store/gameStore'
import './RoleRevealScreen.css'

// ── Sub-components ────────────────────────────────────────────────────────────

function CoverScreen({ playerName, onReveal }) {
  return (
    <div className="rr-cover animate-fade-in">
      {/* Ambient orbs */}
      <div className="rr-cover-bg" aria-hidden="true">
        <div className="rr-cover-orb rr-cover-orb-1" />
        <div className="rr-cover-orb rr-cover-orb-2" />
      </div>

      <div className="rr-cover-content">
        <div className="rr-cover-icon">🔒</div>
        <p className="rr-cover-label">Pass the phone to</p>
        <h2 className="rr-cover-name">{playerName}</h2>
        <p className="rr-cover-hint">Make sure nobody else is looking</p>

        <button
          id="btn-tap-to-reveal"
          className="rr-reveal-btn"
          onClick={onReveal}
          aria-label={`Reveal role for ${playerName}`}
        >
          <span className="rr-reveal-btn-icon">👁</span>
          Tap to Reveal
        </button>
      </div>
    </div>
  )
}

function CrewmateCard({ secretWord, category }) {
  return (
    <div className="rr-card rr-card-crewmate">
      {/* Shine overlay */}
      <div className="rr-card-shine" aria-hidden="true" />

      <div className="rr-card-body">
        <div className="rr-card-badge crewmate-badge">CREWMATE</div>

        <div className="rr-card-role-icon crewmate-icon">🛡️</div>

        <p className="rr-card-role-label crewmate-label">Your Secret Word</p>
        <h2 className="rr-card-word crewmate-word">{secretWord}</h2>

        {category && (
          <div className="rr-card-category crewmate-category">
            <span className="rr-card-category-label">Category</span>
            <span className="rr-card-category-value">{category}</span>
          </div>
        )}

        <p className="rr-card-tip crewmate-tip">
          Discuss but don't reveal the exact word — a Spy is listening!
        </p>
      </div>
    </div>
  )
}

function SpyCard({ spyHint }) {
  return (
    <div className="rr-card rr-card-spy">
      {/* Shine overlay */}
      <div className="rr-card-shine" aria-hidden="true" />

      <div className="rr-card-body">
        <div className="rr-card-badge spy-badge">SPY</div>

        <div className="rr-card-role-icon spy-icon">💀</div>

        <h2 className="rr-card-spy-title">YOU ARE THE SPY</h2>

        {spyHint ? (
          <div className="rr-spy-hint-box">
            <p className="rr-spy-hint-label">Your Clue</p>
            <p className="rr-spy-hint-text">{spyHint}</p>
          </div>
        ) : (
          <p className="rr-spy-no-hint">No hint — fly blind, trust your instincts.</p>
        )}

        <p className="rr-card-tip spy-tip">
          Blend in, ask clever questions, and figure out the secret word.
        </p>
      </div>
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────────────────

function ProgressDots({ total, current }) {
  return (
    <div className="rr-progress" role="progressbar" aria-valuenow={current + 1} aria-valuemax={total}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`rr-progress-dot ${i < current ? 'rr-progress-dot-done' : ''} ${i === current ? 'rr-progress-dot-active' : ''}`}
        />
      ))}
    </div>
  )
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function RoleRevealScreen() {
  const players            = useGameStore((s) => s.players)
  const currentRevealIndex = useGameStore((s) => s.currentRevealIndex)
  const secretWord         = useGameStore((s) => s.secretWord)
  const spyHint            = useGameStore((s) => s.spyHint)
  const revealNext         = useGameStore((s) => s.revealNext)

  const [phase, setPhase] = useState('cover')   // 'cover' | 'flipping' | 'revealed'

  const currentPlayer = players[currentRevealIndex] ?? null
  const isLastPlayer  = currentRevealIndex >= players.length - 1

  // Derive category label from secretWord using the imported WORD_BANK
  const categoryLabel = (() => {
    if (!secretWord) return null
    for (const [, cat] of Object.entries(WORD_BANK)) {
      if (cat.entries?.some((e) => e.word === secretWord)) return cat.label
    }
    return null
  })()

  // Guard: shouldn't render without a current player
  if (!currentPlayer) return null

  function handleReveal() {
    setPhase('flipping')
    setTimeout(() => setPhase('revealed'), 680)  // match CSS animation duration
  }

  function handleGotIt() {
    setPhase('cover')
    revealNext()
  }

  return (
    <main className="rr-screen">

      {/* ── Persistent progress indicator ── */}
      <div className="rr-header">
        <span className="rr-header-label">Role Reveal</span>
        <ProgressDots total={players.length} current={currentRevealIndex} />
        <span className="rr-header-count">{currentRevealIndex + 1} / {players.length}</span>
      </div>

      {/* ── Phase: Cover ── */}
      {phase === 'cover' && (
        <CoverScreen
          playerName={currentPlayer.name}
          onReveal={handleReveal}
        />
      )}

      {/* ── Phase: Flipping / Revealed ── */}
      {(phase === 'flipping' || phase === 'revealed') && (
        <div className="rr-card-area animate-fade-in">
          {/* 3D Flip wrapper */}
          <div className={`rr-flip-scene ${phase === 'revealed' ? 'rr-flip-scene-done' : ''}`}>
            <div className="rr-flip-inner">
              {/* Front: generic card back texture */}
              <div className="rr-flip-front">
                <div className="rr-flip-front-inner">
                  <span className="rr-flip-front-icon">❓</span>
                </div>
              </div>

              {/* Back: the actual role card */}
              <div className="rr-flip-back">
                {currentPlayer.role === 'spy' ? (
                  <SpyCard spyHint={spyHint} />
                ) : (
                  <CrewmateCard secretWord={secretWord} category={categoryLabel} />
                )}
              </div>
            </div>
          </div>

          {/* ── CTA below card ── */}
          {phase === 'revealed' && (
            <div className="rr-cta animate-slide-up">
              <p className="rr-cta-player-name">{currentPlayer.name}</p>
              {isLastPlayer ? (
                <button
                  id="btn-start-discussion"
                  className="rr-cta-btn rr-cta-btn-start"
                  onClick={handleGotIt}
                  aria-label="All roles revealed – start discussion"
                >
                  <span>🎯</span>
                  Start Discussion
                </button>
              ) : (
                <button
                  id="btn-got-it"
                  className="rr-cta-btn rr-cta-btn-gotit"
                  onClick={handleGotIt}
                  aria-label="Got it, next player"
                >
                  <span>✓</span>
                  Got it!
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
