import { useState } from 'react'
import { useUIStore } from '@gaqno-development/frontcore/store/uiStore'
import { aiApi } from '@/utils/api/aiApi'
import type { ISetting, IWorldSettingsStepProps } from '../types'
import { useWizardStepGeneration } from '../../shared/useWizardStepGeneration'

export function useWorldSettingsStep({ settings, onSettingsChange, bookContext }: IWorldSettingsStepProps) {
  const { addNotification } = useUIStore()
  const { generatingFor, setGeneratingFor, isGeneratingAll, guardGenerateAll, runWithGeneratingAll } = useWizardStepGeneration()

  const handleAddSetting = () => {
    const newSetting: ISetting = {
      id: `temp-${Date.now()}`,
      name: '',
      description: '',
    }
    onSettingsChange([...settings, newSetting])
  }

  const handleRemoveSetting = (id: string) => {
    onSettingsChange(settings.filter((s) => s.id !== id))
  }

  const handleUpdateSetting = (id: string, field: keyof ISetting, value: string) => {
    onSettingsChange(settings.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const handleGenerateDescription = async (settingId: string, settingName: string): Promise<string> => {
    setGeneratingFor(settingId)
    try {
      const prompt = `Crie uma descrição detalhada para o cenário "${settingName}" no livro "${bookContext?.title || 'Novo Livro'}" do gênero ${bookContext?.genre || 'ficção'}. A descrição deve incluir características físicas, atmosfera, importância na história.`
      const data = await aiApi.generateBlueprint({
        title: bookContext?.title || 'Novo Livro',
        genre: bookContext?.genre || 'fiction',
        description: prompt,
      })
      const generated = data?.blueprint?.summary || data?.summary || `Uma descrição detalhada do cenário ${settingName}`
      return typeof generated === 'string' ? generated : JSON.stringify(generated)
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao gerar descrição')
    } finally {
      setGeneratingFor(null)
    }
  }

  const handleGenerateAll = async () => {
    if (guardGenerateAll(bookContext, 'Preencha pelo menos o título ou a premissa do livro antes de gerar cenários.')) return
    await runWithGeneratingAll(async () => {
      try {
        const prompt = `Baseado no livro "${bookContext?.title || 'Novo Livro'}" ${bookContext?.genre ? `do gênero ${bookContext.genre}` : ''}, ${bookContext?.description ? `com a premissa: ${bookContext.description.substring(0, 200)}` : ''}. Gere 3 a 5 cenários principais onde a história se desenrola. Para cada cenário, forneça: nome, descrição detalhada (características físicas, atmosfera, importância na história) e opcionalmente uma linha do tempo ou contexto histórico.`
        const data = await aiApi.generateBlueprint({
          title: bookContext?.title || 'Novo Livro',
          genre: bookContext?.genre || 'fiction',
          description: prompt,
        })
        const blueprint = data?.blueprint || data
        const context = blueprint?.context || {}
        let settingsArray: unknown[] = []
        if (Array.isArray(context.setting)) settingsArray = context.setting
        else if (Array.isArray(context.settings)) settingsArray = context.settings
        else if (Array.isArray(context.locations)) settingsArray = context.locations
        else if (Array.isArray(context.places)) settingsArray = context.places
        else if (Array.isArray(context)) settingsArray = context

        if (Array.isArray(settingsArray) && settingsArray.length > 0) {
          const newSettings: ISetting[] = settingsArray.map((s: Record<string, unknown>, idx: number) => {
            let description = (s.description || s.summary || '') as string
            if (s.importance && !description.includes(String(s.importance))) {
              description += description ? `\n\nImportância: ${s.importance}` : String(s.importance)
            }
            return {
              id: `temp-${Date.now()}-${idx}`,
              name: (s.name as string) || `Cenário ${idx + 1}`,
              description: description.trim(),
              timeline_summary: (s.timeline_summary || s.timeline || s.historical_context || '') as string,
            }
          })
          onSettingsChange(newSettings)
          addNotification({
            type: 'success',
            title: 'Cenários gerados!',
            message: `${newSettings.length} cenário(s) foram gerados com sucesso a partir do blueprint. Você pode editá-los conforme necessário.`,
            duration: 3000,
          })
        } else {
          const summary = (blueprint?.summary || data?.summary || '') as string
          if (summary) {
            const newSettings: ISetting[] = [
              { id: `temp-${Date.now()}-1`, name: 'Cenário Principal', description: `O cenário principal onde a maior parte da história se desenrola. ${summary.substring(0, 200)}` },
              { id: `temp-${Date.now()}-2`, name: 'Cenário Secundário', description: 'Um cenário importante para o desenvolvimento da narrativa.' },
              { id: `temp-${Date.now()}-3`, name: 'Cenário de Conflito', description: 'O local onde os principais conflitos da história ocorrem.' },
            ]
            onSettingsChange(newSettings)
            addNotification({
              type: 'success',
              title: 'Cenários gerados!',
              message: '3 cenários genéricos foram criados. Você pode editá-los conforme necessário.',
              duration: 3000,
            })
          } else {
            addNotification({
              type: 'warning',
              title: 'Nenhum cenário encontrado',
              message: 'O blueprint não retornou cenários específicos. Adicione cenários manualmente.',
              duration: 5000,
            })
          }
        }
      } catch (err: unknown) {
        addNotification({
          type: 'error',
          title: 'Erro ao gerar cenários',
          message: err instanceof Error ? err.message : 'Não foi possível gerar os cenários automaticamente.',
          duration: 5000,
        })
      }
    })
  }

  return {
    generatingFor,
    isGeneratingAll,
    handleAddSetting,
    handleRemoveSetting,
    handleUpdateSetting,
    handleGenerateDescription,
    handleGenerateAll,
  }
}
