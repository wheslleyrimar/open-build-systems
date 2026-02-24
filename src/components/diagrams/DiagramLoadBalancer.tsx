import { motion } from 'framer-motion'

export function DiagramLoadBalancer() {
  return (
    <svg viewBox="0 0 400 220" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <linearGradient id="lbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Client */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <rect x="170" y="10" width="60" height="36" rx="6" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="200" y="32" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">Clientes</text>
      </motion.g>
      {/* Arrows to LB */}
      <motion.path
        d="M 200 46 L 200 74"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      {/* Load Balancer */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <rect x="140" y="74" width="120" height="44" rx="8" fill="url(#lbGrad)" filter="url(#glow)" />
        <text x="200" y="98" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">Load Balancer</text>
      </motion.g>
      {/* Arrows to servers */}
      <motion.path
        d="M 160 118 L 100 158"
        stroke="#34d399"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />
      <motion.path
        d="M 200 118 L 200 158"
        stroke="#34d399"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      />
      <motion.path
        d="M 240 118 L 300 158"
        stroke="#34d399"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      />
      {/* Servers */}
      {[100, 200, 300].map((x, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
        >
          <rect x={x - 36} y="158" width="72" height="44" rx="6" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
          <text x={x} y="182" textAnchor="middle" fill="#e2e8f0" fontSize="11">Server {i + 1}</text>
        </motion.g>
      ))}
    </svg>
  )
}
