import { motion } from 'framer-motion'

const nodes = [
  { id: 'client', x: 200, y: 35, label: 'Web / Mobile', color: '#22d3ee', clip: 'bff-client' },
  { id: 'bff', x: 200, y: 95, label: 'BFF', color: '#8b5cf6', clip: 'bff-bff' },
  { id: 'u', x: 80, y: 155, label: 'Users', color: '#34d399', clip: 'bff-u' },
  { id: 'o', x: 200, y: 155, label: 'Orders', color: '#f59e0b', clip: 'bff-o' },
  { id: 'n', x: 320, y: 155, label: 'Notify', color: '#f472b6', clip: 'bff-n' },
]

export function DiagramBFF() {
  return (
    <svg viewBox="0 0 400 215" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        {nodes.map((s) => (
          <clipPath key={s.id} id={s.clip}><rect x={s.x - 44} y={s.y - 18} width="88" height="36" rx="8" /></clipPath>
        ))}
      </defs>
      {nodes.map((s, i) => (
        <motion.g key={s.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.08 }} clipPath={`url(#${s.clip})`}>
          <rect x={s.x - 44} y={s.y - 18} width="88" height="36" rx="8" fill="var(--color-surface)" stroke={s.color} strokeWidth="2" />
          <text x={s.x} y={s.y + 4} textAnchor="middle" fill="#e2e8f0" fontSize="10">{s.label}</text>
        </motion.g>
      ))}
      <motion.path d="M 200 53 L 200 77" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.2 }} />
      <motion.path d="M 168 113 L 124 137" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.25 }} />
      <motion.path d="M 200 113 L 200 137" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.3 }} />
      <motion.path d="M 232 113 L 276 137" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.35 }} />
      <motion.text x="200" y="190" textAnchor="middle" fill="#94a3b8" fontSize="9">BFF agrega chamadas e devolve payload otimizado</motion.text>
    </svg>
  )
}
