import { motion } from 'framer-motion'

export function DiagramCircuitBreaker() {
  return (
    <svg viewBox="0 0 380 230" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <clipPath id="cb-client"><rect x="50" y="65" width="80" height="50" rx="8" /></clipPath>
        <clipPath id="cb-cb"><rect x="175" y="55" width="100" height="70" rx="8" /></clipPath>
        <clipPath id="cb-svc"><rect x="320" y="65" width="60" height="50" rx="8" /></clipPath>
      </defs>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} clipPath="url(#cb-client)">
        <rect x="50" y="65" width="80" height="50" rx="8" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="90" y="97" textAnchor="middle" fill="#e2e8f0" fontSize="11">Cliente</text>
      </motion.g>
      <motion.path d="M 130 90 L 175 90" stroke="#94a3b8" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} clipPath="url(#cb-cb)">
        <rect x="175" y="55" width="100" height="70" rx="8" fill="var(--color-surface)" stroke="#f59e0b" strokeWidth="2" />
        <text x="225" y="82" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">Circuit Breaker</text>
        <text x="225" y="100" textAnchor="middle" fill="#34d399" fontSize="10">Closed → Open</text>
        <text x="225" y="115" textAnchor="middle" fill="#94a3b8" fontSize="9">→ Half-open</text>
      </motion.g>
      <motion.path d="M 275 90 L 320 90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} clipPath="url(#cb-svc)">
        <rect x="320" y="65" width="60" height="50" rx="8" fill="var(--color-surface)" stroke="#ef4444" strokeWidth="2" />
        <text x="350" y="97" textAnchor="middle" fill="#e2e8f0" fontSize="10">Serviço</text>
      </motion.g>
      <motion.text x="225" y="160" textAnchor="middle" fill="#94a3b8" fontSize="9">falhas consecutivas → abrir → não chamar; após timeout → half-open → testar</motion.text>
      <motion.text x="225" y="198" textAnchor="middle" fill="#64748b" fontSize="8">
        <tspan x="225" dy="0">Caso: checkout chama pagamentos; se cair, circuito abre</tspan>
        <tspan x="225" dy="11">e checkout retorna fallback (&quot;Tente mais tarde&quot;) sem timeout longo</tspan>
      </motion.text>
    </svg>
  )
}
