import { create } from 'zustand'

// ─── Word Bank ────────────────────────────────────────────────────
// Each entry: { word, hints: { beginner, intermediate, advanced } }
// Hints are what the SPY receives — deliberately abstract and oblique.
// Rule: someone who knows the word can confirm the hint fits;
//       someone who doesn't cannot reverse-engineer the answer from it.
// hintLevel 'none' skips this entirely (spyHint set to null in store).
export const WORD_BANK = {
  animals: {
    label: 'Animals',
    entries: [
      { word: 'Lion',       hints: { beginner: 'Royalty that hunts',                          intermediate: 'Gold silence before the kill',               advanced: 'Where dominion meets hunger' } },
      { word: 'Penguin',    hints: { beginner: 'Grace below, helpless above',                  intermediate: 'A tuxedoed exile of warm seasons',           advanced: 'The flightless sovereign of cold margins' } },
      { word: 'Dolphin',    hints: { beginner: 'Intelligence wearing water',                   intermediate: "The sea's mirror of empathy",                advanced: 'What leaps between worlds without leaving either' } },
      { word: 'Elephant',   hints: { beginner: 'Memory given a body',                          intermediate: 'The weight that mourns',                     advanced: 'Antiquity still breathing' } },
      { word: 'Eagle',      hints: { beginner: "The sky's decisive point",                     intermediate: 'Vision descended as a weapon',               advanced: 'Gravity deferred' } },
      { word: 'Shark',      hints: { beginner: "The ocean's oldest hunger",                    intermediate: 'Efficiency without mercy',                   advanced: 'What the deep perfected first' } },
      { word: 'Octopus',    hints: { beginner: 'Many minds sharing one body',                  intermediate: 'Distributed intelligence made soft',         advanced: 'The formless that thinks' } },
      { word: 'Cheetah',    hints: { beginner: 'Speed that hesitates before committing',       intermediate: 'A moment stretched into motion',             advanced: 'The equation of velocity solved in muscle' } },
      { word: 'Gorilla',    hints: { beginner: 'Strength that chooses restraint',              intermediate: 'Power that watches',                         advanced: 'The ancestor that stayed' } },
      { word: 'Flamingo',   hints: { beginner: 'Balance made beautiful',                       intermediate: 'A contradiction in silhouette',              advanced: 'Stillness performing colour' } },
    ],
  },

  places: {
    label: 'Places',
    entries: [
      { word: 'Casino',        hints: { beginner: 'Where hope and math collide',               intermediate: 'The altar of controlled chance',            advanced: 'Optimism quantified against itself' } },
      { word: 'Hospital',      hints: { beginner: 'Where time is measured in heartbeats',      intermediate: 'A threshold between states of being',       advanced: 'The institutional negotiation with mortality' } },
      { word: 'Airport',       hints: { beginner: 'A waiting room for elsewhere',              intermediate: 'The pause between identities',              advanced: 'Liminality made concrete' } },
      { word: 'Library',       hints: { beginner: 'Silence holding multitudes',                intermediate: 'The architecture of accumulated thought',    advanced: 'Deferred speech made permanent' } },
      { word: 'Submarine',     hints: { beginner: 'Depth made habitable',                      intermediate: 'A lung beneath the pressure',               advanced: 'Sovereignty in the crushed dark' } },
      { word: 'Space Station', hints: { beginner: 'A foothold above breathing',                intermediate: 'Orbit as address',                          advanced: 'Permanent impermanence above atmosphere' } },
      { word: 'Circus',        hints: { beginner: 'Impossibility scheduled for eight o\'clock',intermediate: 'The rehearsed violation of expected limits', advanced: 'Defiance choreographed under canvas' } },
      { word: 'Pirate Ship',   hints: { beginner: 'Freedom with a flag',                       intermediate: 'Sovereignty declared on moving water',      advanced: 'Jurisdiction rejected afloat' } },
      { word: 'Museum',        hints: { beginner: 'The past asking to be seen',                intermediate: 'Time cured and displayed',                  advanced: 'Entropy arrested in glass cases' } },
      { word: 'Ski Resort',    hints: { beginner: 'Gravity enjoyed on cold slopes',            intermediate: 'Altitude sold as leisure',                  advanced: "The mountain's descent commodified" } },
    ],
  },

  food: {
    label: 'Food & Drink',
    entries: [
      { word: 'Pizza',       hints: { beginner: 'A circle that feeds crowds',                  intermediate: 'Simplicity assembled by region',             advanced: 'Communal geometry baked flat' } },
      { word: 'Sushi',       hints: { beginner: 'Precision without heat',                      intermediate: "The sea's patience on rice",                 advanced: 'Restraint as flavour' } },
      { word: 'Chocolate',   hints: { beginner: 'Bitterness transformed to comfort',           intermediate: "A bean's long journey to desire",            advanced: 'Alchemy from soil to craving' } },
      { word: 'Taco',        hints: { beginner: 'A folded argument about its filling',         intermediate: 'Structure that yields to its contents',      advanced: 'Geometry in service of abundance' } },
      { word: 'Ice Cream',   hints: { beginner: 'Cold sweetness that vanishes',                intermediate: 'Pleasure with a deadline',                   advanced: 'Desire that melts under attention' } },
      { word: 'Burger',      hints: { beginner: 'Layers pressed into a claim',                 intermediate: 'Architecture of appetite',                   advanced: 'The democratic meal, stacked' } },
      { word: 'Croissant',   hints: { beginner: 'Patience laminated into layers',              intermediate: 'Time folded into butter',                    advanced: 'Labour disguised as lightness' } },
      { word: 'Ramen',       hints: { beginner: 'A bowl that holds more than it shows',        intermediate: 'Warmth distilled from hours',                advanced: 'Depth accumulated at low heat' } },
      { word: 'Espresso',    hints: { beginner: 'Concentration in small form',                 intermediate: 'Time and pressure married in a cup',         advanced: 'Velocity extracted from bean to moment' } },
      { word: 'Fondue',      hints: { beginner: 'Sharing heat and dipping',                    intermediate: 'Communal dissolution over flame',            advanced: 'Social ritual conducted through liquid' } },
    ],
  },

  sports: {
    label: 'Sports',
    entries: [
      { word: 'Chess',      hints: { beginner: 'War without blood',                            intermediate: 'Violence abstracted into patience',          advanced: 'Conflict resolved through foresight alone' } },
      { word: 'Surfing',    hints: { beginner: 'Negotiating with something much larger',       intermediate: 'Borrowed momentum from the deep',            advanced: "The ocean's permission to stand" } },
      { word: 'Fencing',    hints: { beginner: 'An argument conducted in metal',               intermediate: 'Conversation at blade-length',               advanced: 'Rhetoric made sharp' } },
      { word: 'Archery',    hints: { beginner: 'Stillness releasing force',                    intermediate: 'The breath between intention and impact',    advanced: 'Will extended beyond the body' } },
      { word: 'Polo',       hints: { beginner: 'Speed in service of precision',                intermediate: 'Partnership between species for a goal',     advanced: 'Interspecies velocity toward a point' } },
      { word: 'Curling',    hints: { beginner: 'Direction given to something already moving',  intermediate: 'Friction negotiated across ice',             advanced: 'The correction after the release' } },
      { word: 'Skydiving',  hints: { beginner: 'Trust in what slows you',                     intermediate: 'Gravity accepted willingly',                 advanced: 'The negotiation with terminal velocity' } },
      { word: 'Gymnastics', hints: { beginner: 'The body as argument',                         intermediate: 'Physics made beautiful under pressure',      advanced: 'Kinetics performed against expectation' } },
      { word: 'Bobsled',    hints: { beginner: 'Gravity harnessed as a team',                  intermediate: 'Controlled surrender to descent',            advanced: 'Collaboration inside falling' } },
      { word: 'Rowing',     hints: { beginner: 'Moving forward while facing backward',         intermediate: 'Synchronised effort against resistance',     advanced: 'Unity expressed through opposition' } },
    ],
  },

  technology: {
    label: 'Technology',
    entries: [
      { word: 'Drone',            hints: { beginner: 'Eyes without a face above you',          intermediate: 'Presence without body',                     advanced: 'Remote will made aerial' } },
      { word: 'Blockchain',       hints: { beginner: 'Trust without a middleman',              intermediate: 'Agreement distributed and hardened',         advanced: 'Consensus crystallised across distrust' } },
      { word: 'Satellite',        hints: { beginner: 'A machine that knows where you are',     intermediate: 'Precision lent from above',                  advanced: 'The high-orbit witness' } },
      { word: 'Laser',            hints: { beginner: 'Light made single-minded',               intermediate: 'Coherence as force',                         advanced: 'Entropy reversed into a line' } },
      { word: 'Robot',            hints: { beginner: 'Instruction given a body',               intermediate: 'Labour without complaint',                   advanced: 'Agency without will' } },
      { word: 'Algorithm',        hints: { beginner: 'A recipe that never tires',              intermediate: 'Decision minus intuition',                   advanced: 'The deterministic ghost in the machine' } },
      { word: 'Encryption',       hints: { beginner: 'A message only its recipient can read',  intermediate: 'Meaning locked behind mathematics',          advanced: 'The public face of a private truth' } },
      { word: 'Neural Net',       hints: { beginner: 'Learning by failing many times',         intermediate: 'Pattern recognition through shaped error',   advanced: 'Weighted uncertainty converging toward signal' } },
      { word: 'VR Headset',       hints: { beginner: 'Elsewhere worn on the face',             intermediate: 'Presence rented from a machine',             advanced: 'Phenomenology outsourced to hardware' } },
      { word: 'Quantum Computer', hints: { beginner: 'A machine that tries all answers at once',intermediate: 'Superposed computation collapsing to certainty',advanced: 'Probability leveraged before observation' } },
    ],
  },

  movies: {
    label: 'Movies',
    entries: [
      { word: 'Heist Film',   hints: { beginner: 'The plan is the point',                      intermediate: 'Choreographed transgression as entertainment', advanced: 'Complicity with precision' } },
      { word: 'Western',      hints: { beginner: 'A landscape that enforces its own law',       intermediate: 'Myth dressed in dust and leather',           advanced: 'The frontier as moral vacuum' } },
      { word: 'Musical',      hints: { beginner: 'When the feeling is too big for words',       intermediate: 'Emotion overflows into song',                advanced: 'The moment narrative yields to affect' } },
      { word: 'Documentary',  hints: { beginner: 'Reality with an argument',                    intermediate: 'The world curated into a point of view',     advanced: 'Indexicality in service of persuasion' } },
      { word: 'Horror',       hints: { beginner: 'The thing you cannot unsee',                  intermediate: 'Dread formalised as entertainment',          advanced: 'The return of the repressed, scheduled' } },
      { word: 'Sci-Fi',       hints: { beginner: 'What if we were wrong about tomorrow',        intermediate: 'The present extended into fear or wonder',   advanced: 'Extrapolation as social critique' } },
      { word: 'Noir',         hints: { beginner: 'Everyone is guilty of something',             intermediate: 'Cynicism as aesthetic',                      advanced: 'Moral entropy in shadows and rain' } },
      { word: 'Mockumentary', hints: { beginner: 'A lie performed as truth',                    intermediate: 'Sincerity weaponised for comedy',            advanced: 'The form used against itself' } },
      { word: 'Anime',        hints: { beginner: 'Feeling drawn at a scale nothing else attempts',intermediate: 'Emotion amplified through stylisation',   advanced: 'The hyperreal articulation of affect' } },
      { word: 'Thriller',     hints: { beginner: 'You know something bad is coming',            intermediate: 'Anticipation sustained beyond comfort',      advanced: 'Suspense as a structural principle' } },
    ],
  },
}

