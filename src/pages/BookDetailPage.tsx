import { useParams, useNavigate } from 'react-router-dom'
import { BookBlueprintPanel } from '@/features/books/components/BookBlueprintPanel'
import { useBook } from '@/features/books/hooks/useBooks'
import { LoadingSkeleton } from '@gaqno-development/frontcore/components/ui'
import { EmptyState } from '@gaqno-development/frontcore/components/ui'
import { BookX } from 'lucide-react'

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { book, isLoading } = useBook(id || '')

  if (isLoading) {
    return <LoadingSkeleton variant="card" count={1} />
  }

  if (!book) {
    return (
      <EmptyState
        icon={BookX}
        title="Livro não encontrado"
        description="O livro que você está procurando não existe ou foi removido."
        action={{
          label: 'Voltar para Meus Livros',
          onClick: () => navigate('/books'),
        }}
      />
    )
  }

  return <BookBlueprintPanel bookId={id || ''} />
}

