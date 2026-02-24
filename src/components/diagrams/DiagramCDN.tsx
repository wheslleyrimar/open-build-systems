import { motion } from 'framer-motion'

export function DiagramCDN() {
  return (
    <svg viewBox="0 0 400 200" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <linearGradient id="cdnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <clipPath id="cdn-origin"><rect x="160" y="20" width="80" height="50" rx="8" /></clipPath>
        <clipPath id="cdn-edge"><rect x="140" y="95" width="120" height="44" rx="8" /></clipPath>
        <clipPath id="cdn-pop1"><circle cx="80" cy="172" r="22" /></clipPath>
        <clipPath id="cdn-pop2"><circle cx="200" cy="172" r="22" /></clipPath>
        <clipPath id="cdn-pop3"><circle cx="320" cy="172" r="22" /></clipPath>
      </defs>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} clipPath="url(#cdn-origin)">
        <rect x="160" y="20" width="80" height="50" rx="8" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="200" y="52" textAnchor="middle" fill="#e2e8f0" fontSize="12">Origin</text>
      </motion.g>
      <motion.path d="M 200 70 L 200 95" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        clipPath="url(#cdn-edge)"
      >
        <rect x="140" y="95" width="120" height="44" rx="8" fill="url(#cdnGrad)" />
        <text x="200" y="120" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">CDN (Edge)</text>
      </motion.g>
      <motion.path d="M 120 117 L 80 155" stroke="#34d399" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.5 }} />
      <motion.path d="M 200 139 L 200 155" stroke="#34d399" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.55 }} />
      <motion.path d="M 280 117 L 320 155" stroke="#34d399" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.6 }} />
      {[[80, 'cdn-pop1'], [200, 'cdn-pop2'], [320, 'cdn-pop3']].map(([x, clipId], i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
          clipPath={`url(#${clipId})`}
        >
          <circle cx={x} cy="172" r="22" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
          <text x={x} y="176" textAnchor="middle" fill="#e2e8f0" fontSize="9">PoP {i + 1}</text>
        </motion.g>
      ))}
      <motion.text x="200" y="195" textAnchor="middle" fill="#94a3b8" fontSize="9" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        Pontos de presença próximos ao usuário
      </motion.text>
    </svg>
  )
}
