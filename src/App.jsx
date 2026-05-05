import { useGameStore } from './store/gameStore'
import HomeScreen from './screens/HomeScreen'
import SetupScreen from './screens/SetupScreen'
import RoleRevealScreen from './screens/RoleRevealScreen'
import DiscussionScreen from './screens/DiscussionScreen'
import VotingScreen from './screens/VotingScreen'
import ResultsScreen from './screens/ResultsScreen'
import ScoreboardScreen from './screens/ScoreboardScreen'
import './App.css'

// Screens registered here are rendered by the store's `screen` key
const SCREENS = {
  home:    HomeScreen,
  setup:   SetupScreen,
  reveal:  RoleRevealScreen,
  play:    DiscussionScreen,
  vote:    VotingScreen,
  results: ResultsScreen,
  final:   ScoreboardScreen,
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
