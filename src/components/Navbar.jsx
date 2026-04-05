import { useIsMobile } from '../hooks/useIsMobile'

const MOBILE_LABELS = {
  map:   '⚔ MAP',
  proxy: '🔗 PROXY',
  waves: '📊 WAVES',
  log:   '📋 LOG',
  intel: '🔍 INTEL',
}

const PULSE_STYLE = {
  display: 'inline-block',
  borderRadius: '50%',
  background: '#e84343',
  animation: 'pulse 1.5s ease-in-out infinite',
}

export default function Navbar({ tabs, activeTab, onSwitch }) {
  const isMobile = useIsMobile()

  return (
    <nav style={{
      background: '#131720',
      borderBottom: '1px solid #1e2540',
      flexShrink: 0,
      position: 'relative',
      zIndex: 2000,
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        .nav-tab-scroll::-webkit-scrollbar { display: none; }
        .nav-tab-btn { -webkit-tap-highlight-color: transparent; }
      `}</style>

      {isMobile ? (
        /* ── Mobile: two-row layout ── */
        <>
          {/* Row 1: Brand + Live badge */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: '44px', padding: '0 14px',
            borderBottom: '1px solid #1e2540',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ color: '#e84343', fontSize: '16px' }}>⚔</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px', letterSpacing: '0.1em' }}>WARWATCH</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ ...PULSE_STYLE, width: '6px', height: '6px', boxShadow: '0 0 6px rgba(232,67,67,0.7)' }} />
              <span style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
                DAY 35 · LIVE
              </span>
            </div>
          </div>

          {/* Row 2: Scrollable tab strip */}
          <div className="nav-tab-scroll" style={{
            display: 'flex', height: '40px',
            overflowX: 'auto', scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}>
            {tabs.map(tab => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  className="nav-tab-btn"
                  onClick={() => onSwitch(tab.id)}
                  style={{
                    flexShrink: 0, height: '100%', padding: '0 18px',
                    background: isActive ? 'rgba(74,158,255,0.06)' : 'transparent',
                    border: 'none',
                    borderBottom: isActive ? '2px solid #4a9eff' : '2px solid transparent',
                    color: isActive ? '#4a9eff' : '#6b7280',
                    fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'color 0.15s, background 0.15s',
                  }}
                >
                  {MOBILE_LABELS[tab.id] || tab.label}
                </button>
              )
            })}
          </div>
        </>
      ) : (
        /* ── Desktop: single row ── */
        <div style={{ display: 'flex', alignItems: 'center', height: '56px' }}>
          {/* Brand */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '0 20px', borderRight: '1px solid #1e2540', height: '100%',
            flexShrink: 0,
          }}>
            <span style={{ color: '#e84343', fontSize: '18px' }}>⚔</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px', letterSpacing: '0.12em' }}>WARWATCH</span>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', flex: 1, height: '100%' }}>
            {tabs.map(tab => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  className="nav-tab-btn"
                  onClick={() => onSwitch(tab.id)}
                  style={{
                    flex: 1, height: '100%',
                    background: isActive ? 'rgba(74,158,255,0.06)' : 'transparent',
                    border: 'none',
                    borderBottom: isActive ? '2px solid #4a9eff' : '2px solid transparent',
                    color: isActive ? '#4a9eff' : '#6b7280',
                    fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    padding: '0 8px', transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#e8eaf0'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = 'transparent' }}}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Live badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '0 16px', borderLeft: '1px solid #1e2540', height: '100%',
            flexShrink: 0,
          }}>
            <span style={{ ...PULSE_STYLE, width: '7px', height: '7px', boxShadow: '0 0 8px rgba(232,67,67,0.7)' }} />
            <span style={{ color: '#6b7280', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
              DAY 35 · LIVE
            </span>
          </div>
        </div>
      )}
    </nav>
  )
}
