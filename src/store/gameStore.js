import { create } from 'zustand'

// ─── Word Bank ────────────────────────────────────────────────────
// Each entry: { word, hints: { beginner, intermediate, advanced } }
// Hints are what the SPY receives — vague enough to bluff, specific enough to play.
export const WORD_BANK = {
  animals: {
    label: 'Animals',
    entries: [
      { word: 'Lion',       hints: { beginner: 'It roars and has a mane',               intermediate: 'A large African big cat',            advanced: 'A wild apex feline' } },
      { word: 'Penguin',    hints: { beginner: 'A waddling bird that cannot fly',        intermediate: 'A flightless seabird',               advanced: 'An aquatic southern bird' } },
      { word: 'Dolphin',    hints: { beginner: 'Friendly ocean animal that jumps',       intermediate: 'An intelligent marine mammal',       advanced: 'A highly social cetacean' } },
      { word: 'Elephant',   hints: { beginner: 'Biggest land animal with a trunk',       intermediate: 'A large grey mammal with tusks',     advanced: 'The largest extant proboscidean' } },
      { word: 'Eagle',      hints: { beginner: 'A big bird that soars very high',        intermediate: 'A large bird of prey',               advanced: 'A diurnal raptor' } },
      { word: 'Shark',      hints: { beginner: 'Scary ocean fish with big teeth',        intermediate: 'An apex marine predator',            advanced: 'A cartilaginous pelagic fish' } },
      { word: 'Octopus',    hints: { beginner: 'Sea creature with eight arms',           intermediate: 'An eight-limbed marine mollusc',     advanced: 'A benthic cephalopod' } },
      { word: 'Cheetah',    hints: { beginner: 'Fastest land animal with spots',         intermediate: 'A swift spotted big cat',            advanced: 'A cursorial felid' } },
      { word: 'Gorilla',    hints: { beginner: 'Large hairy ape from the jungle',        intermediate: 'The largest living primate',         advanced: 'A hominid great ape' } },
      { word: 'Flamingo',   hints: { beginner: 'Pink bird that stands on one leg',       intermediate: 'A wading bird known for its colour', advanced: 'A filter-feeding phoenicopterid' } },
    ],
  },

  places: {
    label: 'Places',
    entries: [
      { word: 'Casino',        hints: { beginner: 'Where people go to gamble',            intermediate: 'A licensed gambling establishment',  advanced: 'A wagering and entertainment venue' } },
      { word: 'Hospital',      hints: { beginner: 'Where sick people get treated',        intermediate: 'A medical care facility',             advanced: 'An acute healthcare institution' } },
      { word: 'Airport',       hints: { beginner: 'Where planes take off and land',       intermediate: 'An aviation transport hub',           advanced: 'A civil aerodrome terminal' } },
      { word: 'Library',       hints: { beginner: 'A building full of books to borrow',   intermediate: 'A public repository of books',        advanced: 'An archival information commons' } },
      { word: 'Submarine',     hints: { beginner: 'A vehicle that goes underwater',       intermediate: 'A submerged naval vessel',             advanced: 'An underwater pressure hull craft' } },
      { word: 'Space Station', hints: { beginner: 'Where astronauts live in space',       intermediate: 'An orbital research habitat',          advanced: 'A crewed extraterrestrial outpost' } },
      { word: 'Circus',        hints: { beginner: 'Clowns, acrobats, and animals perform',intermediate: 'A travelling performance venue',      advanced: 'An itinerant variety entertainment' } },
      { word: 'Pirate Ship',   hints: { beginner: 'A sailing ship with a skull flag',     intermediate: 'A vessel used by buccaneers',         advanced: 'A maritime outlaw\'s vessel' } },
      { word: 'Museum',        hints: { beginner: 'A place with artefacts and exhibits',  intermediate: 'A cultural and historical institution',advanced: 'A curatorial public repository' } },
      { word: 'Ski Resort',    hints: { beginner: 'A snowy mountain with ski slopes',     intermediate: 'A winter sports destination',          advanced: 'An alpine recreational facility' } },
    ],
  },

  food: {
    label: 'Food & Drink',
    entries: [
      { word: 'Pizza',       hints: { beginner: 'Round dough with cheese and toppings',   intermediate: 'Italian flatbread with toppings',    advanced: 'A leavened Neapolitan baked dish' } },
      { word: 'Sushi',       hints: { beginner: 'Japanese rice rolls with fish',           intermediate: 'A Japanese vinegared rice dish',     advanced: 'A shari-based Japanese preparation' } },
      { word: 'Chocolate',   hints: { beginner: 'Sweet brown treat everyone loves',        intermediate: 'A confection derived from cacao',    advanced: 'A processed theobroma product' } },
      { word: 'Taco',        hints: { beginner: 'Folded tortilla with fillings',           intermediate: 'A Mexican corn-based street food',   advanced: 'A maize tortilla folded dish' } },
      { word: 'Ice Cream',   hints: { beginner: 'Cold sweet treat in a cone',              intermediate: 'A frozen dairy dessert',             advanced: 'A churned frozen emulsion' } },
      { word: 'Burger',      hints: { beginner: 'Meat patty in a bun with toppings',       intermediate: 'A grilled patty sandwich',           advanced: 'A ground-meat breadroll assembly' } },
      { word: 'Croissant',   hints: { beginner: 'Flaky crescent-shaped pastry',           intermediate: 'A laminated French pastry',           advanced: 'A viennoiserie laminated baked good' } },
      { word: 'Ramen',       hints: { beginner: 'Hot Japanese noodle soup',                intermediate: 'A wheat noodle broth dish',           advanced: 'A Japanese alkaline noodle preparation' } },
      { word: 'Espresso',    hints: { beginner: 'A small but very strong coffee',          intermediate: 'A concentrated coffee extraction',   advanced: 'A pressurised hot water infusion' } },
      { word: 'Fondue',      hints: { beginner: 'You dip bread into melted cheese',        intermediate: 'A Swiss melted cheese dish',          advanced: 'A communal pot-based Swiss preparation' } },
    ],
  },

  sports: {
    label: 'Sports',
    entries: [
      { word: 'Chess',      hints: { beginner: 'Board game with kings, queens and pawns',  intermediate: 'A two-player abstract strategy game', advanced: 'A combinatorial perfect-information game' } },
      { word: 'Surfing',    hints: { beginner: 'Riding ocean waves on a board',             intermediate: 'A wave-riding water sport',           advanced: 'Hydrodynamic gliding on ocean swells' } },
      { word: 'Fencing',    hints: { beginner: 'Fighting with swords as a sport',           intermediate: 'A sword-based combat sport',          advanced: 'A foil, épée and sabre blade sport' } },
      { word: 'Archery',    hints: { beginner: 'Shooting arrows at a bullseye',             intermediate: 'A bow and arrow precision sport',     advanced: 'A ranged projectile discipline' } },
      { word: 'Polo',       hints: { beginner: 'Riding horses while hitting a ball',        intermediate: 'An equestrian team ball sport',       advanced: 'A mounted mallet ball sport' } },
      { word: 'Curling',    hints: { beginner: 'Sliding heavy stones on ice',               intermediate: 'A target-based ice surface sport',   advanced: 'A granitic stone sweeping game' } },
      { word: 'Skydiving',  hints: { beginner: 'Jumping out of a plane with a parachute',  intermediate: 'A parachute freefall sport',          advanced: 'A controlled aerial descent activity' } },
      { word: 'Gymnastics', hints: { beginner: 'Flips, balance beams and cartwheels',       intermediate: 'An acrobatic athletic discipline',    advanced: 'A somatic kinesthetic sport' } },
      { word: 'Bobsled',    hints: { beginner: 'A team rides a sled down an icy track',    intermediate: 'A gravity-assisted ice track sport',  advanced: 'A crewed gravity-driven luge discipline' } },
      { word: 'Rowing',     hints: { beginner: 'Paddling a boat on a river fast',           intermediate: 'An oar-propelled watercraft race',   advanced: 'A sculling or sweeping aquatic discipline' } },
    ],
  },

  technology: {
    label: 'Technology',
    entries: [
      { word: 'Drone',       hints: { beginner: 'A flying robot controlled from far away', intermediate: 'An unmanned aerial vehicle',         advanced: 'An autonomous multi-rotor aerial platform' } },
      { word: 'Blockchain',  hints: { beginner: 'The technology behind Bitcoin',            intermediate: 'A distributed ledger system',        advanced: 'An immutable append-only hash chain' } },
      { word: 'Satellite',   hints: { beginner: 'An object orbiting the Earth in space',   intermediate: 'An orbital communications device',   advanced: 'A geostationary or LEO relay node' } },
      { word: 'Laser',       hints: { beginner: 'A focused beam of light',                  intermediate: 'An amplified coherent light source',  advanced: 'Stimulated emission of radiation' } },
      { word: 'Robot',       hints: { beginner: 'A machine that does human tasks',          intermediate: 'An automated mechanical system',     advanced: 'An electromechanical autonomous agent' } },
      { word: 'Algorithm',   hints: { beginner: 'A set of steps a computer follows',        intermediate: 'A finite computational procedure',   advanced: 'A deterministic procedural specification' } },
      { word: 'Encryption',  hints: { beginner: 'Turning data into a secret code',          intermediate: 'Cryptographic data transformation',  advanced: 'Ciphertext derivation from plaintext' } },
      { word: 'Neural Net',  hints: { beginner: 'How AI brains are built',                  intermediate: 'An interconnected AI model layer',   advanced: 'A parameterised directed acyclic graph' } },
      { word: 'VR Headset',  hints: { beginner: 'A device you wear to enter a virtual world',intermediate: 'An immersive display device',       advanced: 'A stereoscopic display with 6DoF tracking' } },
      { word: 'Quantum Computer',hints:{beginner:'An extremely powerful computer',          intermediate: 'A qubit-based computing system',     advanced: 'A superposition-exploiting computation device' } },
    ],
  },

  movies: {
    label: 'Movies',
    entries: [
      { word: 'Heist Film',    hints: { beginner: 'A movie about robbing a bank',          intermediate: 'A crime-planning genre film',        advanced: 'A larceny-centric narrative' } },
      { word: 'Western',       hints: { beginner: 'Cowboys and outlaws in the old west',    intermediate: 'A frontier-era American genre',      advanced: 'A frontier mythology narrative' } },
      { word: 'Musical',       hints: { beginner: 'Characters burst into song and dance',   intermediate: 'A song-driven narrative film',       advanced: 'A diegetic performance genre' } },
      { word: 'Documentary',   hints: { beginner: 'A movie about real people and events',   intermediate: 'A non-fiction factual film',         advanced: 'An indexical cinematic record' } },
      { word: 'Horror',        hints: { beginner: 'Scary movies with monsters and ghosts',  intermediate: 'A fear-eliciting genre film',        advanced: 'A dread-inducing narrative mode' } },
      { word: 'Sci-Fi',        hints: { beginner: 'Space, aliens and the future',           intermediate: 'Speculative science fiction genre',  advanced: 'A speculative extrapolation narrative' } },
      { word: 'Noir',          hints: { beginner: 'Dark detective movies from the 1950s',   intermediate: 'A dark crime drama aesthetic',       advanced: 'A cynical fatalistic genre' } },
      { word: 'Mockumentary',  hints: { beginner: 'A fake documentary that is funny',       intermediate: 'A satirical faux-documentary format',advanced: 'A parodic observational mode' } },
      { word: 'Anime',         hints: { beginner: 'Japanese animated movies',               intermediate: 'Japanese animation style films',     advanced: 'A Japanese cel or CG animation medium' } },
      { word: 'Thriller',      hints: { beginner: 'Edge-of-your-seat suspenseful movies',   intermediate: 'A suspense-driven narrative film',   advanced: 'A tension-escalating genre' } },
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
      spyHint: entry.hints[hintLevel] ?? entry.hints.intermediate,
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
      spyHint: entry.hints[hintLevel] ?? entry.hints.intermediate,
      currentRound: currentRound + 1,
      currentRevealIndex: 0,
      votes: {},
      screen: 'reveal',
    })
  },

  // Full reset — returns to the initial home screen
  resetGame: () => set({ ...INITIAL_STATE }),
}))
