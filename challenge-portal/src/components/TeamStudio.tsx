import { useEffect, useMemo, useState } from 'react'

const STORAGE_TEAMS = 'team-studio-teams-v1'
const STORAGE_MEMBER = 'team-studio-membership-v1'

// Predefined color themes to avoid dynamic class generation issues
const COLOR_THEMES = [
  { id: 'emerald', dot: 'bg-emerald-500', badge: 'bg-emerald-600/20 text-emerald-300 border-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  { id: 'sky', dot: 'bg-sky-500', badge: 'bg-sky-600/20 text-sky-300 border-sky-700', btn: 'bg-sky-600 hover:bg-sky-700' },
  { id: 'violet', dot: 'bg-violet-500', badge: 'bg-violet-600/20 text-violet-300 border-violet-700', btn: 'bg-violet-600 hover:bg-violet-700' },
  { id: 'pink', dot: 'bg-pink-500', badge: 'bg-pink-600/20 text-pink-300 border-pink-700', btn: 'bg-pink-600 hover:bg-pink-700' },
  { id: 'amber', dot: 'bg-amber-500', badge: 'bg-amber-600/20 text-amber-300 border-amber-700', btn: 'bg-amber-600 hover:bg-amber-700' },
  { id: 'lime', dot: 'bg-lime-500', badge: 'bg-lime-600/20 text-lime-300 border-lime-700', btn: 'bg-lime-600 hover:bg-lime-700' },
]

const EMOJIS = ['🧘','🐢','🐝','🐧','🌈','✨']
const ADJECTIVES = ['Giggly','Zen','Turbo','Sparkly','Sleepy','Wobbly','Lo-Fi','Sassy','Wholesome','Chaotic','Banana','Cosmic','Mighty','Curious','Bouncy']
const NOUNS = ['Walruses','Wombats','Unicorns','Muffins','Disco Ducks','Yogis','Noodles','Otters','Koalas','Pickles','Cupcakes','Penguins','Koalas','Llamas','Otters']
const CHANTS = [
  'One step, one smile, we vibe in style! 🎉',
  'Breathe in calm, beam out charm! ✨',
  'Wiggle, giggle, wellness jiggle! 🕺',
  'Hydrate, celebrate, we radiate! 💧',
  'Stretch, fetch joy, no stress, oh boy! 🤸',
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
    } catch {}
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
    } catch {}
    return {}
  })

  useEffect(() => { try { localStorage.setItem(STORAGE_TEAMS, JSON.stringify(teams)) } catch {} }, [teams])
  useEffect(() => { try { localStorage.setItem(STORAGE_MEMBER, JSON.stringify(myMembership)) } catch {} }, [myMembership])

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
    localStorage.removeItem(STORAGE_TEAMS)
    localStorage.removeItem(STORAGE_MEMBER)
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
    setTeams((cur) => cur.map((t) => t.id === teamId ? { ...t, cheers: t.cheers + 1 } : t))
  }

  const copyInvite = async (teamId: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('joinTeam', teamId)
    try {
      await navigator.clipboard.writeText(url.toString())
    } catch {}
  }

  return (
    <section className="grid gap-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="h2">Teams & Groups</h2>
          <p className="p-muted">Form a squad with a delightfully silly vibe. Collaboration, but make it fun.</p>
        </div>
        <div className="flex items-center gap-2">
          <input className="rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2" placeholder="Search teams" value={query} onChange={(e)=>setQuery(e.target.value)} />
          <select className="rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2" value={sort} onChange={(e)=>setSort(e.target.value as any)}>
            <option value="new">Newest</option>
            <option value="members">Most Members</option>
            <option value="cheers">Most Cheers</option>
          </select>
          <button className="btn-outline" onClick={resetDemo}>Reset Demo</button>
        </div>
      </header>

      <div className="card grid gap-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="text-2xl" title="Mascot">{emoji}</div>
            <input className="rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2 w-64" value={name} onChange={(e)=>setName(e.target.value)} />
            <button className="btn-outline" onClick={() => setEmoji(randomEmoji())}>Shuffle Emoji</button>
            <button className="btn-outline" onClick={() => setName(randomName())}>Random Name</button>
          </div>
          <button className="btn" onClick={createTeam} disabled={!canCreate}>Create Team</button>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-sm p-muted">Team color</div>
          <div className="flex items-center gap-2">
            {COLOR_THEMES.map((c) => (
              <button key={c.id} aria-label={c.id} onClick={()=>setColorId(c.id)} className={`h-6 w-6 rounded-full border-2 ${colorThemeById(c.id).dot} ${colorId===c.id?'border-white':'border-slate-600'}`} />
            ))}
          </div>
          <div className="text-sm p-muted ml-4">Chant</div>
          <input className="flex-1 rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2" value={chant} onChange={(e)=>setChant(e.target.value)} placeholder="Your team chant" />
          <button className="btn-outline" onClick={()=>setChant(randomChant())}>Random Chant</button>
          <button className="btn-outline" onClick={regenerateAll}>Surprise Me</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => {
          const theme = colorThemeById(t.colorId)
          const joined = !!myMembership[t.id]
          return (
            <article key={t.id} className="card space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} />
                  <div className="text-2xl" title="Mascot">{t.emoji}</div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className={`inline-flex items-center gap-2 text-xs border px-2 py-0.5 rounded ${theme.badge}`}>{t.chant}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-outline" onClick={() => cheer(t.id)}>Cheer {t.cheers}</button>
                  <button className="btn-outline" onClick={() => copyInvite(t.id)}>Invite</button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm p-muted">
                <div>{t.members} members</div>
                <div className="flex items-center gap-2">
                  <button className={`px-3 py-1.5 rounded-md text-white ${theme.btn}`} onClick={() => toggleJoin(t.id)}>
                    {joined ? 'Leave' : 'Join'}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}