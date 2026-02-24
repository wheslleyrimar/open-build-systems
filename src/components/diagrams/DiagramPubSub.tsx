import { motion } from 'framer-motion'

export function DiagramPubSub() {
  return (
    <svg viewBox="0 0 400 240" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <linearGradient id="pubGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <clipPath id="pub-pub"><rect x="40" y="80" width="70" height="50" rx="8" /></clipPath>
        <clipPath id="pub-topic"><rect x="175" y="70" width="90" height="70" rx="8" /></clipPath>
        <clipPath id="pub-s1"><rect x="295" y="35" width="70" height="40" rx="6" /></clipPath>
        <clipPath id="pub-s2"><rect x="300" y="92" width="70" height="26" rx="6" /></clipPath>
        <clipPath id="pub-s3"><rect x="295" y="145" width="70" height="40" rx="6" /></clipPath>
      </defs>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} clipPath="url(#pub-pub)">
        <rect x="40" y="80" width="70" height="50" rx="8" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="75" y="110" textAnchor="middle" fill="#e2e8f0" fontSize="10">Publicador</text>
      </motion.g>
      <motion.path d="M 110 105 L 175 105" stroke="#94a3b8" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} clipPath="url(#pub-topic)">
        <rect x="175" y="70" width="90" height="70" rx="8" fill="url(#pubGrad)" />
        <text x="220" y="98" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">Tópico</text>
        <text x="220" y="115" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9">Pub/Sub</text>
        <text x="220" y="130" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9">eventos</text>
      </motion.g>
      <motion.path d="M 265 88 L 295 55" stroke="#34d399" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <motion.path d="M 265 105 L 300 105" stroke="#34d399" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
      <motion.path d="M 265 122 L 295 155" stroke="#34d399" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} clipPath="url(#pub-s1)">
        <rect x="295" y="35" width="70" height="40" rx="6" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
        <text x="330" y="60" textAnchor="middle" fill="#e2e8f0" fontSize="9">Assinante 1</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} clipPath="url(#pub-s2)">
        <rect x="300" y="92" width="70" height="26" rx="6" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
        <text x="335" y="108" textAnchor="middle" fill="#e2e8f0" fontSize="9">Assinante 2</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} clipPath="url(#pub-s3)">
        <rect x="295" y="145" width="70" height="40" rx="6" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
        <text x="330" y="170" textAnchor="middle" fill="#e2e8f0" fontSize="9">Assinante 3</text>
      </motion.g>
      <motion.text x="220" y="205" textAnchor="middle" fill="#94a3b8" fontSize="9">um publicador • N assinantes • desacoplamento total</motion.text>
    </svg>
  )
}