// ─── Helpers ──────────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

function pickRandomEntry(selectedCategories) {
  const keys = selectedCategories.length
    ? selectedCategories.filter(k => WORD_BANK[k])
    : Object.keys(WORD_BANK)

  if (!keys.length) return null

  const category = keys[Math.floor(Math.random() * keys.length)]
  const entries  = WORD_BANK[category].entries
  return entries[Math.floor(Math.random() * entries.length)]
}

function assignRoles(players, numSpies) {
  const shuffled = [...players].sort(() => Math.random() - 0.5)
  const spyIds   = new Set(shuffled.slice(0, numSpies).map(p => p.id))
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
    hintLevel: 'intermediate',
    selectedCategories: [],
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

  // ── Game lifecycle ───────────────────────────────────────────────

  startGame: () => {
    const { players, settings } = get()
    const { numSpies, selectedCategories, hintLevel } = settings

    const entry = pickRandomEntry(selectedCategories)
    if (!entry || players.length < 2) return

    const safeSpiCount    = Math.min(numSpies, players.length - 1)
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
    const topIds    = Object.keys(tally).filter(id => tally[id] === maxVotes)
    // Break ties randomly
    const votedOutId = topIds[Math.floor(Math.random() * topIds.length)] ?? null
    const votedOut   = players.find(p => p.id === votedOutId) ?? null

    const spyVotedOut = votedOut?.role === 'spy'

    // +2 pts to the "winning" side
    const updatedPlayers = players.map(p => {
      if (spyVotedOut  && p.role === 'innocent') return { ...p, score: p.score + 2 }
      if (!spyVotedOut && p.role === 'spy')      return { ...p, score: p.score + 2 }
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
      if (correct  && p.role === 'spy')      return { ...p, score: p.score + 3 }
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
    const { rounds, numSpies, selectedCategories, hintLevel } = settings

    if (currentRound >= rounds) {
      set({ screen: 'final' })
      return
    }

    const entry = pickRandomEntry(selectedCategories)
    if (!entry) return

    // Keep scores; clear per-round role and vote state
    const resetPlayers    = players.map(p => ({ ...p, role: null, votedFor: null }))
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
}))
