import { useEffect, useMemo, useState } from 'react'

const STORAGE_TEAMS = 'team-studio-teams-v1'
const STORAGE_MEMBER = 'team-studio-membership-v1'

const ADJECTIVES = ['Sparkly','Cozy','Giggle','Zen','Turbo','Chaotic','Glorious','Sneaky','Cosmic','Wholesome']
const NOUNS = ['Otters','Yogis','Ninjas','Wizards','Pandas','Koalas','Fireflies','Cacti','Muffins','Comets']
const EMOJIS = ['🦦','🍌','🧘','🦄','🐼','🐨','🦋','🌵','🧁','☄️']
const CHANTS = [
  'Wiggle, giggle, wellness jiggle! 🕺',
  'Breathe in calm, beam out charm! ✨',
  'Stronger together, lighter forever! 🌟',
  'One step at a time, we\'re doing fine! 🚶‍♀️',
  'Mindful moments, joyful movements! 🎉',
  'Peace, love, and positive vibes! 💫',
  'Healthy habits, happy hearts! 💝',
  'Wellness warriors, unite! ⚡',
  'Good vibes only, that\'s our story! 🌈',
  'Chill, heal, and feel! 🧘‍♀️'
]

const COLOR_THEMES = [
  { id: 'violet', name: 'Violet', classes: 'bg-violet-500 border-violet-600' },
  { id: 'amber', name: 'Amber', classes: 'bg-amber-500 border-amber-600' },
  { id: 'emerald', name: 'Emerald', classes: 'bg-emerald-500 border-emerald-600' },
  { id: 'sky', name: 'Sky', classes: 'bg-sky-500 border-sky-600' },
  { id: 'rose', name: 'Rose', classes: 'bg-rose-500 border-rose-600' },
  { id: 'lime', name: 'Lime', classes: 'bg-lime-500 border-lime-600' },
  { id: 'pink', name: 'Pink', classes: 'bg-pink-500 border-pink-600' },
  { id: 'indigo', name: 'Indigo', classes: 'bg-indigo-500 border-indigo-600' },
]

type Team = {
  id: string
  name: string
  emoji: string
  colorId: string
  chant: string
  members: number
  cheers: number
  createdAt: number
}

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randomName() { return `The ${pick(ADJECTIVES)} ${pick(NOUNS)}` }
function randomEmoji() { return pick(EMOJIS) }
function randomChant() { return pick(CHANTS) }
function randomColorId() { return pick(COLOR_THEMES).id }
function colorThemeById(id: string) { return COLOR_THEMES.find(c => c.id === id) ?? COLOR_THEMES[0] }

