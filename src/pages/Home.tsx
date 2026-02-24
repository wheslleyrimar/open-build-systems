import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { lessons } from '../data/lessons'

export function Home() {
  const { getLessonProgress, lessonProgress } = useGame()
  const completedCount = lessonProgress.filter((p) => p.completed).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-10"
    >
      <section className="text-center space-y-4">
        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Aprenda <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">System Design</span>
        </motion.h1>
        <motion.p
          className="text-slate-400 max-w-xl mx-auto text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Diagramas interativos, visualizações 3D e quizzes gamificados para dominar arquitetura de sistemas.
        </motion.p>
        <motion.div
          className="flex items-center justify-center gap-4 text-sm text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span>{completedCount} / {lessons.length} lições</span>
          <span>•</span>
          <span>Complete para ganhar XP e conquistas</span>
        </motion.div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson, i) => {
          const progress = getLessonProgress(lesson.id)
          const completed = progress?.completed ?? false
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Link
                to={`/lesson/${lesson.id}`}
                className="block p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-violet-500/50 hover:bg-[var(--color-surface)]/80 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-lg text-white group-hover:text-violet-300 transition">
                      {lesson.title}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 line-clamp-2">{lesson.description}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                      <span>{lesson.duration}</span>
                      <span>•</span>
                      <span className="text-amber-400">+{lesson.xpReward} XP</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {completed ? (
                      <span className="text-2xl" title="Completo">✅</span>
                    ) : (
                      <span className="text-2xl opacity-60 group-hover:opacity-100">📖</span>
                    )}
                  </div>
                </div>
                {completed && progress?.xpEarned != null && (
                  <p className="text-xs text-emerald-400 mt-2">+{progress.xpEarned} XP ganho</p>
                )}
              </Link>
            </motion.div>
          )
        })}
      </section>
    </motion.div>
  )
}
