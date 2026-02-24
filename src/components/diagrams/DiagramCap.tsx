import { motion } from 'framer-motion'

export function DiagramCap() {
  return (
    <svg viewBox="0 0 400 210" className="w-full max-w-lg mx-auto" fill="none">
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <rect x="80" y="40" width="100" height="50" rx="8" fill="var(--color-surface)" stroke="#8b5cf6" strokeWidth="2" />
        <text x="130" y="72" textAnchor="middle" fill="#e2e8f0" fontSize="11">Consistência (C)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <rect x="220" y="40" width="100" height="50" rx="8" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="270" y="72" textAnchor="middle" fill="#e2e8f0" fontSize="11">Disponibilidade (A)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <rect x="140" y="120" width="120" height="50" rx="8" fill="var(--color-surface)" stroke="#f59e0b" strokeWidth="2" />
        <text x="200" y="152" textAnchor="middle" fill="#e2e8f0" fontSize="11">Partição (P) inevitável</text>
      </motion.g>
      <motion.path d="M 130 90 L 170 110" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <motion.path d="M 270 90 L 230 110" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
      <motion.text x="200" y="185" textAnchor="middle" fill="#94a3b8" fontSize="9">Em partição: escolha CP ou AP</motion.text>
    </svg>
  )
}
