import { motion } from 'framer-motion'

export function DiagramAPIGateway() {
  return (
    <svg viewBox="0 0 400 250" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <linearGradient id="gwGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <clipPath id="gw-clients"><rect x="160" y="15" width="80" height="40" rx="8" /></clipPath>
        <clipPath id="gw-gateway"><rect x="120" y="78" width="160" height="50" rx="8" /></clipPath>
        <clipPath id="gw-s1"><rect x="64" y="155" width="72" height="44" rx="6" /></clipPath>
        <clipPath id="gw-s2"><rect x="164" y="155" width="72" height="44" rx="6" /></clipPath>
        <clipPath id="gw-s3"><rect x="264" y="155" width="72" height="44" rx="6" /></clipPath>
      </defs>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} clipPath="url(#gw-clients)">
        <rect x="160" y="15" width="80" height="40" rx="8" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="200" y="40" textAnchor="middle" fill="#e2e8f0" fontSize="12">Clientes</text>
      </motion.g>
      <motion.path d="M 200 55 L 200 78" stroke="#22d3ee" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} clipPath="url(#gw-gateway)">
        <rect x="120" y="78" width="160" height="50" rx="8" fill="url(#gwGrad)" />
        <text x="200" y="102" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">API Gateway</text>
        <text x="200" y="118" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="8">roteamento • auth • rate limit</text>
      </motion.g>
      <motion.path d="M 160 128 L 100 155" stroke="#34d399" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <motion.path d="M 200 128 L 200 155" stroke="#34d399" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
      <motion.path d="M 240 128 L 300 155" stroke="#34d399" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      {[
        { x: 100, l: 'Auth', sub: '/auth', clip: 'gw-s1' },
        { x: 200, l: 'Users', sub: '/users', clip: 'gw-s2' },
        { x: 300, l: 'Orders', sub: '/orders', clip: 'gw-s3' },
      ].map((s, i) => (
        <motion.g key={s.l} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.05 }} clipPath={`url(#${s.clip})`}>
          <rect x={s.x - 36} y="155" width="72" height="44" rx="6" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
          <text x={s.x} y="172" textAnchor="middle" fill="#e2e8f0" fontSize="10">{s.l}</text>
          <text x={s.x} y="186" textAnchor="middle" fill="#94a3b8" fontSize="7">{s.sub}</text>
        </motion.g>
      ))}
      <motion.text x="200" y="222" textAnchor="middle" fill="#64748b" fontSize="8">
        <tspan x="200" dy="0">Caso: api.empresa.com — gateway valida JWT</tspan>
        <tspan x="200" dy="11">e roteia por path para o backend correspondente</tspan>
      </motion.text>
    </svg>
  )
}
