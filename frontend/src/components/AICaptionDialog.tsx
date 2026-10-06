import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import { apiErrorMessage, EMOTIONS } from "@/lib/fan";
import type { CaptionsOut } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AICaptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (caption: string) => void;
}

// The AI caption generator: pick an emotion, get 3 dramatic Jão-style captions.
export default function AICaptionDialog({ open, onOpenChange, onSelect }: AICaptionDialogProps) {
  const [emotion, setEmotion] = useState(EMOTIONS[0]);
  const [topic, setTopic] = useState("");

  const generate = useMutation({
    mutationFn: () =>
      apiPost<CaptionsOut>("/ai/captions", { emotion, topic: topic.trim() || null }),
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-testid="ai-caption-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading">
            <Sparkles className="h-4 w-4 text-primary" />
            Poeta da Matilha
          </DialogTitle>
          <DialogDescription>
            Escolha a emoção e receba legendas dramáticas à altura do Jão para o seu post.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2" data-testid="ai-caption-emotions">
          {EMOTIONS.map((e, i) => (
            <button
              key={e}
              type="button"
              data-testid={`ai-caption-emotion-${i}`}
              onClick={() => setEmotion(e)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                emotion === e
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {e}
            </button>
          ))}
        </div>

        <Input
          data-testid="ai-caption-topic-input"
          placeholder="Sobre o que é o post? (opcional)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          maxLength={300}
        />

        <Button
          data-testid="ai-caption-generate-button"
          onClick={() => generate.mutate()}
          disabled={generate.isPending}
          className="w-full"
        >
          {generate.isPending ? "Invocando o poeta..." : "Gerar 3 legendas"}
        </Button>

        {generate.isPending && (
          <div className="flex items-center justify-center gap-3 rounded-lg border border-border py-6" data-testid="ai-caption-loading">
            <span className="inline-block h-6 w-6 animate-vinyl rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">Ajustando a dor e o brilho das palavras...</span>
          </div>
        )}

        {generate.data && (
          <div className="space-y-2" data-testid="ai-caption-results">
            {generate.data.source === "curated" && (
              <p className="text-xs text-muted-foreground">
                A IA deu uma escapada — deixei versos selecionados do universo do Jão.
              </p>
            )}
            {generate.data.captions.map((caption, i) => (
              <div
                key={i}
                data-testid={`ai-caption-result-${i}`}
                className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-3"
              >
                <p className="text-sm leading-relaxed">{caption}</p>
                <Button
                  size="xs"
                  variant="secondary"
                  data-testid={`ai-caption-use-${i}`}
                  onClick={() => {
                    onSelect(caption);
                    onOpenChange(false);
                  }}
                >
                  Usar
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}