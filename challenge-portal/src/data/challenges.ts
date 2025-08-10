import type { Challenge } from '../types'

export const CHALLENGES: Challenge[] = [
  {
    id: 'mindfulness-01',
    title: '7-Minute Mindful Breathing',
    category: 'Mindfulness',
    durationDays: 7,
    description:
      'Center your day with gentle, guided breaths. Short, consistent sessions help create calm momentum.',
    guidelines: [
      'Find a quiet space and sit comfortably',
      'Breathe in for 4, hold for 4, out for 6 — repeat',
      'Log how you feel before and after',
    ],
    estimatedDailyMinutes: 7,
  },
  {
    id: 'creativity-01',
    title: 'Daily Doodle Sprint',
    category: 'Creativity',
    durationDays: 7,
    description:
      'Spark ideas with playful drawing prompts. No perfection needed — just joyful marks.',
    guidelines: [
      'Pick a simple theme each day (e.g., “circles in motion”)',
      'Fill one small page with quick sketches',
      'Share a favorite doodle with your team for encouragement',
    ],
    estimatedDailyMinutes: 10,
  },
  {
    id: 'physical-01',
    title: 'Fresh Air Walks',
    category: 'Physical Activity',
    durationDays: 7,
    description:
      'Light movement restores energy. Step outside, look far, and reset your posture.',
    guidelines: [
      'Walk at a conversational pace',
      'Notice 3 things you can see, hear, and feel',
      'Stretch calves and shoulders after the walk',
    ],
    estimatedDailyMinutes: 15,
  },
  {
    id: 'mindfulness-02',
    title: 'Gratitude Notes',
    category: 'Mindfulness',
    durationDays: 7,
    description:
      'Intentional appreciation trains attention toward the good and builds quiet confidence.',
    guidelines: [
      'Write 3 small, specific moments you appreciated today',
      'Optional: message one person to thank them',
      'Keep notes in a single place to re-read later',
    ],
    estimatedDailyMinutes: 5,
  },
  {
    id: 'creativity-02',
    title: 'Idea Seeds',
    category: 'Creativity',
    durationDays: 7,
    description:
      'Capture tiny ideas before they vanish. Small seeds often grow into surprising projects.',
    guidelines: [
      'Jot down 5 one-line ideas each day',
      'Star one idea you might explore further',
      'Review the list at the end of the week',
    ],
    estimatedDailyMinutes: 8,
  },
  {
    id: 'physical-02',
    title: 'Morning Mobility',
    category: 'Physical Activity',
    durationDays: 7,
    description:
      'Gentle joints, happier day. Start with easy mobility to feel lighter and more focused.',
    guidelines: [
      'Neck, shoulders, hips, ankles — 2 minutes each',
      'Keep range-of-motion pain-free and smooth',
      'Sip water after to rehydrate',
    ],
    estimatedDailyMinutes: 12,
  },
]