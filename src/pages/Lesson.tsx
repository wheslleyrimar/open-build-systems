import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { lessons } from '../data/lessons'
import { useGame } from '../context/GameContext'
import { Diagram } from '../components/diagrams'
import { Scene3DCanvas } from '../components/Scene3DCanvas'
import { Quiz } from '../components/Quiz'

type Tab = 'diagram' | '3d' | 'steps' | 'quiz'

export function Lesson() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { completeLesson, getLessonProgress } = useGame()
  const [activeTab, setActiveTab] = useState<Tab>('diagram')
  const [stepIndex, setStepIndex] = useState(0)
  const [quizDone, setQuizDone] = useState(false)

  const lesson = lessons.find((l) => l.id === id)
  const progress = lesson ? getLessonProgress(lesson.id) : undefined

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Lição não encontrada.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 text-violet-400 hover:underline"
        >
          Voltar ao início
        </button>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'diagram', label: 'Diagrama', icon: '📐' },
    { id: '3d', label: '3D', icon: '🎮' },
    { id: 'steps', label: 'Conteúdo', icon: '📚' },
    { id: 'quiz', label: 'Quiz', icon: '🎯' },
  ]

  const handleQuizComplete = (score: number) => {
    setQuizDone(true)
    completeLesson(lesson.id, score)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
        <p className="text-slate-400 mt-1">{lesson.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)] pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white'
                : 'bg-[var(--color-surface)] text-slate-400 hover:text-white hover:bg-[var(--color-surface)]/80'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'diagram' && (
          <motion.section
            key="diagram"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="py-4"
          >
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
              <Diagram name={lesson.diagram} />
            </div>
          </motion.section>
        )}

        {activeTab === '3d' && (
          <motion.section
            key="3d"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="py-4"
          >
            <p className="text-slate-400 text-sm mb-2 text-center">
              Arraste para rotacionar • Scroll para zoom
            </p>
            <p className="text-slate-500 text-xs mb-4 text-center max-w-xl mx-auto">
              Os rótulos indicam cada componente (ex.: Load Balancer, servidores). As esferas em movimento mostram o fluxo de requisições ou dados entre eles, alinhado ao conteúdo da lição.
            </p>
            <Scene3DCanvas sceneName={lesson.scene} />
          </motion.section>
        )}

        {activeTab === 'steps' && (
          <motion.section
            key="steps"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="py-4 space-y-6"
          >
            <div className="flex flex-wrap gap-2">
              {lesson.steps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setStepIndex(i)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    stepIndex === i
                      ? 'bg-violet-600 text-white'
                      : 'bg-[var(--color-surface)] text-slate-400 hover:text-white'
                  }`}
                >
                  {i + 1}. {lesson.steps[i].title}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-3">
                  {lesson.steps[stepIndex].title}
                </h3>
                <article className="text-slate-300 leading-relaxed [&_p]:mb-3 [&_h4]:text-white [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_li]:mb-1 [&_strong]:text-white [&_code]:bg-white/10 [&_code]:text-cyan-300 [&_code]:px-1.5 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-[#0f172a] [&_pre]:border [&_pre]:border-slate-700 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-4">
                  <ReactMarkdown
                    components={{
                      code: ({ node, className, children, ...props }) => {
                        const isBlock = className?.includes('language-')
                        if (isBlock) {
                          return (
                            <pre className="my-4 p-4 rounded-xl overflow-x-auto bg-[#0f172a] border border-slate-700">
                              <code className={`text-sm text-slate-300 ${className || ''}`} {...props}>{children}</code>
                            </pre>
                          )
                        }
                        return <code className="bg-white/10 text-cyan-300 px-1.5 rounded text-sm" {...props}>{children}</code>
                      },
                    }}
                  >
                    {lesson.steps[stepIndex].content}
                  </ReactMarkdown>
                </article>
              </motion.div>
            </AnimatePresence>
          </motion.section>
        )}

        {activeTab === 'quiz' && (
          <motion.section
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="py-4"
          >
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 max-w-xl mx-auto">
              {quizDone || progress?.completed ? (
                <div className="text-center py-8">
                  <span className="text-5xl">🎉</span>
                  <h3 className="text-xl font-bold text-white mt-4">Lição concluída!</h3>
                  {progress?.xpEarned != null && (
                    <p className="text-amber-400 font-semibold mt-2">+{progress.xpEarned} XP</p>
                  )}
                  {progress?.quizScore != null && (
                    <p className="text-slate-400 mt-1">Quiz: {progress.quizScore}%</p>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition"
                  >
                    Voltar ao mapa
                  </button>
                </div>
              ) : lesson.quiz && lesson.quiz.length > 0 ? (
                <Quiz questions={lesson.quiz} onComplete={handleQuizComplete} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">Esta lição não tem quiz.</p>
                  <button
                    type="button"
                    onClick={() => {
                      completeLesson(lesson.id)
                      setQuizDone(true)
                    }}
                    className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition"
                  >
                    Marcar como concluída
                  </button>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
