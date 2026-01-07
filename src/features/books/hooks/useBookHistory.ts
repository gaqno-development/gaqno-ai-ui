import { useBooksQueries } from '@/hooks/queries/useBooksQueries'
import { useBooksMutations } from '@/hooks/mutations/useBooksMutations'
import { coreAxiosClient } from '@gaqno-development/frontcore/utils/api'
import { transformers } from '@/lib/api-transformers'
import {
  ICreateBookHistoryInput,
} from '../types/books'

const aiClient = coreAxiosClient.ai;

export const useBookHistory = (bookId: string | null) => {
  const queries = useBooksQueries()
  const mutations = useBooksMutations()

  const { data: history, isLoading, refetch } = queries.getHistory(bookId || '')

  const createHistory = async (input: ICreateBookHistoryInput) => {
    try {
      const response = await aiClient.get<any>(`/books/chapters/${input.chapter_id}`)
      const chapter = transformers.chapter(response.data)
      if (!chapter) {
        throw new Error('Chapter not found')
      }
      const result = await mutations.createHistory.mutateAsync({
        bookId: chapter.book_id,
        data: {
          chapter_id: input.chapter_id,
          content_snapshot: input.content_snapshot,
          version_number: input.version_number,
          change_summary: input.change_summary,
        }
      })
      return { success: true, data: result }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create history' }
    }
  }

  return {
    history: history || [],
    isLoading,
    refetch,
    createHistory,
    isCreating: mutations.createHistory.isPending,
  }
}
