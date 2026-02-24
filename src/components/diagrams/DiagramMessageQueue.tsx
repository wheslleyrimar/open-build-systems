import { motion } from 'framer-motion'

export function DiagramMessageQueue() {
  return (
    <svg viewBox="0 0 380 235" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <linearGradient id="mqGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <clipPath id="mq-prod"><rect x="40" y="70" width="70" height="50" rx="8" /></clipPath>
        <clipPath id="mq-fila"><rect x="160" y="60" width="60" height="70" rx="8" /></clipPath>
        <clipPath id="mq-cons"><rect x="270" y="70" width="70" height="50" rx="8" /></clipPath>
      </defs>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} clipPath="url(#mq-prod)">
        <rect x="40" y="70" width="70" height="50" rx="8" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="75" y="100" textAnchor="middle" fill="#e2e8f0" fontSize="11">Produtor</text>
      </motion.g>
      <motion.path d="M 110 95 L 160 95" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.3 }} clipPath="url(#mq-fila)">
        <rect x="160" y="60" width="60" height="70" rx="8" fill="url(#mqGrad)" />
        <text x="190" y="92" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">Fila</text>
        <text x="190" y="108" textAnchor="middle" fill="white" fontSize="9">Kafka /</text>
        <text x="190" y="120" textAnchor="middle" fill="white" fontSize="9">SQS</text>
      </motion.g>
      <motion.path d="M 220 95 L 270 95" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.4 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.5 }} clipPath="url(#mq-cons)">
        <rect x="270" y="70" width="70" height="50" rx="8" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
        <text x="305" y="100" textAnchor="middle" fill="#e2e8f0" fontSize="11">Consumidor</text>
      </motion.g>
      <motion.text x="190" y="175" textAnchor="middle" fill="#94a3b8" fontSize="10">mensagens assíncronas • desacoplamento</motion.text>
      <motion.text x="190" y="198" textAnchor="middle" fill="#64748b" fontSize="8">
        <tspan x="190" dy="0">Caso: pedidos — API publica &quot;Pedido criado&quot; na fila e responde 200;</tspan>
        <tspan x="190" dy="11">worker consome e envia e-mail, atualiza estoque</tspan>
      </motion.text>
    </svg>
  )
}
