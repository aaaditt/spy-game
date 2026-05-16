# New Categories + UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 8 new word categories; fix three core game-logic bugs (tie votes = no elimination, spy wins when spies ≥ crewmates, correct playAgain rotation); then completely overhaul the visual design with a new display font, richer backgrounds, and polished micro-interactions across all screens.

**Architecture:** Game logic changes are isolated to `src/store/gameStore.js` (`tallyVotes`, `playAgain`) and `src/screens/ResultsScreen.jsx` (tie banner). Categories are pure data additions. UI polish is CSS-only — no JSX logic changes for styling.

**Tech Stack:** React 18 + Vite, Zustand, CSS custom properties, Google Fonts (Syne for display headings, keep Inter for body)

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `src/store/gameStore.js` | Modify | Fix tie logic (no-elimination), spy-majority win, playAgain rotation |
| `src/screens/ResultsScreen.jsx` | Modify | Show tie banner when no one is voted out |
| `src/data/categories.js` | Modify | Add 8 new categories × 30 words with full hint tiers |
| `src/index.css` | Modify | Add Syne font import, new display font token, richer color tokens, new glow animations |
| `src/screens/HomeScreen.css` | Modify | Full redesign — scanlines texture, larger orbs, Syne title, particle grid |
| `src/screens/SetupScreen.css` | Modify | Category cards get emoji gradient borders, new active state |
| `src/screens/RoleRevealScreen.css` | Modify | Flip card shimmer, card glow on reveal |
| `src/screens/DiscussionScreen.css` | Modify | Timer ring glow, bolder player list |
| `src/screens/VotingScreen.css` | Modify | Selection ring animation, card hover lift |
| `src/screens/ResultsScreen.css` | Modify | Tally bar gradient, verdict glow |
| `src/screens/ScoreboardScreen.css` | Modify | Winner card spotlight, confetti colours |

---

## Task 1: Add New Categories Data

**Files:**
- Modify: `src/data/categories.js` (append 8 new category keys)

- [ ] **Step 1: Add the `music` category (30 words)**

Append to `WORD_BANK` in `src/data/categories.js`:

```js
  music: {
    label: 'Music',
    emoji: '🎵',
    entries: [
      { id: 'music_000', word: 'Guitar',      hints: { beginner: 'Strings',      intermediate: 'Fret',           advanced: 'Chord voicing' } },
      { id: 'music_001', word: 'Drums',       hints: { beginner: 'Beat',         intermediate: 'Snare',          advanced: 'Polyrhythm' } },
      { id: 'music_002', word: 'Piano',       hints: { beginner: 'Keys',         intermediate: 'Pedal',          advanced: 'Voicing' } },
      { id: 'music_003', word: 'Violin',      hints: { beginner: 'Bow',          intermediate: 'Strings',        advanced: 'Vibrato' } },
      { id: 'music_004', word: 'Jazz',        hints: { beginner: 'Improvise',    intermediate: 'Swing',          advanced: 'Bebop' } },
      { id: 'music_005', word: 'Bass',        hints: { beginner: 'Low',          intermediate: 'Groove',         advanced: 'Root note' } },
      { id: 'music_006', word: 'Orchestra',   hints: { beginner: 'Conductor',    intermediate: 'Sections',       advanced: 'Tutti' } },
      { id: 'music_007', word: 'Vinyl',       hints: { beginner: 'Record',       intermediate: 'Groove',         advanced: 'RPM' } },
      { id: 'music_008', word: 'Tempo',       hints: { beginner: 'Speed',        intermediate: 'BPM',            advanced: 'Rubato' } },
      { id: 'music_009', word: 'Chord',       hints: { beginner: 'Notes',        intermediate: 'Harmony',        advanced: 'Triad' } },
      { id: 'music_010', word: 'Melody',      hints: { beginner: 'Tune',         intermediate: 'Phrase',         advanced: 'Motif' } },
      { id: 'music_011', word: 'Rhythm',      hints: { beginner: 'Beat',         intermediate: 'Syncopation',    advanced: 'Meter' } },
      { id: 'music_012', word: 'Lyrics',      hints: { beginner: 'Words',        intermediate: 'Verse',          advanced: 'Prosody' } },
      { id: 'music_013', word: 'Concert',     hints: { beginner: 'Live',         intermediate: 'Venue',          advanced: 'Setlist' } },
      { id: 'music_014', word: 'Album',       hints: { beginner: 'Tracks',       intermediate: 'Artwork',        advanced: 'LP' } },
      { id: 'music_015', word: 'Microphone',  hints: { beginner: 'Sing',         intermediate: 'Capsule',        advanced: 'Cardioid' } },
      { id: 'music_016', word: 'Synthesizer', hints: { beginner: 'Electronic',   intermediate: 'Oscillator',     advanced: 'LFO' } },
      { id: 'music_017', word: 'Saxophone',   hints: { beginner: 'Brass',        intermediate: 'Reed',           advanced: 'Embouchure' } },
      { id: 'music_018', word: 'Trumpet',     hints: { beginner: 'Brass',        intermediate: 'Valve',          advanced: 'Mute' } },
      { id: 'music_019', word: 'Flute',       hints: { beginner: 'Breath',       intermediate: 'Woodwind',       advanced: 'Embouchure' } },
      { id: 'music_020', word: 'Opera',       hints: { beginner: 'Singing',      intermediate: 'Aria',           advanced: 'Libretto' } },
      { id: 'music_021', word: 'Hip Hop',     hints: { beginner: 'Rap',          intermediate: 'Sample',         advanced: 'Couplet' } },
      { id: 'music_022', word: 'Classical',   hints: { beginner: 'Old',          intermediate: 'Sonata',         advanced: 'Counterpoint' } },
      { id: 'music_023', word: 'Playlist',    hints: { beginner: 'Queue',        intermediate: 'Shuffle',        advanced: 'Curation' } },
      { id: 'music_024', word: 'Studio',      hints: { beginner: 'Record',       intermediate: 'Mixing board',   advanced: 'Isolation booth' } },
      { id: 'music_025', word: 'DJ',          hints: { beginner: 'Turntable',    intermediate: 'Mix',            advanced: 'Beatmatch' } },
      { id: 'music_026', word: 'Pitch',       hints: { beginner: 'High low',     intermediate: 'Frequency',      advanced: 'Semitone' } },
      { id: 'music_027', word: 'Acoustic',    hints: { beginner: 'Unplugged',    intermediate: 'Resonance',      advanced: 'Soundboard' } },
      { id: 'music_028', word: 'Metronome',   hints: { beginner: 'Tick',         intermediate: 'Tempo',          advanced: 'Subdivision' } },
      { id: 'music_029', word: 'Amplifier',   hints: { beginner: 'Loud',         intermediate: 'Watt',           advanced: 'Gain stage' } },
    ]
  },
```

- [ ] **Step 2: Add the `history` category (30 words)**

