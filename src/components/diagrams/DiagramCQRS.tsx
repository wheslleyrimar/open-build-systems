import { motion } from 'framer-motion'

export function DiagramCQRS() {
  return (
    <svg viewBox="0 0 400 235" className="w-full max-w-lg mx-auto" fill="none">
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <rect x="40" y="30" width="90" height="50" rx="8" fill="var(--color-surface)" stroke="#8b5cf6" strokeWidth="2" />
        <text x="85" y="55" textAnchor="middle" fill="#e2e8f0" fontSize="11">Comandos</text>
        <text x="85" y="70" textAnchor="middle" fill="#94a3b8" fontSize="9">(Write)</text>
      </motion.g>
      <motion.path d="M 85 80 L 85 105" stroke="#64748b" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x="50" y="105" width="70" height="36" rx="8" fill="var(--color-surface)" stroke="#0ea5e9" strokeWidth="2" />
        <text x="85" y="128" textAnchor="middle" fill="#e2e8f0" fontSize="9">Event Store</text>
      </motion.g>
      <motion.path d="M 85 141 L 85 165" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x="30" y="165" width="50" height="28" rx="6" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
        <text x="55" y="183" textAnchor="middle" fill="#e2e8f0" fontSize="8">View 1</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}>
        <rect x="95" y="165" width="50" height="28" rx="6" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
        <text x="120" y="183" textAnchor="middle" fill="#e2e8f0" fontSize="8">View 2</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <rect x="270" y="30" width="90" height="50" rx="8" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="315" y="55" textAnchor="middle" fill="#e2e8f0" fontSize="11">Queries</text>
        <text x="315" y="70" textAnchor="middle" fill="#94a3b8" fontSize="9">(Read)</text>
      </motion.g>
      <motion.path d="M 315 80 L 315 120" stroke="#64748b" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <rect x="270" y="120" width="90" height="36" rx="8" fill="var(--color-surface)" stroke="#f59e0b" strokeWidth="2" />
        <text x="315" y="143" textAnchor="middle" fill="#e2e8f0" fontSize="9">Read Models</text>
      </motion.g>
      <motion.path d="M 85 123 L 200 123 L 315 138" stroke="#475569" strokeWidth="1" strokeDasharray="2 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <motion.text x="200" y="115" textAnchor="middle" fill="#64748b" fontSize="8">eventos → projectors</motion.text>
      <motion.text x="200" y="208" textAnchor="middle" fill="#94a3b8" fontSize="8">
        <tspan x="200" dy="0">CQRS + Event Sourcing: write → events</tspan>
        <tspan x="200" dy="11">→ read models</tspan>
      </motion.text>
    </svg>
  )
}
