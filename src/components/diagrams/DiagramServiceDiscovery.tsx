import { motion } from 'framer-motion'

export function DiagramServiceDiscovery() {
  return (
    <svg viewBox="0 0 400 210" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <linearGradient id="regGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <clipPath id="sd-client"><rect x="40" y="75" width="70" height="50" rx="8" /></clipPath>
        <clipPath id="sd-registry"><rect x="155" y="65" width="90" height="70" rx="8" /></clipPath>
        <clipPath id="sd-inst"><rect x="285" y="55" width="75" height="90" rx="8" /></clipPath>
      </defs>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} clipPath="url(#sd-client)">
        <rect x="40" y="75" width="70" height="50" rx="8" fill="var(--color-surface)" stroke="#22d3ee" strokeWidth="2" />
        <text x="75" y="105" textAnchor="middle" fill="#e2e8f0" fontSize="10">Cliente</text>
      </motion.g>
      <motion.path d="M 110 100 L 155 100" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} clipPath="url(#sd-registry)">
        <rect x="155" y="65" width="90" height="70" rx="8" fill="url(#regGrad)" />
        <text x="200" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">Registry</text>
        <text x="200" y="112" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9">Consul / etcd</text>
        <text x="200" y="126" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9">K8s Service</text>
      </motion.g>
      <motion.path d="M 245 100 L 285 100" stroke="#34d399" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} clipPath="url(#sd-inst)">
        <rect x="285" y="55" width="75" height="90" rx="8" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
        <text x="322" y="82" textAnchor="middle" fill="#e2e8f0" fontSize="9">Instância</text>
        <text x="322" y="98" textAnchor="middle" fill="#e2e8f0" fontSize="9">A</text>
        <line x1="295" y1="108" x2="349" y2="108" stroke="#475569" strokeWidth="1" />
        <text x="322" y="125" textAnchor="middle" fill="#e2e8f0" fontSize="9">Instância</text>
        <text x="322" y="138" textAnchor="middle" fill="#e2e8f0" fontSize="9">B</text>
      </motion.g>
      <motion.text x="200" y="185" textAnchor="middle" fill="#94a3b8" fontSize="9">registro ao subir • descoberta por nome • health checks</motion.text>
    </svg>
  )
}
