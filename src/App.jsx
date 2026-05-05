import { useGameStore } from './store/gameStore'
import HomeScreen from './screens/HomeScreen'
import RoleRevealScreen from './screens/RoleRevealScreen'
import DiscussionScreen from './screens/DiscussionScreen'
import VotingScreen from './screens/VotingScreen'
import ResultsScreen from './screens/ResultsScreen'
import './App.css'

// Screens registered here are rendered by the store's `screen` key
const SCREENS = {
  home:   HomeScreen,
  reveal: RoleRevealScreen,
  play:   DiscussionScreen,
  vote:    VotingScreen,
  results: ResultsScreen,
  // final — to be added
}

function App() {
  const screen = useGameStore((s) => s.screen)
  const Screen = SCREENS[screen] ?? HomeScreen

  return <Screen />
}

export default App