```js
  history: {
    label: 'History & Myth',
    emoji: '🏛️',
    entries: [
      { id: 'history_000', word: 'Pharaoh',      hints: { beginner: 'Egypt',        intermediate: 'Pyramid',        advanced: 'Cartouche' } },
      { id: 'history_001', word: 'Gladiator',    hints: { beginner: 'Arena',        intermediate: 'Colosseum',      advanced: 'Murmillo' } },
      { id: 'history_002', word: 'Viking',       hints: { beginner: 'Longship',     intermediate: 'Norse',          advanced: 'Berserker' } },
      { id: 'history_003', word: 'Samurai',      hints: { beginner: 'Sword',        intermediate: 'Bushido',        advanced: 'Katana' } },
      { id: 'history_004', word: 'Knight',       hints: { beginner: 'Armour',       intermediate: 'Chivalry',       advanced: 'Joust' } },
      { id: 'history_005', word: 'Pirate',       hints: { beginner: 'Ship',         intermediate: 'Plunder',        advanced: 'Privateer' } },
      { id: 'history_006', word: 'Revolution',   hints: { beginner: 'Uprising',     intermediate: 'Overthrow',      advanced: 'Coup' } },
      { id: 'history_007', word: 'Renaissance',  hints: { beginner: 'Art',          intermediate: 'Florence',       advanced: 'Humanism' } },
      { id: 'history_008', word: 'Mythology',    hints: { beginner: 'Gods',         intermediate: 'Epic',           advanced: 'Pantheon' } },
      { id: 'history_009', word: 'Colosseum',    hints: { beginner: 'Rome',         intermediate: 'Arch',           advanced: 'Hypogeum' } },
      { id: 'history_010', word: 'Olympus',      hints: { beginner: 'Gods',         intermediate: 'Zeus',           advanced: 'Pantheon' } },
      { id: 'history_011', word: 'Troy',         hints: { beginner: 'Horse',        intermediate: 'Siege',          advanced: 'Iliad' } },
      { id: 'history_012', word: 'Empire',       hints: { beginner: 'Ruled',        intermediate: 'Conquest',       advanced: 'Hegemony' } },
      { id: 'history_013', word: 'Castle',       hints: { beginner: 'Tower',        intermediate: 'Moat',           advanced: 'Battlement' } },
      { id: 'history_014', word: 'Sparta',       hints: { beginner: 'Warriors',     intermediate: 'Phalanx',        advanced: 'Agoge' } },
      { id: 'history_015', word: 'Plague',       hints: { beginner: 'Disease',      intermediate: 'Epidemic',       advanced: 'Bubonic' } },
      { id: 'history_016', word: 'Colony',       hints: { beginner: 'Settlers',     intermediate: 'Territory',      advanced: 'Suzerainty' } },
      { id: 'history_017', word: 'Treaty',       hints: { beginner: 'Agreement',    intermediate: 'Diplomat',       advanced: 'Ratification' } },
      { id: 'history_018', word: 'Sphinx',       hints: { beginner: 'Egypt',        intermediate: 'Riddle',         advanced: 'Limestone' } },
      { id: 'history_019', word: 'Dragon',       hints: { beginner: 'Fire',         intermediate: 'Scales',         advanced: 'Wyrm' } },
      { id: 'history_020', word: 'Minotaur',     hints: { beginner: 'Bull',         intermediate: 'Labyrinth',      advanced: 'Crete' } },
      { id: 'history_021', word: 'Crusade',      hints: { beginner: 'Holy war',     intermediate: 'Jerusalem',      advanced: 'Papal bull' } },
      { id: 'history_022', word: 'Feudal',       hints: { beginner: 'Lord',         intermediate: 'Serf',           advanced: 'Vassal' } },
      { id: 'history_023', word: 'Catapult',     hints: { beginner: 'Launch',       intermediate: 'Siege weapon',   advanced: 'Torsion' } },
      { id: 'history_024', word: 'Oracle',       hints: { beginner: 'Prophecy',     intermediate: 'Delphi',         advanced: 'Augury' } },
      { id: 'history_025', word: 'Rebellion',    hints: { beginner: 'Revolt',       intermediate: 'Uprising',       advanced: 'Insurrection' } },
      { id: 'history_026', word: 'Pharaohs',     hints: { beginner: 'Ruler',        intermediate: 'Dynasty',        advanced: 'Regnal' } },
      { id: 'history_027', word: 'Scroll',       hints: { beginner: 'Write',        intermediate: 'Papyrus',        advanced: 'Codex' } },
      { id: 'history_028', word: 'Stonehenge',   hints: { beginner: 'Stones',       intermediate: 'Solstice',       advanced: 'Megalith' } },
      { id: 'history_029', word: 'Gladius',      hints: { beginner: 'Roman sword',  intermediate: 'Legionary',      advanced: 'Short blade' } },
    ]
  },
```

- [ ] **Step 3: Add the `body` category (30 words)**

```js
  body: {
    label: 'Human Body',
    emoji: '🫀',
    entries: [
      { id: 'body_000', word: 'Heart',       hints: { beginner: 'Pump',         intermediate: 'Ventricle',      advanced: 'Myocardium' } },
      { id: 'body_001', word: 'Brain',       hints: { beginner: 'Think',        intermediate: 'Cortex',         advanced: 'Synapse' } },
      { id: 'body_002', word: 'Lung',        hints: { beginner: 'Breathe',      intermediate: 'Alveoli',        advanced: 'Surfactant' } },
      { id: 'body_003', word: 'Kidney',      hints: { beginner: 'Filter',       intermediate: 'Urea',           advanced: 'Nephron' } },
      { id: 'body_004', word: 'Liver',       hints: { beginner: 'Detox',        intermediate: 'Bile',           advanced: 'Hepatocyte' } },
      { id: 'body_005', word: 'Spine',       hints: { beginner: 'Backbone',     intermediate: 'Vertebra',       advanced: 'Disc' } },
      { id: 'body_006', word: 'Skin',        hints: { beginner: 'Outer',        intermediate: 'Dermis',         advanced: 'Melanin' } },
      { id: 'body_007', word: 'Neuron',      hints: { beginner: 'Brain cell',   intermediate: 'Signal',         advanced: 'Axon' } },
      { id: 'body_008', word: 'Artery',      hints: { beginner: 'Blood',        intermediate: 'Pulse',          advanced: 'Aorta' } },
      { id: 'body_009', word: 'Muscle',      hints: { beginner: 'Flex',         intermediate: 'Fibre',          advanced: 'Sarcomere' } },
      { id: 'body_010', word: 'Bone',        hints: { beginner: 'Hard',         intermediate: 'Marrow',         advanced: 'Ossification' } },
      { id: 'body_011', word: 'Stomach',     hints: { beginner: 'Hungry',       intermediate: 'Acid',           advanced: 'Peristalsis' } },
      { id: 'body_012', word: 'Eye',         hints: { beginner: 'See',          intermediate: 'Retina',         advanced: 'Fovea' } },
      { id: 'body_013', word: 'Ear',         hints: { beginner: 'Hear',         intermediate: 'Cochlea',        advanced: 'Ossicles' } },
      { id: 'body_014', word: 'Nose',        hints: { beginner: 'Smell',        intermediate: 'Olfactory',      advanced: 'Conchae' } },
      { id: 'body_015', word: 'Tongue',      hints: { beginner: 'Taste',        intermediate: 'Papillae',       advanced: 'Gustatory' } },
      { id: 'body_016', word: 'Blood',       hints: { beginner: 'Red',          intermediate: 'Plasma',         advanced: 'Haematocrit' } },
      { id: 'body_017', word: 'DNA',         hints: { beginner: 'Gene',         intermediate: 'Helix',          advanced: 'Nucleotide' } },
      { id: 'body_018', word: 'Cell',        hints: { beginner: 'Tiny',         intermediate: 'Membrane',       advanced: 'Mitosis' } },
      { id: 'body_019', word: 'Hormone',     hints: { beginner: 'Chemical',     intermediate: 'Gland',          advanced: 'Endocrine' } },
      { id: 'body_020', word: 'Immune',      hints: { beginner: 'Defence',      intermediate: 'Antibody',       advanced: 'T-cell' } },
      { id: 'body_021', word: 'Femur',       hints: { beginner: 'Thigh',        intermediate: 'Long bone',      advanced: 'Diaphysis' } },
      { id: 'body_022', word: 'Tendon',      hints: { beginner: 'Attach',       intermediate: 'Fibrous',        advanced: 'Collagen' } },
      { id: 'body_023', word: 'Pancreas',    hints: { beginner: 'Sugar',        intermediate: 'Insulin',        advanced: 'Islets' } },
      { id: 'body_024', word: 'Thyroid',     hints: { beginner: 'Neck gland',   intermediate: 'Metabolism',     advanced: 'T3 T4' } },
      { id: 'body_025', word: 'Skull',       hints: { beginner: 'Head bone',    intermediate: 'Cranium',        advanced: 'Suture' } },
      { id: 'body_026', word: 'Diaphragm',   hints: { beginner: 'Breath',       intermediate: 'Dome shaped',    advanced: 'Thoracic' } },
      { id: 'body_027', word: 'Vein',        hints: { beginner: 'Blue',         intermediate: 'Valve',          advanced: 'Venous return' } },
      { id: 'body_028', word: 'Intestine',   hints: { beginner: 'Digest',       intermediate: 'Absorption',     advanced: 'Villus' } },
      { id: 'body_029', word: 'Lymph',       hints: { beginner: 'Node',         intermediate: 'Fluid',          advanced: 'Lymphocyte' } },
    ]
  },
```

