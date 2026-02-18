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
import { useItemsStep } from "@/hooks/useItemsStep";
import type { IItemsStepProps } from "./types";
import {
  TrashIcon,
  SparklesIcon,
} from "@gaqno-development/frontcore/components/icons";
import { Package, Plus } from "lucide-react";
import { Spinner } from "@gaqno-development/frontcore/components/ui";

export function ItemsStep(props: IItemsStepProps) {
  const {
    generatingFor,
    isGeneratingAll,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItem,
    handleGenerateItemDetails,
    handleGenerateAll,
  } = useItemsStep(props);
  const { items } = props;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h3 className="text-lg font-semibold">Itens Importantes</h3>
          <p className="text-sm text-muted-foreground">
            Objetos, artefatos ou elementos importantes na história
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
            onClick={handleAddItem}
            size="sm"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Nenhum item adicionado ainda. Clique em &quot;Adicionar Item&quot;
              para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Nome do item"
                        value={item.name}
                        onChange={(e) =>
                          handleUpdateItem(item.id, "name", e.target.value)
                        }
                        className="max-w-xs"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Função Narrativa</Label>
                    <AISuggestionButton
                      onGenerate={() =>
                        handleGenerateItemDetails(
                          item.id,
                          "function",
                          item.name || "Item"
                        )
                      }
                      onAccept={(suggestion) =>
                        handleUpdateItem(item.id, "function", suggestion)
                      }
                      disabled={
                        generatingFor === `${item.id}-function` ||
                        isGeneratingAll ||
                        !item.name
                      }
                    />
                  </div>
                  <Textarea
                    placeholder="Qual a função deste item na narrativa?"
                    value={item.function || ""}
                    onChange={(e) =>
                      handleUpdateItem(item.id, "function", e.target.value)
                    }
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Origem</Label>
                    <AISuggestionButton
                      onGenerate={() =>
                        handleGenerateItemDetails(
                          item.id,
                          "origin",
                          item.name || "Item"
                        )
                      }
                      onAccept={(suggestion) =>
                        handleUpdateItem(item.id, "origin", suggestion)
                      }
                      disabled={
                        generatingFor === `${item.id}-origin` ||
                        isGeneratingAll ||
                        !item.name
                      }
                    />
                  </div>
                  <Textarea
                    placeholder="De onde vem este item? Como foi criado ou obtido?"
                    value={item.origin || ""}
                    onChange={(e) =>
                      handleUpdateItem(item.id, "origin", e.target.value)
                    }
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Relevância</Label>
                    <AISuggestionButton
                      onGenerate={() =>
                        handleGenerateItemDetails(
                          item.id,
                          "relevance",
                          item.name || "Item"
                        )
                      }
                      onAccept={(suggestion) =>
                        handleUpdateItem(item.id, "relevance", suggestion)
                      }
                      disabled={
                        generatingFor === `${item.id}-relevance` ||
                        isGeneratingAll ||
                        !item.name
                      }
                    />
                  </div>
                  <Textarea
                    placeholder="Por que este item é importante para a história?"
                    value={item.relevance || ""}
                    onChange={(e) =>
                      handleUpdateItem(item.id, "relevance", e.target.value)
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
