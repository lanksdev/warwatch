import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts'
import { WAR_DATA } from '../../data/warData'
import SectionTitle from '../ui/SectionTitle'
import StatBlock from '../ui/StatBlock'

const chartData = WAR_DATA.attackWaves.map((waves, i) => ({ day: `D${i + 1}`, waves, num: i + 1 }))
const avg = Math.round(WAR_DATA.attackWaves.reduce((a, b) => a + b, 0) / WAR_DATA.attackWaves.length)
const total = WAR_DATA.attackWaves.reduce((a, b) => a + b, 0)

function barColor(v) {
  if (v >= 40) return '#e84343'
  if (v >= 20) return '#f5a623'
  return '#4a9eff'
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const val = payload[0].value
  return (
    <div style={{
      background: '#131720', border: '1px solid #1e2540',
      borderRadius: '8px', padding: '10px 14px',
    }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '11px', color: barColor(val) }}>{val} attack waves</div>
      <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
        {val >= 40 ? 'HIGH intensity' : val >= 20 ? 'MEDIUM intensity' : 'LOW intensity'}
      </div>
    </div>
  )
}

function AvgLabel({ viewBox }) {
  return (
    <text x={viewBox.width + viewBox.x + 6} y={viewBox.y + 4}
      fill="#a855f7" fontSize="10" fontFamily="monospace"
    >Avg {avg}</text>
  )
}

export default function AttackWaves() {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Chart area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', background: '#0b0d11', overflow: 'hidden' }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#e8eaf0', marginBottom: '4px' }}>
            Iranian Attack Waves — Day 1 through Day 35
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Each bar = one day of the war. &nbsp;
            <span style={{ color: '#e84343' }}>■</span> High (&gt;40) &nbsp;
            <span style={{ color: '#f5a623' }}>■</span> Medium (&gt;20) &nbsp;
            <span style={{ color: '#4a9eff' }}>■</span> Low &nbsp;
            <span style={{ color: '#a855f7' }}>— </span> Average ({avg}/day)
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 60, left: 0, bottom: 20 }} barCategoryGap="18%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2540" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#1e2540' }}
                tickLine={false}
                interval={1}
                angle={-45}
                textAnchor="end"
                height={40}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 65]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <ReferenceLine
                y={avg}
                stroke="#a855f7"
                strokeDasharray="5 3"
                strokeWidth={1.5}
                label={<AvgLabel />}
              />
              <Bar dataKey="waves" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={900} animationEasing="ease-out">
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={barColor(entry.waves)} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right sidebar */}
      <div style={{
        width: '268px', flexShrink: 0,
        background: '#131720', borderLeft: '1px solid #1e2540',
        overflowY: 'auto', padding: '16px',
      }}>
        <SectionTitle>Strike Summary</SectionTitle>
        <StatBlock label="Total Attack Waves (35d)" value={total.toLocaleString()} />
        <StatBlock label="Peak Day — Day 15, Mar 14" value="56 waves" color="text-red" />
        <StatBlock label="2nd Peak — Day 2, Mar 1"   value="55 waves" color="text-red" />
        <StatBlock label="Daily Average"              value={`${avg} waves`} color="text-purple" />

        <div style={{ marginTop: '18px' }}>
          <SectionTitle>Iranian Arsenal Deployed</SectionTitle>
          <StatBlock label="Ballistic Missiles" value="500+"   color="text-red" />
          <StatBlock label="Drones / UAVs"      value="2,000+" color="text-orange" />
        </div>

        <div style={{ marginTop: '18px' }}>
          <SectionTitle>Hezbollah Weapon Mix</SectionTitle>
          {[
            { type: 'Rockets',    pct: 72, color: '#e84343' },
            { type: 'UAVs',       pct: 25, color: '#f5a623' },
            { type: 'Anti-tank',  pct: 3,  color: '#4a9eff' },
          ].map(w => (
            <div key={w.type} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>{w.type}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', color: w.color }}>{w.pct}%</span>
              </div>
              <div style={{ height: '5px', background: '#1e2540', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '3px',
                  width: `${w.pct}%`, background: w.color,
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '18px' }}>
          <SectionTitle>US-Israel Strikes on Iran</SectionTitle>
          <StatBlock label="Targets Struck"      value="10,000+"  color="text-blue" />
          <StatBlock label="Avg Daily Sorties"   value="200+"     color="text-blue" small />
          <StatBlock label="Vessels Destroyed"   value="19"       color="text-blue" small />
          <StatBlock label="Strike Precision"    value="98%+"     color="text-green" small />
        </div>
      </div>
    </div>
  )
}
