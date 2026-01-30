export interface IBasicInfoStepProps {
  onGenreSelect: (genre: string) => void
  selectedGenre?: string | null
  selectedModel?: string
  onModelChange?: (model: string) => void
  onGenerateCompleteBlueprint?: () => Promise<void>
}

export const GENRE_LABELS: Record<string, string> = {
  fiction: 'de ficção',
  fantasy: 'de fantasia',
  'sci-fi': 'de ficção científica',
  romance: 'de romance',
  mystery: 'de mistério',
  thriller: 'de suspense',
  'non-fiction': 'de não ficção',
  biography: 'biográfico',
  history: 'histórico',
  'self-help': 'de autoajuda',
}
