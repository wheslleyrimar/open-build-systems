import { motion } from 'framer-motion'

export function DiagramDatabase() {
  return (
    <svg viewBox="0 0 420 400" className="w-full max-w-lg mx-auto" fill="none">
      <defs>
        <linearGradient id="dbPrimaryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="dbReplicaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <marker
          id="arrowGreen"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0 0 L8 4 L0 8 Z" fill="#34d399" />
        </marker>
        <marker
          id="arrowBlue"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0 0 L8 4 L0 8 Z" fill="#3b82f6" />
        </marker>
      </defs>

      {/* === REPLICAÇÃO === */}
      <motion.text
        x="210"
        y="24"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="11"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Replicação
      </motion.text>

      {/* Primary database */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ellipse cx="210" cy="60" rx="42" ry="14" fill="var(--color-surface)" stroke="url(#dbPrimaryGrad)" strokeWidth="2.5" />
        <path
          d="M 168 60 L 168 100 Q 210 114 252 100 L 252 60"
          fill="var(--color-surface)"
          stroke="url(#dbPrimaryGrad)"
          strokeWidth="2.5"
        />
        <ellipse cx="210" cy="100" rx="42" ry="14" fill="var(--color-surface)" stroke="url(#dbPrimaryGrad)" strokeWidth="2.5" />
        <text x="210" y="82" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="700">Primary</text>
        <text x="210" y="95" textAnchor="middle" fill="#60a5fa" fontSize="10">Write + Read</text>
      </motion.g>

      {/* Replication arrows to replicas */}
      <motion.path
        d="M 210 114 L 210 138 L 120 138 L 120 162"
        stroke="#34d399"
        strokeWidth="2"
        strokeDasharray="5 4"
        markerEnd="url(#arrowGreen)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      <motion.path
        d="M 210 114 L 210 138 L 300 138 L 300 162"
        stroke="#34d399"
        strokeWidth="2"
        strokeDasharray="5 4"
        markerEnd="url(#arrowGreen)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />
      <motion.text x="210" y="132" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        replicação
      </motion.text>

      {/* Replica 1 */}
      <motion.g
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.45 }}
      >
        <ellipse cx="120" cy="178" rx="32" ry="11" fill="var(--color-surface)" stroke="url(#dbReplicaGrad)" strokeWidth="2" />
        <path d="M 88 178 L 88 212 Q 120 224 152 212 L 152 178" fill="var(--color-surface)" stroke="url(#dbReplicaGrad)" strokeWidth="2" />
        <ellipse cx="120" cy="212" rx="32" ry="11" fill="var(--color-surface)" stroke="url(#dbReplicaGrad)" strokeWidth="2" />
        <text x="120" y="198" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">Replica 1</text>
        <text x="120" y="210" textAnchor="middle" fill="#34d399" fontSize="9">Read</text>
      </motion.g>

      {/* Replica 2 */}
      <motion.g
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.55 }}
      >
        <ellipse cx="300" cy="178" rx="32" ry="11" fill="var(--color-surface)" stroke="url(#dbReplicaGrad)" strokeWidth="2" />
        <path d="M 268 178 L 268 212 Q 300 224 332 212 L 332 178" fill="var(--color-surface)" stroke="url(#dbReplicaGrad)" strokeWidth="2" />
        <ellipse cx="300" cy="212" rx="32" ry="11" fill="var(--color-surface)" stroke="url(#dbReplicaGrad)" strokeWidth="2" />
        <text x="300" y="198" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">Replica 2</text>
        <text x="300" y="210" textAnchor="middle" fill="#34d399" fontSize="9">Read</text>
      </motion.g>

      {/* === SHARDING === */}
      <motion.text
        x="210"
        y="262"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="11"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Sharding (particionamento)
      </motion.text>

      <motion.text
        x="210"
        y="278"
        textAnchor="middle"
        fill="#64748b"
        fontSize="9"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
      >
        dados particionados por chave
      </motion.text>

      {/* Arrows from center down to shards */}
      <motion.path
        d="M 210 282 L 80 298 L 80 308"
        stroke="#64748b"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        markerEnd="url(#arrowBlue)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.85 }}
      />
      <motion.path
        d="M 210 282 L 210 298 L 210 308"
        stroke="#64748b"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        markerEnd="url(#arrowBlue)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      />
      <motion.path
        d="M 210 282 L 340 298 L 340 308"
        stroke="#64748b"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        markerEnd="url(#arrowBlue)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.95 }}
      />

      {/* Shards */}
      {[
        { x: 80, label: 'Shard A', key: 'user_id 0–33%' },
        { x: 210, label: 'Shard B', key: 'user_id 34–66%' },
        { x: 340, label: 'Shard C', key: 'user_id 67–100%' },
      ].map((s, i) => (
        <motion.g
          key={s.label}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
        >
          <rect x={s.x - 44} y="308" width="88" height="52" rx="8" fill="var(--color-surface)" stroke="#64748b" strokeWidth="2" />
          <text x={s.x} y="332" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">{s.label}</text>
          <text x={s.x} y="348" textAnchor="middle" fill="#94a3b8" fontSize="9">{s.key}</text>
        </motion.g>
      ))}
    </svg>
  )
}
