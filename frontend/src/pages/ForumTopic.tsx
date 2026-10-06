import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Eye, Heart, Pin, Send } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/lib/api";
import { useMe } from "@/lib/session";
import { apiErrorMessage, categoryLabel, timeAgo } from "@/lib/fan";
import type { LikeOut, TopicDetail } from "@/lib/types";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForumTopic() {
  const { id } = useParams<{ id: string }>();
  const { data: me } = useMe();
  const qc = useQueryClient();
  const [reply, setReply] = useState("");

  const topicQ = useQuery({
    queryKey: ["topic", id],
    queryFn: () => apiGet<TopicDetail>(`/forum/topics/${id}`),
    enabled: Boolean(id),
  });

  const like = useMutation({
    mutationFn: () => apiPost<LikeOut>(`/forum/topics/${id}/like`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["topic", id] });
      qc.invalidateQueries({ queryKey: ["topics"] });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const send = useMutation({
    mutationFn: () => apiPost(`/forum/topics/${id}/replies`, { content: reply }),
    onSuccess: () => {
      setReply("");
      qc.invalidateQueries({ queryKey: ["topic", id] });
      qc.invalidateQueries({ queryKey: ["topics"] });
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Resposta publicada! +5 pontos");
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  if (topicQ.isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (topicQ.isError || !topicQ.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Card className="p-10 text-center" data-testid="topic-not-found">
          <p className="font-heading text-lg font-semibold">Esse tópico não foi encontrado.</p>
          <Link to="/forum" data-testid="topic-back-link" className="mt-3 inline-block text-sm text-primary hover:underline">
            Voltar ao fórum
          </Link>
        </Card>
      </div>
    );
  }

  const { topic, replies } = topicQ.data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link
        to="/forum"
        data-testid="topic-back-nav"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Todos os tópicos
      </Link>

      <Card className="mt-4 p-5" data-testid={`topic-card-${topic.id}`}>
        <div className="flex flex-wrap items-center gap-2">
          {topic.pinned && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Pin className="h-3 w-3" /> Fixado
            </span>
          )}
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
            {categoryLabel(topic.category)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5" /> {topic.view_count} visualizações
          </span>
        </div>

        <h1 className="mt-2 font-heading text-2xl font-bold leading-snug">{topic.title}</h1>
        <p className="mt-3 whitespace-pre-wrap leading-relaxed text-foreground/90">{topic.content}</p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
          <Link to={`/perfil/${topic.author.username}`} className="flex items-center gap-2" data-testid="topic-author-link">
            <Avatar name={topic.author.name} username={topic.author.username} avatar_url={topic.author.avatar_url} size="sm" />
            <div>
              <p className="text-sm font-semibold">{topic.author.name}</p>
              <p className="text-xs text-muted-foreground">{timeAgo(topic.created_at)}</p>
            </div>
          </Link>
          <Button
            variant="outline"
            size="sm"
            data-testid="topic-like-button"
            onClick={() => (me ? like.mutate() : toast.info("Entre com sua conta para curtir."))}
            disabled={like.isPending}
            className="gap-1.5"
          >
            <Heart className={topic.liked_by_me ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4"} />
            {topic.like_count}
          </Button>
        </div>
      </Card>

      <h2 className="mt-8 font-heading text-lg font-bold">
        {replies.length} {replies.length === 1 ? "resposta" : "respostas"}
      </h2>

      <div className="mt-3 space-y-3" data-testid="topic-replies">
        {replies.map((r, i) => (
          <Card key={r.id} className="p-4" data-testid={`reply-card-${i}`}>
            <div className="flex items-start gap-2.5">
              <Avatar name={r.author.name} username={r.author.username} avatar_url={r.author.avatar_url} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs">
                  <Link to={`/perfil/${r.author.username}`} className="font-semibold hover:text-primary">
                    {r.author.name}
                  </Link>{" "}
                  <span className="text-muted-foreground">· {timeAgo(r.created_at)}</span>
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{r.content}</p>
              </div>
            </div>
          </Card>
        ))}
        {replies.length === 0 && (
          <p className="text-sm text-muted-foreground">Ninguém respondeu ainda — quebre o silêncio.</p>
        )}
      </div>

      {me ? (
        <form
          className="mt-6 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (reply.trim()) send.mutate();
          }}
        >
          <Input
            data-testid="reply-input"
            placeholder="Sua resposta para a matilha..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            maxLength={2000}
          />
          <Button type="submit" data-testid="reply-send-button" disabled={!reply.trim() || send.isPending}>
            <Send className="h-4 w-4" /> Responder
          </Button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          <Link to="/login" data-testid="reply-login-link" className="text-primary hover:underline">
            Entre com sua conta
          </Link>{" "}
          para responder.
        </p>
      )}
    </div>
  );
}