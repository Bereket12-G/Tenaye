import { usePartyMode } from '../hooks/usePartyMode'

export default function PartySwitch() {
  const { partyOn, toggleParty } = usePartyMode()
  return (
    <button onClick={toggleParty} className={`btn-outline ${partyOn ? 'ring-2 ring-brand-500/50' : ''}`} title="Party mode">
      {partyOn ? '🎉 Party On' : '✨ Party'}
    </button>
  )
}