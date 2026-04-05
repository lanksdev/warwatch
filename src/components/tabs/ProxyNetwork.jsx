import { WAR_DATA } from '../../data/warData'
import SectionTitle from '../ui/SectionTitle'
import { useIsMobile } from '../../hooks/useIsMobile'

const ARMS_PIPELINE = [
  { route: 'Iran → Russia',  detail: 'Shahed-136 drones, ballistic missile tech, surveillance intel', color: '#e84343' },
  { route: 'Russia → Iran',  detail: 'S-300/S-400 air defense systems, radar tech, combat intelligence', color: '#6b7280' },
  { route: 'Iran → Proxies', detail: 'Missiles, drones, weapon tech, C2 via encrypted networks', color: '#a855f7' },
]

export default function ProxyNetwork() {
  const isMobile = useIsMobile()
  const cx = 320, cy = 240, dist = 165

  /* ── Shared SVG diagram ── */
  const diagram = (
    <svg
      viewBox="0 0 640 480"
      style={{ width: '100%', maxWidth: isMobile ? '100%' : '640px', maxHeight: '100%' }}
    >
      <defs>
        <marker id="arrow-gray" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#6b7280" />
        </marker>
        <radialGradient id="iran-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e84343" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#e84343" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r="70" fill="url(#iran-glow)" />

      {WAR_DATA.proxyNodes.map((node, i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180)
        const x = cx + dist * Math.cos(angle)
        const y = cy + dist * Math.sin(angle)
        const isEnemy = node.id === 'us_israel'
        return (
          <line
            key={node.id}
            x1={cx} y1={cy} x2={x} y2={y}
            stroke={node.statusColor}
            strokeWidth="1.8"
            strokeDasharray="7 4"
            opacity="0.55"
            markerEnd={isEnemy ? undefined : 'url(#arrow-gray)'}
            className="route-animated"
          />
        )
      })}

      {WAR_DATA.proxyNodes.map((node, i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180)
        const x = cx + dist * Math.cos(angle)
        const y = cy + dist * Math.sin(angle)
        return (
          <g key={node.id}>
            <circle cx={x} cy={y} r="32"
              fill={node.statusColor} fillOpacity="0.1"
              stroke={node.statusColor} strokeWidth="1.5"
            />
            <text x={x} y={y - 5} textAnchor="middle"
              fill="#e8eaf0" fontSize="11" fontWeight="700"
              fontFamily="Inter, sans-serif"
            >{node.name}</text>
            <text x={x} y={y + 10} textAnchor="middle"
              fill={node.statusColor} fontSize="9"
              fontFamily="Inter, sans-serif"
            >{node.status}</text>
          </g>
        )
      })}

      <circle cx={cx} cy={cy} r="42"
        fill="#e84343" fillOpacity="0.15"
        stroke="#e84343" strokeWidth="2"
      />
      <circle cx={cx} cy={cy} r="34"
        fill="#e84343" fillOpacity="0.2"
        stroke="#e84343" strokeWidth="1"
      />
      <text x={cx} y={cy + 5} textAnchor="middle"
        fill="#fff" fontSize="14" fontWeight="800"
        fontFamily="Inter, sans-serif" letterSpacing="2"
      >IRAN</text>

      <g transform="translate(490, 410)">
        <rect x="-8" y="-12" width="150" height="60" rx="6"
          fill="rgba(19,23,32,0.8)" stroke="#1e2540" strokeWidth="1"
        />
        <line x1="0" y1="0" x2="20" y2="0" stroke="#e84343" strokeWidth="1.5" strokeDasharray="5 3" />
        <text x="24" y="4" fill="#9ca3af" fontSize="10" fontFamily="Inter, sans-serif">Directs / supplies</text>
        <line x1="0" y1="18" x2="20" y2="18" stroke="#4a9eff" strokeWidth="1.5" strokeDasharray="5 3" />
        <text x="24" y="22" fill="#9ca3af" fontSize="10" fontFamily="Inter, sans-serif">Striking Iran</text>
        <line x1="0" y1="36" x2="20" y2="36" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5 3" />
        <text x="24" y="40" fill="#9ca3af" fontSize="10" fontFamily="Inter, sans-serif">Partial / indirect</text>
      </g>
    </svg>
  )

  /* ── Shared sidebar content ── */
  const sidebarContent = (
    <>
      <SectionTitle>Proxy Axis Status</SectionTitle>
      {WAR_DATA.proxyNodes.map(node => (
        <div key={node.id} style={{
          background: '#0b0d11', borderRadius: '8px',
          border: '1px solid #1e2540', padding: '10px 12px', marginBottom: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#e8eaf0' }}>{node.name}</span>
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px',
              color: node.statusColor, background: node.statusColor + '22',
            }}>{node.status}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.5 }}>{node.desc}</div>
        </div>
      ))}

      <div style={{ marginTop: '20px' }}>
        <SectionTitle>Arms Pipeline</SectionTitle>
        {ARMS_PIPELINE.map(p => (
          <div key={p.route} style={{
            background: '#0b0d11', borderRadius: '8px',
            border: '1px solid #1e2540', padding: '10px 12px', marginBottom: '8px',
            borderLeft: `3px solid ${p.color}`,
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: p.color, marginBottom: '4px' }}>{p.route}</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', lineHeight: 1.55 }}>{p.detail}</div>
          </div>
        ))}
      </div>
    </>
  )

  /* ── Mobile layout ── */
  if (isMobile) {
    return (
      <div style={{ height: '100%', overflowY: 'auto', background: '#0b0d11' }}>
        <div style={{ padding: '12px 8px', background: '#0b0d11' }}>
          {diagram}
        </div>
        <div style={{ padding: '12px 14px 20px', background: '#131720', borderTop: '1px solid #1e2540' }}>
          {sidebarContent}
        </div>
      </div>
    )
  }

  /* ── Desktop layout (original) ── */
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{
        flex: 1, background: '#0b0d11',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', overflow: 'hidden',
      }}>
        {diagram}
      </div>
      <div style={{
        width: '280px', flexShrink: 0,
        background: '#131720', borderLeft: '1px solid #1e2540',
        overflowY: 'auto', padding: '16px',
      }}>
        {sidebarContent}
      </div>
    </div>
  )
}
