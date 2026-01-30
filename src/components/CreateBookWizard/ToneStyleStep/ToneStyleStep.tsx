import { Input, Label, Textarea, Button } from '@gaqno-development/frontcore/components/ui'
import { AISuggestionButton } from '../../AISuggestionButton'
import { useToneStyleStep } from './hooks/useToneStyleStep'
import type { IToneStyleStepProps } from './types'
import { TONE_OPTIONS, PACING_OPTIONS } from './types'
import { SparklesIcon } from '@gaqno-development/frontcore/components/icons';
import { Loader2 } from 'lucide-react';

export function ToneStyleStep(props: IToneStyleStepProps) {
  const {
    register,
    setValue,
    generatingFor,
    isGeneratingAll,
    handleGenerateTone,
    handleGeneratePacing,
    handleGenerateAudience,
    handleGenerateThemes,
    handleGenerateAll,
  } = useToneStyleStep(props)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-end pb-2 border-b">
        <Button
          type="button"
          onClick={handleGenerateAll}
          disabled={isGeneratingAll || generatingFor !== null}
          variant="outline"
          className="gap-2"
        >
          {isGeneratingAll ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4" />
              Gerar Tudo com IA
            </>
          )}
        </Button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="narrative_tone">Tom Narrativo</Label>
          <AISuggestionButton
            onGenerate={handleGenerateTone}
            onAccept={(suggestion) => setValue('narrative_tone', suggestion)}
            disabled={generatingFor === 'tone' || isGeneratingAll}
          />
        </div>
        <Input
          id="narrative_tone"
          placeholder="Ex: leve, sombrio, épico, intimista..."
          list="tone-options"
          {...register('narrative_tone')}
        />
        <datalist id="tone-options">
          {TONE_OPTIONS.map((tone) => (
            <option key={tone} value={tone} />
          ))}
        </datalist>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="pacing">Ritmo</Label>
          <AISuggestionButton
            onGenerate={handleGeneratePacing}
            onAccept={(suggestion) => setValue('pacing', suggestion)}
            disabled={generatingFor === 'pacing' || isGeneratingAll}
          />
        </div>
        <Input
          id="pacing"
          placeholder="Ex: rápido, contemplativo, equilibrado..."
          list="pacing-options"
          {...register('pacing')}
        />
        <datalist id="pacing-options">
          {PACING_OPTIONS.map((pace) => (
            <option key={pace} value={pace} />
          ))}
        </datalist>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="target_audience">Público Alvo</Label>
          <AISuggestionButton
            onGenerate={handleGenerateAudience}
            onAccept={(suggestion) => setValue('target_audience', suggestion)}
            disabled={generatingFor === 'audience' || isGeneratingAll}
          />
        </div>
        <Input
          id="target_audience"
          placeholder="Ex: Jovens adultos, Adultos, Público geral..."
          {...register('target_audience')}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="central_themes">Mensagem / Temas Centrais</Label>
          <AISuggestionButton
            onGenerate={handleGenerateThemes}
            onAccept={(suggestion) => setValue('central_themes', suggestion)}
            disabled={generatingFor === 'themes' || isGeneratingAll}
          />
        </div>
        <Textarea
          id="central_themes"
          placeholder="Quais são os temas centrais, mensagens ou questões que o livro explora?"
          rows={4}
          {...register('central_themes')}
        />
      </div>
    </div>
  )
}