- [ ] **Step 4: Add the `gaming` category (30 words)**

```js
  gaming: {
    label: 'Video Games',
    emoji: '🎮',
    entries: [
      { id: 'gaming_000', word: 'Respawn',      hints: { beginner: 'Comeback',     intermediate: 'Checkpoint',     advanced: 'Spawn point' } },
      { id: 'gaming_001', word: 'Inventory',    hints: { beginner: 'Items',        intermediate: 'Slot',           advanced: 'Encumbrance' } },
      { id: 'gaming_002', word: 'Boss Fight',   hints: { beginner: 'Hard enemy',   intermediate: 'Phase',          advanced: 'DPS check' } },
      { id: 'gaming_003', word: 'Speedrun',     hints: { beginner: 'Fast',         intermediate: 'Glitch',         advanced: 'Any%' } },
      { id: 'gaming_004', word: 'Loot',         hints: { beginner: 'Drop',         intermediate: 'Rarity',         advanced: 'RNG' } },
      { id: 'gaming_005', word: 'NPC',          hints: { beginner: 'Character',    intermediate: 'Dialogue',       advanced: 'Scripted' } },
      { id: 'gaming_006', word: 'Open World',   hints: { beginner: 'Explore',      intermediate: 'Sandbox',        advanced: 'Emergent' } },
      { id: 'gaming_007', word: 'Multiplayer',  hints: { beginner: 'Online',       intermediate: 'Lobby',          advanced: 'Netcode' } },
      { id: 'gaming_008', word: 'Cutscene',     hints: { beginner: 'Movie bit',    intermediate: 'Cinematic',      advanced: 'Non-interactive' } },
      { id: 'gaming_009', word: 'Hitbox',       hints: { beginner: 'Hit zone',     intermediate: 'Collision',      advanced: 'AABB' } },
      { id: 'gaming_010', word: 'Quest',        hints: { beginner: 'Mission',      intermediate: 'Objective',      advanced: 'Side quest' } },
      { id: 'gaming_011', word: 'Pixel',        hints: { beginner: 'Dot',          intermediate: 'Retro',          advanced: 'Sprite' } },
      { id: 'gaming_012', word: 'Level Up',     hints: { beginner: 'Grow',         intermediate: 'XP',             advanced: 'Progression' } },
      { id: 'gaming_013', word: 'Controller',   hints: { beginner: 'Joystick',     intermediate: 'Input lag',      advanced: 'Haptic' } },
      { id: 'gaming_014', word: 'Dungeon',      hints: { beginner: 'Underground',  intermediate: 'Procedural',     advanced: 'Roguelike' } },
      { id: 'gaming_015', word: 'Crafting',     hints: { beginner: 'Build',        intermediate: 'Recipe',         advanced: 'Workbench' } },
      { id: 'gaming_016', word: 'Stealth',      hints: { beginner: 'Sneak',        intermediate: 'Detection',      advanced: 'Sight cone' } },
      { id: 'gaming_017', word: 'Cooldown',     hints: { beginner: 'Wait',         intermediate: 'Timer',          advanced: 'GCD' } },
      { id: 'gaming_018', word: 'Achievement',  hints: { beginner: 'Badge',        intermediate: 'Trophy',         advanced: 'Platinum' } },
      { id: 'gaming_019', word: 'Framerate',    hints: { beginner: 'Smooth',       intermediate: 'FPS',            advanced: 'V-sync' } },
      { id: 'gaming_020', word: 'Map',          hints: { beginner: 'Navigate',     intermediate: 'Minimap',        advanced: 'Fog of war' } },
      { id: 'gaming_021', word: 'Patch',        hints: { beginner: 'Update',       intermediate: 'Nerf',           advanced: 'Hotfix' } },
      { id: 'gaming_022', word: 'Esports',      hints: { beginner: 'Tournament',   intermediate: 'Team',           advanced: 'Meta' } },
      { id: 'gaming_023', word: 'Sandbox',      hints: { beginner: 'Free play',    intermediate: 'No goal',        advanced: 'Emergent gameplay' } },
      { id: 'gaming_024', word: 'Grinding',     hints: { beginner: 'Repeat',       intermediate: 'Farm',           advanced: 'Min-maxing' } },
      { id: 'gaming_025', word: 'Avatar',       hints: { beginner: 'Character',    intermediate: 'Customise',      advanced: 'Skin' } },
      { id: 'gaming_026', word: 'Battle Royale', hints: { beginner: 'Last one',    intermediate: 'Circle',         advanced: 'Zone' } },
      { id: 'gaming_027', word: 'Mods',         hints: { beginner: 'Fan-made',     intermediate: 'Workshop',       advanced: 'Overhaul' } },
      { id: 'gaming_028', word: 'Spawn',        hints: { beginner: 'Appear',       intermediate: 'Location',       advanced: 'Spawn rate' } },
      { id: 'gaming_029', word: 'Health Bar',   hints: { beginner: 'HP',           intermediate: 'Damage',         advanced: 'Vitality' } },
    ]
  },
```

- [ ] **Step 5: Add the `science` category (30 words)**

```js
  science: {
    label: 'Space & Science',
    emoji: '🌌',
    entries: [
      { id: 'science_000', word: 'Black Hole',   hints: { beginner: 'Gravity',      intermediate: 'Event horizon',  advanced: 'Singularity' } },
      { id: 'science_001', word: 'Galaxy',       hints: { beginner: 'Stars',        intermediate: 'Spiral',         advanced: 'Redshift' } },
      { id: 'science_002', word: 'Comet',        hints: { beginner: 'Tail',         intermediate: 'Nucleus',        advanced: 'Perihelion' } },
      { id: 'science_003', word: 'Atom',         hints: { beginner: 'Tiny',         intermediate: 'Proton',         advanced: 'Valence' } },
      { id: 'science_004', word: 'Gravity',      hints: { beginner: 'Fall',         intermediate: 'Mass',           advanced: 'Geodesic' } },
      { id: 'science_005', word: 'Telescope',    hints: { beginner: 'See far',      intermediate: 'Aperture',       advanced: 'Focal length' } },
      { id: 'science_006', word: 'DNA',          hints: { beginner: 'Gene',         intermediate: 'Helix',          advanced: 'Base pair' } },
      { id: 'science_007', word: 'Fossil',       hints: { beginner: 'Ancient',      intermediate: 'Sediment',       advanced: 'Palaeontology' } },
      { id: 'science_008', word: 'Volcano',      hints: { beginner: 'Lava',         intermediate: 'Magma',          advanced: 'Pyroclastic' } },
      { id: 'science_009', word: 'Supernova',    hints: { beginner: 'Explosion',    intermediate: 'Star death',     advanced: 'Remnant' } },
      { id: 'science_010', word: 'Photosynthesis', hints: { beginner: 'Plants',     intermediate: 'Chlorophyll',    advanced: 'Calvin cycle' } },
      { id: 'science_011', word: 'Electricity',  hints: { beginner: 'Charge',       intermediate: 'Current',        advanced: 'Potential difference' } },
      { id: 'science_012', word: 'Magnetism',    hints: { beginner: 'Attract',      intermediate: 'Field',          advanced: 'Flux' } },
      { id: 'science_013', word: 'Molecule',     hints: { beginner: 'Bond',         intermediate: 'Compound',       advanced: 'Covalent' } },
      { id: 'science_014', word: 'Periodic Table', hints: { beginner: 'Elements',   intermediate: 'Atomic number',  advanced: 'Valence shell' } },
      { id: 'science_015', word: 'Eclipse',      hints: { beginner: 'Shadow',       intermediate: 'Totality',       advanced: 'Umbra' } },
      { id: 'science_016', word: 'Orbit',        hints: { beginner: 'Circle',       intermediate: 'Ellipse',        advanced: 'Eccentricity' } },
      { id: 'science_017', word: 'Nebula',       hints: { beginner: 'Cloud',        intermediate: 'Gas',            advanced: 'Stellar nursery' } },
      { id: 'science_018', word: 'Tectonic',     hints: { beginner: 'Plates',       intermediate: 'Fault',          advanced: 'Subduction' } },
      { id: 'science_019', word: 'Evolution',    hints: { beginner: 'Change',       intermediate: 'Selection',      advanced: 'Speciation' } },
      { id: 'science_020', word: 'Big Bang',     hints: { beginner: 'Beginning',    intermediate: 'Expansion',      advanced: 'Inflation epoch' } },
      { id: 'science_021', word: 'Laser',        hints: { beginner: 'Beam',         intermediate: 'Coherent',       advanced: 'Stimulated emission' } },
      { id: 'science_022', word: 'Asteroid',     hints: { beginner: 'Rock',         intermediate: 'Belt',           advanced: 'Impactor' } },
      { id: 'science_023', word: 'Entropy',      hints: { beginner: 'Disorder',     intermediate: 'Thermodynamics', advanced: 'Irreversibility' } },
      { id: 'science_024', word: 'Neutrino',     hints: { beginner: 'Particle',     intermediate: 'Mass',           advanced: 'Flavour' } },
      { id: 'science_025', word: 'Vaccine',      hints: { beginner: 'Injection',    intermediate: 'Immunity',       advanced: 'Adjuvant' } },
      { id: 'science_026', word: 'Radiation',    hints: { beginner: 'Wave',         intermediate: 'Ionising',       advanced: 'Half-life' } },
      { id: 'science_027', word: 'Quantum',      hints: { beginner: 'Tiny',         intermediate: 'Uncertainty',    advanced: 'Superposition' } },
      { id: 'science_028', word: 'Wormhole',     hints: { beginner: 'Shortcut',     intermediate: 'Spacetime',      advanced: 'Traversable' } },
      { id: 'science_029', word: 'Carbon',       hints: { beginner: 'Element',      intermediate: 'Organic',        advanced: 'Isotope' } },
    ]
  },
```

