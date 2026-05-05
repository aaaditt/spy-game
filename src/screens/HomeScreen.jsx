import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import HowToPlayModal from '../components/HowToPlayModal'
import './HomeScreen.css'

export default function HomeScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const [showHowToPlay, setShowHowToPlay] = useState(false)

  return (
    <main className="home-screen">

      {/* ── Animated background ── */}
      <div className="home-bg" aria-hidden="true">
        <div className="home-bg-gradient" />
        <div className="home-orb home-orb-1" />
        <div className="home-orb home-orb-2" />
        <div className="home-orb home-orb-3" />
      </div>

      {/* ── Main content ── */}
      <div className="home-content">

        {/* Badge */}
        <div className="home-badge">
          <span className="home-badge-dot" />
          Social Deduction Game
        </div>

        {/* Headings */}
        <div className="home-heading">
          <h1 className="home-title">SPY</h1>
          <p className="home-subtitle">Find the imposter among you</p>
        </div>

        {/* CTA buttons */}
        <div className="home-actions">
          <button
            id="btn-start-game"
            className="btn-start"
            onClick={() => setScreen('setup')}
            aria-label="Start a new game"
          >
            <span className="btn-start-inner">
              <span className="btn-start-icon">🕵️</span>
              Start Game
            </span>
          </button>

          <button
            id="btn-how-to-play"
            className="btn-how-to-play"
            onClick={() => setShowHowToPlay(true)}
            aria-label="Learn how to play"
          >
            How To Play
          </button>
        </div>
      </div>

      {/* ── Footer hint ── */}
      <p className="home-footer">3 – 10 players · Pass &amp; Play</p>

      {/* ── How To Play Modal ── */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}
    </main>
  )
}
