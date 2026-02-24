import { motion } from 'framer-motion'

export function DiagramRateLimiting() {
  return (
    <svg viewBox="0 0 360 215" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <clipPath id="rl-req"><rect x="40" y="50" width="80" height="60" rx="8" /></clipPath>
        <clipPath id="rl-limiter"><rect x="168" y="50" width="80" height="60" rx="8" /></clipPath>
        <clipPath id="rl-ok"><rect x="296" y="50" width="60" height="60" rx="8" /></clipPath>
      </defs>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} clipPath="url(#rl-req)">
        <rect x="40" y="50" width="80" height="60" rx="8" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="80" y="85" textAnchor="middle" fill="#e2e8f0" fontSize="11">Requisições</text>
        <text x="80" y="100" textAnchor="middle" fill="#94a3b8" fontSize="9">(muitas)</text>
      </motion.g>
      <motion.path d="M 120 80 L 168 80" stroke="#f59e0b" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} clipPath="url(#rl-limiter)">
        <rect x="168" y="50" width="80" height="60" rx="8" fill="var(--color-surface)" stroke="#f59e0b" strokeWidth="2" />
        <text x="208" y="78" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">Rate Limiter</text>
        <text x="208" y="95" textAnchor="middle" fill="#94a3b8" fontSize="9">ex.: 100 req/min</text>
      </motion.g>
      <motion.path d="M 248 80 L 296 80" stroke="#34d399" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} clipPath="url(#rl-ok)">
        <rect x="296" y="50" width="60" height="60" rx="8" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
        <text x="326" y="85" textAnchor="middle" fill="#e2e8f0" fontSize="10">OK</text>
        <text x="326" y="100" textAnchor="middle" fill="#94a3b8" fontSize="8">ou 429</text>
      </motion.g>
      <motion.text x="180" y="145" textAnchor="middle" fill="#94a3b8" fontSize="9">Token bucket • Sliding window • Por IP/user</motion.text>
      <motion.text x="180" y="172" textAnchor="middle" fill="#64748b" fontSize="8">
        <tspan x="180" dy="0">Caso: API pública — limite 100 req/min por API key;</tspan>
        <tspan x="180" dy="11">acima retorna 429 e Retry-After</tspan>
      </motion.text>
    </svg>
  )
}
