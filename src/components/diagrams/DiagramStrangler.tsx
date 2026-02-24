import { motion } from 'framer-motion'

export function DiagramStrangler() {
  return (
    <svg viewBox="0 0 400 230" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <clipPath id="str-clients"><rect x="160" y="25" width="80" height="40" rx="8" /></clipPath>
        <clipPath id="str-gw"><rect x="160" y="88" width="80" height="40" rx="8" /></clipPath>
        <clipPath id="str-mono"><rect x="20" y="128" width="110" height="44" rx="8" /></clipPath>
        <clipPath id="str-new"><rect x="270" y="128" width="110" height="44" rx="8" /></clipPath>
      </defs>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} clipPath="url(#str-clients)">
        <rect x="160" y="25" width="80" height="40" rx="8" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="200" y="52" textAnchor="middle" fill="#e2e8f0" fontSize="10">Clientes</text>
      </motion.g>
      <motion.path d="M 200 65 L 200 88" stroke="#64748b" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} clipPath="url(#str-gw)">
        <rect x="160" y="88" width="80" height="40" rx="8" fill="var(--color-surface)" stroke="#8b5cf6" strokeWidth="2" />
        <text x="200" y="115" textAnchor="middle" fill="#e2e8f0" fontSize="10">API Gateway</text>
      </motion.g>
      <motion.path d="M 140 108 L 75 108 L 75 148" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.path d="M 200 128 L 200 148" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 }} />
      <motion.path d="M 260 108 L 325 108 L 325 148" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} clipPath="url(#str-mono)">
        <rect x="20" y="128" width="110" height="44" rx="8" fill="var(--color-surface)" stroke="#94a3b8" strokeWidth="2" />
        <text x="75" y="150" textAnchor="middle" fill="#94a3b8" fontSize="10">Monolito</text>
        <text x="75" y="164" textAnchor="middle" fill="#64748b" fontSize="8">/users, /orders</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} clipPath="url(#str-new)">
        <rect x="270" y="128" width="110" height="44" rx="8" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
        <text x="325" y="150" textAnchor="middle" fill="#e2e8f0" fontSize="10">Novo serviço</text>
        <text x="325" y="164" textAnchor="middle" fill="#94a3b8" fontSize="8">/notifications</text>
      </motion.g>
      <motion.text x="200" y="198" textAnchor="middle" fill="#94a3b8" fontSize="8">
        <tspan x="200" dy="0">Gateway roteia: rotas novas → novo serviço;</tspan>
        <tspan x="200" dy="11">antigas → monolito</tspan>
      </motion.text>
    </svg>
  )
}
