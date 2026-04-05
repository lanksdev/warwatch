import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WAR_DATA } from '../../data/warData'
import SectionTitle from '../ui/SectionTitle'

const SEVERITY = {
  critical: { color: '#e84343', label: 'Critical', glow: 'rgba(232,67,67,0.5)' },
  high:     { color: '#f5a623', label: 'High',     glow: 'rgba(245,166,35,0.5)' },
  medium:   { color: '#4a9eff', label: 'Medium',   glow: 'rgba(74,158,255,0.5)' },
}

export default function DailyLog() {
  const [openDay, setOpenDay] = useState(35)
  const days = [...WAR_DATA.days].reverse()

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Accordion */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {days.map(d => {
            const isOpen = openDay === d.day
            const sev = SEVERITY[d.severity]
            return (
              <div
                key={d.day}
                style={{
                  marginBottom: '6px',
                  borderRadius: '8px',
                  border: `1px solid ${isOpen ? sev.color + '44' : '#1e2540'}`,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Header */}
                <button
                  onClick={() => setOpenDay(isOpen ? null : d.day)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: '10px', padding: '11px 14px',
                    background: isOpen ? 'rgba(19,23,32,1)' : '#131720',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{
                    width: '9px', height: '9px', borderRadius: '50%', flexShrink: 0,
                    background: sev.color,
                    boxShadow: isOpen ? `0 0 7px ${sev.glow}` : 'none',
                    transition: 'box-shadow 0.2s',
                  }} />
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#6b7280', flexShrink: 0, width: '44px' }}>
                    Day {d.day}
                  </span>
                  <span style={{ fontSize: '11px', color: '#6b7280', flexShrink: 0, width: '50px' }}>
                    {d.date}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: isOpen ? '#fff' : '#d1d5db', flex: 1 }}>
                    {d.title}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: '#6b7280', fontSize: '11px', flexShrink: 0 }}
                  >
                    ▼
                  </motion.span>
                </button>

                {/* Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        padding: '12px 14px 14px 14px',
                        background: '#0b0d11',
                        borderTop: `1px solid ${sev.color}33`,
                      }}>
                        {d.events.map((e, i) => (
                          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ color: sev.color, fontSize: '11px', flexShrink: 0, marginTop: '2px' }}>▸</span>
                            <span style={{ fontSize: '12px', color: '#d1d5db', lineHeight: 1.6 }}>{e}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right sidebar */}
      <div style={{
        width: '250px', flexShrink: 0,
        background: '#131720', borderLeft: '1px solid #1e2540',
        overflowY: 'auto', padding: '16px',
      }}>
        <SectionTitle>Running Totals</SectionTitle>
        {[
          { label: 'Days of War',       value: '35',       color: '#4a9eff' },
          { label: 'Killed in Iran',    value: '2,076+',   color: '#e84343' },
          { label: 'Injured',           value: '26,500+',  color: '#f5a623' },
          { label: 'Attack Waves',      value: '1,265',    color: '#e8eaf0' },
          { label: 'Brent Crude',       value: '$118/bbl', color: '#f5a623' },
          { label: 'Hormuz Transit',    value: '6/day',    color: '#e84343' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#0b0d11', borderRadius: '8px',
            border: '1px solid #1e2540', padding: '10px 12px', marginBottom: '6px',
          }}>
            <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: s.color }}>{s.value}</div>
          </div>
        ))}

        <div style={{ marginTop: '20px' }}>
          <SectionTitle>Critical Milestones</SectionTitle>
          {[
            { date: 'Feb 28', event: 'Khamenei assassinated — war begins' },
            { date: 'Mar 2',  event: 'Hezbollah re-enters — 2nd front' },
            { date: 'Mar 13', event: 'Larijani assassinated' },
            { date: 'Mar 21', event: 'Naval chief Tangsiri assassinated' },
            { date: 'Mar 29', event: 'Houthis enter — 4th active front' },
            { date: 'Mar 30', event: 'E-3 AWACS destroyed in Saudi Arabia' },
            { date: 'Apr 2',  event: 'Iran fires as Trump speaks live on TV' },
          ].map(m => (
            <div key={m.date} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#4a9eff', flexShrink: 0, width: '44px' }}>{m.date}</span>
              <span style={{ fontSize: '11px', color: '#9ca3af', lineHeight: 1.55 }}>{m.event}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px' }}>
          <SectionTitle>Severity Legend</SectionTitle>
          {Object.entries(SEVERITY).map(([key, s]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'capitalize' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
