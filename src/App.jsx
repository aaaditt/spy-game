import { useGameStore } from './store/gameStore'
import HomeScreen from './screens/HomeScreen'
import RoleRevealScreen from './screens/RoleRevealScreen'
import './App.css'

// Screens registered here are rendered by the store's `screen` key
const SCREENS = {
  home:   HomeScreen,
  reveal: RoleRevealScreen,
  // setup, play, vote, results, final — to be added
}

function App() {
  const screen = useGameStore((s) => s.screen)
  const Screen = SCREENS[screen] ?? HomeScreen

  return <Screen />
}

export default App
