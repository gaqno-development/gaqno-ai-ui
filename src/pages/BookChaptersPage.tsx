import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ChapterList } from '@/features/books/components/ChapterList'
import { ChapterEditor } from '@/features/books/components/ChapterEditor'
import { useBookChapters } from '@/features/books/hooks/useBookChapters'
import { IBookChapter } from '@/features/books/types/books'
import { LoadingSkeleton } from '@gaqno-development/frontcore/components/ui'

export default function BookChaptersPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { chapters, isLoading } = useBookChapters(id || '')

  const chapterParam = searchParams.get('chapter')
  const chaptersArray: IBookChapter[] = Array.isArray(chapters) ? chapters : []
  const selectedChapterId = chapterParam && chaptersArray.some(c => c.id === chapterParam)
    ? chapterParam
    : chaptersArray.length > 0
    ? chaptersArray[0].id
    : undefined

  useEffect(() => {
    const chaptersArray: IBookChapter[] = Array.isArray(chapters) ? chapters : []
    if (chaptersArray.length > 0 && !chapterParam) {
      const firstChapterId = chaptersArray[0].id
      setSearchParams({ chapter: firstChapterId })
    } else if (chapterParam && !chaptersArray.some(c => c.id === chapterParam) && chaptersArray.length > 0) {
      const firstChapterId = chaptersArray[0].id
      setSearchParams({ chapter: firstChapterId })
    }
  }, [chapters, chapterParam, setSearchParams])

  const handleChapterSelect = (chapterId: string) => {
    setSearchParams({ chapter: chapterId })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <LoadingSkeleton variant="list" count={5} />
        </div>
        <div className="col-span-9">
          <LoadingSkeleton variant="card" count={1} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden">
        <div className="md:col-span-3 border-r overflow-y-auto">
          <ChapterList
            bookId={id || ''}
            chapters={chaptersArray}
            selectedChapterId={selectedChapterId}
            onChapterSelect={handleChapterSelect}
          />
        </div>
        <div className="md:col-span-9 overflow-y-auto">
          <ChapterEditor bookId={id || ''} chapterId={selectedChapterId} />
        </div>
      </div>
    </div>
  )
}

