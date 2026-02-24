export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: number
}

export interface LessonProgress {
  lessonId: string
  completed: boolean
  xpEarned: number
  completedAt?: number
  quizScore?: number
}

export interface GameState {
  xp: number
  level: number
  streak: number
  lastVisitDate: string | null
  badges: Badge[]
  lessonProgress: LessonProgress[]
}

export const XP_PER_LEVEL = 500
export const BADGES: Badge[] = [
  { id: 'first-lesson', name: 'Primeiro passo', description: 'Completou a primeira lição', icon: '🚀' },
  { id: 'three-lessons', name: 'Em progresso', description: 'Completou 3 lições', icon: '📚' },
  { id: 'all-lessons', name: 'Arquiteto', description: 'Completou todas as lições', icon: '🏗️' },
  { id: 'streak-3', name: 'Consistente', description: '3 dias seguidos estudando', icon: '🔥' },
  { id: 'streak-7', name: 'Disciplinado', description: '7 dias seguidos estudando', icon: '⭐' },
  { id: 'quiz-master', name: 'Quiz Master', description: 'Acertou 100% em um quiz', icon: '🎯' },
]

export function xpToLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function xpProgressInLevel(xp: number): number {
  return xp % XP_PER_LEVEL
}
