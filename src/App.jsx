import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import ConflictMap from './components/tabs/ConflictMap'
import ProxyNetwork from './components/tabs/ProxyNetwork'
import AttackWaves from './components/tabs/AttackWaves'
import DailyLog from './components/tabs/DailyLog'
import IntelData from './components/tabs/IntelData'

const TABS = [
  { id: 'map',    label: '⚔ CONFLICT MAP' },
  { id: 'proxy',  label: '🔗 PROXY NETWORK' },
  { id: 'waves',  label: '📊 ATTACK WAVES' },
  { id: 'log',    label: '📋 DAILY LOG' },
  { id: 'intel',  label: '🔍 INTEL & DATA' },
]

const TAB_COMPONENTS = {
  map:    ConflictMap,
  proxy:  ProxyNetwork,
  waves:  AttackWaves,
  log:    DailyLog,
  intel:  IntelData,
}

const variants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir < 0 ? 40 : -40 }),
}

export default function App() {
  const [activeTab, setActiveTab] = useState('map')
  const [direction, setDirection] = useState(1)

  const tabIds = TABS.map(t => t.id)

  function switchTab(id) {
    const curr = tabIds.indexOf(activeTab)
    const next = tabIds.indexOf(id)
    if (id === activeTab) return
    setDirection(next > curr ? 1 : -1)
    setActiveTab(id)
  }

  const TabComponent = TAB_COMPONENTS[activeTab]

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'#0b0d11' }}>
      <Navbar tabs={TABS} activeTab={activeTab} onSwitch={switchTab} />
      <div style={{ flex:1, overflow:'hidden', position:'relative' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            style={{ position:'absolute', inset:0 }}
          >
            <TabComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
