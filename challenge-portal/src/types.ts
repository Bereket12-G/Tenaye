export type ChallengeCategory = 'Mindfulness' | 'Creativity' | 'Physical Activity' | 'Nutrition' | 'Sleep'

export interface Challenge {
  id: string
  title: string
  category: ChallengeCategory
  durationDays: number
  description: string
  guidelines: string[]
  estimatedDailyMinutes: number
}