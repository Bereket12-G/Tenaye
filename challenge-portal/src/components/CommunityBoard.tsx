import { useEffect, useMemo, useState } from 'react'

const STORAGE_POSTS = 'community-board-posts-v1'
const STORAGE_PROFILE = 'community-board-profile-v1'

const AVATAR_EMOJIS = ['🦄','🐝','🐢','🐼','🦊','🐧']
const REACTIONS = ['😂','💪','🌟','🫶'] as const

type ReactionKey = typeof REACTIONS[number]

type Profile = {
  name: string
  avatar: string
  flair: string
}

type Comment = {
  id: string
  author: Profile
  content: string
  ts: number
}

type Post = {
  id: string
  author: Profile
  content: string
  mood?: string
  ts: number
  reactions: Record<ReactionKey, number>
  comments: Comment[]
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Pure JS funny flair generator using user-provided keywords
function generateFlair(keywords: string): string {
  const vibes = ['Zen','Sparkly','Turbo','Cozy','Chaotic','Wholesome','Sneaky','Glorious','Giggle','Cosmic']
  const nouns = ['Noodle','Ninja','Walrus','Wizard','Tornado','Muffin','Comet','Yogi','Disco','Koala']
  const extras = ['of Joy','of Calm','of Snacks','of Chaos','of Vibes','of Sunshine','of Shenanigans']
  const emojis = ['✨','🌈','🧘','🎉','💪']
  const kw = keywords.trim()
  const kwPart = kw ? ` ${kw.split(/[\,\s]+/).filter(Boolean)[0]}` : ''
  return `${pick(vibes)} ${pick(nouns)}${kwPart} ${pick(extras)} ${pick(emojis)}`
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function CommunityBoard() {
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PROFILE)
      if (raw) return JSON.parse(raw)
    } catch {}
    return { name: 'Guest', avatar: pick(AVATAR_EMOJIS), flair: generateFlair('') }
  })

  const [nameInput, setNameInput] = useState(profile.name)
  const [kwInput, setKwInput] = useState('')

  useEffect(() => {
    try { localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile)) } catch {}
  }, [profile])

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_POSTS)
      if (raw) return JSON.parse(raw)
    } catch {}
    // Seed with a couple cheerful posts
    const seedAuthor: Profile = { name: 'Ava', avatar: '🦄', flair: 'Wholesome Wizard of Joy ✨' }
    const seed: Post[] = [
      { id: crypto.randomUUID(), author: seedAuthor, content: 'Day 2 of mindful breathing — my brain went from popcorn to soup. Deliciously calm.', mood: '🧘', ts: Date.now() - 1000*60*60*3, reactions: { '😂': 2, '💪': 1, '🌟': 3, '🫶': 2 }, comments: [] },
      { id: crypto.randomUUID(), author: { name: 'Ben', avatar: '🐝', flair: 'Sparkly Ninja of Snacks 🍩' }, content: 'Walked 15 minutes and waved at every dog. 10/10 would woof again.', mood: '🐶', ts: Date.now() - 1000*60*60*6, reactions: { '😂': 4, '💪': 2, '🌟': 1, '🫶': 3 }, comments: [] },
    ]
    return seed
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_POSTS, JSON.stringify(posts)) } catch {}
  }, [posts])

  const [composer, setComposer] = useState('')
  const [mood, setMood] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'new' | 'reacted'>('new')

  const canPost = composer.trim().length > 0

  const share = () => {
    if (!canPost) return
    const p: Post = {
      id: crypto.randomUUID(),
      author: profile,
      content: composer.trim(),
      mood: mood || undefined,
      ts: Date.now(),
      reactions: { '😂': 0, '💪': 0, '🌟': 0, '🫶': 0 },
      comments: []
    }
    setPosts((prev) => [p, ...prev])
    setComposer('')
    setMood('')
  }

  const reactTo = (postId: string, key: ReactionKey) => {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, reactions: { ...p.reactions, [key]: p.reactions[key] + 1 } } : p))
  }

  const addComment = (postId: string, content: string) => {
    const comment: Comment = { id: crypto.randomUUID(), author: profile, content, ts: Date.now() }
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p))
  }

  const resetDemo = () => {
    setPosts([])
    setProfile({ name: 'Guest', avatar: pick(AVATAR_EMOJIS), flair: generateFlair('') })
    setNameInput('Guest')
    setKwInput('')
  }

  function sumReact(p: Post) { return REACTIONS.reduce((acc, r) => acc + p.reactions[r], 0) }

  const filtered = useMemo(() => {
    let f = posts
    if (query) {
      const q = query.toLowerCase()
      f = f.filter((p) => p.content.toLowerCase().includes(q) || p.author.name.toLowerCase().includes(q))
    }
    if (sort === 'reacted') {
      f = [...f].sort((a, b) => sumReact(b) - sumReact(a))
    } else {
      f = [...f].sort((a, b) => b.ts - a.ts)
    }
    return f
  }, [posts, query, sort])

  return (
    <section className="space-responsive">
      <div>
        <h2 className="h2">Community Board</h2>
        <p className="p-muted">Share your wellness journey and cheer on others. Keep it light and supportive!</p>
      </div>

      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl sm:text-2xl" title="Avatar">{profile.avatar}</div>
            <div>
              <div className="font-semibold text-lg sm:text-base">{profile.name}</div>
              <div className="text-xs p-muted max-w-xs truncate">{profile.flair}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="btn-outline text-sm" onClick={() => setProfile((p) => ({ ...p, avatar: pick(AVATAR_EMOJIS) }))}>Shuffle Avatar</button>
            <button className="btn-outline text-sm" onClick={resetDemo}>Reset Demo</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <input className="rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2 touch-friendly" placeholder="Display name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
          <input className="rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2 touch-friendly" placeholder="Your vibe keywords (e.g., zen, snacks)" value={kwInput} onChange={(e) => setKwInput(e.target.value)} />
          <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
            <button className="btn flex-1" onClick={() => setProfile((p) => ({ ...p, name: nameInput || 'Guest', flair: generateFlair(kwInput) }))}>Generate Flair</button>
            <button className="btn-outline" onClick={() => setProfile({ name: nameInput || 'Guest', avatar: profile.avatar, flair: profile.flair })}>Save</button>
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <div className="font-medium text-lg">Share your experience</div>
        <textarea className="rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2 min-h-24 w-full touch-friendly" placeholder="Lighthearted thoughts, progress, or tips..." value={composer} onChange={(e) => setComposer(e.target.value)} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm p-muted">Mood</span>
            <div className="flex gap-1">
              {['🧘','😄','🌈','🎉','💪'].map((m) => (
                <button key={m} onClick={() => setMood(m)} className={`px-3 py-2 rounded touch-friendly transition-colors ${mood===m?'bg-slate-800':'hover:bg-slate-800/60'}`}>{m}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input className="rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2 touch-friendly" placeholder="Search posts" value={query} onChange={(e) => setQuery(e.target.value)} />
            <select className="rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2 touch-friendly" value={sort} onChange={(e) => setSort(e.target.value as any)}>
              <option value="new">Newest</option>
              <option value="reacted">Most Reacted</option>
            </select>
            <button className="btn" disabled={!canPost} onClick={share}>Share</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((p) => (
          <article key={p.id} className="card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="text-3xl sm:text-2xl" title="Avatar">{p.author.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold flex items-center gap-2 text-lg sm:text-base">
                    {p.author.name} {p.mood && <span className="text-base">{p.mood}</span>}
                  </div>
                  <div className="text-xs p-muted truncate">{p.author.flair} • {formatTime(p.ts)}</div>
                </div>
              </div>
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                {REACTIONS.map((r) => (
                  <button key={r} className="btn-outline px-2 py-1 text-sm touch-friendly" onClick={() => reactTo(p.id, r)}>{r} <span className="text-slate-400">{p.reactions[r]}</span></button>
                ))}
              </div>
            </div>
            <p className="text-slate-200 leading-relaxed">{p.content}</p>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              <CommentBox onAdd={(text) => addComment(p.id, text)} />
              <div className="grid gap-3">
                {p.comments.map((c) => (
                  <div key={c.id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                    <div className="text-xs p-muted flex items-center gap-2 flex-wrap">
                      <span>{c.author.avatar}</span>
                      <span className="font-medium text-slate-200">{c.author.name}</span>
                      <span>•</span>
                      <span>{formatTime(c.ts)}</span>
                    </div>
                    <div className="text-sm mt-2 leading-relaxed">{c.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function CommentBox({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState('')
  const [pickEmoji, setPickEmoji] = useState('')
  const emojis = ['😄','🫶','🌟','🎉','🧘']
  const add = () => {
    const t = (pickEmoji ? pickEmoji + ' ' : '') + text.trim()
    if (!t) return
    onAdd(t)
    setText('')
    setPickEmoji('')
  }
  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {emojis.map((e) => (
          <button key={e} onClick={() => setPickEmoji(e)} className={`px-2 py-1 rounded touch-friendly transition-colors ${pickEmoji===e?'bg-slate-800':'hover:bg-slate-800/60'}`}>{e}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2 touch-friendly" placeholder="Add a comment..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        <button className="btn-outline" onClick={add}>Comment</button>
      </div>
    </div>
  )
}