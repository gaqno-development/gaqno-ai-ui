import {
  Card,
  CardContent,
  CardHeader,
} from "@gaqno-development/frontcore/components/ui";
import {
  Input,
  Label,
  Textarea,
  Button,
} from "@gaqno-development/frontcore/components/ui";
import { AISuggestionButton } from "../../AISuggestionButton";
import { useWorldSettingsStep } from "@/hooks/useWorldSettingsStep";
import type { IWorldSettingsStepProps } from "./types";
import {
  TrashIcon,
  SparklesIcon,
} from "@gaqno-development/frontcore/components/icons";
import { MapPin, Plus } from "lucide-react";
import { Spinner } from "@gaqno-development/frontcore/components/ui";

export function WorldSettingsStep(props: IWorldSettingsStepProps) {
  const {
    generatingFor,
    isGeneratingAll,
    handleAddSetting,
    handleRemoveSetting,
    handleUpdateSetting,
    handleGenerateDescription,
    handleGenerateAll,
  } = useWorldSettingsStep(props);
  const { settings } = props;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h3 className="text-lg font-semibold">Mundo e Ambientação</h3>
          <p className="text-sm text-muted-foreground">
            Defina os cenários principais onde sua história se desenrola
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
                <Spinner className="h-4 w-4" />
                Gerando...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4" />
                Gerar Tudo com IA
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={handleAddSetting}
            size="sm"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Cenário
          </Button>
        </div>
      </div>

      {settings.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Nenhum cenário adicionado ainda. Clique em &quot;Adicionar
              Cenário&quot; para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {settings.map((setting) => (
            <Card key={setting.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Nome do cenário"
                        value={setting.name}
                        onChange={(e) =>
                          handleUpdateSetting(
                            setting.id,
                            "name",
                            e.target.value
                          )
                        }
                        className="max-w-xs"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSetting(setting.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Descrição</Label>
                    <AISuggestionButton
                      onGenerate={() =>
                        handleGenerateDescription(
                          setting.id,
                          setting.name || "Cenário"
                        )
                      }
                      onAccept={(suggestion) =>
                        handleUpdateSetting(
                          setting.id,
                          "description",
                          suggestion
                        )
                      }
                      disabled={
                        generatingFor === setting.id ||
                        isGeneratingAll ||
                        !setting.name
                      }
                    />
                  </div>
                  <Textarea
                    placeholder="Descreva o cenário, sua atmosfera, características físicas e importância na história..."
                    value={setting.description}
                    onChange={(e) =>
                      handleUpdateSetting(
                        setting.id,
                        "description",
                        e.target.value
                      )
                    }
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Linha do Tempo (Opcional)</Label>
                  <Textarea
                    placeholder="Resumo histórico ou contexto temporal do cenário..."
                    value={setting.timeline_summary || ""}
                    onChange={(e) =>
                      handleUpdateSetting(
                        setting.id,
                        "timeline_summary",
                        e.target.value
                      )
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
