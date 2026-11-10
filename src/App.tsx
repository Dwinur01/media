import { GameProvider, useGame } from './context/GameContext'
import { SetupScreen } from './components/setup'
import { GameScreen } from './components/game'
import { ResultScreen } from './components/result'

// ============================================================
//  Router — phase-based screen switcher
// ============================================================

function AppRouter() {
  const { state } = useGame()

  switch (state.phase) {
    case 'setup':
      return <SetupScreen />
    case 'reading':
    case 'answering':
    case 'reveal':
      return <GameScreen />
    case 'result':
      return <ResultScreen />
    default:
      return <SetupScreen />
  }
}

// ============================================================
//  App root
// ============================================================

export default function App() {
  return (
    <GameProvider>
      <AppRouter />
    </GameProvider>
  )
}
