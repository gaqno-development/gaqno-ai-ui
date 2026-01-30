import { Card, CardContent, CardHeader } from '@gaqno-development/frontcore/components/ui'
import { Input, Label, Textarea, Button } from '@gaqno-development/frontcore/components/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gaqno-development/frontcore/components/ui'
import { AISuggestionButton } from '../../AISuggestionButton'
import { useCharactersStep } from './hooks/useCharactersStep'
import type { ICharactersStepProps } from './types'
import { CHARACTER_ROLES } from './types'
import { UserIcon, TrashIcon, SparklesIcon } from '@gaqno-development/frontcore/components/icons';
import { Plus, Loader2, Trash2 } from 'lucide-react';

export function CharactersStep(props: ICharactersStepProps) {
  const {
    generatingFor,
    isGeneratingAll,
    handleAddCharacter,
    handleRemoveCharacter,
    handleUpdateCharacter,
    handleGenerateCharacterDetails,
    handleGenerateAll,
  } = useCharactersStep(props)
  const { characters } = props

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h3 className="text-lg font-semibold">Personagens</h3>
          <p className="text-sm text-muted-foreground">
            Defina os personagens principais da sua história
          </p>
        </div>
        <div className="flex gap-2">
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
          <Button type="button" onClick={handleAddCharacter} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Personagem
          </Button>
        </div>
      </div>

      {characters.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <UserIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Nenhum personagem adicionado ainda. Clique em &quot;Adicionar Personagem&quot; para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {characters.map((character) => (
            <Card key={character.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Nome do personagem"
                        value={character.name}
                        onChange={(e) => handleUpdateCharacter(character.id, 'name', e.target.value)}
                        className="max-w-xs"
                      />
                      <Select
                        value={character.role || 'supporting'}
                        onValueChange={(value) => handleUpdateCharacter(character.id, 'role', value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CHARACTER_ROLES.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveCharacter(character.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Descrição</Label>
                    <AISuggestionButton
                      onGenerate={() => handleGenerateCharacterDetails(character.id, character.name || 'Personagem')}
                      onAccept={(suggestion) => handleUpdateCharacter(character.id, 'description', suggestion)}
                      disabled={generatingFor === character.id || isGeneratingAll || !character.name}
                    />
                  </div>
                  <Textarea
                    placeholder="Descreva o personagem, sua personalidade, aparência física e papel na história..."
                    value={character.description || ''}
                    onChange={(e) => handleUpdateCharacter(character.id, 'description', e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
