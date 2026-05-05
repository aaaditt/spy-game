# Spy Game Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the spy game to support infinite-round event-driven play, rotating start player per session, real one-word hints by difficulty, neutral role reveal cards, spy word-guess win condition, and per-round scoreboard display.

**Architecture:** The store replaces `rounds` with a `sessionIndex` counter (incremented on each "new game / play again") and tracks `roundStartPlayerIndex` to rotate which player gets the first reveal each round within a session. Win conditions are now event-driven: crewmates win when they vote out the spy; spy wins if they are the last player standing or guess the secret word after being voted out. A mid-round scoreboard screen is shown after results before starting the next round.

**Tech Stack:** React 18, Zustand, Vite, CSS Modules pattern (per-screen CSS files)

---

## File Map

| File | Change |
|---|---|
| `src/data/categories.js` | Replace all placeholder hints with real one-word / short-phrase contextual clues per difficulty |
| `src/store/gameStore.js` | Remove `rounds` from settings; add `sessionIndex`, `roundStartPlayerIndex`, `activePlayers` (players still in game); new win conditions in `tallyVotes`; new `nextRound` that doesn't check round cap; updated `playAgain` / `startGame` that rotate start player |
| `src/screens/SetupScreen.jsx` + `.css` | Remove "Rounds" pill row |
| `src/screens/RoleRevealScreen.jsx` + `.css` | Neutral card design — no distinct red (spy) / green (crewmate) colour, use dark/light neutral contrast instead |
| `src/screens/ResultsScreen.jsx` + `.css` | Handle new win conditions: (a) spy voted out → spy guess phase → round over, (b) crewmates win outright, (c) spy wins (last survivor). Show "Next Round" only when game continues. Show "Game Over" when a win condition is met. |
| `src/screens/ScoreboardScreen.jsx` + `.css` | Reuse for mid-round "between rounds" display; receives a `isFinal` prop to decide footer buttons |
| `src/App.jsx` | Add `scoreboard` screen to SCREENS map (currently only `final` goes to ScoreboardScreen; we'll route both `final` and `scoreboard` there) |

---

## Task 1: Rewrite hint data in categories.js

**Files:**
- Modify: `src/data/categories.js`

The current hints are all placeholders ("Begins with X, has N letters" / "A type of animals"). Replace every entry with:
- **beginner**: closely related clue, easy to guess (e.g. for Lion → "Mane")
- **intermediate**: loosely related, one step removed (e.g. "Savannah")
- **advanced**: cryptic or abstract (e.g. "Pride")

Do all 7 categories × 30 words = 210 entries.

- [ ] **Step 1: Replace categories.js with fully rewritten hint data**

Here is the complete file content (all 7 categories, 30 words each, 3 real hints per entry):

```js
export const WORD_BANK = {
  animals: {
    label: 'Animals',
    emoji: '🦁',
    entries: [
      { id: 'animals_000', word: 'Lion',      hints: { beginner: 'Mane',       intermediate: 'Savannah',    advanced: 'Pride' } },
      { id: 'animals_001', word: 'Penguin',   hints: { beginner: 'Tuxedo',     intermediate: 'Antarctic',   advanced: 'Waddle' } },
      { id: 'animals_002', word: 'Dolphin',   hints: { beginner: 'Flipper',    intermediate: 'Echolocation',advanced: 'Pod' } },
      { id: 'animals_003', word: 'Elephant',  hints: { beginner: 'Trunk',      intermediate: 'Ivory',       advanced: 'Memory' } },
      { id: 'animals_004', word: 'Eagle',     hints: { beginner: 'Talon',      intermediate: 'Nest',        advanced: 'Soar' } },
      { id: 'animals_005', word: 'Shark',     hints: { beginner: 'Fin',        intermediate: 'Predator',    advanced: 'Apex' } },
      { id: 'animals_006', word: 'Octopus',   hints: { beginner: 'Tentacle',   intermediate: 'Ink',         advanced: 'Camouflage' } },
      { id: 'animals_007', word: 'Cheetah',   hints: { beginner: 'Spots',      intermediate: 'Sprint',      advanced: 'Acceleration' } },
      { id: 'animals_008', word: 'Gorilla',   hints: { beginner: 'Chest-beat', intermediate: 'Jungle',      advanced: 'Silverback' } },
      { id: 'animals_009', word: 'Flamingo',  hints: { beginner: 'Pink',       intermediate: 'Brine',       advanced: 'Balance' } },
      { id: 'animals_010', word: 'Tiger',     hints: { beginner: 'Stripes',    intermediate: 'Bengal',      advanced: 'Stalk' } },
      { id: 'animals_011', word: 'Bear',      hints: { beginner: 'Hibernate',  intermediate: 'Claw',        advanced: 'Solitary' } },
      { id: 'animals_012', word: 'Wolf',      hints: { beginner: 'Howl',       intermediate: 'Pack',        advanced: 'Lunar' } },
      { id: 'animals_013', word: 'Fox',       hints: { beginner: 'Bushy tail', intermediate: 'Cunning',     advanced: 'Vixen' } },
      { id: 'animals_014', word: 'Kangaroo',  hints: { beginner: 'Pouch',      intermediate: 'Outback',     advanced: 'Joey' } },
      { id: 'animals_015', word: 'Giraffe',   hints: { beginner: 'Long neck',  intermediate: 'Acacia',      advanced: 'Ossicones' } },
      { id: 'animals_016', word: 'Zebra',     hints: { beginner: 'Stripes',    intermediate: 'Herd',        advanced: 'Dazzle' } },
      { id: 'animals_017', word: 'Rhino',     hints: { beginner: 'Horn',       intermediate: 'Armoured',    advanced: 'Crash' } },
      { id: 'animals_018', word: 'Hippo',     hints: { beginner: 'Mud',        intermediate: 'River',       advanced: 'Bloat' } },
      { id: 'animals_019', word: 'Crocodile', hints: { beginner: 'Scales',     intermediate: 'Swamp',       advanced: 'Ambush' } },
      { id: 'animals_020', word: 'Snake',     hints: { beginner: 'Slither',    intermediate: 'Venom',       advanced: 'Coil' } },
      { id: 'animals_021', word: 'Turtle',    hints: { beginner: 'Shell',      intermediate: 'Slow',        advanced: 'Longevity' } },
      { id: 'animals_022', word: 'Frog',      hints: { beginner: 'Leap',       intermediate: 'Lily pad',    advanced: 'Metamorphosis' } },
      { id: 'animals_023', word: 'Toad',      hints: { beginner: 'Wart',       intermediate: 'Terrestrial', advanced: 'Poison' } },
      { id: 'animals_024', word: 'Lizard',    hints: { beginner: 'Scales',     intermediate: 'Reptile',     advanced: 'Ectotherm' } },
      { id: 'animals_025', word: 'Chameleon', hints: { beginner: 'Color-change',intermediate: 'Camouflage', advanced: 'Cryptic' } },
      { id: 'animals_026', word: 'Monkey',    hints: { beginner: 'Swing',      intermediate: 'Primate',     advanced: 'Troop' } },
      { id: 'animals_027', word: 'Ape',       hints: { beginner: 'No tail',    intermediate: 'Knuckle',     advanced: 'Hominid' } },
      { id: 'animals_028', word: 'Lemur',     hints: { beginner: 'Ring tail',  intermediate: 'Madagascar',  advanced: 'Strepsirhini' } },
      { id: 'animals_029', word: 'Sloth',     hints: { beginner: 'Slow',       intermediate: 'Upside-down', advanced: 'Torpor' } },
    ]
  },
  places: {
    label: 'Places',
    emoji: '🌍',
    entries: [
      { id: 'places_000', word: 'Casino',        hints: { beginner: 'Chips',       intermediate: 'Jackpot',     advanced: 'House edge' } },
      { id: 'places_001', word: 'Hospital',      hints: { beginner: 'Doctor',      intermediate: 'Sterile',     advanced: 'Triage' } },
      { id: 'places_002', word: 'Airport',       hints: { beginner: 'Runway',      intermediate: 'Terminal',    advanced: 'Departure' } },
      { id: 'places_003', word: 'Library',       hints: { beginner: 'Books',       intermediate: 'Dewey',       advanced: 'Catalogue' } },
      { id: 'places_004', word: 'Submarine',     hints: { beginner: 'Periscope',   intermediate: 'Underwater',  advanced: 'Ballast' } },
      { id: 'places_005', word: 'Space Station', hints: { beginner: 'Orbit',       intermediate: 'Microgravity',advanced: 'Module' } },
      { id: 'places_006', word: 'Circus',        hints: { beginner: 'Clown',       intermediate: 'Trapeze',     advanced: 'Sawdust' } },
      { id: 'places_007', word: 'Pirate Ship',   hints: { beginner: 'Plank',       intermediate: 'Jolly Roger', advanced: 'Quarterdeck' } },
      { id: 'places_008', word: 'Museum',        hints: { beginner: 'Exhibit',     intermediate: 'Artefact',    advanced: 'Curator' } },
      { id: 'places_009', word: 'Ski Resort',    hints: { beginner: 'Slope',       intermediate: 'Gondola',     advanced: 'Après-ski' } },
      { id: 'places_010', word: 'School',        hints: { beginner: 'Classroom',   intermediate: 'Curriculum',  advanced: 'Pedagogy' } },
      { id: 'places_011', word: 'Supermarket',   hints: { beginner: 'Aisle',       intermediate: 'Barcode',     advanced: 'Planogram' } },
      { id: 'places_012', word: 'Bank',          hints: { beginner: 'Vault',       intermediate: 'Interest',    advanced: 'Liquidity' } },
      { id: 'places_013', word: 'Post Office',   hints: { beginner: 'Stamp',       intermediate: 'Postcode',    advanced: 'Franking' } },
      { id: 'places_014', word: 'Police Station',hints: { beginner: 'Badge',       intermediate: 'Custody',     advanced: 'Precinct' } },
      { id: 'places_015', word: 'Fire Station',  hints: { beginner: 'Hose',        intermediate: 'Alarm',       advanced: 'Pumper' } },
      { id: 'places_016', word: 'Restaurant',    hints: { beginner: 'Menu',        intermediate: 'Reservation', advanced: 'Mise en place' } },
      { id: 'places_017', word: 'Cafe',          hints: { beginner: 'Espresso',    intermediate: 'Latte art',   advanced: 'Third wave' } },
      { id: 'places_018', word: 'Bakery',        hints: { beginner: 'Dough',       intermediate: 'Proofing',    advanced: 'Crumb' } },
      { id: 'places_019', word: 'Cinema',        hints: { beginner: 'Popcorn',     intermediate: 'Screening',   advanced: 'Projection' } },
      { id: 'places_020', word: 'Theatre',       hints: { beginner: 'Curtain',     intermediate: 'Rehearsal',   advanced: 'Proscenium' } },
      { id: 'places_021', word: 'Stadium',       hints: { beginner: 'Crowd',       intermediate: 'Scoreboard',  advanced: 'Concourse' } },
      { id: 'places_022', word: 'Gym',           hints: { beginner: 'Weights',     intermediate: 'Treadmill',   advanced: 'Hypertrophy' } },
      { id: 'places_023', word: 'Park',          hints: { beginner: 'Bench',       intermediate: 'Greenery',    advanced: 'Canopy' } },
      { id: 'places_024', word: 'Beach',         hints: { beginner: 'Sand',        intermediate: 'Shoreline',   advanced: 'Littoral' } },
      { id: 'places_025', word: 'Forest',        hints: { beginner: 'Trees',       intermediate: 'Undergrowth', advanced: 'Canopy layer' } },
      { id: 'places_026', word: 'Mountain',      hints: { beginner: 'Summit',      intermediate: 'Altitude',    advanced: 'Treeline' } },
      { id: 'places_027', word: 'Desert',        hints: { beginner: 'Sand dunes',  intermediate: 'Arid',        advanced: 'Xerophyte' } },
      { id: 'places_028', word: 'Island',        hints: { beginner: 'Surrounded',  intermediate: 'Isolated',    advanced: 'Atoll' } },
      { id: 'places_029', word: 'Cave',          hints: { beginner: 'Dark',        intermediate: 'Stalactite',  advanced: 'Speleothem' } },
    ]
  },
  food: {
    label: 'Food & Drink',
    emoji: '🍔',
    entries: [
      { id: 'food_000', word: 'Pizza',      hints: { beginner: 'Crust',      intermediate: 'Mozzarella',  advanced: 'Neapolitan' } },
      { id: 'food_001', word: 'Sushi',      hints: { beginner: 'Raw fish',   intermediate: 'Nori',        advanced: 'Umami' } },
      { id: 'food_002', word: 'Chocolate',  hints: { beginner: 'Cocoa',      intermediate: 'Tempering',   advanced: 'Conching' } },
      { id: 'food_003', word: 'Taco',       hints: { beginner: 'Tortilla',   intermediate: 'Salsa',       advanced: 'Carnitas' } },
      { id: 'food_004', word: 'Ice Cream',  hints: { beginner: 'Scoop',      intermediate: 'Churning',    advanced: 'Overrun' } },
      { id: 'food_005', word: 'Burger',     hints: { beginner: 'Bun',        intermediate: 'Patty',       advanced: 'Maillard' } },
      { id: 'food_006', word: 'Croissant',  hints: { beginner: 'Flaky',      intermediate: 'Laminated',   advanced: 'Viennoiserie' } },
      { id: 'food_007', word: 'Ramen',      hints: { beginner: 'Broth',      intermediate: 'Noodle',      advanced: 'Tare' } },
      { id: 'food_008', word: 'Espresso',   hints: { beginner: 'Shot',       intermediate: 'Crema',       advanced: 'Extraction' } },
      { id: 'food_009', word: 'Fondue',     hints: { beginner: 'Dip',        intermediate: 'Melted',      advanced: 'Caquelon' } },
      { id: 'food_010', word: 'Pasta',      hints: { beginner: 'Al dente',   intermediate: 'Semolina',    advanced: 'Starchy water' } },
      { id: 'food_011', word: 'Steak',      hints: { beginner: 'Rare',       intermediate: 'Marbling',    advanced: 'Ribeye' } },
      { id: 'food_012', word: 'Salad',      hints: { beginner: 'Greens',     intermediate: 'Dressing',    advanced: 'Vinaigrette' } },
      { id: 'food_013', word: 'Soup',       hints: { beginner: 'Ladle',      intermediate: 'Broth',       advanced: 'Bisque' } },
      { id: 'food_014', word: 'Sandwich',   hints: { beginner: 'Sliced bread',intermediate: 'Filling',    advanced: 'Panino' } },
      { id: 'food_015', word: 'Pancake',    hints: { beginner: 'Syrup',      intermediate: 'Batter',      advanced: 'Crepe' } },
      { id: 'food_016', word: 'Waffle',     hints: { beginner: 'Grid',       intermediate: 'Crispy',      advanced: 'Iron' } },
      { id: 'food_017', word: 'Donut',      hints: { beginner: 'Ring',       intermediate: 'Glazed',      advanced: 'Yeast leavened' } },
      { id: 'food_018', word: 'Cake',       hints: { beginner: 'Candle',     intermediate: 'Frosting',    advanced: 'Ganache' } },
      { id: 'food_019', word: 'Pie',        hints: { beginner: 'Crust',      intermediate: 'Filling',     advanced: 'Shortcrust' } },
      { id: 'food_020', word: 'Cookie',     hints: { beginner: 'Dough',      intermediate: 'Crisp edges', advanced: 'Tablespoon drop' } },
      { id: 'food_021', word: 'Muffin',     hints: { beginner: 'Paper cup',  intermediate: 'Dome top',    advanced: 'Leavening' } },
      { id: 'food_022', word: 'Bread',      hints: { beginner: 'Loaf',       intermediate: 'Yeast',       advanced: 'Autolyse' } },
      { id: 'food_023', word: 'Cheese',     hints: { beginner: 'Dairy',      intermediate: 'Aged',        advanced: 'Rennet' } },
      { id: 'food_024', word: 'Bacon',      hints: { beginner: 'Crispy',     intermediate: 'Smoked',      advanced: 'Pork belly' } },
      { id: 'food_025', word: 'Sausage',    hints: { beginner: 'Casing',     intermediate: 'Banger',      advanced: 'Emulsified' } },
      { id: 'food_026', word: 'Egg',        hints: { beginner: 'Yolk',       intermediate: 'Albumin',     advanced: 'Coagulation' } },
      { id: 'food_027', word: 'Apple',      hints: { beginner: 'Orchard',    intermediate: 'Pectin',      advanced: 'Pomaceous' } },
      { id: 'food_028', word: 'Banana',     hints: { beginner: 'Yellow',     intermediate: 'Potassium',   advanced: 'Cavendish' } },
      { id: 'food_029', word: 'Orange',     hints: { beginner: 'Peel',       intermediate: 'Citrus',      advanced: 'Zest' } },
    ]
  },
  sports: {
    label: 'Sports',
    emoji: '⚽',
    entries: [
      { id: 'sports_000', word: 'Chess',         hints: { beginner: 'Checkmate',   intermediate: 'Gambit',      advanced: 'Zugzwang' } },
      { id: 'sports_001', word: 'Surfing',       hints: { beginner: 'Wave',        intermediate: 'Barrel',      advanced: 'Cutback' } },
      { id: 'sports_002', word: 'Fencing',       hints: { beginner: 'Sword',       intermediate: 'Parry',       advanced: 'Épée' } },
      { id: 'sports_003', word: 'Archery',       hints: { beginner: 'Arrow',       intermediate: 'Bullseye',    advanced: 'Draw weight' } },
      { id: 'sports_004', word: 'Polo',          hints: { beginner: 'Horse',       intermediate: 'Mallet',      advanced: 'Chukker' } },
      { id: 'sports_005', word: 'Curling',       hints: { beginner: 'Ice',         intermediate: 'Stone',       advanced: 'Sweeping' } },
      { id: 'sports_006', word: 'Skydiving',     hints: { beginner: 'Parachute',   intermediate: 'Freefall',    advanced: 'Altimeter' } },
      { id: 'sports_007', word: 'Gymnastics',    hints: { beginner: 'Flip',        intermediate: 'Parallel bars',advanced: 'Pommel' } },
      { id: 'sports_008', word: 'Bobsled',       hints: { beginner: 'Ice track',   intermediate: 'Velocity',    advanced: 'G-force' } },
      { id: 'sports_009', word: 'Rowing',        hints: { beginner: 'Oar',         intermediate: 'Stroke rate', advanced: 'Ergometer' } },
      { id: 'sports_010', word: 'Football',      hints: { beginner: 'Touchdown',   intermediate: 'Blitz',       advanced: 'Gridiron' } },
      { id: 'sports_011', word: 'Basketball',    hints: { beginner: 'Dribble',     intermediate: 'Rebound',     advanced: 'Pick and roll' } },
      { id: 'sports_012', word: 'Tennis',        hints: { beginner: 'Racket',      intermediate: 'Deuce',       advanced: 'Topspin' } },
      { id: 'sports_013', word: 'Baseball',      hints: { beginner: 'Pitcher',     intermediate: 'Inning',      advanced: 'ERA' } },
      { id: 'sports_014', word: 'Golf',          hints: { beginner: 'Club',        intermediate: 'Birdie',      advanced: 'Stimpmeter' } },
      { id: 'sports_015', word: 'Volleyball',    hints: { beginner: 'Spike',       intermediate: 'Block',       advanced: 'Libero' } },
      { id: 'sports_016', word: 'Table Tennis',  hints: { beginner: 'Paddle',      intermediate: 'Spin',        advanced: 'Penhold' } },
      { id: 'sports_017', word: 'Badminton',     hints: { beginner: 'Shuttlecock', intermediate: 'Smash',       advanced: 'Hairpin net' } },
      { id: 'sports_018', word: 'Rugby',         hints: { beginner: 'Scrum',       intermediate: 'Try',         advanced: 'Lineout' } },
      { id: 'sports_019', word: 'Cricket',       hints: { beginner: 'Wicket',      intermediate: 'Over',        advanced: 'LBW' } },
      { id: 'sports_020', word: 'Hockey',        hints: { beginner: 'Puck',        intermediate: 'Power play',  advanced: 'Penalty shot' } },
      { id: 'sports_021', word: 'Boxing',        hints: { beginner: 'Glove',       intermediate: 'Jab',         advanced: 'Southpaw' } },
      { id: 'sports_022', word: 'Wrestling',     hints: { beginner: 'Pin',         intermediate: 'Takedown',    advanced: 'Sprawl' } },
      { id: 'sports_023', word: 'Martial Arts',  hints: { beginner: 'Belt',        intermediate: 'Stance',      advanced: 'Kata' } },
      { id: 'sports_024', word: 'Swimming',      hints: { beginner: 'Goggles',     intermediate: 'Stroke',      advanced: 'Tumble turn' } },
      { id: 'sports_025', word: 'Cycling',       hints: { beginner: 'Pedal',       intermediate: 'Cadence',     advanced: 'Peloton' } },
      { id: 'sports_026', word: 'Athletics',     hints: { beginner: 'Track',       intermediate: 'Starting blocks',advanced: 'PB' } },
      { id: 'sports_027', word: 'Weightlifting', hints: { beginner: 'Barbell',     intermediate: 'Clean and jerk',advanced: 'Snatch' } },
      { id: 'sports_028', word: 'Skiing',        hints: { beginner: 'Slope',       intermediate: 'Slalom',      advanced: 'Schuss' } },
      { id: 'sports_029', word: 'Snowboarding',  hints: { beginner: 'Halfpipe',    intermediate: 'Carve',       advanced: 'Switch stance' } },
    ]
  },
  technology: {
    label: 'Technology',
    emoji: '💻',
    entries: [
      { id: 'technology_000', word: 'Drone',           hints: { beginner: 'Propeller',  intermediate: 'FPV',         advanced: 'Gimbal' } },
      { id: 'technology_001', word: 'Blockchain',      hints: { beginner: 'Ledger',     intermediate: 'Hash',        advanced: 'Immutable' } },
      { id: 'technology_002', word: 'Satellite',       hints: { beginner: 'Orbit',      intermediate: 'Signal',      advanced: 'Transponder' } },
      { id: 'technology_003', word: 'Laser',           hints: { beginner: 'Beam',       intermediate: 'Coherent',    advanced: 'Stimulated emission' } },
      { id: 'technology_004', word: 'Robot',           hints: { beginner: 'Actuator',   intermediate: 'Servo',       advanced: 'Degrees of freedom' } },
      { id: 'technology_005', word: 'Algorithm',       hints: { beginner: 'Steps',      intermediate: 'Complexity',  advanced: 'Heuristic' } },
      { id: 'technology_006', word: 'Encryption',      hints: { beginner: 'Key',        intermediate: 'Cipher',      advanced: 'AES' } },
      { id: 'technology_007', word: 'Neural Net',      hints: { beginner: 'Training',   intermediate: 'Layer',       advanced: 'Backpropagation' } },
      { id: 'technology_008', word: 'VR Headset',      hints: { beginner: 'Immersive',  intermediate: 'Latency',     advanced: 'Fresnel lens' } },
      { id: 'technology_009', word: 'Quantum Computer',hints: { beginner: 'Qubit',      intermediate: 'Entanglement',advanced: 'Superposition' } },
      { id: 'technology_010', word: 'Smartphone',      hints: { beginner: 'Touchscreen',intermediate: 'SoC',         advanced: 'Modem baseband' } },
      { id: 'technology_011', word: 'Tablet',          hints: { beginner: 'Stylus',     intermediate: 'Retina',      advanced: 'Form factor' } },
      { id: 'technology_012', word: 'Laptop',          hints: { beginner: 'Portable',   intermediate: 'Thermal',     advanced: 'TDP' } },
      { id: 'technology_013', word: 'Smartwatch',      hints: { beginner: 'Wrist',      intermediate: 'Heart rate',  advanced: 'ECG sensor' } },
      { id: 'technology_014', word: 'Camera',          hints: { beginner: 'Shutter',    intermediate: 'Aperture',    advanced: 'Bokeh' } },
      { id: 'technology_015', word: 'Microphone',      hints: { beginner: 'Capsule',    intermediate: 'Cardioid',    advanced: 'Phantom power' } },
      { id: 'technology_016', word: 'Speaker',         hints: { beginner: 'Woofer',     intermediate: 'Crossover',   advanced: 'Impedance' } },
      { id: 'technology_017', word: 'Headphones',      hints: { beginner: 'Ear cup',    intermediate: 'Driver',      advanced: 'Planar magnetic' } },
      { id: 'technology_018', word: 'Router',          hints: { beginner: 'Wi-Fi',      intermediate: 'Packet',      advanced: 'NAT' } },
      { id: 'technology_019', word: 'Modem',           hints: { beginner: 'DSL',        intermediate: 'Bandwidth',   advanced: 'Upstream' } },
      { id: 'technology_020', word: 'Server',          hints: { beginner: 'Rack',       intermediate: 'Uptime',      advanced: 'Redundancy' } },
      { id: 'technology_021', word: 'Database',        hints: { beginner: 'Table',      intermediate: 'Query',       advanced: 'ACID' } },
      { id: 'technology_022', word: 'Cloud',           hints: { beginner: 'Storage',    intermediate: 'Scalable',    advanced: 'Elastic compute' } },
      { id: 'technology_023', word: 'Network',         hints: { beginner: 'Cable',      intermediate: 'Protocol',    advanced: 'Topology' } },
      { id: 'technology_024', word: 'Software',        hints: { beginner: 'Code',       intermediate: 'Compile',     advanced: 'Runtime' } },
      { id: 'technology_025', word: 'Hardware',        hints: { beginner: 'Circuit',    intermediate: 'Silicon',     advanced: 'Lithography' } },
      { id: 'technology_026', word: 'Processor',       hints: { beginner: 'GHz',        intermediate: 'Core',        advanced: 'Pipeline' } },
      { id: 'technology_027', word: 'Memory',          hints: { beginner: 'RAM',        intermediate: 'Cache',       advanced: 'Volatile' } },
      { id: 'technology_028', word: 'Battery',         hints: { beginner: 'Charge',     intermediate: 'mAh',         advanced: 'Lithium-ion' } },
      { id: 'technology_029', word: 'Screen',          hints: { beginner: 'Pixel',      intermediate: 'Refresh rate',advanced: 'OLED' } },
    ]
  },
  movies: {
    label: 'Movies',
    emoji: '🎬',
    entries: [
      { id: 'movies_000', word: 'Heist Film',    hints: { beginner: 'Vault',      intermediate: 'Crew',        advanced: 'Caper' } },
      { id: 'movies_001', word: 'Western',       hints: { beginner: 'Cowboy',     intermediate: 'Showdown',    advanced: 'Spaghetti' } },
      { id: 'movies_002', word: 'Musical',       hints: { beginner: 'Singing',    intermediate: 'Choreography',advanced: 'Libretto' } },
      { id: 'movies_003', word: 'Documentary',   hints: { beginner: 'Real events',intermediate: 'Archive',     advanced: 'Verite' } },
      { id: 'movies_004', word: 'Horror',        hints: { beginner: 'Jumpscare',  intermediate: 'Slasher',     advanced: 'Dread' } },
      { id: 'movies_005', word: 'Sci-Fi',        hints: { beginner: 'Spaceship',  intermediate: 'Dystopia',    advanced: 'Speculative' } },
      { id: 'movies_006', word: 'Noir',          hints: { beginner: 'Detective',  intermediate: 'Shadows',     advanced: 'Femme fatale' } },
      { id: 'movies_007', word: 'Mockumentary',  hints: { beginner: 'Fake doc',   intermediate: 'Interview',   advanced: 'Satire' } },
      { id: 'movies_008', word: 'Anime',         hints: { beginner: 'Subtitles',  intermediate: 'Studio Ghibli',advanced: 'Cel shading' } },
      { id: 'movies_009', word: 'Thriller',      hints: { beginner: 'Suspense',   intermediate: 'Chase',       advanced: 'MacGuffin' } },
      { id: 'movies_010', word: 'Action',        hints: { beginner: 'Explosion',  intermediate: 'Stunt',       advanced: 'Practical FX' } },
      { id: 'movies_011', word: 'Comedy',        hints: { beginner: 'Laugh',      intermediate: 'Timing',      advanced: 'Slapstick' } },
      { id: 'movies_012', word: 'Drama',         hints: { beginner: 'Emotion',    intermediate: 'Conflict',    advanced: 'Catharsis' } },
      { id: 'movies_013', word: 'Romance',       hints: { beginner: 'Kiss',       intermediate: 'Meet-cute',   advanced: 'Trope' } },
      { id: 'movies_014', word: 'Fantasy',       hints: { beginner: 'Magic',      intermediate: 'Quest',       advanced: 'World-building' } },
      { id: 'movies_015', word: 'Adventure',     hints: { beginner: 'Journey',    intermediate: 'Discovery',   advanced: 'Narrative arc' } },
      { id: 'movies_016', word: 'Mystery',       hints: { beginner: 'Clue',       intermediate: 'Whodunit',    advanced: 'Red herring' } },
      { id: 'movies_017', word: 'Crime',         hints: { beginner: 'Evidence',   intermediate: 'Motive',      advanced: 'Procedural' } },
      { id: 'movies_018', word: 'Family',        hints: { beginner: 'Kids',       intermediate: 'G-rated',     advanced: 'Ensemble' } },
      { id: 'movies_019', word: 'Animation',     hints: { beginner: 'Cartoon',    intermediate: 'Frame rate',  advanced: 'Keyframe' } },
      { id: 'movies_020', word: 'Biography',     hints: { beginner: 'Life story', intermediate: 'Biopic',      advanced: 'Dramatised' } },
      { id: 'movies_021', word: 'History',       hints: { beginner: 'Period',     intermediate: 'Costume',     advanced: 'Anachronism' } },
      { id: 'movies_022', word: 'War',           hints: { beginner: 'Battle',     intermediate: 'Trench',      advanced: 'Propaganda' } },
      { id: 'movies_023', word: 'Sport',         hints: { beginner: 'Training',   intermediate: 'Underdog',    advanced: 'Redemption arc' } },
      { id: 'movies_024', word: 'Music',         hints: { beginner: 'Concert',    intermediate: 'Biopic',      advanced: 'Docufilm' } },
      { id: 'movies_025', word: 'Short',         hints: { beginner: 'Brief',      intermediate: 'Festival',    advanced: 'Palme d\'Or' } },
      { id: 'movies_026', word: 'Silent',        hints: { beginner: 'No sound',   intermediate: 'Title card',  advanced: 'Intertitle' } },
      { id: 'movies_027', word: 'Indie',         hints: { beginner: 'Low budget', intermediate: 'Sundance',    advanced: 'Auteur' } },
      { id: 'movies_028', word: 'Blockbuster',   hints: { beginner: 'Opening week',intermediate: 'Franchise',  advanced: 'P&A spend' } },
      { id: 'movies_029', word: 'Cult Classic',  hints: { beginner: 'Midnight show',intermediate: 'Niche',     advanced: 'Zeitgeist' } },
    ]
  },
  simple_words: {
    label: 'Simple Words',
    emoji: '📝',
    entries: [
      { id: 'simple_words_000', word: 'Dog',       hints: { beginner: 'Bark',      intermediate: 'Loyal',       advanced: 'Canine' } },
      { id: 'simple_words_001', word: 'Cat',       hints: { beginner: 'Meow',      intermediate: 'Pounce',      advanced: 'Feline' } },
      { id: 'simple_words_002', word: 'Bird',      hints: { beginner: 'Wings',     intermediate: 'Migration',   advanced: 'Avian' } },
      { id: 'simple_words_003', word: 'Fish',      hints: { beginner: 'Scales',    intermediate: 'Gill',        advanced: 'Aquatic' } },
      { id: 'simple_words_004', word: 'Tree',      hints: { beginner: 'Bark',      intermediate: 'Deciduous',   advanced: 'Cambium' } },
      { id: 'simple_words_005', word: 'Flower',    hints: { beginner: 'Petal',     intermediate: 'Pollinate',   advanced: 'Anther' } },
      { id: 'simple_words_006', word: 'Sun',       hints: { beginner: 'Bright',    intermediate: 'Nuclear',     advanced: 'Photosphere' } },
      { id: 'simple_words_007', word: 'Moon',      hints: { beginner: 'Crescent',  intermediate: 'Tidal',       advanced: 'Perigee' } },
      { id: 'simple_words_008', word: 'Star',      hints: { beginner: 'Twinkle',   intermediate: 'Fusion',      advanced: 'Magnitude' } },
      { id: 'simple_words_009', word: 'Cloud',     hints: { beginner: 'Fluffy',    intermediate: 'Cumulus',     advanced: 'Condensation' } },
      { id: 'simple_words_010', word: 'Rain',      hints: { beginner: 'Drops',     intermediate: 'Precipitation',advanced: 'Orographic' } },
      { id: 'simple_words_011', word: 'Snow',      hints: { beginner: 'Flake',     intermediate: 'Powder',      advanced: 'Dendrite' } },
      { id: 'simple_words_012', word: 'Wind',      hints: { beginner: 'Breeze',    intermediate: 'Pressure',    advanced: 'Coriolis' } },
      { id: 'simple_words_013', word: 'Fire',      hints: { beginner: 'Flame',     intermediate: 'Combustion',  advanced: 'Exothermic' } },
      { id: 'simple_words_014', word: 'Water',     hints: { beginner: 'Wet',       intermediate: 'Solvent',     advanced: 'H2O' } },
      { id: 'simple_words_015', word: 'Earth',     hints: { beginner: 'Soil',      intermediate: 'Crust',       advanced: 'Lithosphere' } },
      { id: 'simple_words_016', word: 'Rock',      hints: { beginner: 'Hard',      intermediate: 'Mineral',     advanced: 'Sedimentary' } },
      { id: 'simple_words_017', word: 'Sand',      hints: { beginner: 'Grainy',    intermediate: 'Quartz',      advanced: 'Aeolian' } },
      { id: 'simple_words_018', word: 'Dirt',      hints: { beginner: 'Brown',     intermediate: 'Topsoil',     advanced: 'Humus' } },
      { id: 'simple_words_019', word: 'Grass',     hints: { beginner: 'Green',     intermediate: 'Lawn',        advanced: 'Chlorophyll' } },
      { id: 'simple_words_020', word: 'Leaf',      hints: { beginner: 'Green',     intermediate: 'Vein',        advanced: 'Stomata' } },
      { id: 'simple_words_021', word: 'Branch',    hints: { beginner: 'Limb',      intermediate: 'Fork',        advanced: 'Lateral' } },
      { id: 'simple_words_022', word: 'Root',      hints: { beginner: 'Underground',intermediate: 'Absorb',     advanced: 'Taproot' } },
      { id: 'simple_words_023', word: 'Seed',      hints: { beginner: 'Sprout',    intermediate: 'Dormant',     advanced: 'Germinate' } },
      { id: 'simple_words_024', word: 'Fruit',     hints: { beginner: 'Sweet',     intermediate: 'Ripening',    advanced: 'Drupe' } },
      { id: 'simple_words_025', word: 'Nut',       hints: { beginner: 'Crunchy',   intermediate: 'Shell',       advanced: 'Indehiscent' } },
      { id: 'simple_words_026', word: 'Berry',     hints: { beginner: 'Small',     intermediate: 'Antioxidant', advanced: 'Drupe' } },
      { id: 'simple_words_027', word: 'Vegetable', hints: { beginner: 'Edible',    intermediate: 'Starchy',     advanced: 'Cultivar' } },
      { id: 'simple_words_028', word: 'Meat',      hints: { beginner: 'Protein',   intermediate: 'Muscle',      advanced: 'Myoglobin' } },
      { id: 'simple_words_029', word: 'Bone',      hints: { beginner: 'Skeleton',  intermediate: 'Marrow',      advanced: 'Ossification' } },
    ]
  },
  clothing: {
    label: 'Clothing',
    emoji: '👕',
    entries: [
      { id: 'clothing_000', word: 'Shirt',      hints: { beginner: 'Button',     intermediate: 'Collar',      advanced: 'Oxford cloth' } },
      { id: 'clothing_001', word: 'Pants',      hints: { beginner: 'Waistband',  intermediate: 'Inseam',      advanced: 'Rise' } },
      { id: 'clothing_002', word: 'Dress',      hints: { beginner: 'Hem',        intermediate: 'Silhouette',  advanced: 'Bodice' } },
      { id: 'clothing_003', word: 'Skirt',      hints: { beginner: 'Flare',      intermediate: 'Pleats',      advanced: 'A-line' } },
      { id: 'clothing_004', word: 'Jacket',     hints: { beginner: 'Lapel',      intermediate: 'Lining',      advanced: 'Construction' } },
      { id: 'clothing_005', word: 'Coat',       hints: { beginner: 'Warm',       intermediate: 'Wool',        advanced: 'Overcoat' } },
      { id: 'clothing_006', word: 'Sweater',    hints: { beginner: 'Knit',       intermediate: 'Cable',       advanced: 'Gauge' } },
      { id: 'clothing_007', word: 'Hoodie',     hints: { beginner: 'Drawstring', intermediate: 'Kangaroo pocket',advanced: 'Streetwear' } },
      { id: 'clothing_008', word: 'T-shirt',    hints: { beginner: 'Crew neck',  intermediate: 'Jersey',      advanced: 'Ringspun' } },
      { id: 'clothing_009', word: 'Jeans',      hints: { beginner: 'Denim',      intermediate: 'Warp',        advanced: 'Selvedge' } },
      { id: 'clothing_010', word: 'Shorts',     hints: { beginner: 'Knee',       intermediate: 'Chino',       advanced: 'Inseam length' } },
      { id: 'clothing_011', word: 'Socks',      hints: { beginner: 'Elastic',    intermediate: 'Crew',        advanced: 'Denier' } },
      { id: 'clothing_012', word: 'Shoes',      hints: { beginner: 'Sole',       intermediate: 'Last',        advanced: 'Welt' } },
      { id: 'clothing_013', word: 'Boots',      hints: { beginner: 'Ankle',      intermediate: 'Shaft',       advanced: 'Goodyear welt' } },
      { id: 'clothing_014', word: 'Sneakers',   hints: { beginner: 'Rubber sole',intermediate: 'Midsole',     advanced: 'Colourway' } },
      { id: 'clothing_015', word: 'Sandals',    hints: { beginner: 'Strap',      intermediate: 'Open toe',    advanced: 'Insole' } },
      { id: 'clothing_016', word: 'Hat',        hints: { beginner: 'Brim',       intermediate: 'Crown',       advanced: 'Millinery' } },
      { id: 'clothing_017', word: 'Cap',        hints: { beginner: 'Visor',      intermediate: 'Snapback',    advanced: 'Six-panel' } },
      { id: 'clothing_018', word: 'Beanie',     hints: { beginner: 'Woollen',    intermediate: 'Cuffed',      advanced: 'Rib knit' } },
      { id: 'clothing_019', word: 'Scarf',      hints: { beginner: 'Wrap',       intermediate: 'Cashmere',    advanced: 'Fringe' } },
      { id: 'clothing_020', word: 'Gloves',     hints: { beginner: 'Fingers',    intermediate: 'Seam',        advanced: 'Gauntlet' } },
      { id: 'clothing_021', word: 'Mittens',    hints: { beginner: 'Thumbhole',  intermediate: 'Insulated',   advanced: 'Fleece lined' } },
      { id: 'clothing_022', word: 'Belt',       hints: { beginner: 'Buckle',     intermediate: 'Leather',     advanced: 'Keeper loop' } },
      { id: 'clothing_023', word: 'Tie',        hints: { beginner: 'Knot',       intermediate: 'Silk',        advanced: 'Four-in-hand' } },
      { id: 'clothing_024', word: 'Bow Tie',    hints: { beginner: 'Formal',     intermediate: 'Clip-on',     advanced: 'Self-tie' } },
      { id: 'clothing_025', word: 'Glasses',    hints: { beginner: 'Lens',       intermediate: 'Frame',       advanced: 'Dioptre' } },
      { id: 'clothing_026', word: 'Sunglasses', hints: { beginner: 'UV',         intermediate: 'Polarised',   advanced: 'Wraparound' } },
      { id: 'clothing_027', word: 'Watch',      hints: { beginner: 'Dial',       intermediate: 'Movement',    advanced: 'Escapement' } },
      { id: 'clothing_028', word: 'Ring',       hints: { beginner: 'Finger',     intermediate: 'Band',        advanced: 'Bezel' } },
      { id: 'clothing_029', word: 'Necklace',   hints: { beginner: 'Chain',      intermediate: 'Pendant',     advanced: 'Clasp' } },
    ]
  },
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/categories.js
git commit -m "feat: replace placeholder hints with real contextual one-word clues per difficulty"
```

---

## Task 2: Overhaul gameStore.js

**Files:**
- Modify: `src/store/gameStore.js`

Key changes:
1. Remove `rounds` from `settings`.
2. Add `sessionIndex: 0` to state (incremented each time a full "game session" starts via `startGame` or `playAgain`).
3. Add `roundStartPlayerIndex: 0` — which player index starts getting the first reveal. For session N, this is `N % players.length`.
4. `startGame` and `playAgain` set `currentRevealIndex` to `roundStartPlayerIndex` and use `roundStartPlayerIndex` as the first player in the reveal order. The `revealNext` function cycles from `roundStartPlayerIndex` forward (wrapping), hitting all players.
5. `tallyVotes`: after tallying, determine game-over conditions:
   - If spy voted out → `screen: 'results'` (existing), spy gets chance to guess
   - If the last non-spy player is voted out (spy is the only one left) → spy wins without guessing → `screen: 'results'` with a `spyWon: true` flag
6. Add `activePlayers` array (players still in game, i.e. not voted out). Initially = all players. When someone is voted out they are removed. For now, treat every round as resetting activePlayers (the current design doesn't eliminate players per round — re-read the spec).

**Re-reading the spec carefully:**
- "we vote someone out. If that person is not the spy, they get voted out, everyone except them is still in the game and we do another round."
- "spy is the last one that survives" = spy wins if they are the last player not voted out
- "find the spy" → crewmates win

So: voted-out players are **eliminated across rounds**. We need an `eliminatedPlayerIds` set. Each round, the eliminated players don't get a reveal and can't vote.

7. Revise `nextRound`:
   - No round cap check
   - New word + new spy assignment among `activePlayers` (not eliminatedPlayerIds)
   - `currentRevealIndex` starts at `roundStartPlayerIndex` but skips eliminated players
   - If only 1 active player remains after voting someone out AND that player is the spy → spy wins
   - If after voting out a non-spy, only spies remain among activePlayers → spy wins

8. `spyGuess` result: if correct → spy wins (extra points). The game ends.

9. New action: `endGame(winner)` where winner is `'spy'` | `'crewmates'` → sets `screen: 'final'` with a `winner` field in state.

- [ ] **Step 1: Rewrite gameStore.js**

Full replacement content:

```js
import { create } from 'zustand'
export { WORD_BANK } from '../data/categories.js'
import { WORD_BANK } from '../data/categories.js'

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

// Build ordered reveal list starting from startIndex, cycling through activePlayers
function buildRevealOrder(allPlayers, eliminatedIds, startIndex) {
  const active = allPlayers.filter(p => !eliminatedIds.has(p.id))
  if (!active.length) return active
  // find the position of startIndex player in active
  const startPlayerId = allPlayers[startIndex % allPlayers.length]?.id
  const pivotIdx = active.findIndex(p => p.id === startPlayerId)
  const pivot = pivotIdx === -1 ? 0 : pivotIdx
  return [...active.slice(pivot), ...active.slice(0, pivot)]
}

const INITIAL_STATE = {
  screen: 'home',
  players: [],           // all players ever added (roster)
  eliminatedIds: [],     // ids of players voted out this game session
  settings: {
    numSpies: 1,
    timerMinutes: 5,
    hintLevel: 'beginner',
    selectedCategories: [],
    disabledWords: {},
  },
  sessionIndex: 0,       // increments each playAgain / startGame
  currentRound: 0,
  revealOrder: [],       // ordered player list for current round reveal
  currentRevealIndex: 0, // index into revealOrder
  secretWord: null,
  spyHint: null,
  votes: {},
  roundResults: [],
  winner: null,          // 'spy' | 'crewmates' | null
}

export const useGameStore = create((set, get) => ({
  ...INITIAL_STATE,
  eliminatedIds: [],

  setScreen: (screen) => set({ screen }),

  addPlayer: (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    set(state => ({
      players: [...state.players, { id: generateId(), name: trimmed, role: null, score: 0, votedFor: null }],
    }))
  },

  removePlayer: (id) => set(state => ({ players: state.players.filter(p => p.id !== id) })),

  updateSettings: (partial) => set(state => ({ settings: { ...state.settings, ...partial } })),

  toggleWord: (categoryId, wordId) => set(state => {
    const disabled = state.settings.disabledWords[categoryId] || []
    const newDisabled = disabled.includes(wordId)
      ? disabled.filter(id => id !== wordId)
      : [...disabled, wordId]
    return { settings: { ...state.settings, disabledWords: { ...state.settings.disabledWords, [categoryId]: newDisabled } } }
  }),

  toggleAllWords: (categoryId, isEnabled) => set(state => {
    const cat = WORD_BANK[categoryId]
    if (!cat) return state
    const allIds = cat.entries.map(e => e.id)
    return { settings: { ...state.settings, disabledWords: { ...state.settings.disabledWords, [categoryId]: isEnabled ? [] : allIds } } }
  }),

  // ── Game lifecycle ───────────────────────────────────────────────

  startGame: () => {
    const { players, settings, sessionIndex } = get()
    const { numSpies, selectedCategories, hintLevel, disabledWords } = settings
    const entry = pickRandomEntry(selectedCategories, disabledWords)
    if (!entry || players.length < 3) return

    const eliminatedIds = new Set()
    const safeSpiCount = Math.min(numSpies, players.length - 1)
    const startIdx = sessionIndex % players.length
    const revealOrder = buildRevealOrder(players, eliminatedIds, startIdx)
    const assignedPlayers = assignRoles(players.map(p => ({ ...p, role: null, votedFor: null })), safeSpiCount)
    // sync roles into revealOrder
    const roleMap = Object.fromEntries(assignedPlayers.map(p => [p.id, p.role]))
    const orderedWithRoles = revealOrder.map(p => ({ ...p, role: roleMap[p.id] }))

    set({
      players: assignedPlayers,
      eliminatedIds: [],
      revealOrder: orderedWithRoles,
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

  revealNext: () => {
    const { currentRevealIndex, revealOrder } = get()
    const next = currentRevealIndex + 1
    if (next >= revealOrder.length) {
      set({ screen: 'play' })
    } else {
      set({ currentRevealIndex: next })
    }
  },

  castVote: (voterId, targetId) =>
    set(state => ({
      votes: { ...state.votes, [voterId]: targetId },
      players: state.players.map(p => p.id === voterId ? { ...p, votedFor: targetId } : p),
    })),

  tallyVotes: () => {
    const { votes, players, eliminatedIds, currentRound, settings } = get()
    const eliminatedSet = new Set(eliminatedIds)
    const activePlayers = players.filter(p => !eliminatedSet.has(p.id))

    // Tally
    const tally = {}
    for (const targetId of Object.values(votes)) {
      tally[targetId] = (tally[targetId] ?? 0) + 1
    }
    const maxVotes = Object.values(tally).length ? Math.max(...Object.values(tally)) : 0
    const topIds = Object.keys(tally).filter(id => tally[id] === maxVotes)
    const votedOutId = topIds[Math.floor(Math.random() * topIds.length)] ?? null
    const votedOut = activePlayers.find(p => p.id === votedOutId) ?? null
    const spyVotedOut = votedOut?.role === 'spy'

    // Update eliminated list
    const newEliminatedIds = votedOutId ? [...eliminatedIds, votedOutId] : [...eliminatedIds]
    const newEliminatedSet = new Set(newEliminatedIds)
    const remainingPlayers = players.filter(p => !newEliminatedSet.has(p.id))
    const remainingSpies = remainingPlayers.filter(p => p.role === 'spy')
    const remainingInnocents = remainingPlayers.filter(p => p.role === 'innocent')

    // Determine win condition
    let winner = null
    if (spyVotedOut) {
      // crewmates win — spy gets chance to guess word (handled in results screen)
      winner = null // will be set after spyGuess or if spy skips
    } else if (remainingSpies.length > 0 && remainingInnocents.length === 0) {
      // spy is last survivor — spy wins immediately
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
      roundResults: [...state.roundResults, { round: currentRound, type: 'vote', votedOut, spyVotedOut, winner }],
      winner,
      screen: 'results',
    }))

    return votedOut
  },

  spyGuess: (word) => {
    const { secretWord, players, currentRound } = get()
    const correct = word.trim().toLowerCase() === secretWord.toLowerCase()

    // If correct, spy wins
    const winner = correct ? 'spy' : 'crewmates'

    const updatedPlayers = players.map(p => {
      if (correct && p.role === 'spy') return { ...p, score: p.score + 3 }
      if (!correct && p.role === 'innocent') return { ...p, score: p.score + 1 }
      return p
    })

    set(state => ({
      players: updatedPlayers,
      winner,
      roundResults: [...state.roundResults, { round: currentRound, type: 'spyGuess', guessedWord: word.trim(), secretWord, correct, winner }],
      screen: 'results',
    }))

    return correct
  },

  // Called from ResultsScreen when no spy guess or game-over condition reached
  // Goes to scoreboard (mid-round), then next round starts from there
  nextRound: () => {
    const { winner } = get()
    if (winner) {
      set({ screen: 'final' })
      return
    }
    // Show mid-round scoreboard before next round
    set({ screen: 'scoreboard' })
  },

  // Called from mid-round ScoreboardScreen to actually start next round
  startNextRound: () => {
    const { currentRound, settings, players, eliminatedIds, sessionIndex } = get()
    const { numSpies, selectedCategories, hintLevel, disabledWords } = settings
    const entry = pickRandomEntry(selectedCategories, disabledWords)
    if (!entry) return

    const eliminatedSet = new Set(eliminatedIds)
    const activePlayers = players.filter(p => !eliminatedSet.has(p.id))

    // Next start player: (sessionIndex + currentRound) % activePlayers.length
    const startIdx = (sessionIndex + currentRound) % players.length
    const revealOrder = buildRevealOrder(players, eliminatedSet, startIdx)

    const resetActive = activePlayers.map(p => ({ ...p, role: null, votedFor: null }))
    const allReset = players.map(p => ({ ...p, role: null, votedFor: null }))
    const safeSpiCount = Math.min(numSpies, activePlayers.length - 1)
    const assignedActive = assignRoles(resetActive, safeSpiCount)
    const roleMap = Object.fromEntries(assignedActive.map(p => [p.id, p.role]))
    const allAssigned = allReset.map(p => ({ ...p, role: roleMap[p.id] ?? p.role }))
    const orderedWithRoles = revealOrder.map(p => {
      const found = allAssigned.find(ap => ap.id === p.id)
      return found ?? p
    })

    set({
      players: allAssigned,
      revealOrder: orderedWithRoles,
      secretWord: entry.word,
      spyHint: hintLevel === 'none' ? null : (entry.hints[hintLevel] ?? entry.hints.intermediate),
      currentRound: currentRound + 1,
      currentRevealIndex: 0,
      votes: {},
      winner: null,
      screen: 'reveal',
    })
  },

  endGame: () => set({ screen: 'final' }),

  resetGame: () => set({ ...INITIAL_STATE, eliminatedIds: [] }),

  playAgain: () => {
    const { players, settings, sessionIndex } = get()
    const { numSpies, selectedCategories, hintLevel, disabledWords } = settings
    const entry = pickRandomEntry(selectedCategories, disabledWords)
    if (!entry || players.length < 3) return

    const newSessionIndex = sessionIndex + 1
    const startIdx = newSessionIndex % players.length
    const eliminatedSet = new Set()
    const revealOrder = buildRevealOrder(players, eliminatedSet, startIdx)
    const resetPlayers = players.map(p => ({ ...p, score: 0, role: null, votedFor: null }))
    const assignedPlayers = assignRoles(resetPlayers, Math.min(numSpies, players.length - 1))
    const roleMap = Object.fromEntries(assignedPlayers.map(p => [p.id, p.role]))
    const orderedWithRoles = revealOrder.map(p => ({ ...p, role: roleMap[p.id] }))

    set({
      players: assignedPlayers,
      eliminatedIds: [],
      revealOrder: orderedWithRoles,
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
```

- [ ] **Step 2: Commit**

```bash
git add src/store/gameStore.js
git commit -m "feat: overhaul game store — infinite rounds, session rotation, elimination, spy-wins condition"
```

---

## Task 3: Update App.jsx — add `scoreboard` screen

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add scoreboard screen mapping**

```jsx
import { useGameStore } from './store/gameStore'
import HomeScreen from './screens/HomeScreen'
import SetupScreen from './screens/SetupScreen'
import RoleRevealScreen from './screens/RoleRevealScreen'
import DiscussionScreen from './screens/DiscussionScreen'
import VotingScreen from './screens/VotingScreen'
import ResultsScreen from './screens/ResultsScreen'
import ScoreboardScreen from './screens/ScoreboardScreen'
import './App.css'

const SCREENS = {
  home:        HomeScreen,
  setup:       SetupScreen,
  reveal:      RoleRevealScreen,
  play:        DiscussionScreen,
  vote:        VotingScreen,
  results:     ResultsScreen,
  scoreboard:  ScoreboardScreen,   // mid-round scoreboard
  final:       ScoreboardScreen,   // end-game scoreboard
}

function App() {
  const screen = useGameStore((s) => s.screen)
  const Screen = SCREENS[screen] ?? HomeScreen
  return (
    <div key={screen} className="animate-fade-in" style={{ height: '100svh' }}>
      <Screen />
    </div>
  )
}

export default App
```

- [ ] **Step 2: Commit**

```bash
git add src/App.jsx
git commit -m "feat: route scoreboard screen in App"
```

---

## Task 4: Update SetupScreen — remove Rounds setting

**Files:**
- Modify: `src/screens/SetupScreen.jsx`

Remove the entire "Rounds" `<div className="setting-row">` block (lines 111-124 in current file). No other changes needed — `rounds` is just gone from settings.

- [ ] **Step 1: Delete the Rounds setting row from SetupScreen.jsx**

Remove this block from the JSX:
```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/SetupScreen.jsx
git commit -m "feat: remove rounds setting from setup — game now plays infinite rounds"
```

---

## Task 5: Update RoleRevealScreen — use revealOrder + neutral card design

**Files:**
- Modify: `src/screens/RoleRevealScreen.jsx`
- Modify: `src/screens/RoleRevealScreen.css`

Key changes:
1. Use `revealOrder` from store instead of `players` for the reveal sequence, and `currentRevealIndex` as index into `revealOrder`.
2. Neutral card design: both spy and crewmate cards use the same dark neutral palette (no red for spy, no green for crewmate). Differentiate with icon + badge text only, not background color.

- [ ] **Step 1: Rewrite RoleRevealScreen.jsx**

```jsx
import { useState } from 'react'
import { useGameStore, WORD_BANK } from '../store/gameStore'
import './RoleRevealScreen.css'

function CoverScreen({ playerName, onReveal }) {
  return (
    <div className="rr-cover animate-fade-in">
      <div className="rr-cover-bg" aria-hidden="true">
        <div className="rr-cover-orb rr-cover-orb-1" />
        <div className="rr-cover-orb rr-cover-orb-2" />
      </div>
      <div className="rr-cover-content">
        <div className="rr-cover-icon">🔒</div>
        <p className="rr-cover-label">Pass the phone to</p>
        <h2 className="rr-cover-name">{playerName}</h2>
        <p className="rr-cover-hint">Make sure nobody else is looking</p>
        <button id="btn-tap-to-reveal" className="rr-reveal-btn" onClick={onReveal} aria-label={`Reveal role for ${playerName}`}>
          <span className="rr-reveal-btn-icon">👁</span>
          Tap to Reveal
        </button>
      </div>
    </div>
  )
}

function CrewmateCard({ secretWord, category }) {
  return (
    <div className="rr-card rr-card-neutral">
      <div className="rr-card-shine" aria-hidden="true" />
      <div className="rr-card-body">
        <div className="rr-card-badge rr-badge-crewmate">CREWMATE</div>
        <div className="rr-card-role-icon">🛡️</div>
        <p className="rr-card-role-label">Your Secret Word</p>
        <h2 className="rr-card-word">{secretWord}</h2>
        {category && (
          <div className="rr-card-category">
            <span className="rr-card-category-label">Category</span>
            <span className="rr-card-category-value">{category}</span>
          </div>
        )}
        <p className="rr-card-tip">Discuss but don't reveal the exact word — a Spy is listening!</p>
      </div>
    </div>
  )
}

function SpyCard({ spyHint }) {
  return (
    <div className="rr-card rr-card-neutral">
      <div className="rr-card-shine" aria-hidden="true" />
      <div className="rr-card-body">
        <div className="rr-card-badge rr-badge-spy">SPY</div>
        <div className="rr-card-role-icon">🕵️</div>
        <h2 className="rr-card-spy-title">YOU ARE THE SPY</h2>
        {spyHint ? (
          <div className="rr-spy-hint-box">
            <p className="rr-spy-hint-label">Your Clue</p>
            <p className="rr-spy-hint-text">{spyHint}</p>
          </div>
        ) : (
          <p className="rr-spy-no-hint">No hint — fly blind, trust your instincts.</p>
        )}
        <p className="rr-card-tip">Blend in, ask clever questions, and figure out the secret word.</p>
      </div>
    </div>
  )
}

function ProgressDots({ total, current }) {
  return (
    <div className="rr-progress" role="progressbar" aria-valuenow={current + 1} aria-valuemax={total}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`rr-progress-dot ${i < current ? 'rr-progress-dot-done' : ''} ${i === current ? 'rr-progress-dot-active' : ''}`} />
      ))}
    </div>
  )
}

export default function RoleRevealScreen() {
  const revealOrder        = useGameStore((s) => s.revealOrder)
  const currentRevealIndex = useGameStore((s) => s.currentRevealIndex)
  const secretWord         = useGameStore((s) => s.secretWord)
  const spyHint            = useGameStore((s) => s.spyHint)
  const revealNext         = useGameStore((s) => s.revealNext)

  const [phase, setPhase] = useState('cover')

  const currentPlayer = revealOrder[currentRevealIndex] ?? null
  const isLastPlayer  = currentRevealIndex >= revealOrder.length - 1

  const categoryLabel = (() => {
    if (!secretWord) return null
    for (const [, cat] of Object.entries(WORD_BANK)) {
      if (cat.entries?.some((e) => e.word === secretWord)) return cat.label
    }
    return null
  })()

  if (!currentPlayer) return null

  function handleReveal() {
    setPhase('flipping')
    setTimeout(() => setPhase('revealed'), 680)
  }

  function handleGotIt() {
    setPhase('cover')
    revealNext()
  }

  return (
    <main className="rr-screen">
      <div className="rr-header">
        <span className="rr-header-label">Role Reveal</span>
        <ProgressDots total={revealOrder.length} current={currentRevealIndex} />
        <span className="rr-header-count">{currentRevealIndex + 1} / {revealOrder.length}</span>
      </div>

      {phase === 'cover' && <CoverScreen playerName={currentPlayer.name} onReveal={handleReveal} />}

      {(phase === 'flipping' || phase === 'revealed') && (
        <div className="rr-card-area animate-fade-in">
          <div className={`rr-flip-scene ${phase === 'revealed' ? 'rr-flip-scene-done' : ''}`}>
            <div className="rr-flip-inner">
              <div className="rr-flip-front">
                <div className="rr-flip-front-inner">
                  <span className="rr-flip-front-icon">❓</span>
                </div>
              </div>
              <div className="rr-flip-back">
                {currentPlayer.role === 'spy'
                  ? <SpyCard spyHint={spyHint} />
                  : <CrewmateCard secretWord={secretWord} category={categoryLabel} />}
              </div>
            </div>
          </div>
          {phase === 'revealed' && (
            <div className="rr-cta animate-slide-up">
              <p className="rr-cta-player-name">{currentPlayer.name}</p>
              {isLastPlayer ? (
                <button id="btn-start-discussion" className="rr-cta-btn rr-cta-btn-start" onClick={handleGotIt}>
                  <span>🎯</span> Start Discussion
                </button>
              ) : (
                <button id="btn-got-it" className="rr-cta-btn rr-cta-btn-gotit" onClick={handleGotIt}>
                  <span>✓</span> Got it!
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
```

- [ ] **Step 2: Update RoleRevealScreen.css — replace spy/crewmate color variants with neutral**

In `RoleRevealScreen.css`, find all `.rr-card-crewmate` and `.rr-card-spy` colour rules and replace with a single `.rr-card-neutral` rule. The badge text colours should stay distinct (e.g. crewmate badge = cyan/blue text, spy badge = amber/yellow text) but the card background must be the same neutral dark glass for both.

Specific CSS changes — replace the split colour rules:
```css
/* REMOVE these classes and replace with .rr-card-neutral */
.rr-card-crewmate { ... }
.rr-card-spy { ... }
.crewmate-badge { ... }
.spy-badge { ... }
.crewmate-icon { ... }
.spy-icon { ... }
.crewmate-label { ... }
.crewmate-word { ... }
.crewmate-category { ... }
.crewmate-tip { ... }
.spy-tip { ... }

/* ADD */
.rr-card-neutral {
  background: rgba(20, 20, 35, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.rr-badge-crewmate {
  background: rgba(99, 179, 237, 0.2);
  color: #63b3ed;
  border: 1px solid rgba(99, 179, 237, 0.4);
}
.rr-badge-spy {
  background: rgba(246, 173, 85, 0.2);
  color: #f6ad55;
  border: 1px solid rgba(246, 173, 85, 0.4);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/screens/RoleRevealScreen.jsx src/screens/RoleRevealScreen.css
git commit -m "feat: neutral role reveal cards — no red/green; use revealOrder from store"
```

---

## Task 6: Update ResultsScreen — handle new win conditions

**Files:**
- Modify: `src/screens/ResultsScreen.jsx`

Key changes:
1. Read `winner` from store state.
2. If `winner === 'spy'` (spy survived as last player or voted out and guessed correctly), show "Spy Wins" verdict.
3. If `winner === 'crewmates'`, show "Crewmates Win" verdict.
4. The `nextRound` action now routes to `scoreboard` (mid-round), or to `final` if `winner` is set.
5. Remove the `isLastRound` check — it no longer exists.
6. When spy is voted out (`spyVotedOut === true`), show the guess input. After guess, the `spyGuess` action sets `winner` and re-renders the screen.
7. Show "See Scores" CTA when `revealDone` is true (routes to `nextRound` which now handles routing).

- [ ] **Step 1: Update ResultsScreen.jsx**

Replace the footer CTA section (currently has `isLastRound` check) and update `isLastRound` logic:

Remove:
```jsx
const isLastRound = currentRound >= settings.rounds
```

Add:
```jsx
const winner = useGameStore((s) => s.winner)
```

Replace footer CTA:
```jsx
{revealDone && (
  <footer className="rs-footer animate-slide-up">
    <button
      id="btn-next-round"
      className="rs-cta-btn rs-cta-btn-next"
      onClick={nextRound}
      aria-label={winner ? 'View final scores' : 'Continue to next round'}
    >
      <span>{winner ? '🏆' : '▶'}</span>
      {winner ? 'View Scores' : 'Next Round'}
    </button>
  </footer>
)}
```

Also update the SpyReveal verdict message to reflect the new messaging: when spy is voted out and wins via guess, the message updates via `winner` state.

- [ ] **Step 2: Commit**

```bash
git add src/screens/ResultsScreen.jsx
git commit -m "feat: update results screen for new win conditions and no round cap"
```

---

## Task 7: Update ScoreboardScreen — handle mid-round vs final

**Files:**
- Modify: `src/screens/ScoreboardScreen.jsx`

The `ScoreboardScreen` is now rendered for both `screen === 'scoreboard'` (mid-round) and `screen === 'final'` (end of game). 

Key changes:
1. Read `screen` from store to know if it's `'scoreboard'` or `'final'`.
2. Read `winner` and `currentRound` from store.
3. If `screen === 'scoreboard'` (mid-round): title shows "Round N Complete", footer shows "Next Round" button which calls `startNextRound`.
4. If `screen === 'final'`: title shows "Final Scores", footer shows "Play Again" + "Home" buttons.
5. Remove the `settings.rounds` reference in the sub-line (no round count any more).

- [ ] **Step 1: Rewrite ScoreboardScreen.jsx**

```jsx
import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import './ScoreboardScreen.css'

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

const TROPHY = ['🥇', '🥈', '🥉']

function Confetti() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i, angle: (i / 30) * 360,
    distance: 60 + Math.random() * 80,
    color: ['#8b5cf6', '#ec4899', '#f59e0b', '#34d399', '#60a5fa'][i % 5],
    size: 5 + Math.random() * 5, delay: Math.random() * 300,
  }))
  return (
    <div className="sb-confetti" aria-hidden="true">
      {particles.map((p) => (
        <span key={p.id} className="sb-confetti-dot"
          style={{ '--angle': `${p.angle}deg`, '--dist': `${p.distance}px`, '--color': p.color, '--size': `${p.size}px`, animationDelay: `${p.delay}ms` }} />
      ))}
    </div>
  )
}

function PlayerCard({ player, rank, maxScore, animDelay }) {
  const [barAnimated, setBarAnimated] = useState(false)
  const isWinner = rank === 0
  const hasTrophy = rank < 3
  const pct = maxScore > 0 ? (player.score / maxScore) * 100 : 0
  const initials = getInitials(player.name)

  useEffect(() => {
    const t = setTimeout(() => setBarAnimated(true), animDelay + 100)
    return () => clearTimeout(t)
  }, [animDelay])

  return (
    <div className={`sb-card animate-fade-in ${isWinner ? 'sb-card-winner' : ''}`}
      style={{ animationDelay: `${animDelay}ms` }} role="listitem"
      aria-label={`${player.name} – ${player.score} points – rank ${rank + 1}`}>
      {isWinner && player.score > 0 && <Confetti />}
      <div className={`sb-rank ${hasTrophy ? 'sb-rank-trophy' : ''}`}>
        {hasTrophy ? TROPHY[rank] : <span className="sb-rank-num">{rank + 1}</span>}
      </div>
      <div className={`sb-avatar ${isWinner ? 'sb-avatar-winner' : ''}`}>{initials}</div>
      <div className="sb-info">
        <span className={`sb-name ${isWinner ? 'sb-name-winner' : ''}`}>{player.name}</span>
        <div className="sb-track" role="progressbar" aria-valuenow={player.score} aria-valuemin={0} aria-valuemax={maxScore || 1}>
          <div className={`sb-bar ${isWinner ? 'sb-bar-winner' : ''}`}
            style={{ width: barAnimated ? `${Math.max(pct, player.score > 0 ? 4 : 0)}%` : '0%' }} />
        </div>
      </div>
      <div className="sb-score">
        <span className={`sb-score-num ${isWinner ? 'sb-score-num-winner' : ''}`}>{player.score}</span>
        <span className="sb-score-label">pts</span>
      </div>
    </div>
  )
}

export default function ScoreboardScreen() {
  const players        = useGameStore((s) => s.players)
  const screen         = useGameStore((s) => s.screen)
  const currentRound   = useGameStore((s) => s.currentRound)
  const winner         = useGameStore((s) => s.winner)
  const playAgain      = useGameStore((s) => s.playAgain)
  const resetGame      = useGameStore((s) => s.resetGame)
  const startNextRound = useGameStore((s) => s.startNextRound)

  const isFinal = screen === 'final'
  const sorted = [...players].sort((a, b) => b.score - a.score)
  const maxScore = sorted[0]?.score ?? 0
  const topPlayer = sorted[0] ?? null
  const isTie = sorted.length > 1 && sorted[0].score === sorted[1].score

  const headline = isFinal
    ? (winner === 'spy' ? '🕵️ Spy Wins!' : winner === 'crewmates' ? '🛡️ Crewmates Win!' : isTie ? "It's a Tie! 🤝" : topPlayer ? `${topPlayer.name} Wins! 🎉` : 'Game Over')
    : `Round ${currentRound} Complete`

  const subline = isFinal
    ? (winner === 'spy' ? 'The spy survived to the end.' : winner === 'crewmates' ? 'The spy was found out.' : 'Final standings')
    : 'Scores so far — get ready for the next round'

  return (
    <main className="sb-screen">
      <div className="sb-bg" aria-hidden="true">
        <div className="sb-orb sb-orb-1" />
        <div className="sb-orb sb-orb-2" />
        <div className="sb-orb sb-orb-3" />
      </div>

      <header className="sb-header animate-slide-down">
        <div className="sb-header-inner">
          <div className="sb-header-badge">
            <span>{isFinal ? '🏆' : '📊'}</span>
            <span>{isFinal ? 'Final Scoreboard' : 'Scoreboard'}</span>
          </div>
          <h1 className="sb-headline">{headline}</h1>
          <p className="sb-sub">{subline}</p>
        </div>
      </header>

      <section className="sb-body" aria-label={isFinal ? 'Final rankings' : 'Current scores'} role="list">
        {sorted.map((player, i) => (
          <PlayerCard key={player.id} player={player} rank={i} maxScore={maxScore} animDelay={i * 80} />
        ))}
        <div className="sb-body-spacer" aria-hidden="true" />
      </section>

      <footer className="sb-footer animate-slide-up">
        {isFinal ? (
          <>
            <button id="btn-play-again" className="sb-btn sb-btn-primary" onClick={playAgain}>
              <span>▶</span> Play Again
            </button>
            <button id="btn-go-home" className="sb-btn sb-btn-ghost" onClick={resetGame}>
              <span>🏠</span> Home
            </button>
          </>
        ) : (
          <button id="btn-next-round" className="sb-btn sb-btn-primary" onClick={startNextRound}>
            <span>▶</span> Start Next Round
          </button>
        )}
      </footer>
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/ScoreboardScreen.jsx
git commit -m "feat: scoreboard supports mid-round and final modes"
```

---

## Task 8: Update VotingScreen — only active (non-eliminated) players vote

**Files:**
- Modify: `src/screens/VotingScreen.jsx`

VotingScreen currently uses `players` directly. Now it should only show active (non-eliminated) players as voters and candidates.

- [ ] **Step 1: Filter by eliminatedIds in VotingScreen.jsx**

At the top of the component, add:
```jsx
const eliminatedIds = useGameStore((s) => s.eliminatedIds)
const activePlayers = players.filter(p => !eliminatedIds.includes(p.id))
```

Then replace all uses of `players` in the voting logic (voter list, candidates, `totalVoters`) with `activePlayers`. Keep `players` only for the `castVote` / `tallyVotes` calls which operate on the full list.

- [ ] **Step 2: Commit**

```bash
git add src/screens/VotingScreen.jsx
git commit -m "feat: voting screen only shows active (non-eliminated) players"
```

---

## Task 9: Final commit

- [ ] **Step 1: Verify the full game loop works**

Start dev server: `npm run dev`
Test path:
1. Home → Setup (3+ players, no rounds field visible)
2. Start Game → Role Reveal (cards are neutral coloured — not red/green)
3. Discussion → Voting (only active players)
4. Results → reveals verdict → spy guess input if spy caught
5. "Next Round" → ScoreboardScreen mid-round with "Start Next Round" button
6. Next round reveals — first player is rotated
7. When spy caught + guesses correctly → "View Scores" → Final ScoreboardScreen with "Spy Wins"
8. "Play Again" → new session with next rotation starting player

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: complete spy game overhaul — infinite rounds, rotation, neutral cards, spy win conditions"
```
