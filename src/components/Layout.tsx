import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { XP_PER_LEVEL } from '../types/game'

export function Layout({ children }: { children: React.ReactNode }) {
  const { level, streak, xpProgressInLevel, unlockedBadges } = useGame()
  const location = useLocation()
  const progress = (xpProgressInLevel() / XP_PER_LEVEL) * 100

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            >
              🏗️
            </motion.span>
            <span className="font-bold text-xl text-white tracking-tight">System Design</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-amber-400">
              <span className="text-lg">🔥</span>
              <span className="font-semibold">{streak}</span>
              <span className="text-slate-400 text-sm">dias</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-28 sm:w-36 h-3 bg-[var(--color-surface)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-amber-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <span className="text-sm font-bold text-amber-400 shrink-0">Nv.{level}</span>
            </div>
            <div className="hidden sm:flex gap-1">
              {unlockedBadges.slice(0, 4).map((b) => (
                <motion.span
                  key={b.id}
                  className="text-lg"
                  title={b.name}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {b.icon}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="border-t border-[var(--color-border)] py-3 text-center text-slate-500 text-sm">
        {location.pathname !== '/' && (
          <Link to="/" className="text-violet-400 hover:text-violet-300 transition">
            ← Voltar ao mapa
          </Link>
        )}
      </footer>
    </div>
  )
}