export default function TeamStudio() {
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_TEAMS)
      if (raw) return JSON.parse(raw)
    } catch {
      // Handle localStorage errors silently
    }
    // Seed with playful examples
    const seed: Team[] = [
      { id: crypto.randomUUID(), name: 'The Sparkly Otters', emoji: '🦦', colorId: 'violet', chant: 'Wiggle, giggle, wellness jiggle! 🕺', members: 8, cheers: 12, createdAt: Date.now()-86400000 },
      { id: crypto.randomUUID(), name: 'Banana Yogis', emoji: '🍌', colorId: 'amber', chant: 'Breathe in calm, beam out charm! ✨', members: 5, cheers: 7, createdAt: Date.now()-43200000 },
    ]
    return seed
  })

  const [myMembership, setMyMembership] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_MEMBER)
      if (raw) return JSON.parse(raw)
    } catch {
      // Handle localStorage errors silently
    }
    return {}
  })

  useEffect(() => { 
    try { 
      localStorage.setItem(STORAGE_TEAMS, JSON.stringify(teams)) 
    } catch {
      // Handle localStorage errors silently
    }
  }, [teams])
  
  useEffect(() => { 
    try { 
      localStorage.setItem(STORAGE_MEMBER, JSON.stringify(myMembership)) 
    } catch {
      // Handle localStorage errors silently
    }
  }, [myMembership])

  // Auto-join via URL ?joinTeam=ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const joinTeam = params.get('joinTeam')
    if (joinTeam) {
      setMyMembership((prev) => ({ ...prev, [joinTeam]: true }))
      setTeams((cur) => cur.map((t) => t.id === joinTeam ? { ...t, members: t.members + 1 } : t))
      params.delete('joinTeam')
      const url = new URL(window.location.href)
      url.search = params.toString()
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  // Create form
  const [name, setName] = useState<string>(randomName())
  const [emoji, setEmoji] = useState<string>(randomEmoji())
  const [colorId, setColorId] = useState<string>(randomColorId())
  const [chant, setChant] = useState<string>(randomChant())

  const regenerateAll = () => {
    setName(randomName())
    setEmoji(randomEmoji())
    setColorId(randomColorId())
    setChant(randomChant())
  }

  const canCreate = name.trim().length > 0

  const createTeam = () => {
    if (!canCreate) return
    const t: Team = {
      id: crypto.randomUUID(),
      name: name.trim(),
      emoji,
      colorId,
      chant: chant.trim() || randomChant(),
      members: 1,
      cheers: 0,
      createdAt: Date.now(),
    }
    setTeams((prev) => [t, ...prev])
    setMyMembership((prev) => ({ ...prev, [t.id]: true }))
    regenerateAll()
  }

  // Enhancements: search, sort, reset demo
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'new' | 'members' | 'cheers'>('new')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = teams.filter(t => !q || t.name.toLowerCase().includes(q) || t.chant.toLowerCase().includes(q))
    if (sort === 'new') list = list.slice().sort((a,b) => b.createdAt - a.createdAt)
    if (sort === 'members') list = list.slice().sort((a,b) => b.members - a.members)
    if (sort === 'cheers') list = list.slice().sort((a,b) => b.cheers - a.cheers)
    return list
  }, [teams, query, sort])

  const resetDemo = () => {
    try {
      localStorage.removeItem(STORAGE_TEAMS)
      localStorage.removeItem(STORAGE_MEMBER)
    } catch {
      // Handle localStorage errors silently
    }
    window.location.reload()
  }

  const toggleJoin = (teamId: string) => {
    setMyMembership((prev) => {
      const joined = !!prev[teamId]
      setTeams((cur) => cur.map((t) => t.id === teamId ? { ...t, members: Math.max(0, t.members + (joined ? -1 : 1)) } : t))
      return { ...prev, [teamId]: !joined }
    })
  }

  const cheer = (teamId: string) => {
    setTeams((prev) => prev.map((t) => t.id === teamId ? { ...t, cheers: t.cheers + 1 } : t))
  }

  const copyInvite = async (teamId: string) => {
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('joinTeam', teamId)
      await navigator.clipboard.writeText(url.toString())
    } catch {
      // Handle clipboard errors silently
    }
  }

  return (
    <section className="space-responsive">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h2 className="h2">Team Studio</h2>
          <p className="p-muted max-w-2xl">Create wellness teams, join forces, and spread good vibes together.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline" onClick={resetDemo}>Reset Demo</button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card space-y-4">
            <h3 className="font-semibold text-lg">Create New Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Team Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2 touch-friendly"
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Emoji</label>
                <div className="flex gap-2 flex-wrap">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setEmoji(e)}
                      className={`p-2 rounded touch-friendly transition-colors ${emoji === e ? 'bg-slate-800' : 'hover:bg-slate-800/60'}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setColorId(theme.id)}
                      className={`p-2 rounded touch-friendly transition-colors ${colorId === theme.id ? 'ring-2 ring-white' : 'hover:bg-slate-800/60'}`}
                    >
                      <div className={`w-6 h-6 rounded ${theme.classes}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Team Chant</label>
                <input
                  type="text"
                  value={chant}
                  onChange={(e) => setChant(e.target.value)}
                  className="w-full rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2 touch-friendly"
                  placeholder="Enter team chant"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline" onClick={regenerateAll}>Regenerate All</button>
              <button className="btn" onClick={createTeam} disabled={!canCreate}>Create Team</button>
            </div>
          </div>

          <div className="card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="font-semibold text-lg">All Teams</h3>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2 touch-friendly"
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as 'new' | 'members' | 'cheers')}
                  className="rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2 touch-friendly"
                >
                  <option value="new">Newest</option>
                  <option value="members">Most Members</option>
                  <option value="cheers">Most Cheers</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {filtered.map((team) => {
                const theme = colorThemeById(team.colorId)
                const isMember = myMembership[team.id]
                return (
                  <div key={team.id} className="card space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{team.emoji}</div>
                        <div>
                          <div className="font-semibold text-lg">{team.name}</div>
                          <div className="text-sm p-muted">{team.chant}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className={`btn-outline ${isMember ? 'bg-brand-500 text-white border-brand-600' : ''}`}
                          onClick={() => toggleJoin(team.id)}
                        >
                          {isMember ? 'Leave' : 'Join'}
                        </button>
                        <button className="btn-outline" onClick={() => cheer(team.id)}>Cheer! 🎉</button>
                        <button className="btn-outline" onClick={() => copyInvite(team.id)}>Invite</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="rounded-lg bg-slate-800/30 p-3">
                        <div className="text-2xl font-bold">{team.members}</div>
                        <div className="text-xs p-muted">Members</div>
                      </div>
                      <div className="rounded-lg bg-slate-800/30 p-3">
                        <div className="text-2xl font-bold">{team.cheers}</div>
                        <div className="text-xs p-muted">Cheers</div>
                      </div>
                      <div className="rounded-lg bg-slate-800/30 p-3">
                        <div className="text-2xl font-bold">{theme.name}</div>
                        <div className="text-xs p-muted">Theme</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card space-y-4">
            <h3 className="font-semibold text-lg">My Teams</h3>
            {Object.keys(myMembership).length === 0 ? (
              <p className="text-sm p-muted">Join some teams to see them here!</p>
            ) : (
              <div className="space-y-3">
                {teams
                  .filter((t) => myMembership[t.id])
                  .map((team) => (
                    <div key={team.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
                      <div className="text-2xl">{team.emoji}</div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{team.name}</div>
                        <div className="text-xs p-muted">{team.members} members</div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="card space-y-4">
            <h3 className="font-semibold text-lg">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Teams</span>
                <span className="font-semibold">{teams.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">My Teams</span>
                <span className="font-semibold">{Object.values(myMembership).filter(Boolean).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Members</span>
                <span className="font-semibold">{teams.reduce((sum, t) => sum + t.members, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Cheers</span>
                <span className="font-semibold">{teams.reduce((sum, t) => sum + t.cheers, 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}