- [ ] **Step 6: Add the `art` category (30 words)**

```js
  art: {
    label: 'Art & Design',
    emoji: '🎨',
    entries: [
      { id: 'art_000', word: 'Painting',      hints: { beginner: 'Brush',        intermediate: 'Canvas',         advanced: 'Impasto' } },
      { id: 'art_001', word: 'Sculpture',     hints: { beginner: '3D',           intermediate: 'Chisel',         advanced: 'Relief' } },
      { id: 'art_002', word: 'Watercolour',   hints: { beginner: 'Transparent',  intermediate: 'Wash',           advanced: 'Wet on wet' } },
      { id: 'art_003', word: 'Perspective',   hints: { beginner: 'Depth',        intermediate: 'Vanishing point', advanced: 'Foreshortening' } },
      { id: 'art_004', word: 'Portrait',      hints: { beginner: 'Face',         intermediate: 'Subject',        advanced: 'Likeness' } },
      { id: 'art_005', word: 'Abstract',      hints: { beginner: 'No shape',     intermediate: 'Emotion',        advanced: 'Non-objective' } },
      { id: 'art_006', word: 'Typography',    hints: { beginner: 'Font',         intermediate: 'Kerning',        advanced: 'Baseline grid' } },
      { id: 'art_007', word: 'Composition',   hints: { beginner: 'Arrange',      intermediate: 'Rule of thirds', advanced: 'Gestalt' } },
      { id: 'art_008', word: 'Chiaroscuro',   hints: { beginner: 'Shadow',       intermediate: 'Contrast',       advanced: 'Tenebrism' } },
      { id: 'art_009', word: 'Impressionism', hints: { beginner: 'Monet',        intermediate: 'Brushwork',      advanced: 'Pointillism' } },
      { id: 'art_010', word: 'Collage',       hints: { beginner: 'Cut paste',    intermediate: 'Mixed media',    advanced: 'Assemblage' } },
      { id: 'art_011', word: 'Fresco',        hints: { beginner: 'Wall paint',   intermediate: 'Plaster',        advanced: 'Buon fresco' } },
      { id: 'art_012', word: 'Palette',       hints: { beginner: 'Colours',      intermediate: 'Mix',            advanced: 'Hue range' } },
      { id: 'art_013', word: 'Negative Space', hints: { beginner: 'Empty',       intermediate: 'Surround',       advanced: 'Figure ground' } },
      { id: 'art_014', word: 'Symmetry',      hints: { beginner: 'Mirror',       intermediate: 'Balance',        advanced: 'Bilateral' } },
      { id: 'art_015', word: 'Texture',       hints: { beginner: 'Feel',         intermediate: 'Surface',        advanced: 'Tactile' } },
      { id: 'art_016', word: 'Graffiti',      hints: { beginner: 'Spray can',    intermediate: 'Street',         advanced: 'Tag' } },
      { id: 'art_017', word: 'Illustration',  hints: { beginner: 'Drawing',      intermediate: 'Narrative',      advanced: 'Editorial' } },
      { id: 'art_018', word: 'Installation',  hints: { beginner: 'Gallery',      intermediate: 'Site-specific',  advanced: 'Immersive' } },
      { id: 'art_019', word: 'Origami',       hints: { beginner: 'Paper fold',   intermediate: 'Crease',         advanced: 'Valley fold' } },
      { id: 'art_020', word: 'Mosaic',        hints: { beginner: 'Tiles',        intermediate: 'Grout',          advanced: 'Tesserae' } },
      { id: 'art_021', word: 'Lithography',   hints: { beginner: 'Print',        intermediate: 'Stone',          advanced: 'Planographic' } },
      { id: 'art_022', word: 'Animation',     hints: { beginner: 'Frames',       intermediate: 'Keyframe',       advanced: 'Tweening' } },
      { id: 'art_023', word: 'Branding',      hints: { beginner: 'Logo',         intermediate: 'Identity',       advanced: 'Brand equity' } },
      { id: 'art_024', word: 'Contrast',      hints: { beginner: 'Difference',   intermediate: 'Light dark',     advanced: 'Juxtaposition' } },
      { id: 'art_025', word: 'Sketch',        hints: { beginner: 'Draft',        intermediate: 'Loose',          advanced: 'Thumbnail' } },
      { id: 'art_026', word: 'Cubism',        hints: { beginner: 'Picasso',      intermediate: 'Fragmented',     advanced: 'Analytical' } },
      { id: 'art_027', word: 'Hue',           hints: { beginner: 'Colour name',  intermediate: 'Spectrum',       advanced: 'Chromaticity' } },
      { id: 'art_028', word: 'Etching',       hints: { beginner: 'Scratch',      intermediate: 'Acid',           advanced: 'Intaglio' } },
      { id: 'art_029', word: 'Surrealism',    hints: { beginner: 'Dream',        intermediate: 'Dali',           advanced: 'Uncanny' } },
    ]
  },
```

- [ ] **Step 7: Add the `jobs` category (30 words)**

