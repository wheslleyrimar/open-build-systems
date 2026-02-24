import { motion } from 'framer-motion'

export function DiagramDatabasePerService() {
  return (
    <svg viewBox="0 0 400 220" className="w-full max-w-lg mx-auto" fill="none">
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <rect x="50" y="70" width="80" height="36" rx="8" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
        <text x="90" y="92" textAnchor="middle" fill="#e2e8f0" fontSize="10">Serviço A</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
        <rect x="50" y="118" width="80" height="32" rx="6" fill="var(--color-surface)" stroke="#0ea5e9" strokeWidth="2" />
        <text x="90" y="138" textAnchor="middle" fill="#94a3b8" fontSize="9">DB A</text>
      </motion.g>
      <motion.path d="M 90 106 L 90 118" stroke="#64748b" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x="270" y="70" width="80" height="36" rx="8" fill="var(--color-surface)" stroke="#f59e0b" strokeWidth="2" />
        <text x="310" y="92" textAnchor="middle" fill="#e2e8f0" fontSize="10">Serviço B</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <rect x="270" y="118" width="80" height="32" rx="6" fill="var(--color-surface)" stroke="#0ea5e9" strokeWidth="2" />
        <text x="310" y="138" textAnchor="middle" fill="#94a3b8" fontSize="9">DB B</text>
      </motion.g>
      <motion.path d="M 310 106 L 310 118" stroke="#64748b" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.path d="M 130 88 L 270 88" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 }} />
      <motion.text x="200" y="82" textAnchor="middle" fill="#a78bfa" fontSize="9">API (não acessa DB do outro)</motion.text>
      <motion.text x="200" y="192" textAnchor="middle" fill="#94a3b8" fontSize="8">
        <tspan x="200" dy="0">Cada serviço é dono do próprio banco;</tspan>
        <tspan x="200" dy="11">comunicação só via API</tspan>
      </motion.text>
    </svg>
  )
}
