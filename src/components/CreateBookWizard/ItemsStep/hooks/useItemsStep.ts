import { useState } from 'react'
import { useUIStore } from '@gaqno-development/frontcore/store/uiStore'
import { booksApi } from '@/utils/api/booksApi'
import type { IItem, IItemsStepProps } from '../types'
import { useWizardStepGeneration } from '../../shared/useWizardStepGeneration'

export function useItemsStep({ items, onItemsChange, bookContext }: IItemsStepProps) {
  const { addNotification } = useUIStore()
  const { generatingFor, setGeneratingFor, isGeneratingAll, guardGenerateAll, runWithGeneratingAll } = useWizardStepGeneration()

  const handleAddItem = () => {
    const newItem: IItem = {
      id: `temp-${Date.now()}`,
      name: '',
      function: '',
      origin: '',
      relevance: '',
    }
    onItemsChange([...items, newItem])
  }

  const handleRemoveItem = (id: string) => {
    onItemsChange(items.filter((i) => i.id !== id))
  }

  const handleUpdateItem = (id: string, field: keyof IItem, value: string) => {
    onItemsChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  const handleGenerateItemDetails = async (
    itemId: string,
    field: 'function' | 'origin' | 'relevance',
    itemName: string
  ): Promise<string> => {
    setGeneratingFor(`${itemId}-${field}`)
    try {
      const prompts: Record<string, string> = {
        function: `Descreva a função narrativa do objeto "${itemName}" no livro "${bookContext?.title || 'Novo Livro'}"`,
        origin: `Descreva a origem do objeto "${itemName}" no livro "${bookContext?.title || 'Novo Livro'}"`,
        relevance: `Explique a relevância do objeto "${itemName}" para a história do livro "${bookContext?.title || 'Novo Livro'}"`,
      }
      const data = await booksApi.generateBlueprint({
        title: bookContext?.title || 'Novo Livro',
        genre: bookContext?.genre || 'fiction',
        description: prompts[field],
      })
      const generated = data?.blueprint?.summary || data?.summary || `Detalhes sobre ${field} do objeto ${itemName}`
      return typeof generated === 'string' ? generated : JSON.stringify(generated)
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao gerar detalhes')
    } finally {
      setGeneratingFor(null)
    }
  }

  const handleGenerateAll = async () => {
    if (guardGenerateAll(bookContext, 'Preencha pelo menos o título ou a premissa do livro antes de gerar itens.')) return
    await runWithGeneratingAll(async () => {
      try {
        const prompt = `Baseado no livro "${bookContext?.title || 'Novo Livro'}" ${bookContext?.genre ? `do gênero ${bookContext.genre}` : ''}, ${bookContext?.description ? `com a premissa: ${bookContext.description.substring(0, 200)}` : ''}. Gere 2 a 4 itens, objetos ou artefatos importantes para a história. Para cada item, forneça: nome, função narrativa, origem e relevância para a história.`
        const data = await booksApi.generateBlueprint({
          title: bookContext?.title || 'Novo Livro',
          genre: bookContext?.genre || 'fiction',
          description: prompt,
        })
        const blueprint = data?.blueprint || data
        const context = blueprint?.context || {}
        const itemsArray = (context.item || context.items || []) as unknown[]

        if (Array.isArray(itemsArray) && itemsArray.length > 0) {
          const newItems: IItem[] = (itemsArray as Array<Record<string, unknown>>).map((item, idx) => ({
            id: `temp-${Date.now()}-${idx}`,
            name: (item.name as string) || `Item ${idx + 1}`,
            function: (item.function || item.narrative_function || item.role || '') as string,
            origin: (item.origin || item.source || '') as string,
            relevance: (item.relevance || item.importance || item.significance || '') as string,
          }))
          onItemsChange(newItems)
        } else {
          const newItems: IItem[] = [
            {
              id: `temp-${Date.now()}-1`,
              name: 'Artefato Principal',
              function: 'Elemento central da narrativa',
              origin: 'Origem misteriosa ou importante',
              relevance: 'Crucial para o desenvolvimento da história',
            },
            {
              id: `temp-${Date.now()}-2`,
              name: 'Objeto de Poder',
              function: 'Concede habilidades ou poderes especiais',
              origin: 'Criado ou descoberto pelos personagens',
              relevance: 'Importante para resolver conflitos',
            },
          ]
          onItemsChange(newItems)
        }
        addNotification({
          type: 'success',
          title: 'Itens gerados!',
          message: 'Os itens importantes foram gerados com sucesso. Você pode editá-los conforme necessário.',
          duration: 3000,
        })
      } catch (err: unknown) {
        addNotification({
          type: 'error',
          title: 'Erro ao gerar itens',
          message: err instanceof Error ? err.message : 'Não foi possível gerar os itens automaticamente.',
          duration: 5000,
        })
      }
    })
  }

  return {
    generatingFor,
    isGeneratingAll,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItem,
    handleGenerateItemDetails,
    handleGenerateAll,
  }
}
