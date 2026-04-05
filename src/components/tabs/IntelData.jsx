import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts'
import { WAR_DATA } from '../../data/warData'
import SectionTitle from '../ui/SectionTitle'
import { useIsMobile } from '../../hooks/useIsMobile'

const STATUS_COLOR = { critical: '#e84343', high: '#f5a623', medium: '#4a9eff' }

function CasualtyTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{ background: '#131720', border: '1px solid #1e2540', borderRadius: '8px', padding: '10px 14px' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '3px' }}>{d.label}</div>
      <div style={{ fontSize: '11px', color: d.color }}>{d.display}</div>
    </div>
  )
}

/* ── Shared: casualty chart ── */
function CasualtyChart({ height }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={WAR_DATA.casualties}
        layout="vertical"
        margin={{ left: 5, right: 55, top: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2540" horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
          axisLine={false} tickLine={false}
          width={110}
        />
        <Tooltip content={<CasualtyTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="value" radius={[0, 5, 5, 0]} isAnimationActive animationDuration={1000} label={{
          position: 'right',
          formatter: (v) => WAR_DATA.casualties.find(c => c.value === v)?.display ?? String(v),
          fill: '#9ca3af', fontSize: 11, fontFamily: 'monospace',
        }}>
          {WAR_DATA.casualties.map((c, i) => (
            <Cell key={i} fill={c.color} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function IntelData() {
  const isMobile = useIsMobile()

  /* ── Mobile layout ── */
  if (isMobile) {
    return (
      <div style={{ height: '100%', overflowY: 'auto', padding: '12px', background: '#0b0d11' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Casualty Comparison */}
          <div style={{ background: '#131720', borderRadius: '12px', border: '1px solid #1e2540', padding: '16px' }}>
            <SectionTitle>Casualty Comparison</SectionTitle>
            <div style={{ height: '180px', marginBottom: '10px' }}>
              <CasualtyChart height={180} />
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.5 }}>
              Comparing total conflict deaths. Russia-Ukraine over 3 years; Gaza since Oct 2023; Iran and Lebanon over 35 days.
            </div>
          </div>

          {/* Energy Market Impact */}
          <div style={{ background: '#131720', borderRadius: '12px', border: '1px solid #1e2540', padding: '16px' }}>
            <SectionTitle>Energy Market Impact</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {WAR_DATA.energyImpact.map(e => {
                const col = STATUS_COLOR[e.status]
                return (
                  <div key={e.metric} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: '8px',
                    background: '#0b0d11', border: `1px solid ${col}33`,
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#e8eaf0' }}>{e.metric}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{e.change}</div>
                    </div>
                    <div style={{
                      fontSize: '13px', fontWeight: 700, fontFamily: 'monospace',
                      color: col, textAlign: 'right', maxWidth: '100px',
                    }}>{e.value}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Strategic Position Cards — single column on mobile */}
          {WAR_DATA.strategicCards.map(card => (
            <div key={card.title} style={{
              background: '#131720', borderRadius: '12px',
              border: '1px solid #1e2540',
              borderTop: `3px solid ${card.color}`,
              padding: '16px',
            }}>
              <div style={{
                fontSize: '13px', fontWeight: 700, color: card.color,
                marginBottom: '12px', letterSpacing: '0.03em',
              }}>{card.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {card.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: card.color, fontSize: '11px', flexShrink: 0, marginTop: '2px' }}>▸</span>
                    <span style={{ fontSize: '12px', color: '#d1d5db', lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    )
  }

  /* ── Desktop layout (original) ── */
  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 24px', background: '#0b0d11' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'auto auto',
        gap: '16px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>

        {/* Casualty Comparison */}
        <div style={{ background: '#131720', borderRadius: '12px', border: '1px solid #1e2540', padding: '20px' }}>
          <SectionTitle>Casualty Comparison</SectionTitle>
          <div style={{ height: '200px', marginBottom: '12px' }}>
            <CasualtyChart height={200} />
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.5 }}>
            Comparing total conflict deaths. Russia-Ukraine over 3 years; Gaza since Oct 2023; Iran and Lebanon over 35 days.
          </div>
        </div>

        {/* Energy Impact */}
        <div style={{ background: '#131720', borderRadius: '12px', border: '1px solid #1e2540', padding: '20px' }}>
          <SectionTitle>Energy Market Impact</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {WAR_DATA.energyImpact.map(e => {
              const col = STATUS_COLOR[e.status]
              return (
                <div key={e.metric} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: '8px',
                  background: '#0b0d11', border: `1px solid ${col}33`,
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#e8eaf0' }}>{e.metric}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{e.change}</div>
                  </div>
                  <div style={{
                    fontSize: '13px', fontWeight: 700, fontFamily: 'monospace',
                    color: col, textAlign: 'right', maxWidth: '100px',
                  }}>{e.value}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Strategic Position Cards — span both columns */}
        <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          {WAR_DATA.strategicCards.map(card => (
            <div key={card.title} style={{
              background: '#131720', borderRadius: '12px',
              border: '1px solid #1e2540',
              borderTop: `3px solid ${card.color}`,
              padding: '18px',
            }}>
              <div style={{
                fontSize: '13px', fontWeight: 700, color: card.color,
                marginBottom: '14px', letterSpacing: '0.03em',
              }}>{card.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {card.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: card.color, fontSize: '11px', flexShrink: 0, marginTop: '2px' }}>▸</span>
                    <span style={{ fontSize: '12px', color: '#d1d5db', lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