```js
  jobs: {
    label: 'Jobs & Careers',
    emoji: '🏙️',
    entries: [
      { id: 'jobs_000', word: 'Chef',          hints: { beginner: 'Cook',         intermediate: 'Kitchen',        advanced: 'Mise en place' } },
      { id: 'jobs_001', word: 'Pilot',         hints: { beginner: 'Fly',          intermediate: 'Cockpit',        advanced: 'IFR' } },
      { id: 'jobs_002', word: 'Surgeon',       hints: { beginner: 'Operate',      intermediate: 'Scalpel',        advanced: 'Anastomosis' } },
      { id: 'jobs_003', word: 'Architect',     hints: { beginner: 'Design',       intermediate: 'Blueprint',      advanced: 'Load bearing' } },
      { id: 'jobs_004', word: 'Detective',     hints: { beginner: 'Solve',        intermediate: 'Evidence',       advanced: 'Deduction' } },
      { id: 'jobs_005', word: 'Teacher',       hints: { beginner: 'Lesson',       intermediate: 'Curriculum',     advanced: 'Pedagogy' } },
      { id: 'jobs_006', word: 'Astronaut',     hints: { beginner: 'Space',        intermediate: 'EVA',            advanced: 'Microgravity' } },
      { id: 'jobs_007', word: 'Lawyer',        hints: { beginner: 'Court',        intermediate: 'Brief',          advanced: 'Tort' } },
      { id: 'jobs_008', word: 'Firefighter',   hints: { beginner: 'Hose',         intermediate: 'Ladder',         advanced: 'Flash point' } },
      { id: 'jobs_009', word: 'Nurse',         hints: { beginner: 'Care',         intermediate: 'Ward',           advanced: 'Triage' } },
      { id: 'jobs_010', word: 'Engineer',      hints: { beginner: 'Build',        intermediate: 'Specs',          advanced: 'Tolerance' } },
      { id: 'jobs_011', word: 'Accountant',    hints: { beginner: 'Numbers',      intermediate: 'Balance sheet',  advanced: 'Amortisation' } },
      { id: 'jobs_012', word: 'Journalist',    hints: { beginner: 'Article',      intermediate: 'Deadline',       advanced: 'Byline' } },
      { id: 'jobs_013', word: 'Scientist',     hints: { beginner: 'Lab',          intermediate: 'Experiment',     advanced: 'Hypothesis' } },
      { id: 'jobs_014', word: 'Programmer',    hints: { beginner: 'Code',         intermediate: 'Debug',          advanced: 'Algorithm' } },
      { id: 'jobs_015', word: 'Farmer',        hints: { beginner: 'Crop',         intermediate: 'Harvest',        advanced: 'Yield' } },
      { id: 'jobs_016', word: 'Artist',        hints: { beginner: 'Paint',        intermediate: 'Gallery',        advanced: 'Oeuvre' } },
      { id: 'jobs_017', word: 'Musician',      hints: { beginner: 'Perform',      intermediate: 'Rehearse',       advanced: 'Improvise' } },
      { id: 'jobs_018', word: 'Doctor',        hints: { beginner: 'Diagnose',     intermediate: 'Stethoscope',    advanced: 'Prognosis' } },
      { id: 'jobs_019', word: 'Soldier',       hints: { beginner: 'Army',         intermediate: 'Rank',           advanced: 'Garrison' } },
      { id: 'jobs_020', word: 'Astronomer',    hints: { beginner: 'Stars',        intermediate: 'Observatory',    advanced: 'Spectroscopy' } },
      { id: 'jobs_021', word: 'Psychologist',  hints: { beginner: 'Mind',         intermediate: 'Therapy',        advanced: 'Cognition' } },
      { id: 'jobs_022', word: 'Electrician',   hints: { beginner: 'Wire',         intermediate: 'Circuit',        advanced: 'Amperage' } },
      { id: 'jobs_023', word: 'Plumber',       hints: { beginner: 'Pipe',         intermediate: 'Leak',           advanced: 'Solder joint' } },
      { id: 'jobs_024', word: 'Carpenter',     hints: { beginner: 'Wood',         intermediate: 'Joint',          advanced: 'Dovetail' } },
      { id: 'jobs_025', word: 'Dentist',       hints: { beginner: 'Teeth',        intermediate: 'Cavity',         advanced: 'Occlusion' } },
      { id: 'jobs_026', word: 'Librarian',     hints: { beginner: 'Books',        intermediate: 'Catalogue',      advanced: 'Dewey decimal' } },
      { id: 'jobs_027', word: 'Sailor',        hints: { beginner: 'Ship',         intermediate: 'Navigation',     advanced: 'Starboard' } },
      { id: 'jobs_028', word: 'Photographer',  hints: { beginner: 'Camera',       intermediate: 'Exposure',       advanced: 'Bokeh' } },
      { id: 'jobs_029', word: 'Vet',           hints: { beginner: 'Animals',      intermediate: 'Diagnosis',      advanced: 'Anaesthesia' } },
    ]
  },
```

- [ ] **Step 8: Add the `objects` category (30 words)**

```js
  objects: {
    label: 'Everyday Objects',
    emoji: '🧪',
    entries: [
      { id: 'objects_000', word: 'Elevator',       hints: { beginner: 'Floor button',  intermediate: 'Cable',          advanced: 'Counterweight' } },
      { id: 'objects_001', word: 'Umbrella',       hints: { beginner: 'Rain',          intermediate: 'Canopy',         advanced: 'Ribs' } },
      { id: 'objects_002', word: 'Scissors',       hints: { beginner: 'Cut',           intermediate: 'Blade',          advanced: 'Pivot' } },
      { id: 'objects_003', word: 'Candle',         hints: { beginner: 'Flame',         intermediate: 'Wax',            advanced: 'Wick' } },
      { id: 'objects_004', word: 'Compass',        hints: { beginner: 'North',         intermediate: 'Needle',         advanced: 'Declination' } },
      { id: 'objects_005', word: 'Magnifying Glass', hints: { beginner: 'Bigger',      intermediate: 'Lens',           advanced: 'Convex' } },
      { id: 'objects_006', word: 'Stapler',        hints: { beginner: 'Bind',          intermediate: 'Staple',         advanced: 'Magazine' } },
      { id: 'objects_007', word: 'Thermometer',    hints: { beginner: 'Temperature',   intermediate: 'Mercury',        advanced: 'Calibration' } },
      { id: 'objects_008', word: 'Hourglass',      hints: { beginner: 'Sand',          intermediate: 'Timer',          advanced: 'Ampulla' } },
      { id: 'objects_009', word: 'Torch',          hints: { beginner: 'Light',         intermediate: 'Battery',        advanced: 'Lumens' } },
      { id: 'objects_010', word: 'Safe',           hints: { beginner: 'Lock',          intermediate: 'Combination',    advanced: 'Bolts' } },
      { id: 'objects_011', word: 'Ladder',         hints: { beginner: 'Climb',         intermediate: 'Rung',           advanced: 'Stile' } },
      { id: 'objects_012', word: 'Telescope',      hints: { beginner: 'See far',       intermediate: 'Lens',           advanced: 'Focal length' } },
      { id: 'objects_013', word: 'Microscope',     hints: { beginner: 'Small',         intermediate: 'Lens',           advanced: 'Objective' } },
      { id: 'objects_014', word: 'Scale',          hints: { beginner: 'Weigh',         intermediate: 'Balance',        advanced: 'Calibrated' } },
      { id: 'objects_015', word: 'Calculator',     hints: { beginner: 'Add',           intermediate: 'Display',        advanced: 'Logarithm' } },
      { id: 'objects_016', word: 'Typewriter',     hints: { beginner: 'Keys',          intermediate: 'Ribbon',         advanced: 'Carriage return' } },
      { id: 'objects_017', word: 'Suitcase',       hints: { beginner: 'Travel',        intermediate: 'Handle',         advanced: 'Roller' } },
      { id: 'objects_018', word: 'Parachute',      hints: { beginner: 'Fall slow',     intermediate: 'Canopy',         advanced: 'Deployment bag' } },
      { id: 'objects_019', word: 'Handcuffs',      hints: { beginner: 'Arrest',        intermediate: 'Chain',          advanced: 'Ratchet' } },
      { id: 'objects_020', word: 'Hammer',         hints: { beginner: 'Nail',          intermediate: 'Head',           advanced: 'Claw end' } },
      { id: 'objects_021', word: 'Padlock',        hints: { beginner: 'Lock',          intermediate: 'Shackle',        advanced: 'Cylinder' } },
      { id: 'objects_022', word: 'Megaphone',      hints: { beginner: 'Loud',          intermediate: 'Cone',           advanced: 'Amplify' } },
      { id: 'objects_023', word: 'Briefcase',      hints: { beginner: 'Carry',         intermediate: 'Clasp',          advanced: 'Attache' } },
      { id: 'objects_024', word: 'Binoculars',     hints: { beginner: 'Far',           intermediate: 'Prism',          advanced: 'Diopter' } },
      { id: 'objects_025', word: 'Globe',          hints: { beginner: 'Spin',          intermediate: 'Meridian',       advanced: 'Graticule' } },
      { id: 'objects_026', word: 'Abacus',         hints: { beginner: 'Beads',         intermediate: 'Count',          advanced: 'Soroban' } },
      { id: 'objects_027', word: 'Pendulum',       hints: { beginner: 'Swing',         intermediate: 'Period',         advanced: 'Amplitude' } },
      { id: 'objects_028', word: 'Periscope',      hints: { beginner: 'See above',     intermediate: 'Prism',          advanced: 'Submarine' } },
      { id: 'objects_029', word: 'Boomerang',      hints: { beginner: 'Return',        intermediate: 'Throw',          advanced: 'Airfoil' } },
    ]
  },
```

