export default function Navbar({ tabs, activeTab, onSwitch }) {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      height: '56px',
      background: '#131720',
      borderBottom: '1px solid #1e2540',
      flexShrink: 0,
      position: 'relative',
      zIndex: 2000,
    }}>
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
              onClick={() => onSwitch(tab.id)}
              style={{
                flex: 1,
                height: '100%',
                background: isActive ? 'rgba(74,158,255,0.06)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #4a9eff' : '2px solid transparent',
                color: isActive ? '#4a9eff' : '#6b7280',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                padding: '0 8px',
                transition: 'all 0.18s ease',
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
        <span style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#e84343',
          boxShadow: '0 0 8px rgba(232,67,67,0.7)',
          animation: 'pulse 1.5s ease-in-out infinite',
          display: 'inline-block',
        }}></span>
        <span style={{ color: '#6b7280', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
          DAY 35 · LIVE
        </span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </nav>
  )
}
