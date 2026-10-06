import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import { useMe } from "@/lib/session";
import { apiErrorMessage, eraLabel } from "@/lib/fan";
import type { Post } from "@/lib/types";
import { Avatar } from "@/components/Avatar";
import AICaptionDialog from "@/components/AICaptionDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PostComposer() {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [era, setEra] = useState("none");
  const [lyric, setLyric] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showExtras, setShowExtras] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const create = useMutation({
    mutationFn: () =>
      apiPost<Post>("/posts", {
        text,
        era: era === "none" ? null : era,
        lyric: lyric.trim() || null,
        image_url: imageUrl.trim() || null,
      }),
    onSuccess: () => {
      setText("");
      setLyric("");
      setImageUrl("");
      setEra("none");
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Publicado na matilha! +10 pontos");
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  if (!me) {
    return (
      <Card className="flex flex-col items-start gap-3 p-5" data-testid="composer-login-cta">
        <p className="font-heading text-lg font-semibold">Sua vez de uivar, fã.</p>
        <p className="text-sm text-muted-foreground">
          Entre com sua conta para publicar memórias, letras favoritas e fotos das eras.
        </p>
        <div className="flex gap-2">
          <Link to="/cadastro" data-testid="composer-join-link" className={buttonSm()}>
            Criar conta de fã
          </Link>
          <Link to="/login" data-testid="composer-login-link" className={buttonSm("secondary")}>
            Entrar
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <Avatar name={me.name} username={me.username} avatar_url={me.avatar_url} />
        <div className="min-w-0 flex-1 space-y-3">
          <Textarea
            data-testid="post-composer-textarea"
            placeholder="Qual memória com o Jão você quer dividir com a matilha?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1200}
            className="min-h-20 resize-none"
          />

          {showExtras && (
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                data-testid="post-composer-lyric-input"
                placeholder="Trecho de letra favorito (opcional)"
                value={lyric}
                onChange={(e) => setLyric(e.target.value)}
                maxLength={300}
              />
              <Input
                data-testid="post-composer-image-input"
                placeholder="URL da foto (opcional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                maxLength={500}
              />
              <Select value={era} onValueChange={(v: string) => setEra(v)}>
                <SelectTrigger data-testid="post-composer-era-select" className="w-full">
                  <SelectValue>{(v: string) => eraLabel(v)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem era</SelectItem>
                  {ERAS_OPTIONS}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                data-testid="post-composer-extras-button"
                onClick={() => setShowExtras((s) => !s)}
                title="Letra, foto e era"
              >
                <ImagePlus className={showExtras ? "h-4 w-4 text-primary" : "h-4 w-4"} />
              </Button>
              <Button variant="ghost" size="sm" data-testid="ai-caption-button" onClick={() => setAiOpen(true)}>
                <Sparkles className="h-4 w-4 text-primary" />
                Legendas com IA
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground" data-testid="post-composer-char-count">
                {text.length}/1200
              </span>
              <Button
                size="sm"
                data-testid="post-composer-submit-button"
                disabled={text.trim().length === 0 || create.isPending}
                onClick={() => create.mutate()}
              >
                {create.isPending ? "Publicando..." : "Publicar"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AICaptionDialog
        open={aiOpen}
        onOpenChange={setAiOpen}
        onSelect={(caption) => setText((t) => (t.trim() ? `${t}\n\n${caption}` : caption))}
      />
    </Card>
  );
}

import { ERAS } from "@/lib/fan";
import { buttonVariants } from "@/components/ui/button";

const ERAS_OPTIONS = ERAS.map((e) => (
  <SelectItem key={e.id} value={e.id}>
    {e.label}
  </SelectItem>
));

function buttonSm(variant?: "secondary"): string {
  return buttonVariants({ size: "sm", variant });
}
