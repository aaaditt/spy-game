import { create } from 'zustand'
export { WORD_BANK } from '../data/categories.js'
import { WORD_BANK } from '../data/categories.js'

// ─── Helpers ──────────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

function pickRandomEntry(selectedCategories, disabledWords = {}) {
  const keys = selectedCategories.length
    ? selectedCategories.filter(k => WORD_BANK[k])
    : Object.keys(WORD_BANK)
  if (!keys.length) return null
  const pool = []
  for (const catKey of keys) {
    const categoryDisabled = disabledWords[catKey] || []
    const validEntries = WORD_BANK[catKey].entries.filter(e => !categoryDisabled.includes(e.id))
    pool.push(...validEntries)
  }
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

function assignRoles(players, numSpies) {
  const shuffled = [...players].sort(() => Math.random() - 0.5)
  const spyIds = new Set(shuffled.slice(0, numSpies).map(p => p.id))
  return players.map(p => ({ ...p, role: spyIds.has(p.id) ? 'spy' : 'innocent' }))
}

// Build ordered reveal list starting from the player at startIndex (in allPlayers),
// cycling through only active (non-eliminated) players.
function buildRevealOrder(allPlayers, eliminatedIdSet, startIndex) {
  const active = allPlayers.filter(p => !eliminatedIdSet.has(p.id))
  if (!active.length) return active
  const startPlayerId = allPlayers[startIndex % allPlayers.length]?.id
  // Find the pivot in the active list — the first active player at or after startIndex
  let pivot = active.findIndex(p => p.id === startPlayerId)
  if (pivot === -1) {
    // startIndex player was eliminated; find the next active player after them
    for (let i = 0; i < allPlayers.length; i++) {
      const candidate = allPlayers[(startIndex + i) % allPlayers.length]
      pivot = active.findIndex(p => p.id === candidate.id)
      if (pivot !== -1) break
    }
  }
  if (pivot === -1) pivot = 0
  return [...active.slice(pivot), ...active.slice(0, pivot)]
}

// ─── Initial State ────────────────────────────────────────────────
const INITIAL_STATE = {
  screen: 'home',
  players: [],            // full roster (includes eliminated)
  eliminatedIds: [],      // ids voted out this game session
  settings: {
    numSpies: 1,
    timerMinutes: 5,
    hintLevel: 'beginner',
    selectedCategories: [],
    disabledWords: {},
  },
  sessionIndex: 0,        // increments each new game / play again (drives rotation)
  currentRound: 0,
  revealOrder: [],        // ordered active players for current round reveal
  currentRevealIndex: 0,  // index into revealOrder
  secretWord: null,
  spyHint: null,
  votes: {},
  roundResults: [],
  winner: null,           // 'spy' | 'crewmates' | null
}

// ─── Store ────────────────────────────────────────────────────────
export const useGameStore = create((set, get) => ({
  ...INITIAL_STATE,

  // Navigation
  setScreen: (screen) => set({ screen }),

  // Player management
  addPlayer: (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    set(state => ({
      players: [
        ...state.players,
        { id: generateId(), name: trimmed, role: null, score: 0, votedFor: null },
      ],
    }))
  },

  removePlayer: (id) =>
    set(state => ({ players: state.players.filter(p => p.id !== id) })),

  // Settings
  updateSettings: (partial) =>
    set(state => ({ settings: { ...state.settings, ...partial } })),

  toggleWord: (categoryId, wordId) => set(state => {
    const disabled = state.settings.disabledWords[categoryId] || []
    const newDisabled = disabled.includes(wordId)
      ? disabled.filter(id => id !== wordId)
      : [...disabled, wordId]
    return {
      settings: {
        ...state.settings,
        disabledWords: { ...state.settings.disabledWords, [categoryId]: newDisabled },
      },
    }
  }),

  toggleAllWords: (categoryId, isEnabled) => set(state => {
    const cat = WORD_BANK[categoryId]
    if (!cat) return state
    const allIds = cat.entries.map(e => e.id)
    return {
      settings: {
        ...state.settings,
        disabledWords: {
          ...state.settings.disabledWords,
          [categoryId]: isEnabled ? [] : allIds,
        },
      },
    }
  }),

  // ── Game lifecycle ───────────────────────────────────────────────

  startGame: () => {
    const { players, settings, sessionIndex } = get()
    const { numSpies, selectedCategories, hintLevel, disabledWords } = settings
    const entry = pickRandomEntry(selectedCategories, disabledWords)
    if (!entry || players.length < 3) return

    const eliminatedIdSet = new Set()
    const startIdx = sessionIndex % players.length
    const safeSpiCount = Math.min(numSpies, players.length - 1)

    // Assign roles first so revealOrder carries correct roles
    const resetPlayers = players.map(p => ({ ...p, role: null, votedFor: null }))
    const assignedPlayers = assignRoles(resetPlayers, safeSpiCount)
    const revealOrder = buildRevealOrder(assignedPlayers, eliminatedIdSet, startIdx)

    set({
      players: assignedPlayers,
      eliminatedIds: [],
      revealOrder,
      secretWord: entry.word,
      spyHint: hintLevel === 'none' ? null : (entry.hints[hintLevel] ?? entry.hints.intermediate),
      currentRound: 1,
      currentRevealIndex: 0,
      votes: {},
      roundResults: [],
      winner: null,
      screen: 'reveal',
    })
  },

  // Advance per-player role reveal; moves to 'play' after last player
  revealNext: () => {
    const { currentRevealIndex, revealOrder } = get()
    const next = currentRevealIndex + 1
    if (next >= revealOrder.length) {
      set({ screen: 'play' })
    } else {
      set({ currentRevealIndex: next })
    }
  },

  // Record a single vote
  castVote: (voterId, targetId) =>
    set(state => ({
      votes: { ...state.votes, [voterId]: targetId },
      players: state.players.map(p =>
        p.id === voterId ? { ...p, votedFor: targetId } : p
      ),
    })),

  // Tally votes → determine win condition → navigate to results
  tallyVotes: () => {
    const { votes, players, eliminatedIds, currentRound } = get()
    const eliminatedSet = new Set(eliminatedIds)
    const activePlayers = players.filter(p => !eliminatedSet.has(p.id))

    // Build tally
    const tally = {}
    for (const targetId of Object.values(votes)) {
      tally[targetId] = (tally[targetId] ?? 0) + 1
    }
    const maxVotes = Object.values(tally).length
      ? Math.max(...Object.values(tally))
      : 0
    const topIds = Object.keys(tally).filter(id => tally[id] === maxVotes)
    const votedOutId = topIds[Math.floor(Math.random() * topIds.length)] ?? null
    const votedOut = activePlayers.find(p => p.id === votedOutId) ?? null
    const spyVotedOut = votedOut?.role === 'spy'

    // Update eliminated list
    const newEliminatedIds = votedOutId
      ? [...eliminatedIds, votedOutId]
      : [...eliminatedIds]
    const newEliminatedSet = new Set(newEliminatedIds)
    const remainingPlayers = players.filter(p => !newEliminatedSet.has(p.id))
    const remainingSpies = remainingPlayers.filter(p => p.role === 'spy')
    const remainingInnocents = remainingPlayers.filter(p => p.role === 'innocent')

    // Win condition check (spy guess handled separately)
    // Spy wins immediately if no innocents remain
    let winner = null
    if (remainingSpies.length > 0 && remainingInnocents.length === 0) {
      winner = 'spy'
    }

    // Award points
    const updatedPlayers = players.map(p => {
      if (spyVotedOut && p.role === 'innocent') return { ...p, score: p.score + 2 }
      if (!spyVotedOut && p.role === 'spy') return { ...p, score: p.score + 2 }
      return p
    })

    set(state => ({
      players: updatedPlayers,
      eliminatedIds: newEliminatedIds,
      roundResults: [
        ...state.roundResults,
        { round: currentRound, type: 'vote', votedOut, spyVotedOut, winner },
      ],
      winner,
      screen: 'results',
    }))

    return votedOut
  },

  // Spy attempts to name the secret word after being voted out
  spyGuess: (word) => {
    const { secretWord, players, currentRound } = get()
    const correct = word.trim().toLowerCase() === secretWord.toLowerCase()
    const winner = correct ? 'spy' : 'crewmates'

    const updatedPlayers = players.map(p => {
      if (correct && p.role === 'spy') return { ...p, score: p.score + 3 }
      if (!correct && p.role === 'innocent') return { ...p, score: p.score + 1 }
      return p
    })

    set(state => ({
      players: updatedPlayers,
      winner,
      roundResults: [
        ...state.roundResults,
        { round: currentRound, type: 'spyGuess', guessedWord: word.trim(), secretWord, correct, winner },
      ],
      screen: 'results',
    }))

    return correct
  },

  // Called from ResultsScreen CTA — routes to mid-round scoreboard or final
  nextRound: () => {
    const { winner } = get()
    if (winner) {
      set({ screen: 'final' })
    } else {
      set({ screen: 'scoreboard' })
    }
  },

  // Called from mid-round ScoreboardScreen to start the next round
  startNextRound: () => {
    const { currentRound, settings, players, eliminatedIds, sessionIndex } = get()
    const { numSpies, selectedCategories, hintLevel, disabledWords } = settings
    const entry = pickRandomEntry(selectedCategories, disabledWords)
    if (!entry) return

    const eliminatedSet = new Set(eliminatedIds)
    const activePlayers = players.filter(p => !eliminatedSet.has(p.id))
    if (activePlayers.length < 2) return

    // Rotate start player: session offset + rounds completed
    const startIdx = (sessionIndex + currentRound) % players.length

    const safeSpiCount = Math.min(numSpies, activePlayers.length - 1)
    const resetActive = activePlayers.map(p => ({ ...p, role: null, votedFor: null }))
    const assignedActive = assignRoles(resetActive, safeSpiCount)
    const roleMap = Object.fromEntries(assignedActive.map(p => [p.id, p.role]))

    // Apply roles back to full player list (eliminated keep their previous state)
    const updatedPlayers = players.map(p => ({
      ...p,
      role: roleMap[p.id] ?? null,
      votedFor: null,
    }))

    const revealOrder = buildRevealOrder(updatedPlayers, eliminatedSet, startIdx)

    set({
      players: updatedPlayers,
      revealOrder,
      secretWord: entry.word,
      spyHint: hintLevel === 'none' ? null : (entry.hints[hintLevel] ?? entry.hints.intermediate),
      currentRound: currentRound + 1,
      currentRevealIndex: 0,
      votes: {},
      winner: null,
      screen: 'reveal',
    })
  },

  // Full reset — returns to home
  resetGame: () => set({ ...INITIAL_STATE }),

  // Play Again — same players & settings, zero scores, increment sessionIndex
  playAgain: () => {
    const { players, settings, sessionIndex } = get()
    const { numSpies, selectedCategories, hintLevel, disabledWords } = settings
    const entry = pickRandomEntry(selectedCategories, disabledWords)
    if (!entry || players.length < 3) return

    const newSessionIndex = sessionIndex + 1
    const startIdx = newSessionIndex % players.length
    const eliminatedIdSet = new Set()

    const resetPlayers = players.map(p => ({ ...p, score: 0, role: null, votedFor: null }))
    const assignedPlayers = assignRoles(resetPlayers, Math.min(numSpies, players.length - 1))
    const revealOrder = buildRevealOrder(assignedPlayers, eliminatedIdSet, startIdx)

    set({
      players: assignedPlayers,
      eliminatedIds: [],
      revealOrder,
      secretWord: entry.word,
      spyHint: hintLevel === 'none' ? null : (entry.hints[hintLevel] ?? entry.hints.intermediate),
      sessionIndex: newSessionIndex,
      currentRound: 1,
      currentRevealIndex: 0,
      votes: {},
      roundResults: [],
      winner: null,
      screen: 'reveal',
    })
  },
}))
