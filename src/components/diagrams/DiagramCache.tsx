import { motion } from 'framer-motion'

export function DiagramCache() {
  return (
    <svg viewBox="0 0 400 220" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <linearGradient id="cacheGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <clipPath id="cache-app"><rect x="40" y="60" width="80" height="80" rx="8" /></clipPath>
        <clipPath id="cache-cache"><rect x="180" y="60" width="80" height="80" rx="8" /></clipPath>
        <clipPath id="cache-db"><rect x="320" y="60" width="80" height="80" rx="8" /></clipPath>
      </defs>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} clipPath="url(#cache-app)">
        <rect x="40" y="60" width="80" height="80" rx="8" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="80" y="102" textAnchor="middle" fill="#e2e8f0" fontSize="12">App</text>
      </motion.g>
      <motion.path
        d="M 120 100 L 180 100"
        stroke="#fbbf24"
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        clipPath="url(#cache-cache)"
      >
        <rect x="180" y="60" width="80" height="80" rx="8" fill="url(#cacheGrad)" opacity="0.9" />
        <text x="220" y="98" textAnchor="middle" fill="#1e1e2e" fontSize="11" fontWeight="700">Cache</text>
        <text x="220" y="112" textAnchor="middle" fill="#1e1e2e" fontSize="10">(Redis)</text>
      </motion.g>
      <motion.path
        d="M 260 100 L 320 100"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        clipPath="url(#cache-db)"
      >
        <rect x="320" y="60" width="80" height="80" rx="8" fill="var(--color-surface)" stroke="#64748b" strokeWidth="2" />
        <text x="360" y="102" textAnchor="middle" fill="#e2e8f0" fontSize="12">DB</text>
      </motion.g>
      <motion.text
        x="200"
        y="168"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Cache-Aside: App consulta cache → miss → DB → grava no cache
      </motion.text>
      <motion.text x="200" y="195" textAnchor="middle" fill="#64748b" fontSize="8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <tspan x="200" dy="0">Caso: perfil de usuário — hit ~1 ms; miss busca no DB,</tspan>
        <tspan x="200" dy="11">popula cache com TTL (ex.: 5 min)</tspan>
      </motion.text>
    </svg>
  )
}
