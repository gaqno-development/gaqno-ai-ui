import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { BookIcon, FileDescriptionIcon } from '@gaqno-development/frontcore/components/icons';
import { Image, Download } from 'lucide-react';
import { SectionWithSubNav } from '@gaqno-development/frontcore/components/SectionWithSubNav'
import { useBook } from '@/hooks/books/useBooks'
import { BooksListPage } from '@/pages/books/BooksListPage'
import { BookBlueprintView } from '@/pages/books/BookBlueprintView'
import { BookChaptersView } from '@/pages/books/BookChaptersView'
import { BookCoverView } from '@/pages/books/BookCoverView'
import { BookExportView } from '@/pages/books/BookExportView'

function match(pathname: string, pattern: RegExp): boolean {
  return pattern.test(pathname)
}

function parseBookId(pathname: string): string | null {
  const m = /^\/ai\/books\/([^/]+)/.exec(pathname)
  return m?.[1] ?? null
}

function bookModules(id: string) {
  return [
    { segment: 'blueprint', label: 'Blueprint', href: `/ai/books/${id}/blueprint`, icon: BookIcon },
    { segment: 'chapters', label: 'Capítulos', href: `/ai/books/${id}/chapters`, icon: FileDescriptionIcon },
    { segment: 'cover', label: 'Capa', href: `/ai/books/${id}/cover`, icon: Image },
    { segment: 'export', label: 'Exportar', href: `/ai/books/${id}/export`, icon: Download },
  ]
}

const SEGMENT_TO_COMPONENT = {
  blueprint: BookBlueprintView,
  chapters: BookChaptersView,
  cover: BookCoverView,
  export: BookExportView,
}

export default function BookPage() {
  const { pathname } = useLocation()
  const isList = match(pathname, /^\/ai\/books\/?$/)
  const id = parseBookId(pathname)
  const { book } = useBook(id ?? '')

  const modules = useMemo(() => (id ? bookModules(id) : []), [id])

  if (isList) return <BooksListPage />

  if (id) {
    return (
      <SectionWithSubNav
        basePath={`/ai/books/${id}`}
        defaultSegment="blueprint"
        children={modules}
        segmentToComponent={SEGMENT_TO_COMPONENT}
        title={book?.title ?? 'Livro'}
        variant="vertical"
        breadcrumbRoot={{ label: 'AI', href: '/ai/books' }}
      />
    )
  }

  return <BooksListPage />
}
