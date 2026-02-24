import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
}

export function Quiz({
  questions,
  onComplete,
}: {
  questions: QuizQuestion[]
  onComplete: (score: number) => void
}) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const q = questions[index]
  const isLast = index === questions.length - 1

  const handleSubmit = () => {
    if (selected === null) return
    const correct = selected === q.correct
    if (correct) setCorrectCount((c) => c + 1)
    setShowResult(true)
  }

  const handleNext = () => {
    if (isLast) {
      const totalCorrect = correctCount + (selected === q.correct ? 1 : 0)
      const score = Math.round((totalCorrect / questions.length) * 100)
      onComplete(score)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
      setShowResult(false)
    }
  }

  if (!q) return null

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <p className="text-sm text-slate-500">
            Pergunta {index + 1} de {questions.length}
          </p>
          <h3 className="text-lg font-semibold text-white">{q.question}</h3>
          <ul className="space-y-2">
            {q.options.map((opt, i) => {
              const isSelected = selected === i
              const isCorrect = i === q.correct
              const showCorrect = showResult && isCorrect
              const showWrong = showResult && isSelected && !isCorrect
              return (
                <motion.li
                  key={i}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                >
                  <button
                    type="button"
                    onClick={() => !showResult && setSelected(i)}
                    disabled={showResult}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                      showCorrect
                        ? 'border-emerald-500 bg-emerald-500/20'
                        : showWrong
                        ? 'border-red-500/70 bg-red-500/10'
                        : isSelected
                        ? 'border-violet-500 bg-violet-500/20'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-violet-500/50'
                    }`}
                  >
                    <span className="text-slate-200">{opt}</span>
                    {showCorrect && <span className="ml-2 text-emerald-400">✓</span>}
                    {showWrong && <span className="ml-2 text-red-400">✗</span>}
                  </button>
                </motion.li>
              )
            })}
          </ul>
          {!showResult ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selected === null}
              className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-500 transition"
            >
              Confirmar
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/50 hover:bg-cyan-500/30 transition"
            >
              {isLast ? 'Ver resultado' : 'Próxima'}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
