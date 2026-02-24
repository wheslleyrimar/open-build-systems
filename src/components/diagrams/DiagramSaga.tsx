import { motion } from 'framer-motion'

export function DiagramSaga() {
  return (
    <svg viewBox="0 0 400 245" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <clipPath id="saga-1"><rect x="20" y="78" width="70" height="46" rx="8" /></clipPath>
        <clipPath id="saga-2"><rect x="135" y="78" width="70" height="46" rx="8" /></clipPath>
        <clipPath id="saga-3"><rect x="250" y="78" width="70" height="46" rx="8" /></clipPath>
        <clipPath id="saga-ok"><rect x="365" y="85" width="30" height="34" rx="6" /></clipPath>
      </defs>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} clipPath="url(#saga-1)">
        <rect x="20" y="78" width="70" height="46" rx="8" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
        <text x="55" y="98" textAnchor="middle" fill="#e2e8f0" fontSize="9">1. Reservar</text>
        <text x="55" y="112" textAnchor="middle" fill="#94a3b8" fontSize="8">estoque</text>
      </motion.g>
      <motion.path d="M 90 101 L 135 101" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} clipPath="url(#saga-2)">
        <rect x="135" y="78" width="70" height="46" rx="8" fill="var(--color-surface)" stroke="#f59e0b" strokeWidth="2" />
        <text x="170" y="98" textAnchor="middle" fill="#e2e8f0" fontSize="9">2. Cobrar</text>
        <text x="170" y="112" textAnchor="middle" fill="#94a3b8" fontSize="8">pagamento</text>
      </motion.g>
      <motion.path d="M 205 101 L 250 101" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} clipPath="url(#saga-3)">
        <rect x="250" y="78" width="70" height="46" rx="8" fill="var(--color-surface)" stroke="#8b5cf6" strokeWidth="2" />
        <text x="285" y="98" textAnchor="middle" fill="#e2e8f0" fontSize="9">3. Criar</text>
        <text x="285" y="112" textAnchor="middle" fill="#94a3b8" fontSize="8">pedido</text>
      </motion.g>
      <motion.path d="M 320 101 L 365 101" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} clipPath="url(#saga-ok)">
        <rect x="365" y="85" width="30" height="34" rx="6" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="380" y="106" textAnchor="middle" fill="#e2e8f0" fontSize="8">OK</text>
      </motion.g>
      <motion.path d="M 55 124 L 55 165 L 170 165 L 170 147" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <motion.text x="112" y="182" textAnchor="middle" fill="#ef4444" fontSize="8">Compensação (falha no passo 2)</motion.text>
      <motion.text x="200" y="218" textAnchor="middle" fill="#94a3b8" fontSize="8">
        <tspan x="200" dy="0">Saga: compensações na ordem inversa</tspan>
        <tspan x="200" dy="11">em caso de falha</tspan>
      </motion.text>
    </svg>
  )
}
