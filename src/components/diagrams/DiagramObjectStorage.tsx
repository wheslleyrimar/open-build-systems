import { motion } from 'framer-motion'

export function DiagramObjectStorage() {
  return (
    <svg viewBox="0 0 380 210" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <linearGradient id="s3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <rect x="40" y="60" width="80" height="60" rx="8" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="80" y="92" textAnchor="middle" fill="#e2e8f0" fontSize="11">App</text>
        <text x="80" y="108" textAnchor="middle" fill="#94a3b8" fontSize="9">PUT/GET</text>
      </motion.g>
      <motion.path d="M 120 90 L 168 90" stroke="#94a3b8" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
        <rect x="168" y="45" width="100" height="90" rx="8" fill="url(#s3Grad)" />
        <text x="218" y="75" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">Object Storage</text>
        <text x="218" y="92" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9">S3 / GCS / Blob</text>
        <rect x="178" y="100" width="80" height="12" rx="2" fill="rgba(0,0,0,0.2)" />
        <text x="218" y="109" textAnchor="middle" fill="white" fontSize="8">bucket/key</text>
      </motion.g>
      <motion.path d="M 268 90 L 310 90" stroke="#34d399" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x="310" y="65" width="50" height="50" rx="8" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
        <text x="335" y="97" textAnchor="middle" fill="#e2e8f0" fontSize="9">Blob</text>
      </motion.g>
      <motion.text x="218" y="172" textAnchor="middle" fill="#94a3b8" fontSize="8">
        <tspan x="218" dy="0">objetos imutáveis • bucket + key</tspan>
        <tspan x="218" dy="11">durabilidade e escala</tspan>
      </motion.text>
    </svg>
  )
}