- [ ] **Step 9: Verify the file compiles with no errors**

```bash
cd c:/Aadit/Personal/code-ide/Claude-Code/spy-game
npm run build 2>&1 | tail -20
```

Expected: no errors, bundle output shown.

- [ ] **Step 10: Commit**

```bash
git add src/data/categories.js
git commit -m "feat: add 8 new word categories (music, history, body, gaming, science, art, jobs, objects)"
```

---

## Task 2: UI Polish — Global Tokens + Font Upgrade

**Files:**
- Modify: `src/index.css`

The current font is Inter everywhere. We'll add **Syne** as a display font for titles/headings and introduce new tokens. Syne is bold, geometric, futuristic — perfect for a spy game.

- [ ] **Step 1: Update the Google Fonts import and add Syne tokens**

In `src/index.css`, replace line 1:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Syne:wght@700;800;900&display=swap');
```

- [ ] **Step 2: Add `--font-display` token and richer glow tokens to `:root`**

After `--font-mono` line, add:

```css
  --font-display: 'Syne', system-ui, sans-serif;

  /* Richer accent tones */
  --color-accent-4:     #06b6d4; /* cyan accent for secondary highlights */
  --color-accent-warn:  #f59e0b; /* amber for spy/warn states */

  /* Stronger glow variants */
  --shadow-glow-md: 0 0 40px var(--color-accent-glow), 0 0 16px var(--color-accent-glow-sm);
  --shadow-glow-lg: 0 0 80px rgba(139, 92, 246, 0.5), 0 0 30px rgba(236, 72, 153, 0.3);
```

- [ ] **Step 3: Apply display font to all headings**

Change the `h1, h2, h3, h4, h5, h6` rule:

```css
h1, h2, h3, h4, h5, h6 {
  color: var(--color-text-strong);
  font-family: var(--font-display);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.04em;
}
```

- [ ] **Step 4: Add a scanlines keyframe animation for background texture feel**

After the `@keyframes float` block:

```css
@keyframes scanline {
  0%   { background-position: 0 0; }
  100% { background-position: 0 4px; }
}

@keyframes orbPulse {
  0%, 100% { transform: scale(1); opacity: 0.35; }
  50%       { transform: scale(1.08); opacity: 0.45; }
}

.animate-slide-down { animation: slideDown var(--transition-slow) both; }
```

- [ ] **Step 5: Commit**

```bash
git add src/index.css
git commit -m "style: add Syne display font, richer tokens, slideDown animation class"
```

---

## Task 3: HomeScreen Visual Redesign

**Files:**
- Modify: `src/screens/HomeScreen.css`

Goal: Scanline texture overlay, particle-dot grid background, bigger title with Syne, spy silhouette hint using CSS, neon underline on subtitle.

- [ ] **Step 1: Replace the full HomeScreen.css with the new design**

```css
/* ─── HomeScreen Layout ───────────────────────────────────────────── */
.home-screen {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: var(--space-6);
  gap: var(--space-6);
}

/* ─── Multi-layer Background ─────────────────────────────────────── */
.home-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

/* Dot-grid texture */
.home-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(139, 92, 246, 0.18) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%);
  animation: dotGridShift 20s linear infinite;
}

@keyframes dotGridShift {
  from { background-position: 0 0; }
  to   { background-position: 32px 32px; }
}

/* Scanlines overlay */
.home-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.06) 2px,
    rgba(0, 0, 0, 0.06) 4px
  );
  pointer-events: none;
  z-index: 2;
}

.home-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: orbPulse 6s ease-in-out infinite;
  will-change: transform, opacity;
}

.home-orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  top: -200px;
  left: -150px;
  opacity: 0.4;
  animation-duration: 7s;
  animation-delay: 0s;
}

.home-orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #ec4899 0%, transparent 70%);
  bottom: -130px;
  right: -130px;
  opacity: 0.35;
  animation-duration: 9s;
  animation-delay: -3s;
}

.home-orb-3 {
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.15;
  animation-duration: 12s;
  animation-delay: -6s;
}

.home-bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%,   rgba(139, 92, 246, 0.14) 0%, transparent 70%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(236, 72, 153, 0.10) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 0% 80%,    rgba(6, 182, 212, 0.06)  0%, transparent 60%);
}

/* ─── Content ─────────────────────────────────────────────────────── */
.home-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-8);
  max-width: 480px;
  width: 100%;
}

/* ─── Title Badge ─────────────────────────────────────────────────── */
.home-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 7px 16px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.35);
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(196, 148, 255, 0.9);
  animation: fadeIn 0.6s ease both;
  backdrop-filter: blur(8px);
}

.home-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent-2);
  box-shadow: 0 0 8px var(--color-accent-2);
  animation: pulse 2s ease-in-out infinite;
}

/* ─── Headings ────────────────────────────────────────────────────── */
.home-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  animation: slideUp 0.7s ease both;
  animation-delay: 100ms;
}

.home-title {
  font-family: var(--font-display);
  font-size: clamp(7rem, 22vw, 11rem);
  font-weight: 900;
  letter-spacing: -0.08em;
  line-height: 0.85;
  background: linear-gradient(
    135deg,
    #e0aaff 0%,
    #c77dff 20%,
    #ff6b9d 55%,
    #ff9a44 85%,
    #c77dff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation:
    titleFlow 6s ease-in-out infinite alternate,
    slideUp 0.7s ease both;
  filter: drop-shadow(0 0 50px rgba(199, 125, 255, 0.5));
  position: relative;
}

@keyframes titleFlow {
  0%   { background-position: 0%   50%; }
  100% { background-position: 100% 50%; }
}

.home-subtitle {
  font-size: clamp(0.875rem, 2.2vw, 1.0625rem);
  color: var(--color-text-muted);
  font-weight: 400;
  letter-spacing: 0.04em;
  max-width: 280px;
  position: relative;
  padding-bottom: var(--space-3);
}

.home-subtitle::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent-1), transparent);
  animation: lineGlow 2.5s ease-in-out infinite;
}

@keyframes lineGlow {
  0%, 100% { width: 40px; opacity: 0.5; }
  50%       { width: 80px; opacity: 1; }
}

/* ─── Buttons ─────────────────────────────────────────────────────── */
.home-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  width: 100%;
  max-width: 320px;
  animation: slideUp 0.7s ease both;
  animation-delay: 200ms;
}

.btn-start {
  width: 100%;
  padding: 18px var(--space-8);
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #ec4899 100%);
  color: #fff;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition:
    transform var(--transition-spring),
    box-shadow var(--transition-base);
  box-shadow:
    0 0 30px rgba(139, 92, 246, 0.5),
    0 4px 24px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: startPulse 3s ease-in-out infinite;
}

