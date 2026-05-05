import { useState } from 'react'
import { useGameStore, WORD_BANK } from '../store/gameStore'
import './SetupScreen.css'

export default function SetupScreen() {
  const players = useGameStore((s) => s.players)
  const settings = useGameStore((s) => s.settings)
  const addPlayer = useGameStore((s) => s.addPlayer)
  const removePlayer = useGameStore((s) => s.removePlayer)
  const updateSettings = useGameStore((s) => s.updateSettings)
  const startGame = useGameStore((s) => s.startGame)
  const setScreen = useGameStore((s) => s.setScreen)

  const [newPlayerName, setNewPlayerName] = useState('')

  const handleAddPlayer = (e) => {
    e.preventDefault()
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName)
      setNewPlayerName('')
    }
  }

  const toggleCategory = (catKey) => {
    let newCats = [...settings.selectedCategories]
    if (newCats.includes(catKey)) {
      newCats = newCats.filter(k => k !== catKey)
    } else {
      newCats.push(catKey)
    }
    updateSettings({ selectedCategories: newCats })
  }

  // If no categories are selected, implicitly all are used
  const isAllCategories = settings.selectedCategories.length === 0

  return (
    <main className="setup-screen">
      <div className="setup-bg" aria-hidden="true">
        <div className="setup-orb setup-orb-1" />
        <div className="setup-orb setup-orb-2" />
      </div>

      <header className="setup-header animate-slide-down">
        <h2 className="setup-header-title">Game Setup</h2>
        <button className="btn btn-ghost btn-sm" onClick={() => setScreen('home')}>
          Cancel
        </button>
      </header>

      <div className="setup-body">
        
        {/* Players Section */}
        <section className="setup-section glass-card animate-fade-in stagger-1">
          <div className="setup-section-header">
            <h3 className="setup-section-title">Players ({players.length})</h3>
            <span className="setup-hint">{players.length < 3 ? 'Min 3 required' : 'Ready'}</span>
          </div>
          <form className="player-form" onSubmit={handleAddPlayer}>
            <input
              type="text"
              className="player-input"
              placeholder="Enter player name..."
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              maxLength={20}
            />
            <button type="submit" className="btn btn-secondary btn-sm" disabled={!newPlayerName.trim()}>
              Add
            </button>
          </form>
          
          <div className="player-list">
            {players.map((p) => (
              <div key={p.id} className="player-item animate-scale-in">
                <span className="player-name">{p.name}</span>
                <button 
                  className="btn-remove" 
                  onClick={() => removePlayer(p.id)}
                  aria-label={`Remove ${p.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Settings Section */}
        <section className="setup-section glass-card animate-fade-in stagger-2">
          <h3 className="setup-section-title">Game Rules</h3>
          
          <div className="setting-row">
            <span className="setting-label">Number of Spies</span>
            <div className="pill-group">
              {[1, 2].map((n) => (
                <button
                  key={n}
                  className={`pill ${settings.numSpies === n ? 'active' : ''}`}
                  onClick={() => updateSettings({ numSpies: n })}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-row">
            <span className="setting-label">Rounds</span>
            <div className="pill-group">
              {[1, 2, 3, 5].map((n) => (
                <button
                  key={n}
                  className={`pill ${settings.rounds === n ? 'active' : ''}`}
                  onClick={() => updateSettings({ rounds: n })}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-row">
            <span className="setting-label">Timer (Mins)</span>
            <div className="pill-group">
              {[3, 5, 7, 10].map((n) => (
                <button
                  key={n}
                  className={`pill ${settings.timerMinutes === n ? 'active' : ''}`}
                  onClick={() => updateSettings({ timerMinutes: n })}
                >
                  {n}m
                </button>
              ))}
            </div>
          </div>

          <div className="setting-row">
            <span className="setting-label">Hint Level</span>
            <div className="pill-group pill-group-wrap">
              {['none', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
                <button
                  key={lvl}
                  className={`pill ${settings.hintLevel === lvl ? 'active' : ''}`}
                  onClick={() => updateSettings({ hintLevel: lvl })}
                  style={{ textTransform: 'capitalize' }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="setup-section glass-card animate-fade-in stagger-3">
          <div className="setup-section-header">
            <h3 className="setup-section-title">Categories</h3>
            <span className="setup-hint">{isAllCategories ? 'All Active' : 'Custom'}</span>
          </div>
          <div className="category-grid">
            {Object.entries(WORD_BANK).map(([key, cat]) => {
              const isActive = isAllCategories || settings.selectedCategories.includes(key)
              return (
                <button
                  key={key}
                  className={`category-card ${isActive ? 'active' : ''}`}
                  onClick={() => toggleCategory(key)}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </section>

        <div className="setup-spacer" aria-hidden="true" />
      </div>

      <footer className="setup-footer animate-slide-up">
        <button
          className="btn btn-primary btn-lg setup-start-btn"
          disabled={players.length < 3}
          onClick={startGame}
        >
          Start Game
        </button>
      </footer>
    </main>
  )
}
