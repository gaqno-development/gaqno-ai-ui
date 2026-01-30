import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useUIStore } from '@gaqno-development/frontcore/store/uiStore'
import { aiApi } from '@/utils/api/aiApi'
import type { IBasicInfoStepProps } from '../types'
import { GENRE_LABELS } from '../types'
import { useWizardStepGeneration } from '../../shared/useWizardStepGeneration'

export function useBasicInfoStep({
  onGenreSelect,
  selectedGenre,
  onGenerateCompleteBlueprint,
}: IBasicInfoStepProps) {
  const { addNotification } = useUIStore()
  const { register, setValue, watch, formState: { errors } } = useFormContext()
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false)
  const [isGeneratingPremise, setIsGeneratingPremise] = useState(false)
  const { isGeneratingAll, runWithGeneratingAll } = useWizardStepGeneration()

  const title = watch('title')
  const description = watch('description')

  const handleGenerateTitle = async (): Promise<string> => {
    setIsGeneratingTitle(true)
    try {
      const genre = selectedGenre || undefined
      const premise = description?.trim() || undefined
      let prompt = 'Gere um título criativo e atraente para um livro'
      if (genre) {
        prompt += ` ${GENRE_LABELS[genre] || `do gênero ${genre}`}`
      }
      if (premise) {
        prompt += `. A premissa do livro é: ${premise.substring(0, 300)}`
      }
      const data = await aiApi.generateBlueprint({
        title: prompt,
        genre: genre || 'fiction',
        description: premise || 'Uma história envolvente',
      })
      const generatedTitle = data?.blueprint?.title || data?.title || 'Título Sugerido'
      return typeof generatedTitle === 'string' ? generatedTitle : JSON.stringify(generatedTitle)
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao gerar título')
    } finally {
      setIsGeneratingTitle(false)
    }
  }

  const handleGeneratePremise = async (): Promise<string> => {
    setIsGeneratingPremise(true)
    try {
      const bookTitle = title?.trim() || undefined
      const genre = selectedGenre || undefined
      let prompt = 'Gere uma premissa ou sinopse curta e envolvente para um livro'
      if (bookTitle) prompt += ` intitulado "${bookTitle}"`
      if (genre) prompt += ` ${GENRE_LABELS[genre] || `do gênero ${genre}`}`
      prompt += '. A premissa deve incluir os elementos principais da história, personagens principais e o conflito central.'
      const data = await aiApi.generateBlueprint({
        title: bookTitle || 'Novo Livro',
        genre: genre || 'fiction',
        description: prompt,
      })
      const generatedPremise = data?.blueprint?.summary || data?.summary || description || 'Uma premissa interessante para o livro'
      return typeof generatedPremise === 'string' ? generatedPremise : JSON.stringify(generatedPremise)
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao gerar premissa')
    } finally {
      setIsGeneratingPremise(false)
    }
  }

  const handleGenerateAll = async () => {
    await runWithGeneratingAll(async () => {
      try {
        if (onGenerateCompleteBlueprint) {
          await onGenerateCompleteBlueprint()
          addNotification({
            type: 'success',
            title: 'Blueprint completo gerado!',
            message: 'Todos os steps foram preenchidos com sucesso. Navegue pelos steps para revisar.',
            duration: 5000,
          })
        } else {
          const data = await aiApi.generateBlueprint({
            title: 'Gere um livro completo com título, gênero e premissa envolvente',
            genre: 'fiction',
            description: 'Crie uma ideia original e criativa para um livro, incluindo título atraente, gênero apropriado e uma premissa detalhada.',
          })
          const blueprint = data?.blueprint || data
          if (blueprint?.title) {
            const generatedTitle = typeof blueprint.title === 'string' ? blueprint.title : JSON.stringify(blueprint.title)
            setValue('title', generatedTitle)
          }
          if (blueprint?.genre || data?.genre) {
            const genre = blueprint?.genre || data?.genre
            if (typeof genre === 'string') onGenreSelect(genre)
          }
          if (blueprint?.summary || blueprint?.description || data?.summary) {
            const generatedPremise = blueprint?.summary || blueprint?.description || data?.summary
            const premise = typeof generatedPremise === 'string' ? generatedPremise : JSON.stringify(generatedPremise)
            setValue('description', premise)
          }
          addNotification({
            type: 'success',
            title: 'Campos preenchidos!',
            message: 'Título, gênero e premissa foram gerados com sucesso.',
            duration: 3000,
          })
        }
      } catch (err: unknown) {
        addNotification({
          type: 'error',
          title: 'Erro ao gerar',
          message: err instanceof Error ? err.message : 'Não foi possível gerar os campos automaticamente.',
          duration: 5000,
        })
      }
    })
  }

  return {
    register,
    setValue,
    errors,
    isGeneratingTitle,
    isGeneratingPremise,
    isGeneratingAll,
    handleGenerateTitle,
    handleGeneratePremise,
    handleGenerateAll,
  }
}