@keyframes startPulse {
  0%, 100% {
    box-shadow:
      0 0 30px rgba(139, 92, 246, 0.5),
      0 4px 24px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow:
      0 0 60px rgba(168, 85, 247, 0.7),
      0 0 20px rgba(236, 72, 153, 0.45),
      0 4px 24px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
}

.btn-start::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.btn-start::after {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  transition: left 0.5s ease;
}

.btn-start:hover {
  transform: translateY(-3px) scale(1.02);
  animation: none;
  box-shadow:
    0 0 70px rgba(168, 85, 247, 0.75),
    0 0 24px rgba(236, 72, 153, 0.5),
    0 8px 30px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-start:hover::before { opacity: 1; }
.btn-start:hover::after  { left: 150%; }
.btn-start:active { transform: scale(0.97); }

.btn-start-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.btn-start-icon {
  font-size: 1.2em;
  display: inline-flex;
  animation: float 2.5s ease-in-out infinite;
}

.btn-how-to-play {
  width: 100%;
  padding: 14px var(--space-8);
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-text);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition:
    background var(--transition-base),
    border-color var(--transition-base),
    color var(--transition-base),
    transform var(--transition-spring);
  backdrop-filter: blur(8px);
}

.btn-how-to-play:hover {
  background: rgba(139, 92, 246, 0.08);
  border-color: rgba(139, 92, 246, 0.4);
  color: var(--color-text-strong);
  transform: translateY(-1px);
}

.btn-how-to-play:active { transform: scale(0.97); }

/* ─── Footer hint ─────────────────────────────────────────────────── */
.home-footer {
  position: relative;
  z-index: 1;
  font-size: 0.7rem;
  color: var(--color-text-muted);
  opacity: 0.5;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  animation: fadeIn 1.2s ease both;
  animation-delay: 500ms;
}
```

- [ ] **Step 2: Verify the home screen looks good**

```bash
npm run dev
```

Open browser at http://localhost:5173 and verify:
- Title "SPY" uses Syne font, gradient flows
- Dot grid visible in background
- Start button has shimmer hover effect
- Subtitle has animated underline

- [ ] **Step 3: Commit**

```bash
git add src/screens/HomeScreen.css
git commit -m "style: redesign HomeScreen with dot-grid bg, Syne font, shimmer button"
```

---

## Task 4: SetupScreen Category Cards Polish

**Files:**
- Modify: `src/screens/SetupScreen.css`

- [ ] **Step 1: Read the current SetupScreen.css to understand existing styles**

```bash
cat src/screens/SetupScreen.css
```

- [ ] **Step 2: Find and update `.category-card` and `.category-card.active` rules**

Locate the `.category-card` block and replace with:

```css
.category-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-4) var(--space-3);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background var(--transition-base),
    border-color var(--transition-base),
    transform var(--transition-spring),
    box-shadow var(--transition-base);
  text-align: center;
  min-height: 80px;
  justify-content: center;
}

.category-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(139, 92, 246, 0.3);
  transform: translateY(-2px);
}

.category-card.active {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(236, 72, 153, 0.08));
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 16px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.06);
  transform: translateY(-2px);
}

.category-emoji {
  font-size: 1.5rem;
  line-height: 1;
  transition: transform var(--transition-spring);
}

.category-card.active .category-emoji {
  transform: scale(1.2);
  filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.6));
}

.category-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-strong);
  letter-spacing: -0.01em;
}

.category-count {
  font-size: 0.65rem;
  color: var(--color-text-muted);
}
```

- [ ] **Step 3: Update `.category-grid` spacing**

```css
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-3);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/screens/SetupScreen.css
git commit -m "style: polish category cards with active glow, emoji scale, grid layout"
```

---

## Task 5: VotingScreen + ResultsScreen Card Lift

**Files:**
- Modify: `src/screens/VotingScreen.css`
- Modify: `src/screens/ResultsScreen.css`

- [ ] **Step 1: In VotingScreen.css, find `.vs-player-card` and add hover lift + selection glow ring animation**

```css
/* After existing .vs-player-card rule, add/update: */
.vs-player-card {
  /* existing styles stay — add these: */
  transition:
    transform var(--transition-spring),
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.vs-player-card:hover:not(.vs-player-card-selected) {
  transform: translateY(-3px) scale(1.02);
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

.vs-player-card-selected {
  animation: selectedPulse 1.5s ease-in-out infinite;
}

@keyframes selectedPulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.6), 0 0 20px rgba(139, 92, 246, 0.3); }
  50%       { box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.9), 0 0 40px rgba(139, 92, 246, 0.5); }
}
```

- [ ] **Step 2: In ResultsScreen.css, find `.rs-tally-bar` and add gradient + transition**

```css
.rs-tally-bar {
  height: 100%;
  border-radius: var(--radius-full);
  background: linear-gradient(90deg, var(--color-accent-1), var(--color-accent-2));
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.rs-tally-bar-accent {
  background: linear-gradient(90deg, #f59e0b, #ec4899);
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/screens/VotingScreen.css src/screens/ResultsScreen.css
git commit -m "style: voting card hover lift + selected pulse, results tally gradient"
```

---

## Task 6: ScoreboardScreen Winner Spotlight

**Files:**
- Modify: `src/screens/ScoreboardScreen.css`

- [ ] **Step 1: Find `.sb-card-winner` rule and add spotlight glow**

```css
.sb-card-winner {
  /* existing styles + add: */
  box-shadow:
    0 0 0 1px rgba(139, 92, 246, 0.5),
    0 0 40px rgba(139, 92, 246, 0.25),
    0 8px 30px rgba(0,0,0,0.5);
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.12),
    rgba(236, 72, 153, 0.08)
  ) !important;
  animation: winnerGlow 2.5s ease-in-out infinite;
}

@keyframes winnerGlow {
  0%, 100% { box-shadow: 0 0 0 1px rgba(139,92,246,0.5), 0 0 40px rgba(139,92,246,0.25), 0 8px 30px rgba(0,0,0,0.5); }
  50%       { box-shadow: 0 0 0 2px rgba(168,85,247,0.8), 0 0 70px rgba(139,92,246,0.45), 0 8px 30px rgba(0,0,0,0.5); }
}
```

- [ ] **Step 2: Find `.sb-score-num-winner` and boost font**

```css
.sb-score-num-winner {
  font-family: var(--font-display);
  font-size: 1.75rem;
  background: linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/screens/ScoreboardScreen.css
git commit -m "style: winner card spotlight glow, gradient score number"
```

---

## Task 7: Fix Game Logic — Tie Votes, Spy-Majority Win, PlayAgain Rotation

**Files:**
- Modify: `src/store/gameStore.js` lines 181–234 (`tallyVotes`), lines 316–344 (`playAgain`)
- Modify: `src/screens/ResultsScreen.jsx`

### Rules being implemented

1. **Tie vote → no elimination.** If two or more players share the highest vote count, nobody is voted out and the round continues. The word and spy do NOT change — players just discuss again.
2. **Spy-majority win condition.** After any vote, if `remainingSpies.length >= remainingInnocents.length` (and spies > 0), the spies win immediately. This covers: 1 spy vs 1 crewmate (they'd keep tying forever), 2 spies vs 1 crewmate, etc.
3. **PlayAgain rotation.** When a new game starts via "Play Again", `sessionIndex` increments by 1. `startIdx = newSessionIndex % players.length`. This means the second game starts reveals from the player right after the first game's first revealer. Already partially implemented — plan confirms correct formula.

- [ ] **Step 1: Replace `tallyVotes` in `src/store/gameStore.js`**

Find lines 181–234 (the `tallyVotes` function) and replace the entire function body with:

```js
  tallyVotes: () => {
    const { votes, players, eliminatedIds, currentRound } = get()
    const eliminatedSet = new Set(eliminatedIds)
    const activePlayers = players.filter(p => !eliminatedSet.has(p.id))

    // Build tally map: playerId → vote count
    const tally = {}
    for (const targetId of Object.values(votes)) {
      tally[targetId] = (tally[targetId] ?? 0) + 1
    }

    const maxVotes = Object.values(tally).length
      ? Math.max(...Object.values(tally))
      : 0
    const topIds = Object.keys(tally).filter(id => tally[id] === maxVotes)

    // TIE: more than one player shares the top vote count → nobody eliminated
    const isTie = topIds.length > 1
    const votedOutId = isTie ? null : (topIds[0] ?? null)
    const votedOut = votedOutId
      ? (activePlayers.find(p => p.id === votedOutId) ?? null)
      : null
    const spyVotedOut = votedOut?.role === 'spy'

    // Compute post-vote remaining players
    const newEliminatedIds = votedOutId
      ? [...eliminatedIds, votedOutId]
      : [...eliminatedIds]
    const newEliminatedSet = new Set(newEliminatedIds)
    const remainingPlayers = players.filter(p => !newEliminatedSet.has(p.id))
    const remainingSpies = remainingPlayers.filter(p => p.role === 'spy')
    const remainingInnocents = remainingPlayers.filter(p => p.role === 'innocent')

    // Win conditions:
    // 1. Spy voted out → spy gets word-guess chance (handled in spyGuess)
    // 2. Spies outnumber or equal crewmates → spies win (crewmates can never form majority)
    // 3. No innocents left → spies win
    let winner = null
    if (remainingSpies.length > 0 && remainingSpies.length >= remainingInnocents.length) {
      winner = 'spy'
    }

    // Award points (only when someone was eliminated)
    const updatedPlayers = players.map(p => {
      if (spyVotedOut && p.role === 'innocent') return { ...p, score: p.score + 2 }
      if (!spyVotedOut && !isTie && p.role === 'spy') return { ...p, score: p.score + 2 }
      return p
    })

    set(state => ({
      players: updatedPlayers,
      eliminatedIds: newEliminatedIds,
      roundResults: [
        ...state.roundResults,
        { round: currentRound, type: 'vote', votedOut, spyVotedOut, isTie, winner },
      ],
      winner,
      screen: 'results',
    }))

    return votedOut
  },
```

- [ ] **Step 2: Verify `playAgain` rotation formula in `src/store/gameStore.js`**

Read lines 316–344. The formula is:
```js
const newSessionIndex = sessionIndex + 1
const startIdx = newSessionIndex % players.length
```

This is already correct — `playAgain` increments `sessionIndex` by 1, so the next game starts one player later in the roster. No code change needed if the formula matches. If `sessionIndex` is not being incremented, update the line:

```js
// Inside playAgain(), confirm these two lines exist exactly:
const newSessionIndex = sessionIndex + 1
// ...
sessionIndex: newSessionIndex,
```

- [ ] **Step 3: Update `ResultsScreen.jsx` to handle tie and no-elimination cases**

In `src/screens/ResultsScreen.jsx`, find the `VotedOutBanner` call section (around line 365–368) and replace the entire section 2 block:

```jsx
{/* 2. Voted-out reveal or tie banner */}
<section className="rs-section" aria-label="Voted out player">
  {latestResult?.isTie ? (
    <div className="rs-tie-banner animate-scale-in" role="status">
      <span className="rs-tie-icon">⚖️</span>
      <h3 className="rs-tie-title">It's a Tie!</h3>
      <p className="rs-tie-msg">No one was voted out — the discussion continues.</p>
    </div>
  ) : (
    <VotedOutBanner player={votedOut} />
  )}
</section>
```

- [ ] **Step 4: Update `SpyReveal` section to skip when isTie and no one voted out**

In `src/screens/ResultsScreen.jsx`, find section 3 (the `SpyReveal` block) and wrap it:

```jsx
{/* 3. Spy reveal — only shown when someone was actually voted out */}
{!latestResult?.isTie && (
  <section className="rs-section" aria-label="Spy verdict">
    <SpyReveal
      spyVotedOut={spyVotedOut}
      votedOut={votedOut}
      onSpyGuessPhase={handleSpyGuessPhase}
    />
  </section>
)}
```

- [ ] **Step 5: Auto-advance revealDone when tie (no reveal animation needed)**

In `ResultsScreen.jsx`, update the `useEffect` that handles non-spy-caught cases:

```jsx
// When spy is NOT caught OR it's a tie, mark reveal done after delay
useEffect(() => {
  if (!spyVotedOut) {
    const delay = latestResult?.isTie ? 800 : 3200
    const t = setTimeout(() => setRevealDone(true), delay)
    return () => clearTimeout(t)
  }
}, [spyVotedOut, latestResult?.isTie])
```

- [ ] **Step 6: Add tie banner CSS to `src/screens/ResultsScreen.css`**

Append to the end of `src/screens/ResultsScreen.css`:

```css
/* ─── Tie Banner ─────────────────────────────────────────────────── */
.rs-tie-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6) var(--space-8);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(251, 191, 36, 0.06));
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: var(--radius-lg);
  text-align: center;
}

