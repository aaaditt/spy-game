import { useGameStore } from './store/gameStore'
import HomeScreen from './screens/HomeScreen'
import './App.css'

// Lazy-import placeholders for future screens — swap these in as they're built
const SCREENS = {
  home: HomeScreen,
  // setup, reveal, play, vote, results, final — to be added
}

function App() {
  const screen = useGameStore((s) => s.screen)
  const Screen = SCREENS[screen] ?? HomeScreen

  return <Screen />
}

export default App
