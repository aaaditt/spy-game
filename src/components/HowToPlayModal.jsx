import { useEffect, useCallback } from 'react'
import './HowToPlayModal.css'

const STEPS = [
  {
    emoji: '👥',
    title: 'Gather Your Crew',
    desc: 'Grab 3–10 players and pass a single device around the table.',
  },
  {
    emoji: '🎭',
    title: 'Roles Are Assigned',
    desc: 'Every player gets a secret card. Most see the secret word — the Spy gets a cryptic hint instead.',
  },
  {
    emoji: '🗣️',
    title: 'Ask & Debate',
    desc: 'Take turns asking each other clever questions. Innocents try to expose the Spy; the Spy tries to blend in.',
  },
  {
    emoji: '🗳️',
    title: 'Vote Together',
    desc: "When time's up, everyone votes for who they think is the Spy. The player with the most votes is revealed.",
  },
  {
    emoji: '🏆',
    title: 'Score & Play Again',
    desc: 'Innocents score if they catch the Spy. The Spy can still win by guessing the secret word! Play multiple rounds.',
  },
]

export default function HowToPlayModal({ onClose }) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  return (
    /* Clicking the backdrop closes the modal */
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="htp-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-panel">

        {/* Header */}
        <div className="modal-header">
          <h2 id="htp-title" className="modal-title">How To Play</h2>
          <button
            id="btn-close-htp"
            className="modal-close"
            onClick={onClose}
            aria-label="Close how to play"
          >
            ✕
          </button>
        </div>

        {/* Intro */}
        <p className="modal-intro">
          SPY is a fast-paced social deduction game. One player is secretly
          the Spy — everyone else knows the secret word. Can the group
          uncover the imposter before time runs out?
        </p>

        {/* Steps */}
        <ol className="modal-steps" aria-label="Game steps">
          {STEPS.map((step, i) => (
            <li key={i} className="modal-step">
              <span className="modal-step-emoji" aria-hidden="true">
                {step.emoji}
              </span>
              <div className="modal-step-body">
                <span className="modal-step-title">{step.title}</span>
                <span className="modal-step-desc">{step.desc}</span>
              </div>
            </li>
          ))}
        </ol>

        {/* Footer */}
        <div className="modal-footer">
          <p className="modal-footer-text">
            Tip: <span>the Spy can still win</span> by guessing the word correctly after being voted out!
          </p>
        </div>
      </div>
    </div>
  )
}