.rs-tie-icon {
  font-size: 2.5rem;
}

.rs-tie-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: #fbbf24;
  margin: 0;
}

.rs-tie-msg {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  max-width: 260px;
}
```

- [ ] **Step 7: Update the "Next Round" button label for tie rounds**

In `ResultsScreen.jsx`, find the footer CTA button and update the label logic:

```jsx
<button
  id="btn-next-round"
  className={`rs-cta-btn ${winner ? 'rs-cta-btn-final' : 'rs-cta-btn-next'}`}
  onClick={nextRound}
  aria-label={winner ? 'View scores' : latestResult?.isTie ? 'Continue discussion' : `Start round ${currentRound + 1}`}
>
  <span>{winner ? '🏆' : latestResult?.isTie ? '🔄' : '▶'}</span>
  {winner ? 'View Scores' : latestResult?.isTie ? 'Continue' : 'Next Round'}
</button>
```

- [ ] **Step 8: Fix `nextRound` in store so tie rounds don't increment round counter**

In `src/store/gameStore.js`, the `nextRound` action currently routes to `scoreboard` when no winner. For tie rounds, we want to go straight back to `vote` without a scoreboard detour, and without calling `startNextRound` (which picks a new word). Add a `continueTiedRound` action:

```js
  // Called when a tie vote occurred — restart voting with same word, same players
  continueTiedRound: () => {
    const { players, eliminatedIds, sessionIndex, currentRound } = get()
    const eliminatedSet = new Set(eliminatedIds)
    const startIdx = (sessionIndex + currentRound) % players.length
    const revealOrder = buildRevealOrder(players, eliminatedSet, startIdx)

    set({
      revealOrder,
      currentRevealIndex: 0,
      votes: {},
      screen: 'vote',
    })
  },
```

- [ ] **Step 9: Wire `continueTiedRound` into ResultsScreen**

In `src/screens/ResultsScreen.jsx`, import and use the new action. At the top of the component:

```jsx
const continueTiedRound = useGameStore((s) => s.continueTiedRound)
```

Update the footer CTA `onClick` to use it when tied:

```jsx
onClick={latestResult?.isTie ? continueTiedRound : nextRound}
```

- [ ] **Step 10: Test the full tie flow manually**

```bash
npm run dev
```

Scenario to test:
1. 4 players, 1 spy, beginner hints
2. After discussion, have 2 players vote player A and 2 vote player B
3. Click "Confirm Vote" for all 4 players
4. Expected: ResultsScreen shows "It's a Tie!" banner, no VotedOutBanner, "Continue" button
5. Click Continue → goes back to VotingScreen (same word, no new spy assigned)
6. This time vote unanimously → normal elimination flow proceeds

- [ ] **Step 11: Test spy-majority win**

1. 3 players, 2 spies (set in setup), 1 innocent
2. Play through one round — vote out the innocent
3. Expected: ResultsScreen shows spy won immediately (no spy-guess input since spy wasn't voted out)

- [ ] **Step 12: Commit**

```bash
git add src/store/gameStore.js src/screens/ResultsScreen.jsx src/screens/ResultsScreen.css
git commit -m "fix: tie votes skip elimination, spy wins on majority, continue tied round action"
```

---

## Task 8: Final Push to Vercel

- [ ] **Step 1: Run full build to verify no errors**

```bash
npm run build 2>&1
```

Expected: `✓ built in X.XXs`, no errors.

- [ ] **Step 2: Push all commits**

```bash
git push origin main
```

Expected: `main -> main` with all task commits shown.

---

## Self-Review

**Spec coverage:**

- ✅ Tie vote → no elimination, "Continue" button loops back to vote — Task 7
- ✅ Spy wins when spies ≥ crewmates (covers 1v1 stalemate) — Task 7
- ✅ PlayAgain rotation: next game starts one player later — Task 7
- ✅ 8 new categories added (music, history, body, gaming, science, art, jobs, objects) — Task 1
- ✅ Syne display font — Task 2
- ✅ HomeScreen redesign — Task 3
- ✅ Category card polish — Task 4
- ✅ Voting card hover/selection — Task 5
- ✅ Results tally gradient — Task 5
- ✅ Scoreboard winner spotlight — Task 6
- ✅ Push to Vercel — Task 8

**Placeholder scan:** All steps contain actual CSS or JS code. No TBDs.

**Type consistency:** `continueTiedRound` added to store and consumed in `ResultsScreen`. `isTie` field added to `roundResults` entries and read as `latestResult?.isTie` in JSX. All new category IDs follow `categoryKey_NNN` pattern.
