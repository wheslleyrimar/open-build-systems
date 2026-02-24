import { motion } from 'framer-motion'

export function DiagramConsistentHashing() {
  const cx = 200
  const cy = 100
  const r = 75
  return (
    <svg viewBox="0 0 400 250" className="w-full max-w-lg mx-auto" fill="none">
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#475569"
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      {[
        { angle: 0, label: 'Nó A' },
        { angle: 120, label: 'Nó B' },
        { angle: 240, label: 'Nó C' },
      ].map((s, i) => {
        const rad = (s.angle * Math.PI) / 180
        const x = cx + r * Math.cos(rad)
        const y = cy + r * Math.sin(rad)
        return (
          <motion.g key={s.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }}>
            <circle cx={x} cy={y} r="18" fill="var(--color-surface)" stroke="#34d399" strokeWidth="2" />
            <text x={x} y={y + 4} textAnchor="middle" fill="#e2e8f0" fontSize="9">{s.label}</text>
          </motion.g>
        )
      })}
      <motion.text x={cx} y={cy - r - 15} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">Anel (consistent hash)</motion.text>
      <motion.text x={cx} y={212} textAnchor="middle" fill="#94a3b8" fontSize="8">
        <tspan x={cx} dy="0">chaves mapeadas ao nó no sentido horário;</tspan>
        <tspan x={cx} dy="11">adicionar nó = pouco remapeamento</tspan>
      </motion.text>
    </svg>
  )
}
