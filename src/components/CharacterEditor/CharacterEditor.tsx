import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { Input } from "@gaqno-development/frontcore/components/ui";
import { Label } from "@gaqno-development/frontcore/components/ui";
import { Textarea } from "@gaqno-development/frontcore/components/ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@gaqno-development/frontcore/components/ui";
import { Badge } from "@gaqno-development/frontcore/components/ui";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gaqno-development/frontcore/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gaqno-development/frontcore/components/ui";
import { Wand2, Image as ImageIcon, Save, User } from "lucide-react";
import { Spinner } from "@gaqno-development/frontcore/components/ui";
import type { CharacterRole } from "@/types/books/character";
import { useCharacterEditor } from "@/hooks/useCharacterEditor";
import type { CharacterEditorProps } from "./types";

export function CharacterEditor({ bookId, characterId }: CharacterEditorProps) {
  const {
    character,
    name,
    setName,
    description,
    setDescription,
    isAnalyzing,
    isGeneratingAvatar,
    isLoading,
    characterDetails,
    avatarUrl,
    updateCharacterDetails,
    handleAnalyzeCharacter,
    handleGenerateAvatar,
    handleSave,
  } = useCharacterEditor(bookId, characterId);

  if (!characterId || !character) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            Selecione um personagem para editar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{character.name}</CardTitle>
                <CardDescription>Editar detalhes do personagem</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAnalyzeCharacter}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Analisar
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateAvatar}
                disabled={isGeneratingAvatar || !characterDetails}
              >
                {isGeneratingAvatar ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Gerar Avatar
                  </>
                )}
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="traits">Características</TabsTrigger>
              <TabsTrigger value="relationships">Relacionamentos</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Descrição básica do personagem..."
                />
              </div>
              {characterDetails?.role && (
                <div className="space-y-2">
                  <Label>Papel na História</Label>
                  <Select
                    value={characterDetails.role}
                    onValueChange={(value: CharacterRole) =>
                      updateCharacterDetails({ role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="protagonist">Protagonista</SelectItem>
                      <SelectItem value="antagonist">Antagonista</SelectItem>
                      <SelectItem value="supporting">Coadjuvante</SelectItem>
                      <SelectItem value="minor">Secundário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              {characterDetails?.backstory ? (
                <div className="space-y-2">
                  <Label>História (Backstory)</Label>
                  <Textarea
                    value={characterDetails.backstory}
                    onChange={(e) =>
                      updateCharacterDetails({ backstory: e.target.value })
                    }
                    rows={6}
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Analise o personagem para gerar a história</p>
                </div>
              )}
              {characterDetails?.avatarPrompt && (
                <div className="space-y-2">
                  <Label>Prompt para Avatar</Label>
                  <Textarea
                    value={characterDetails.avatarPrompt}
                    onChange={(e) =>
                      updateCharacterDetails({ avatarPrompt: e.target.value })
                    }
                    rows={3}
                    readOnly
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="traits" className="space-y-4 mt-4">
              {characterDetails?.traits ? (
                <>
                  <div className="space-y-2">
                    <Label>Características Físicas</Label>
                    <div className="flex flex-wrap gap-2">
                      {characterDetails.traits.physical.map((trait, idx) => (
                        <Badge key={idx} variant="secondary">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Características Psicológicas</Label>
                    <div className="flex flex-wrap gap-2">
                      {characterDetails.traits.psychological.map(
                        (trait, idx) => (
                          <Badge key={idx} variant="secondary">
                            {trait}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Características Sociais</Label>
                    <div className="flex flex-wrap gap-2">
                      {characterDetails.traits.social.map((trait, idx) => (
                        <Badge key={idx} variant="secondary">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Analise o personagem para gerar as características</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="relationships" className="space-y-4 mt-4">
              {characterDetails?.relationships &&
              characterDetails.relationships.length > 0 ? (
                <div className="space-y-3">
                  {characterDetails.relationships.map((rel, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="font-medium">
                            {rel.characterName || "Personagem"}
                          </div>
                          <Badge variant="outline">
                            {rel.relationshipType}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {rel.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum relacionamento definido ainda</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
