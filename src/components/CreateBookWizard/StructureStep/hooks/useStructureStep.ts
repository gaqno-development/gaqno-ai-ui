import { useState, useEffect } from 'react'
import { useUIStore } from '@gaqno-development/frontcore/store/uiStore'
import { booksApi } from '@/utils/api/booksApi'
import type { IStructureStepProps } from '../types'
import { useWizardStepGeneration } from '../../shared/useWizardStepGeneration'

export function useStructureStep({ bookContext, onStructureChange, structure }: IStructureStepProps) {
  const { addNotification } = useUIStore()
  const [isOpen, setIsOpen] = useState(false)
  const [plotSummary, setPlotSummary] = useState('')
  const [initialChapters, setInitialChapters] = useState('')
  const [mainConflict, setMainConflict] = useState('')
  const { generatingFor, setGeneratingFor, isGeneratingAll, guardGenerateAll, runWithGeneratingAll } = useWizardStepGeneration()

  useEffect(() => {
    if (!structure) return
    if (structure.plotSummary !== undefined) setPlotSummary(structure.plotSummary)
    if (structure.initialChapters !== undefined) setInitialChapters(structure.initialChapters)
    if (structure.mainConflict !== undefined) setMainConflict(structure.mainConflict)
  }, [structure?.plotSummary, structure?.initialChapters, structure?.mainConflict])

  const handleGeneratePlotSummary = async (): Promise<string> => {
    setGeneratingFor('plot')
    try {
      const data = await booksApi.generateBlueprint({
        title: bookContext?.title || 'Novo Livro',
        genre: bookContext?.genre || 'fiction',
        description: bookContext?.description || 'Um livro interessante',
      })
      const generated = data?.blueprint?.summary || data?.summary || 'Um resumo do enredo em 3 atos'
      const summary = typeof generated === 'string' ? generated : JSON.stringify(generated)
      setPlotSummary(summary)
      onStructureChange?.({ plotSummary: summary, initialChapters, mainConflict })
      return summary
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao gerar resumo do enredo')
    } finally {
      setGeneratingFor(null)
    }
  }

  const handleGenerateChapters = async (): Promise<string> => {
    setGeneratingFor('chapters')
    try {
      const data = await booksApi.generateBlueprint({
        title: bookContext?.title || 'Novo Livro',
        genre: bookContext?.genre || 'fiction',
        description: bookContext?.description || 'Um livro interessante',
      })
      const structureData = data?.blueprint?.structure
      if (structureData?.chapters) {
        const chaptersText = (structureData.chapters as Array<{ title?: string; number?: number; summary?: string }>)
          .map((ch, idx) => `${idx + 1}. ${ch.title || `Capítulo ${ch.number ?? idx + 1}`}: ${ch.summary || ''}`)
          .join('\n')
        setInitialChapters(chaptersText)
        onStructureChange?.({ plotSummary, initialChapters: chaptersText, mainConflict })
        return chaptersText
      }
      const generated = 'Capítulos iniciais sugeridos'
      setInitialChapters(generated)
      onStructureChange?.({ plotSummary, initialChapters: generated, mainConflict })
      return generated
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao gerar capítulos')
    } finally {
      setGeneratingFor(null)
    }
  }

  const handleGenerateConflict = async (): Promise<string> => {
    setGeneratingFor('conflict')
    try {
      const data = await booksApi.generateBlueprint({
        title: bookContext?.title || 'Novo Livro',
        genre: bookContext?.genre || 'fiction',
        description: `Descreva o conflito principal para: ${bookContext?.description || 'um livro'}`,
      })
      const generated = data?.blueprint?.summary || data?.summary || 'O conflito principal da história'
      const conflict = typeof generated === 'string' ? generated : JSON.stringify(generated)
      setMainConflict(conflict)
      onStructureChange?.({ plotSummary, initialChapters, mainConflict: conflict })
      return conflict
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao gerar conflito')
    } finally {
      setGeneratingFor(null)
    }
  }

  const handleGenerateAll = async () => {
    if (guardGenerateAll(bookContext, 'Preencha pelo menos o título ou a premissa do livro antes de gerar a estrutura.')) return
    await runWithGeneratingAll(async () => {
      try {
        const prompt = `Baseado no livro "${bookContext?.title || 'Novo Livro'}" ${bookContext?.genre ? `do gênero ${bookContext.genre}` : ''}, ${bookContext?.description ? `com a premissa: ${bookContext.description.substring(0, 200)}` : ''}. Gere uma estrutura completa da história incluindo: resumo do enredo em 3 atos (introdução, desenvolvimento, conclusão), lista de capítulos iniciais sugeridos com títulos e resumos, e o conflito principal que impulsiona a narrativa.`
        const data = await booksApi.generateBlueprint({
          title: bookContext?.title || 'Novo Livro',
          genre: bookContext?.genre || 'fiction',
          description: prompt,
        })
        const blueprint = data?.blueprint || data
        const structureData = (blueprint?.structure || {}) as Record<string, unknown>
        const summary = (blueprint?.summary || data?.summary || '') as string
        const chArr = structureData.chapters as Array<{ title?: string; number?: number; summary?: string }> | undefined

        let newPlot = (structureData.plot_summary as string) || summary || ''
        let newChapters = (structureData.initial_chapters as string) || (Array.isArray(chArr) ? chArr.map((ch, idx) => `${idx + 1}. ${ch.title || `Capítulo ${ch.number ?? idx + 1}`}: ${ch.summary || ''}`).join('\n') : '')
        let newConflict = (structureData.main_conflict || structureData.conflict || (summary ? summary.substring(0, 200) : '')) as string

        setPlotSummary(newPlot)
        setInitialChapters(newChapters)
        setMainConflict(newConflict)
        onStructureChange?.({ plotSummary: newPlot, initialChapters: newChapters, mainConflict: newConflict })

        addNotification({
          type: 'success',
          title: 'Estrutura gerada!',
          message: 'Todos os campos da estrutura foram preenchidos com sucesso.',
          duration: 3000,
        })
      } catch (err: unknown) {
        addNotification({
          type: 'error',
          title: 'Erro ao gerar estrutura',
          message: err instanceof Error ? err.message : 'Não foi possível gerar a estrutura automaticamente.',
          duration: 5000,
        })
      }
    })
  }

  const applyPlotSummary = (v: string) => {
    setPlotSummary(v)
    onStructureChange?.({ plotSummary: v, initialChapters, mainConflict })
  }
  const applyInitialChapters = (v: string) => {
    setInitialChapters(v)
    onStructureChange?.({ plotSummary, initialChapters: v, mainConflict })
  }
  const applyMainConflict = (v: string) => {
    setMainConflict(v)
    onStructureChange?.({ plotSummary, initialChapters, mainConflict: v })
  }

  return {
    isOpen,
    setIsOpen,
    plotSummary,
    initialChapters,
    mainConflict,
    generatingFor,
    isGeneratingAll,
    handleGeneratePlotSummary,
    handleGenerateChapters,
    handleGenerateConflict,
    handleGenerateAll,
    applyPlotSummary,
    applyInitialChapters,
    applyMainConflict,
  }
}
