import { motion } from 'framer-motion'

export function DiagramWebSockets() {
  return (
    <svg viewBox="0 0 400 215" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <clipPath id="ws-cliente"><rect x="40" y="55" width="70" height="70" rx="8" /></clipPath>
        <clipPath id="ws-center"><rect x="155" y="60" width="90" height="56" rx="8" /></clipPath>
        <clipPath id="ws-servidor"><rect x="285" y="55" width="70" height="70" rx="8" /></clipPath>
      </defs>
      {/* Cliente: 40-110 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} clipPath="url(#ws-cliente)">
        <rect x="40" y="55" width="70" height="70" rx="8" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="75" y="86" textAnchor="middle" fill="#e2e8f0" fontSize="11">Cliente</text>
        <text x="75" y="104" textAnchor="middle" fill="#94a3b8" fontSize="8">browser / app</text>
      </motion.g>
      {/* Conexão Cliente → WebSocket */}
      <motion.path d="M 110 90 L 155 90" stroke="#a78bfa" strokeWidth="2.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      {/* WebSocket: 155-245 (centro com folga) */}
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} clipPath="url(#ws-center)">
        <rect x="155" y="60" width="90" height="56" rx="8" fill="var(--color-surface)" stroke="#a78bfa" strokeWidth="2" />
        <text x="200" y="85" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">WebSocket</text>
        <text x="200" y="102" textAnchor="middle" fill="#94a3b8" fontSize="9">bidirecional</text>
      </motion.g>
      {/* Conexão WebSocket → Servidor */}
      <motion.path d="M 245 90 L 285 90" stroke="#a78bfa" strokeWidth="2.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      {/* Servidor: 285-355 (sem sobrepor ao centro) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} clipPath="url(#ws-servidor)">
        <rect x="285" y="55" width="70" height="70" rx="8" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
        <text x="320" y="86" textAnchor="middle" fill="#e2e8f0" fontSize="11">Servidor</text>
        <text x="320" y="104" textAnchor="middle" fill="#94a3b8" fontSize="8">tempo real</text>
      </motion.g>
      <g fill="#94a3b8" fontSize="8" textAnchor="middle">
        <text x="200" y="165">uma conexão persistente;</text>
        <text x="200" y="177">cliente e servidor enviam a qualquer momento</text>
      </g>
    </svg>
  )
}
