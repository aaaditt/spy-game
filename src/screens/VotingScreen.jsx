import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import './VotingScreen.css'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Avatar initials from a player name */
function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * Cover screen shown before each voter — asks the group to
 * pass the device to the named player.
 */
function VoteCoverScreen({ playerName, votedCount, totalVoters, onStart }) {
  return (
    <div className="vs-cover animate-fade-in">
      {/* Ambient background orbs */}
      <div className="vs-cover-bg" aria-hidden="true">
        <div className="vs-cover-orb vs-cover-orb-1" />
        <div className="vs-cover-orb vs-cover-orb-2" />
      </div>

      <div className="vs-cover-content">
        {/* Progress badge */}
        <div className="vs-progress-badge" aria-label={`Voting: ${votedCount} of ${totalVoters}`}>
          <span className="vs-progress-icon">🗳️</span>
          <span className="vs-progress-text">
            Voting: <strong>{votedCount}</strong> of {totalVoters}
          </span>
        </div>

        <div className="vs-cover-icon" aria-hidden="true">🔒</div>

        <p className="vs-cover-eyebrow">Pass to</p>
        <h2 className="vs-cover-name">{playerName}</h2>
        <p className="vs-cover-hint">It's your turn to vote</p>

        <button
          id="btn-start-voting"
          className="vs-start-btn"
          onClick={onStart}
          aria-label={`Start voting for ${playerName}`}
        >
          <span className="vs-start-btn-icon">👁</span>
          Start Voting
        </button>
      </div>
    </div>
  )
}

/**
 * Grid of player cards — voter sees everyone except themselves.
 * Tapping selects; tapping again on the same card deselects.
 */
function PlayerGrid({ candidates, selectedId, onSelect }) {
  return (
    <div className="vs-grid" role="listbox" aria-label="Select a player to vote out">
      {candidates.map((player, i) => {
        const isSelected = player.id === selectedId
        return (
          <button
            key={player.id}
            id={`vote-card-${player.id}`}
            className={`vs-player-card animate-scale-in ${isSelected ? 'vs-player-card-selected' : ''}`}
            style={{ animationDelay: `${i * 60}ms` }}
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(player.id)}
          >
            {/* Selection ring */}
            {isSelected && <div className="vs-card-ring" aria-hidden="true" />}

            <div className="vs-card-avatar" aria-hidden="true">
              {initials(player.name)}
            </div>

            <span className="vs-card-name">{player.name}</span>

            {isSelected && (
              <span className="vs-card-check" aria-hidden="true">✓</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function VotingScreen() {
  const players    = useGameStore((s) => s.players)
  const votes      = useGameStore((s) => s.votes)
  const castVote   = useGameStore((s) => s.castVote)
  const tallyVotes = useGameStore((s) => s.tallyVotes)

  // Index into players[] for who is currently voting
  // Start at the first player who hasn't voted yet
  const firstPending = players.findIndex((p) => !(p.id in votes))
  const [voterIndex, setVoterIndex] = useState(firstPending === -1 ? 0 : firstPending)
  const [phase, setPhase]           = useState('cover')   // 'cover' | 'voting'
  const [selectedId, setSelectedId] = useState(null)

  const currentVoter = players[voterIndex] ?? null
  const votedCount   = Object.keys(votes).length
  const totalVoters  = players.length

  // Players this voter can vote for (everyone except themselves)
  const candidates = players.filter((p) => p.id !== currentVoter?.id)

  // Guard — shouldn't render without a valid voter
  if (!currentVoter) return null

  function handleStart() {
    setSelectedId(null)
    setPhase('voting')
  }

  function handleSelect(playerId) {
    setSelectedId((prev) => (prev === playerId ? null : playerId))
  }

  function handleConfirm() {
    if (!selectedId) return

    castVote(currentVoter.id, selectedId)

    // All votes cast → tally and navigate to results
    if (votedCount + 1 >= totalVoters) {
      tallyVotes()
      return
    }

    // Advance to next voter
    const nextIndex = players.findIndex(
      (p, idx) => idx > voterIndex && !(p.id in votes) && p.id !== currentVoter.id
    )
    const safeNext = nextIndex === -1
      ? players.findIndex((p) => !(p.id in votes) && p.id !== currentVoter.id)
      : nextIndex

    if (safeNext !== -1) {
      setVoterIndex(safeNext)
      setPhase('cover')
      setSelectedId(null)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase === 'cover') {
    return (
      <VoteCoverScreen
        playerName={currentVoter.name}
        votedCount={votedCount}
        totalVoters={totalVoters}
        onStart={handleStart}
      />
    )
  }

  // phase === 'voting'
  return (
    <main className="vs-screen animate-fade-in">

      {/* Ambient background orbs */}
      <div className="vs-bg" aria-hidden="true">
        <div className="vs-orb vs-orb-1" />
        <div className="vs-orb vs-orb-2" />
      </div>

      {/* ── Header ── */}
      <header className="vs-header animate-slide-down">
        <div className="vs-header-meta">
          <span className="vs-header-voter">
            <span className="vs-header-voter-avatar" aria-hidden="true">
              {initials(currentVoter.name)}
            </span>
            {currentVoter.name}
          </span>
          <span className="vs-header-label">is voting</span>
        </div>

        <div
          className="vs-progress-badge"
          aria-label={`Voting: ${votedCount} of ${totalVoters}`}
        >
          <span className="vs-progress-icon">🗳️</span>
          <span className="vs-progress-text">
            Voting: <strong>{votedCount}</strong> of {totalVoters}
          </span>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="vs-body">
        <p className="vs-instruction animate-fade-in stagger-1">
          Who is the spy? Tap to vote.
        </p>

        <PlayerGrid
          candidates={candidates}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </div>

      {/* ── Footer ── */}
      <footer className="vs-footer animate-slide-up">
        <button
          id="btn-confirm-vote"
          className={`vs-confirm-btn ${selectedId ? 'vs-confirm-btn-ready' : 'vs-confirm-btn-disabled'}`}
          onClick={handleConfirm}
          disabled={!selectedId}
          aria-label={selectedId
            ? `Confirm vote for ${players.find((p) => p.id === selectedId)?.name}`
            : 'Select a player first'}
        >
          {selectedId ? (
            <>
              <span>✓</span>
              Vote for {players.find((p) => p.id === selectedId)?.name}
            </>
          ) : (
            <>
              <span>👆</span>
              Select a player first
            </>
          )}
        </button>
      </footer>

    </main>
  )
}
