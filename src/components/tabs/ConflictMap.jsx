import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { WAR_DATA } from '../../data/warData'
import StatBlock from '../ui/StatBlock'
import SectionTitle from '../ui/SectionTitle'
import { useIsMobile } from '../../hooks/useIsMobile'

// Pulsing divIcon marker for active conflict zones
function PulseMarkers({ onCountryClick }) {
  const map = useMap()
  const markersRef = useRef([])

  useEffect(() => {
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    Object.entries(WAR_DATA.countries).forEach(([key, c]) => {
      if (!c.pulse) return
      const icon = L.divIcon({
        html: `<div class="pulse-dot" style="background:${c.statusColor};color:${c.statusColor};"></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })
      const marker = L.marker([c.lat, c.lng], { icon }).addTo(map)
      marker.on('click', () => onCountryClick(key))
      marker.bindTooltip(c.name, { className: 'leaflet-tooltip-dark', direction: 'top', offset: [0, -10] })
      markersRef.current.push(marker)
    })

    return () => markersRef.current.forEach(m => m.remove())
  }, [map])

  return null
}

// Animated attack route polylines
function AttackRoutes() {
  const map = useMap()
  const routesRef = useRef([])

  useEffect(() => {
    routesRef.current.forEach(r => r.remove())
    routesRef.current = []

    WAR_DATA.routes.forEach(route => {
      const pl = L.polyline([route.from, route.to], {
        color: route.color,
        weight: route.weight,
        opacity: 0.65,
        dashArray: '10 5',
      }).addTo(map)

      setTimeout(() => {
        if (pl._path) {
          pl._path.style.strokeDasharray = '10 5'
          pl._path.classList.add('route-animated')
        }
      }, 100)

      routesRef.current.push(pl)
    })

    return () => routesRef.current.forEach(r => r.remove())
  }, [map])

  return null
}

const STATUS_BADGE_STYLE = {
  'ACTIVE CONFLICT':  { bg: 'rgba(232,67,67,0.12)',  color: '#e84343', border: 'rgba(232,67,67,0.3)' },
  'ACTIVE OFFENSIVE': { bg: 'rgba(74,158,255,0.12)', color: '#4a9eff', border: 'rgba(74,158,255,0.3)' },
  'ACTIVE FRONT':     { bg: 'rgba(245,166,35,0.12)', color: '#f5a623', border: 'rgba(245,166,35,0.3)' },
  'STRUCK':           { bg: 'rgba(168,85,247,0.12)', color: '#a855f7', border: 'rgba(168,85,247,0.3)' },
  'TARGETED':         { bg: 'rgba(168,85,247,0.12)', color: '#a855f7', border: 'rgba(168,85,247,0.3)' },
  'PROXY ACTIVE':     { bg: 'rgba(245,166,35,0.12)', color: '#f5a623', border: 'rgba(245,166,35,0.3)' },
  'DEFENSIVE':        { bg: 'rgba(80,200,120,0.12)', color: '#50c878', border: 'rgba(80,200,120,0.3)' },
  'TRANSIT':          { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', border: 'rgba(107,114,128,0.3)' },
  'MONITORING':       { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', border: 'rgba(107,114,128,0.3)' },
}

const ROUTE_LEGEND = [
  { color: '#e84343', label: 'Iran strikes' },
  { color: '#4a9eff', label: 'US+Israel strikes' },
  { color: '#f5a623', label: 'Houthi missiles' },
]

const ACTIVE_FRONTS = [
  { label: 'Iran',          status: 'ACTIVE CONFLICT',  color: '#e84343' },
  { label: 'Israel / Gaza', status: 'ACTIVE OFFENSIVE', color: '#4a9eff' },
  { label: 'Lebanon',       status: 'ACTIVE FRONT',     color: '#f5a623' },
  { label: 'Yemen',         status: 'ACTIVE FRONT',     color: '#f5a623' },
]

export default function ConflictMap() {
  const [selectedKey, setSelectedKey] = useState(null)
  const isMobile = useIsMobile()
  const country = selectedKey ? WAR_DATA.countries[selectedKey] : null
  const day35 = WAR_DATA.days[WAR_DATA.days.length - 1]
  const badgeStyle = country ? (STATUS_BADGE_STYLE[country.status] || STATUS_BADGE_STYLE['MONITORING']) : null

  /* ── Mobile layout ── */
  if (isMobile) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0b0d11' }}>

        {/* Stats strip — horizontal scroll */}
        <div style={{
          flexShrink: 0, display: 'flex', gap: '8px',
          overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
          padding: '8px 12px', background: '#131720', borderBottom: '1px solid #1e2540',
        }}>
          {[
            { label: 'Killed',    value: '2,076+',  color: '#e84343' },
            { label: 'Injured',   value: '26,500+', color: '#f5a623' },
            { label: 'Mil. KIA',  value: '5,300+',  color: '#e84343' },
            { label: 'Targets',   value: '10,000+', color: '#4a9eff' },
            { label: 'Ships',     value: '19',      color: '#4a9eff' },
            { label: 'Crude',     value: '$118/bbl',color: '#f5a623' },
          ].map(s => (
            <div key={s.label} style={{
              flexShrink: 0, background: '#0b0d11', borderRadius: '8px',
              border: '1px solid #1e2540', padding: '6px 10px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace', color: s.color, marginTop: '1px' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div style={{ flexShrink: 0, height: '270px', position: 'relative' }}>
          <MapContainer
            center={[28, 47]} zoom={4}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false} attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              maxZoom={12}
            />
            <PulseMarkers onCountryClick={setSelectedKey} />
            <AttackRoutes />
            {Object.entries(WAR_DATA.countries)
              .filter(([, c]) => !c.pulse)
              .map(([key, c]) => (
                <CircleMarker
                  key={key}
                  center={[c.lat, c.lng]}
                  radius={6}
                  pathOptions={{ fillColor: c.statusColor, color: c.statusColor, fillOpacity: 0.8, weight: 1.5 }}
                  eventHandlers={{ click: () => setSelectedKey(key) }}
                />
              ))}
          </MapContainer>

          {/* Compact route legend */}
          <div style={{
            position: 'absolute', bottom: '8px', right: '8px', zIndex: 1000,
            background: 'rgba(19,23,32,0.92)', border: '1px solid #1e2540',
            borderRadius: '6px', padding: '7px 10px',
          }}>
            {ROUTE_LEGEND.map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <svg width="16" height="4">
                  <line x1="0" y1="2" x2="16" y2="2" stroke={r.color} strokeWidth="2" strokeDasharray="4 2" />
                </svg>
                <span style={{ fontSize: '10px', color: '#9ca3af' }}>{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom panel: country info OR default events */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {country ? (
            /* Country detail */
            <div style={{ padding: '14px', background: '#131720' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #1e2540' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: country.statusColor, flexShrink: 0, boxShadow: `0 0 6px ${country.statusColor}88` }} />
                <div style={{ fontWeight: 700, fontSize: '14px', flex: 1, color: '#fff' }}>{country.name}</div>
                <button
                  onClick={() => setSelectedKey(null)}
                  style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '18px', padding: '2px 6px', lineHeight: 1 }}
                >✕</button>
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '10px', lineHeight: 1.6 }}>{country.role}</div>
              <div style={{
                display: 'inline-block', fontSize: '10px', fontWeight: 700,
                padding: '3px 8px', borderRadius: '4px', marginBottom: '14px', letterSpacing: '0.05em',
                color: badgeStyle.color, background: badgeStyle.bg, border: `1px solid ${badgeStyle.border}`,
              }}>{country.status}</div>
              <SectionTitle>Key Intelligence</SectionTitle>
              {country.facts.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ color: country.statusColor, fontSize: '11px', flexShrink: 0, marginTop: '1px' }}>▸</span>
                  <span style={{ fontSize: '12px', color: '#d1d5db', lineHeight: 1.55 }}>{f}</span>
                </div>
              ))}
            </div>
          ) : (
            /* Active fronts + Day 35 events */
            <div style={{ background: '#0b0d11' }}>
              <div style={{ padding: '12px 14px', background: '#131720', borderBottom: '1px solid #1e2540' }}>
                <SectionTitle>Active Fronts · Tap map markers for country intel</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {ACTIVE_FRONTS.map(f => (
                    <div key={f.label} style={{ background: '#0b0d11', borderRadius: '8px', border: '1px solid #1e2540', padding: '8px 10px' }}>
                      <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '2px' }}>{f.label}</div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: f.color, letterSpacing: '0.04em' }}>{f.status}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <SectionTitle>Day 35 Events</SectionTitle>
                {day35.events.map((e, i) => (
                  <div key={i} style={{
                    fontSize: '12px', color: '#9ca3af', marginBottom: '8px',
                    paddingLeft: '10px', borderLeft: '2px solid #1e2540', lineHeight: 1.55,
                  }}>{e}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ── Desktop layout (original) ── */
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Left Sidebar */}
      <div style={{
        width: '250px', flexShrink: 0,
        background: '#131720', borderRight: '1px solid #1e2540',
        overflowY: 'auto', padding: '16px',
      }}>
        <SectionTitle>Live Toll · Day 35</SectionTitle>
        <StatBlock label="Killed in Iran"     value="2,076+"   color="text-red" />
        <StatBlock label="Injured"            value="26,500+"  color="text-orange" />
        <StatBlock label="Iran Military KIA"  value="5,300+"   color="text-red" />
        <StatBlock label="US Targets Struck"  value="10,000+"  color="text-blue" />
        <StatBlock label="Ships Destroyed"    value="19"       color="text-blue" />
        <StatBlock label="Brent Crude"        value="$118/bbl" color="text-orange" small />

        <div style={{ marginTop: '16px' }}>
          <SectionTitle>Active Fronts</SectionTitle>
          {ACTIVE_FRONTS.map(f => (
            <div key={f.label} style={{
              background: '#0b0d11', borderRadius: '8px',
              border: '1px solid #1e2540', padding: '8px 10px', marginBottom: '6px',
            }}>
              <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '2px' }}>{f.label}</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: f.color, letterSpacing: '0.05em' }}>{f.status}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '16px' }}>
          <SectionTitle>Day 35 Events</SectionTitle>
          {day35.events.map((e, i) => (
            <div key={i} style={{
              fontSize: '11px', color: '#9ca3af', marginBottom: '7px',
              paddingLeft: '10px', borderLeft: '2px solid #1e2540', lineHeight: 1.55,
            }}>{e}</div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={[28, 47]} zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true} attributionControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com">CARTO</a>'
            maxZoom={12}
          />
          <PulseMarkers onCountryClick={setSelectedKey} />
          <AttackRoutes />
          {Object.entries(WAR_DATA.countries)
            .filter(([, c]) => !c.pulse)
            .map(([key, c]) => (
              <CircleMarker
                key={key}
                center={[c.lat, c.lng]}
                radius={7}
                pathOptions={{ fillColor: c.statusColor, color: c.statusColor, fillOpacity: 0.8, weight: 1.5 }}
                eventHandlers={{ click: () => setSelectedKey(key) }}
              />
            ))}
        </MapContainer>

        {/* Route legend */}
        <div style={{
          position: 'absolute', bottom: '24px', left: '16px', zIndex: 1000,
          background: 'rgba(19,23,32,0.9)', border: '1px solid #1e2540',
          borderRadius: '8px', padding: '10px 14px', backdropFilter: 'blur(10px)',
        }}>
          {ROUTE_LEGEND.map(r => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <svg width="24" height="4">
                <line x1="0" y1="2" x2="24" y2="2" stroke={r.color} strokeWidth="2" strokeDasharray="5 3" />
              </svg>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Info Panel */}
      <div style={{
        width: '270px', flexShrink: 0,
        background: '#131720', borderLeft: '1px solid #1e2540',
        overflowY: 'auto', padding: '16px',
      }}>
        {!country ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', textAlign: 'center',
            color: '#6b7280', padding: '20px',
          }}>
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>🗺</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px' }}>Country Intel</div>
            <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
              Click any marker on the map to view country status and key intelligence.
            </div>
            <div style={{ marginTop: '24px', width: '100%' }}>
              <SectionTitle>Marker Guide</SectionTitle>
              {[
                { color: '#e84343', label: 'Active conflict zone' },
                { color: '#4a9eff', label: 'Active offensive' },
                { color: '#f5a623', label: 'Proxy / active front' },
                { color: '#a855f7', label: 'Struck / targeted' },
                { color: '#50c878', label: 'Defensive' },
                { color: '#6b7280', label: 'Observer / transit' },
              ].map(m => (
                <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #1e2540' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: country.statusColor, flexShrink: 0, boxShadow: `0 0 8px ${country.statusColor}88` }} />
              <div style={{ fontWeight: 700, fontSize: '14px', flex: 1 }}>{country.name}</div>
              <button
                onClick={() => setSelectedKey(null)}
                style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '14px', padding: '2px 4px' }}
              >✕</button>
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px', lineHeight: 1.6 }}>{country.role}</div>
            <div style={{
              display: 'inline-block', fontSize: '10px', fontWeight: 700,
              padding: '3px 8px', borderRadius: '4px', marginBottom: '16px', letterSpacing: '0.05em',
              color: badgeStyle.color, background: badgeStyle.bg, border: `1px solid ${badgeStyle.border}`,
            }}>{country.status}</div>
            <SectionTitle>Key Intelligence</SectionTitle>
            {country.facts.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <span style={{ color: country.statusColor, fontSize: '11px', flexShrink: 0, marginTop: '1px' }}>▸</span>
                <span style={{ fontSize: '12px', color: '#d1d5db', lineHeight: 1.55 }}>{f}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
