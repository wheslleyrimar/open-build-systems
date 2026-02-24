import { motion } from 'framer-motion'

const services = [
  { id: 'api', x: 200, y: 40, label: 'API Gateway', color: '#7c3aed', clip: 'ms-api' },
  { id: 'auth', x: 80, y: 120, label: 'Auth', color: '#22d3ee', clip: 'ms-auth' },
  { id: 'user', x: 200, y: 120, label: 'Users', color: '#34d399', clip: 'ms-user' },
  { id: 'order', x: 320, y: 120, label: 'Orders', color: '#f59e0b', clip: 'ms-order' },
  { id: 'notify', x: 200, y: 180, label: 'Notify', color: '#f472b6', clip: 'ms-notify' },
]

export function DiagramMicroservices() {
  return (
    <svg viewBox="0 0 400 250" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        {services.map((s) => (
          <clipPath key={s.id} id={s.clip}><rect x={s.x - 42} y={s.y - 18} width="84" height="36" rx="8" /></clipPath>
        ))}
      </defs>
      {services.map((s, i) => (
        <motion.g key={s.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }} clipPath={`url(#${s.clip})`}>
          <rect x={s.x - 42} y={s.y - 18} width="84" height="36" rx="8" fill="var(--color-surface)" stroke={s.color} strokeWidth="2" />
          <text x={s.x} y={s.y + 4} textAnchor="middle" fill="#e2e8f0" fontSize="10">{s.label}</text>
        </motion.g>
      ))}
      {/* Connections */}
      <motion.path d="M 200 58 L 200 102" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.2 }} />
      <motion.path d="M 168 76 L 124 102" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.3 }} />
      <motion.path d="M 232 76 L 276 102" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.35 }} />
      <motion.path d="M 200 138 L 200 162" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.4 }} />
      <motion.text x="200" y="218" textAnchor="middle" fill="#64748b" fontSize="8">
        <tspan x="200" dy="0">Caso: api.empresa.com — gateway roteia por path para</tspan>
        <tspan x="200" dy="11">Auth, Users, Orders, Notifications (deploy e banco próprios)</tspan>
      </motion.text>
    </svg>
  )
}
