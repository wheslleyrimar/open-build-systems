import React, { createContext, useContext, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { GameState, LessonProgress } from '../types/game'
import {
  BADGES,
  XP_PER_LEVEL,
  xpToLevel,
  xpProgressInLevel,
} from '../types/game'

const initialState: GameState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastVisitDate: null,
  badges: BADGES.map((b) => ({ ...b, unlockedAt: undefined })),
  lessonProgress: [],
}

interface GameContextValue extends GameState {
  addXP: (amount: number) => void
  completeLesson: (lessonId: string, quizScore?: number) => void
  getLessonProgress: (lessonId: string) => LessonProgress | undefined
  xpProgressInLevel: () => number
  xpToNextLevel: () => number
  unlockedBadges: typeof BADGES
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useLocalStorage<GameState>('system-design-game', initialState)

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString()
    if (state.lastVisitDate === today) return state.streak
    const last = state.lastVisitDate ? new Date(state.lastVisitDate) : null
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (!last || last.toDateString() === yesterday.toDateString()) {
      return state.streak + 1
    }
    return 1
  }, [state.lastVisitDate, state.streak])

  const addXP = useCallback(
    (amount: number) => {
      const today = new Date().toDateString()
      const newStreak = state.lastVisitDate === today ? state.streak : updateStreak()
      setState((prev) => ({
        ...prev,
        xp: prev.xp + amount,
        level: xpToLevel(prev.xp + amount),
        streak: newStreak,
        lastVisitDate: today,
      }))
    },
    [setState, state.lastVisitDate, state.streak, updateStreak]
  )

  const completeLesson = useCallback(
    (lessonId: string, quizScore?: number) => {
      const xpEarned = 50 + (quizScore !== undefined ? Math.round((quizScore / 100) * 50) : 0)
      const today = new Date().toDateString()
      const newStreak = state.lastVisitDate === today ? state.streak : updateStreak()

      setState((prev) => {
        const existing = prev.lessonProgress.find((p) => p.lessonId === lessonId)
        if (existing?.completed) return prev

        const progress: LessonProgress[] = [
          ...prev.lessonProgress.filter((p) => p.lessonId !== lessonId),
          {
            lessonId,
            completed: true,
            xpEarned,
            completedAt: Date.now(),
            quizScore,
          },
        ]

        const completedCount = progress.filter((p) => p.completed).length
        const badges = [...prev.badges]

        if (completedCount >= 1 && !badges.find((b) => b.id === 'first-lesson')?.unlockedAt) {
          const idx = badges.findIndex((b) => b.id === 'first-lesson')
          if (idx >= 0) badges[idx] = { ...badges[idx], unlockedAt: Date.now() }
        }
        if (completedCount >= 3 && !badges.find((b) => b.id === 'three-lessons')?.unlockedAt) {
          const idx = badges.findIndex((b) => b.id === 'three-lessons')
          if (idx >= 0) badges[idx] = { ...badges[idx], unlockedAt: Date.now() }
        }
        if (quizScore === 100 && !badges.find((b) => b.id === 'quiz-master')?.unlockedAt) {
          const idx = badges.findIndex((b) => b.id === 'quiz-master')
          if (idx >= 0) badges[idx] = { ...badges[idx], unlockedAt: Date.now() }
        }
        if (newStreak >= 3 && !badges.find((b) => b.id === 'streak-3')?.unlockedAt) {
          const idx = badges.findIndex((b) => b.id === 'streak-3')
          if (idx >= 0) badges[idx] = { ...badges[idx], unlockedAt: Date.now() }
        }
        if (newStreak >= 7 && !badges.find((b) => b.id === 'streak-7')?.unlockedAt) {
          const idx = badges.findIndex((b) => b.id === 'streak-7')
          if (idx >= 0) badges[idx] = { ...badges[idx], unlockedAt: Date.now() }
        }

        const totalLessons = 5 // match lesson count
        if (completedCount >= totalLessons && !badges.find((b) => b.id === 'all-lessons')?.unlockedAt) {
          const idx = badges.findIndex((b) => b.id === 'all-lessons')
          if (idx >= 0) badges[idx] = { ...badges[idx], unlockedAt: Date.now() }
        }

        return {
          ...prev,
          xp: prev.xp + xpEarned,
          level: xpToLevel(prev.xp + xpEarned),
          streak: newStreak,
          lastVisitDate: today,
          lessonProgress: progress,
          badges,
        }
      })
    },
    [setState, state.lastVisitDate, state.streak, updateStreak]
  )

  const getLessonProgress = useCallback(
    (lessonId: string) => state.lessonProgress.find((p) => p.lessonId === lessonId),
    [state.lessonProgress]
  )

  const xpProgress = xpProgressInLevel(state.xp)
  const xpToNext = XP_PER_LEVEL - xpProgress
  const unlockedBadges = state.badges.filter((b) => b.unlockedAt != null)

  const value: GameContextValue = {
    ...state,
    addXP,
    completeLesson,
    getLessonProgress,
    xpProgressInLevel: () => xpProgress,
    xpToNextLevel: () => xpToNext,
    unlockedBadges,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
