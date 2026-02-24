import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Lesson } from './pages/Lesson'

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lesson/:id" element={<Lesson />} />
          </Routes>
        </Layout>
      </GameProvider>
    </BrowserRouter>
  )
}

export default App
