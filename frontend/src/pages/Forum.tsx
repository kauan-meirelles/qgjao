import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Heart, MessageSquare, Pin, Plus } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/lib/api";
import { useMe } from "@/lib/session";
import { apiErrorMessage, categoryLabel, CATEGORIES, timeAgo } from "@/lib/fan";
import { cn } from "@/lib/utils";
import type { Topic } from "@/lib/types";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function chipClass(active: boolean): string {
  return cn(
    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
    active
      ? "border-primary bg-primary/15 text-primary"
      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
  );
}

export default function Forum() {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const [category, setCategory] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [newCategory, setNewCategory] = useState("geral");

  const topicsQ = useQuery({
    queryKey: ["topics", category],
    queryFn: () => apiGet<Topic[]>(category ? `/forum/topics?category=${category}` : "/forum/topics"),
  });

  const create = useMutation({
    mutationFn: () => apiPost<Topic>("/forum/topics", { category: newCategory, title, content }),
    onSuccess: () => {
      setOpen(false);
      setTitle("");
      setContent("");
      qc.invalidateQueries({ queryKey: ["topics"] });
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Tópico criado! +10 pontos");
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Fórum da Matilha</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Teorias, encontros e debates — a conversa mais longa do fã-clube.
          </p>
        </div>
        {me ? (
          <Button data-testid="forum-create-topic-button" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Criar tópico
          </Button>
        ) : (
          <Link
            to="/login"
            data-testid="forum-login-link"
            className="text-sm text-primary hover:underline"
          >
            Entre para criar tópicos
          </Link>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2" data-testid="forum-category-filter">
        <button type="button" data-testid="forum-category-all" onClick={() => setCategory(null)} className={chipClass(category === null)}>
          Todos
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            data-testid={`forum-category-${c.id}`}
            onClick={() => setCategory(c.id)}
            className={chipClass(category === c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3" data-testid="forum-topic-list">
        {topicsQ.isLoading ? (
          [0, 1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />)
        ) : !topicsQ.data || topicsQ.data.length === 0 ? (
          <Card className="p-10 text-center" data-testid="forum-empty">
            <p className="font-heading text-lg font-semibold">Silêncio na matilha...</p>
            <p className="mt-1 text-sm text-muted-foreground">Nenhum tópico nesta categoria ainda. Crie o primeiro!</p>
          </Card>
        ) : (
          topicsQ.data.map((topic) => (
            <Link key={topic.id} to={`/forum/${topic.id}`} data-testid={`forum-topic-${topic.id}`} className="block">
              <Card className="p-4 transition-colors hover:border-primary/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {topic.pinned && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                          <Pin className="h-3 w-3" /> Fixado
                        </span>
                      )}
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
                        {categoryLabel(topic.category)}
                      </span>
                    </div>
                    <h2 className="mt-1.5 font-heading text-lg font-bold leading-snug">{topic.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{topic.content}</p>
                    <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <Avatar name={topic.author.name} username={topic.author.username} avatar_url={topic.author.avatar_url} size="xs" />
                      <span className="font-medium text-foreground/80">{topic.author.name}</span>
                      <span>· {timeAgo(topic.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" /> {topic.reply_count}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" /> {topic.like_count}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> {topic.view_count}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl" data-testid="forum-create-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading">Novo tópico</DialogTitle>
            <DialogDescription>Abra a conversa que a matilha precisa ter. (+10 pontos)</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (title.trim().length >= 5 && content.trim().length >= 5) create.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="topic-category">Categoria</Label>
              <Select value={newCategory} onValueChange={(v: string) => setNewCategory(v)}>
                <SelectTrigger id="topic-category" data-testid="forum-topic-category-select" className="w-full">
                  <SelectValue>{(v: string) => categoryLabel(v)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="topic-title">Título</Label>
              <Input
                id="topic-title"
                data-testid="forum-topic-title-input"
                required
                minLength={5}
                maxLength={140}
                placeholder="Ex.: Qual refrão do Jão é o mais devastador?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="topic-content">Primeira mensagem</Label>
              <Textarea
                id="topic-content"
                data-testid="forum-topic-content-input"
                required
                minLength={5}
                maxLength={4000}
                className="min-h-28 resize-none"
                placeholder="Conte o contexto e lance a pergunta..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" data-testid="forum-topic-submit-button" disabled={create.isPending}>
              {create.isPending ? "Publicando..." : "Publicar tópico"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
