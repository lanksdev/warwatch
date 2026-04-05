export default function StatBlock({ label, value, color = 'text-blue', small = false }) {
  return (
    <div className="bg-bg rounded-lg border border-border p-3 mb-2">
      <div className="text-[11px] text-[#6b7280] mb-1 uppercase tracking-wide">{label}</div>
      <div className={`font-bold font-mono ${small ? 'text-sm' : 'text-xl'} ${color}`}>{value}</div>
    </div>
  )
}
