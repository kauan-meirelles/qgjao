import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Music2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { useMe } from "@/lib/session";
import { apiErrorMessage, eraDef, timeAgo } from "@/lib/fan";
import type { Comment, Post } from "@/lib/types";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function PostCard({ post }: { post: Post }) {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const [openComments, setOpenComments] = useState(false);
  const era = eraDef(post.era);

  const like = useMutation({
    mutationFn: () => apiPost<{ liked: boolean; like_count: number }>(`/posts/${post.id}/like`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["user"] });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: () => apiDelete(`/posts/${post.id}`),
    onSuccess: () => {
      toast.success("Post apagado.");
      qc.invalidateQueries();
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  function handleLike() {
    if (!me) {
      toast.info("Entre com sua conta para curtir.");
      return;
    }
    like.mutate();
  }

  return (
    <Card className="animate-fade-up p-4 sm:p-5" data-testid={`post-card-${post.id}`}>
      <div className="flex items-start gap-3">
        <Link to={`/perfil/${post.author.username}`} data-testid={`post-author-link-${post.id}`}>
          <Avatar name={post.author.name} username={post.author.username} avatar_url={post.author.avatar_url} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <Link
              to={`/perfil/${post.author.username}`}
              data-testid={`post-author-name-${post.id}`}
              className="truncate text-sm font-semibold hover:text-primary"
            >
              {post.author.name}
            </Link>
            <span className="truncate text-xs text-muted-foreground">@{post.author.username}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-xs text-muted-foreground" data-testid={`post-time-${post.id}`}>
              {timeAgo(post.created_at)}
            </span>
            {era && (
              <span
                className="rounded-full border px-2 py-px text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: era.color, borderColor: `${era.color}55`, backgroundColor: `${era.color}14` }}
                data-testid={`post-era-${post.id}`}
              >
                {era.label}
              </span>
            )}
          </div>
        </div>
        {me?.id === post.author.id && (
          <button
            data-testid={`post-delete-button-${post.id}`}
            onClick={() => remove.mutate()}
            disabled={remove.isPending}
            title="Apagar post"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent/60 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed" data-testid={`post-text-${post.id}`}>
        {post.text}
      </p>

      {post.lyric && (
        <blockquote
          className="mt-3 flex items-start gap-2 rounded-lg border-l-2 border-primary bg-primary/5 px-3 py-2 text-sm italic text-[#E8C9CD] dark:text-[#E8C9CD]"
          data-testid={`post-lyric-${post.id}`}
        >
          <Music2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <span>{post.lyric}</span>
        </blockquote>
      )}

      {post.image_url && (
        <img
          src={post.image_url}
          alt="Foto do post"
          loading="lazy"
          className="mt-3 max-h-96 w-full rounded-lg border border-border object-cover"
          data-testid={`post-image-${post.id}`}
        />
      )}

      <div className="mt-3 flex items-center gap-1 border-t border-border pt-2">
        <Button
          variant="ghost"
          size="sm"
          data-testid={`like-button-${post.id}`}
          onClick={handleLike}
          disabled={like.isPending}
          className="gap-1.5 text-muted-foreground hover:text-primary"
        >
          <Heart
            key={String(post.liked_by_me)}
            className={cn("h-4 w-4", post.liked_by_me && "animate-heart fill-primary text-primary")}
          />
          <span data-testid={`like-count-${post.id}`}>{post.like_count}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          data-testid={`comment-toggle-${post.id}`}
          onClick={() => setOpenComments((v) => !v)}
          className="gap-1.5 text-muted-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          <span data-testid={`comment-count-${post.id}`}>{post.comment_count}</span>
          <span className="hidden sm:inline">{openComments ? "ocultar" : "comentários"}</span>
        </Button>
      </div>

      {openComments && <CommentsSection postId={post.id} />}
    </Card>
  );
}

function CommentsSection({ postId }: { postId: string }) {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const [text, setText] = useState("");

  const commentsQ = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => apiGet<Comment[]>(`/posts/${postId}/comments`),
  });

  const send = useMutation({
    mutationFn: () => apiPost<Comment>(`/posts/${postId}/comments`, { text }),
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["comments", postId] });
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Comentário publicado! +5 pontos");
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  return (
    <div className="mt-3 space-y-3 border-t border-border pt-3" data-testid={`comments-section-${postId}`}>
      {commentsQ.isLoading ? (
        <div className="h-10 animate-pulse rounded-lg bg-muted" />
      ) : (
        (commentsQ.data ?? []).map((comment) => (
          <div key={comment.id} className="flex items-start gap-2" data-testid={`comment-${comment.id}`}>
            <Avatar name={comment.author.name} username={comment.author.username} avatar_url={comment.author.avatar_url} size="xs" />
            <div className="min-w-0 flex-1 rounded-lg bg-secondary/60 px-3 py-2">
              <p className="text-xs">
                <span className="font-semibold">{comment.author.name}</span>{" "}
                <span className="text-muted-foreground">· {timeAgo(comment.created_at)}</span>
              </p>
              <p className="mt-0.5 whitespace-pre-wrap text-sm">{comment.text}</p>
            </div>
          </div>
        ))
      )}

      {me ? (
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim()) send.mutate();
          }}
        >
          <Input
            data-testid={`comment-input-${postId}`}
            placeholder="Escreva um comentário..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            className="h-9"
          />
          <Button type="submit" size="sm" data-testid={`comment-send-${postId}`} disabled={!text.trim() || send.isPending}>
            Enviar
          </Button>
        </form>
      ) : (
        <p className="text-xs text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline" data-testid={`comments-login-link-${postId}`}>
            Entre com sua conta
          </Link>{" "}
          para comentar.
        </p>
      )}
    </div>
  );
}