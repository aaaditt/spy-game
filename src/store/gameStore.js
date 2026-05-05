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

  // Pool all valid entries from selected categories
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

// ─── Initial State ────────────────────────────────────────────────
const INITIAL_STATE = {
  screen: 'home',
  players: [],
  settings: {
    numSpies: 1,
    rounds: 3,
    timerMinutes: 5,
    hintLevel: 'beginner',
    selectedCategories: [],
    disabledWords: {}, // { categoryId: [wordId1, wordId2] }
  },
  currentRound: 0,
  currentRevealIndex: -1,
  secretWord: null,
  spyHint: null,
  votes: {},
  roundResults: [],
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
        disabledWords: {
          ...state.settings.disabledWords,
          [categoryId]: newDisabled
        }
      }
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
          [categoryId]: isEnabled ? [] : allIds
        }
      }
    }
  }),

  // ── Game lifecycle ───────────────────────────────────────────────

  startGame: () => {
    const { players, settings } = get()
    const { numSpies, selectedCategories, hintLevel, disabledWords } = settings

    const entry = pickRandomEntry(selectedCategories, disabledWords)
    if (!entry || players.length < 2) return

    const safeSpiCount = Math.min(numSpies, players.length - 1)
    const assignedPlayers = assignRoles(players, safeSpiCount)

    set({
      players: assignedPlayers,
      secretWord: entry.word,
      spyHint: hintLevel === 'none' ? null : (entry.hints[hintLevel] ?? entry.hints.intermediate),
      currentRound: 1,
      currentRevealIndex: 0,
      votes: {},
      roundResults: [],
      screen: 'reveal',
    })
  },

  // Advance the per-player role reveal; moves to 'play' after last player
  revealNext: () => {
    const { currentRevealIndex, players } = get()
    const next = currentRevealIndex + 1
    if (next >= players.length) {
      set({ screen: 'play' })
    } else {
      set({ currentRevealIndex: next })
    }
  },

  // Record a single vote; also stamps votedFor on the voter's player object
  castVote: (voterId, targetId) =>
    set(state => ({
      votes: { ...state.votes, [voterId]: targetId },
      players: state.players.map(p =>
        p.id === voterId ? { ...p, votedFor: targetId } : p
      ),
    })),

  // Tally votes → award points → persist round result → navigate to results
  // Returns the voted-out player object (or null on an all-tie edge case)
  tallyVotes: () => {
    const { votes, players, currentRound } = get()

    const tally = {}
    for (const targetId of Object.values(votes)) {
      tally[targetId] = (tally[targetId] ?? 0) + 1
    }

    const maxVotes = Object.values(tally).length
      ? Math.max(...Object.values(tally))
      : 0
    const topIds = Object.keys(tally).filter(id => tally[id] === maxVotes)
    // Break ties randomly
    const votedOutId = topIds[Math.floor(Math.random() * topIds.length)] ?? null
    const votedOut = players.find(p => p.id === votedOutId) ?? null

    const spyVotedOut = votedOut?.role === 'spy'

    // +2 pts to the "winning" side
    const updatedPlayers = players.map(p => {
      if (spyVotedOut && p.role === 'innocent') return { ...p, score: p.score + 2 }
      if (!spyVotedOut && p.role === 'spy') return { ...p, score: p.score + 2 }
      return p
    })

    set(state => ({
      players: updatedPlayers,
      roundResults: [
        ...state.roundResults,
        { round: currentRound, type: 'vote', votedOut, spyVotedOut },
      ],
      screen: 'results',
    }))

    return votedOut
  },

  // Spy attempts to name the secret word after being voted out
  // Returns true if correct; awards 3 pts to spies on hit, 1 pt to innocents on miss
  spyGuess: (word) => {
    const { secretWord, players, currentRound } = get()
    const correct = word.trim().toLowerCase() === secretWord.toLowerCase()

    const updatedPlayers = players.map(p => {
      if (correct && p.role === 'spy') return { ...p, score: p.score + 3 }
      if (!correct && p.role === 'innocent') return { ...p, score: p.score + 1 }
      return p
    })

    set(state => ({
      players: updatedPlayers,
      roundResults: [
        ...state.roundResults,
        { round: currentRound, type: 'spyGuess', guessedWord: word.trim(), secretWord, correct },
      ],
      screen: 'results',
    }))

    return correct
  },

  // Advance to the next round; if all rounds complete, go to 'final'
  nextRound: () => {
    const { currentRound, settings, players } = get()
    const { rounds, numSpies, selectedCategories, hintLevel, disabledWords } = settings

    if (currentRound >= rounds) {
      set({ screen: 'final' })
      return
    }

    const entry = pickRandomEntry(selectedCategories, disabledWords)
    if (!entry) return

    // Keep scores; clear per-round role and vote state
    const resetPlayers = players.map(p => ({ ...p, role: null, votedFor: null }))
    const assignedPlayers = assignRoles(resetPlayers, Math.min(numSpies, players.length - 1))

    set({
      players: assignedPlayers,
      secretWord: entry.word,
      spyHint: hintLevel === 'none' ? null : (entry.hints[hintLevel] ?? entry.hints.intermediate),
      currentRound: currentRound + 1,
      currentRevealIndex: 0,
      votes: {},
      screen: 'reveal',
    })
  },

  // Full reset — returns to the initial home screen
  resetGame: () => set({ ...INITIAL_STATE }),

  // Play Again — keeps same players & settings, zeroes scores, starts fresh
  playAgain: () => {
    const { players, settings } = get()
    const { numSpies, selectedCategories, hintLevel, disabledWords } = settings

    const entry = pickRandomEntry(selectedCategories, disabledWords)
    if (!entry || players.length < 2) return

    const resetPlayers = players.map(p => ({ ...p, score: 0, role: null, votedFor: null }))
    const assignedPlayers = assignRoles(resetPlayers, Math.min(numSpies, players.length - 1))

    set({
      players: assignedPlayers,
      secretWord: entry.word,
      spyHint: hintLevel === 'none' ? null : (entry.hints[hintLevel] ?? entry.hints.intermediate),
      currentRound: 1,
      currentRevealIndex: 0,
      votes: {},
      roundResults: [],
      screen: 'reveal',
    })
  },
}))
