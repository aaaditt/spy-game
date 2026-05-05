+# Spy Game Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a local pass-and-play Spy party game with Vite + React

**Architecture:** Single-page app with Zustand state machine, screen-based routing, vanilla CSS design system

**Tech Stack:** Vite, React 18, Zustand, Vanilla CSS, Google Fonts (Inter)

---

## Task 0: Project Scaffold

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`
- Create: `src/main.jsx`, `src/App.jsx`, `src/index.css`

**Step 1:** Initialize Vite project
```bash
npx -y create-vite@latest ./ --template react
```

**Step 2:** Install Zustand
```bash
npm install zustand
```

**Step 3:** Replace `src/index.css` with full design system (CSS custom properties for colors, spacing, radius, glassmorphism, button styles, animation keyframes)

**Step 4:** Verify dev server: `npm run dev`

**Step 5:** Commit: `git init && git add -A && git commit -m "feat: scaffold project"`

---

## Task 1: Game Store (Zustand)

**Files:** Create `src/store/gameStore.js`

**State:** screen, players[], settings{numSpies, rounds, timerMinutes, hintLevel, selectedCategories}, currentRound, currentRevealIndex, secretWord, spyHint, votes, roundResults[]

**Actions:** setScreen, addPlayer, removePlayer, updateSettings, startGame (assign roles + pick word + generate hint), revealNext, castVote, tallyVotes, spyGuess, nextRound, resetGame

**Commit:** `git add -A && git commit -m "feat: add zustand game store"`

---

## Task 2: Word Data

**Files:** Create `src/data/categories.js`

**Structure:** 30 categories (6 easy, 8 medium, 16 hard), each with id, name, emoji, difficulty, and 15-25 words. Each word has hints for beginner/intermediate/advanced levels.

**Commit:** `git add -A && git commit -m "feat: add 30 word categories"`

---

## Task 3: Home Screen

**Files:** Create `src/screens/HomeScreen.jsx`, `src/screens/HomeScreen.css`
**Modify:** `src/App.jsx` — screen router

**Design:** Animated gradient title "SPY", subtitle, Start Game button (gradient purple-to-pink, rounded), How to Play button, background animation

**Commit:** `git add -A && git commit -m "feat: add home screen"`

---

## Task 4: How to Play Modal

**Files:** Create `src/components/HowToPlayModal.jsx`, `src/components/HowToPlayModal.css`

**Design:** Glassmorphism overlay modal, step-by-step instructions with emojis, slide-up animation, close button

**Commit:** `git add -A && git commit -m "feat: add how to play modal"`

---

## Task 5: Setup Screen

**Files:** Create `src/screens/SetupScreen.jsx`, `src/screens/SetupScreen.css`, `src/components/CategoryPicker.jsx`, `src/components/CategoryPicker.css`

**Sections:** Player names input, Number of Spies (1/2), Rounds (1-5), Timer (3/5/7/10/None), Hint Level (None/Beginner/Intermediate/Advanced), Category grid grouped by difficulty

**Commit:** `git add -A && git commit -m "feat: add setup screen with category picker"`

---

## Task 6: Role Reveal Screen

**Files:** Create `src/screens/RoleRevealScreen.jsx`, `src/screens/RoleRevealScreen.css`

**Design:** Cover screen ("Pass to [Name]"), flip card animation for reveal. Crewmate=green with word, Spy=red with skull+hint. "Got it!" to proceed.

**Commit:** `git add -A && git commit -m "feat: add role reveal with flip animation"`

---

## Task 7: Discussion Screen

**Files:** Create `src/screens/DiscussionScreen.jsx`, `src/screens/DiscussionScreen.css`, `src/components/Timer.jsx`

**Design:** Circular countdown timer (pulses red in last 30s), player list, round indicator, category name (not word), "Start Voting" button

**Commit:** `git add -A && git commit -m "feat: add discussion screen with timer"`

---

## Task 8: Voting Screen

**Files:** Create `src/screens/VotingScreen.jsx`, `src/screens/VotingScreen.css`

**Design:** Pass-and-play voting, cover screen per player, grid of names (excluding self), tap to select + confirm

**Commit:** `git add -A && git commit -m "feat: add voting screen"`

---

## Task 9: Results Screen

**Files:** Create `src/screens/ResultsScreen.jsx`, `src/screens/ResultsScreen.css`

**Design:** Vote tally bar chart, dramatic spy reveal animation, win/loss state, spy word guess input, score update display

**Commit:** `git add -A && git commit -m "feat: add results screen"`

---

## Task 10: Scoreboard Screen

**Files:** Create `src/screens/ScoreboardScreen.jsx`, `src/screens/ScoreboardScreen.css`

**Design:** Player rankings sorted by score, trophy emojis for top 3, glow effect on winner, Play Again / New Game / Home buttons

**Commit:** `git add -A && git commit -m "feat: add scoreboard screen"`

---

## Task 11: Polish & Integration

**Files:** Modify `src/App.jsx`, `src/index.css`. Create `src/components/ScreenTransition.jsx`

**Steps:** Add screen transitions, mobile responsive viewport, test full flow, fix visual issues

**Commit:** `git add -A && git commit -m "feat: polish and complete game flow"`
