import { motion } from 'framer-motion'

export function DiagramSearch() {
  return (
    <svg viewBox="0 0 400 200" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <linearGradient id="esGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <rect x="50" y="70" width="70" height="60" rx="8" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="85" y="100" textAnchor="middle" fill="#e2e8f0" fontSize="11">Query</text>
        <text x="85" y="118" textAnchor="middle" fill="#94a3b8" fontSize="9">"tênis"</text>
      </motion.g>
      <motion.path d="M 120 100 L 175 100" stroke="#94a3b8" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
        <rect x="175" y="50" width="100" height="100" rx="8" fill="url(#esGrad)" />
        <text x="225" y="82" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">Elasticsearch</text>
        <text x="225" y="98" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9">índice invertido</text>
        <text x="225" y="112" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9">BM25 • filtros</text>
      </motion.g>
      <motion.path d="M 275 100 L 320 100" stroke="#34d399" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x="320" y="75" width="60" height="50" rx="8" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
        <text x="350" y="102" textAnchor="middle" fill="#e2e8f0" fontSize="9">Docs</text>
        <text x="350" y="115" textAnchor="middle" fill="#94a3b8" fontSize="8">ranked</text>
      </motion.g>
      <motion.text x="225" y="185" textAnchor="middle" fill="#94a3b8" fontSize="9">full-text • relevância • agregações</motion.text>
    </svg>
  )
}
