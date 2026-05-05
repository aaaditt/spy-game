import { useState, useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import './ResultsScreen.css'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a vote-count map: { playerId → count } for every player */
function buildTallyMap(players, votes) {
  const map = {}
  players.forEach((p) => { map[p.id] = 0 })
  Object.values(votes).forEach((targetId) => {
    if (targetId in map) map[targetId] = (map[targetId] ?? 0) + 1
  })
  return map
}

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * Animated horizontal bar chart — one row per player.
 * Bars grow from 0 → actual width via CSS transition after mount.
 */
function VoteTallyChart({ players, tallyMap, votedOutId }) {
  const [animated, setAnimated] = useState(false)
  const maxVotes = Math.max(...Object.values(tallyMap), 1)

  useEffect(() => {
    // Tiny delay lets the DOM paint at 0-width first, then we animate
    const t = setTimeout(() => setAnimated(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="rs-tally" role="list" aria-label="Vote tally">
      {players
        .slice()
        .sort((a, b) => (tallyMap[b.id] ?? 0) - (tallyMap[a.id] ?? 0))
        .map((player, i) => {
          const count = tallyMap[player.id] ?? 0
          const pct = (count / maxVotes) * 100
          const isTop = player.id === votedOutId
          const initials = player.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

          return (
            <div
              key={player.id}
              className={`rs-tally-row animate-fade-in ${isTop ? 'rs-tally-row-top' : ''}`}
              style={{ animationDelay: `${i * 70}ms` }}
              role="listitem"
            >
              {/* Avatar */}
              <div className={`rs-tally-avatar ${isTop ? 'rs-tally-avatar-top' : ''}`}>
                {initials}
              </div>

              {/* Name + bar */}
              <div className="rs-tally-bar-wrap">
                <div className="rs-tally-name">{player.name}</div>
                <div className="rs-tally-track" aria-label={`${count} vote${count !== 1 ? 's' : ''}`}>
                  <div
                    className={`rs-tally-bar ${isTop ? 'rs-tally-bar-accent' : ''}`}
                    style={{ width: animated ? `${Math.max(pct, count > 0 ? 4 : 0)}%` : '0%' }}
                  />
                </div>
              </div>

              {/* Count */}
              <span className={`rs-tally-count ${isTop ? 'rs-tally-count-top' : ''}`}>
                {count}
              </span>
            </div>
          )
        })}
    </div>
  )
}

/**
 * Dramatic voted-out reveal.
 * Animates in with a slide + glow after a short delay.
 */
function VotedOutBanner({ player }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 400)
    return () => clearTimeout(t)
  }, [])

  if (!show) return <div className="rs-voted-out-placeholder" aria-hidden="true" />

  const initials = player?.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="rs-voted-out animate-scale-in" role="status">
      <p className="rs-voted-out-label">The player voted out is</p>
      <div className="rs-voted-out-card">
        <div className="rs-voted-out-avatar">{initials ?? '?'}</div>
        <h2 className="rs-voted-out-name">{player?.name ?? 'Nobody'}</h2>
      </div>
    </div>
  )
}

/**
 * Suspenseful "Were they the Spy?" reveal.
 * Shows a pulsing question mark, then after a delay reveals the verdict.
 */
