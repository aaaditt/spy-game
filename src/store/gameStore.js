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
  const spyIds   = new Set(shuffled.slice(0, numSpies).map(p => p.id))
  return players.map(p => ({ ...p, role: spyIds.has(p.id) ? 'spy' : 'innocent' }))
}

// ─── Initial State ────────────────────────────────────────────────
const INITIAL_STATE = {
  screen: 'home',
  settings: {
    numSpies: 1,
    timerMinutes: 5,
    hintLevel: 'beginner',
    selectedCategories: [],
    disabledWords: {}, // { categoryId: [wordId1, wordId2] }
  },
  currentRevealIndex: -1,
  secretWord: null,
  spyHint: null,
  votes: {},
  roundResults: [], // Used for tracking voting and spy guess within the single game
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
        { id: generateId(), name: trimmed, role: null, votedFor: null },
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

    const safeSpiCount    = Math.min(numSpies, players.length - 1)
    const assignedPlayers = assignRoles(players, safeSpiCount)

    set({
      players: assignedPlayers,
      secretWord: entry.word,
      spyHint: hintLevel === 'none' ? null : (entry.hints[hintLevel] ?? entry.hints.intermediate),
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
    const topIds    = Object.keys(tally).filter(id => tally[id] === maxVotes)
    // Break ties randomly
    const votedOutId = topIds[Math.floor(Math.random() * topIds.length)] ?? null
    const votedOut   = players.find(p => p.id === votedOutId) ?? null

    const spyVotedOut = votedOut?.role === 'spy'

    set(state => ({
      roundResults: [
        ...state.roundResults,
        { type: 'vote', votedOut, spyVotedOut },
      ],
      screen: 'results',
    }))

    return votedOut
  },

  spyGuess: (word) => {
    const { secretWord } = get()
    const correct = word.trim().toLowerCase() === secretWord.toLowerCase()

    set(state => ({
      roundResults: [
        ...state.roundResults,
        { type: 'spyGuess', guessedWord: word.trim(), secretWord, correct },
      ],
      screen: 'results',
    }))

    return correct
  },

  // Proceed to final screen
  nextRound: () => {
    set({ screen: 'final' })
  },

  // Full reset — returns to the initial home screen
  resetGame: () => set({ ...INITIAL_STATE }),

  // Play Again — keeps same players & settings, zeroes scores, starts fresh
  playAgain: () => {
    const { players, settings } = get()
    const { numSpies, selectedCategories, hintLevel, disabledWords } = settings

    const entry = pickRandomEntry(selectedCategories, disabledWords)
    if (!entry || players.length < 2) return

    const resetPlayers    = players.map(p => ({ ...p, role: null, votedFor: null }))
    const assignedPlayers = assignRoles(resetPlayers, Math.min(numSpies, players.length - 1))

    set({
      players: assignedPlayers,
      secretWord: entry.word,
      spyHint: hintLevel === 'none' ? null : (entry.hints[hintLevel] ?? entry.hints.intermediate),
      currentRevealIndex: 0,
      votes: {},
      roundResults: [],
      screen: 'reveal',
    })
  },
}))