function SpyReveal({ spyVotedOut, votedOut, onSpyGuessPhase }) {
  const [phase, setPhase] = useState('suspense')  // 'suspense' | 'reveal'

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase('reveal')
      if (spyVotedOut) onSpyGuessPhase()
    }, 2200)
    return () => clearTimeout(t)
  }, [spyVotedOut, onSpyGuessPhase])

  return (
    <div className="rs-spy-reveal">
      <p className="rs-spy-question">Were they the Spy?</p>

      {phase === 'suspense' && (
        <div className="rs-suspense animate-pulse" aria-label="Loading verdict" aria-live="polite">
          <span className="rs-suspense-dots">
            <span />
            <span />
            <span />
          </span>
        </div>
      )}

      {phase === 'reveal' && (
        <div
          className={`rs-verdict animate-scale-in ${spyVotedOut ? 'rs-verdict-yes' : 'rs-verdict-no'}`}
          role="status"
          aria-live="assertive"
        >
          <span className="rs-verdict-emoji">{spyVotedOut ? '🕵️' : '🛡️'}</span>
          <span className="rs-verdict-word">{spyVotedOut ? 'YES!' : 'NO!'}</span>
          <p className="rs-verdict-msg">
            {spyVotedOut
              ? `Crewmates Win! 🎉 ${votedOut?.name ?? 'They'} was the spy.`
              : `The Spy Escapes! 🕵️ ${votedOut?.name ?? 'They'} was innocent.`}
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Spy word-guess input — shown only when spy was caught.
 * Calls store.spyGuess() and displays result inline.
 */
function SpyGuessInput({ secretWord, spyGuess }) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)   // null | 'correct' | 'wrong'
  const [guessedWord, setGuessedWord] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || result) return
    const correct = spyGuess(trimmed)
    setGuessedWord(trimmed)
    setResult(correct ? 'correct' : 'wrong')
  }

  return (
    <div className="rs-spy-guess animate-slide-up">
      <div className="rs-spy-guess-header">
        <span className="rs-spy-guess-icon">💀</span>
        <div>
          <p className="rs-spy-guess-title">Last chance, Spy!</p>
          <p className="rs-spy-guess-sub">Guess the secret word to steal points.</p>
        </div>
      </div>

      {!result ? (
        <form className="rs-spy-guess-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            id="input-spy-guess"
            type="text"
            className="rs-spy-guess-input"
            placeholder="Enter the secret word…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label="Spy's word guess"
          />
          <button
            id="btn-spy-guess-submit"
            type="submit"
            className="rs-spy-guess-btn"
            disabled={!input.trim()}
          >
            Submit Guess
          </button>
        </form>
      ) : (
        <div
          className={`rs-spy-guess-result animate-scale-in ${result === 'correct' ? 'rs-guess-correct' : 'rs-guess-wrong'}`}
          role="status"
          aria-live="assertive"
        >
          {result === 'correct' ? (
            <>
              <span className="rs-guess-emoji">🔥</span>
              <p className="rs-guess-headline">Spy steals points!</p>
              <p className="rs-guess-word">The word was <strong>{secretWord}</strong></p>
            </>
          ) : (
            <>
              <span className="rs-guess-emoji">❌</span>
              <p className="rs-guess-headline">Wrong!</p>
              <p className="rs-guess-word">The word was <strong>{secretWord}</strong></p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Score leaderboard — shown after results are fully revealed.
 */
function ScoreBoard({ players }) {
  const sorted = [...players].sort((a, b) => b.score - a.score)
  const maxScore = sorted[0]?.score ?? 0

  return (
    <section className="rs-scores" aria-label="Current scores">
      <h3 className="rs-scores-title">Scores</h3>
      <div className="rs-scores-list" role="list">
        {sorted.map((player, i) => {
          const initials = player.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
          const pct = maxScore > 0 ? (player.score / maxScore) * 100 : 0
          const medal = i === 0 && player.score > 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null

          return (
            <div
              key={player.id}
              className={`rs-score-row animate-fade-in ${i === 0 && player.score > 0 ? 'rs-score-row-leader' : ''}`}
              style={{ animationDelay: `${i * 60}ms` }}
              role="listitem"
            >
              <span className="rs-score-rank">{medal ?? `${i + 1}`}</span>
              <div className="rs-score-avatar">{initials}</div>
              <div className="rs-score-info">
                <span className="rs-score-name">{player.name}</span>
                <div className="rs-score-track">
                  <div
                    className={`rs-score-bar ${i === 0 && player.score > 0 ? 'rs-score-bar-leader' : ''}`}
                    style={{ width: `${Math.max(pct, player.score > 0 ? 5 : 0)}%` }}
                  />
                </div>
              </div>
              <span className="rs-score-pts">
                {player.score} <span className="rs-score-pts-label">pts</span>
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function ResultsScreen() {
  const players = useGameStore((s) => s.players)
  const votes = useGameStore((s) => s.votes)
  const roundResults = useGameStore((s) => s.roundResults)
  const secretWord = useGameStore((s) => s.secretWord)
  const currentRound = useGameStore((s) => s.currentRound)
  const settings = useGameStore((s) => s.settings)
  const nextRound = useGameStore((s) => s.nextRound)
  const spyGuessFn = useGameStore((s) => s.spyGuess)

  // The latest round result (tallyVotes pushes to roundResults before navigating)
  const latestResult = roundResults[roundResults.length - 1] ?? null
  const votedOut = latestResult?.votedOut ?? null
  const spyVotedOut = latestResult?.spyVotedOut ?? false

  // Check if spy already guessed this round (type === 'spyGuess' entry after 'vote')
  const spyGuessResult = roundResults.findLast?.((r) => r.type === 'spyGuess') ?? null
  const spyAlreadyGuessed = spyGuessResult != null

  // Whether we should show the spy-guess input
  const [showSpyGuess, setShowSpyGuess] = useState(false)
  // Whether the full results are shown (spy reveal done)
  const [revealDone, setRevealDone] = useState(false)

  const tallyMap = buildTallyMap(players, votes)
  const isLastRound = currentRound >= settings.rounds

  // When spy reveal fires the callback, we may show the spy guess input
  function handleSpyGuessPhase() {
    if (!spyAlreadyGuessed) setShowSpyGuess(true)
    // Also mark reveal done after a moment so the scoreboard appears
    setTimeout(() => setRevealDone(true), 800)
  }

  // When spy is NOT caught, we just mark reveal done after delay
  useEffect(() => {
    if (!spyVotedOut) {
      const t = setTimeout(() => setRevealDone(true), 3200)
      return () => clearTimeout(t)
    }
  }, [spyVotedOut])

  // When a spy guess is submitted, mark reveal done to show scoreboard
  // (store sets screen:'results' again which triggers re-render with updated players)
  useEffect(() => {
    if (showSpyGuess && spyAlreadyGuessed) {
      setRevealDone(true)
    }
  }, [showSpyGuess, spyAlreadyGuessed])

  return (
    <main className="rs-screen">

      {/* ── Ambient background ── */}
      <div className="rs-bg" aria-hidden="true">
        <div className="rs-orb rs-orb-1" />
        <div className="rs-orb rs-orb-2" />
        <div className="rs-orb rs-orb-3" />
      </div>

      {/* ── Header ── */}
      <header className="rs-header animate-slide-down">
        <div className="rs-header-badge">
          <span>📋</span>
          <span>
            Round <strong>{currentRound}</strong> Results
          </span>
        </div>
      </header>

      {/* ── Scrollable body ── */}
      <div className="rs-body">

        {/* 1. Vote tally chart */}
        <section className="rs-section animate-fade-in stagger-1" aria-label="Vote tally">
          <h3 className="rs-section-title">
            <span className="rs-section-icon">🗳️</span>
            Vote Tally
          </h3>
          <VoteTallyChart
            players={players}
            tallyMap={tallyMap}
            votedOutId={votedOut?.id ?? null}
          />
        </section>

        {/* 2. Voted-out reveal */}
        <section className="rs-section" aria-label="Voted out player">
          <VotedOutBanner player={votedOut} />
        </section>

        {/* 3. Spy reveal (suspense + verdict) */}
        <section className="rs-section" aria-label="Spy verdict">
          <SpyReveal
            spyVotedOut={spyVotedOut}
            votedOut={votedOut}
            onSpyGuessPhase={handleSpyGuessPhase}
          />
        </section>

        {/* 4. Spy guess input — only if spy was caught and hasn't guessed yet */}
        {showSpyGuess && !spyAlreadyGuessed && (
          <section className="rs-section" aria-label="Spy word guess">
            <SpyGuessInput
              secretWord={secretWord}
              spyGuess={spyGuessFn}
            />
          </section>
        )}

        {/* Show word reveal if spy already guessed (page re-rendered after spyGuess) */}
        {spyAlreadyGuessed && (
          <div
            className={`rs-spy-guess-result rs-word-reveal animate-scale-in ${spyGuessResult.correct ? 'rs-guess-correct' : 'rs-guess-wrong'}`}
            role="status"
          >
            {spyGuessResult.correct ? (
              <>
                <span className="rs-guess-emoji">🔥</span>
                <p className="rs-guess-headline">Spy steals points!</p>
                <p className="rs-guess-word">The word was <strong>{secretWord}</strong></p>
              </>
            ) : (
              <>
                <span className="rs-guess-emoji">❌</span>
                <p className="rs-guess-headline">Wrong!</p>
                <p className="rs-guess-word">The word was <strong>{secretWord}</strong></p>
              </>
            )}
          </div>
        )}

        {/* 5. Scoreboard — revealed after spy verdict */}
        {revealDone && (
          <section className="rs-section animate-slide-up" aria-label="Score update">
            <ScoreBoard players={players} />
          </section>
        )}

        {/* Spacer so footer doesn't cover content */}
        <div className="rs-body-spacer" />
      </div>

      {/* ── Footer CTA ── */}
      {revealDone && (
        <footer className="rs-footer animate-slide-up">
          {isLastRound ? (
            <button
              id="btn-view-final-scores"
              className="rs-cta-btn rs-cta-btn-final"
              onClick={nextRound}
              aria-label="View final scores"
            >
              <span>🏆</span>
              View Final Scores
            </button>
          ) : (
            <button
              id="btn-next-round"
              className="rs-cta-btn rs-cta-btn-next"
              onClick={nextRound}
              aria-label={`Start round ${currentRound + 1}`}
            >
              <span>▶</span>
              Next Round
            </button>
          )}
        </footer>
      )}

    </main>
  )
}
