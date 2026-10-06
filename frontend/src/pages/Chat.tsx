import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Hash, Send } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/lib/api";
import { useMe } from "@/lib/session";
import { apiErrorMessage, CHANNELS, timeAgo } from "@/lib/fan";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Chat() {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const [channel, setChannel] = useState("geral");
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const messagesQ = useQuery({
    queryKey: ["chat", channel],
    queryFn: () => apiGet<ChatMessage[]>(`/chat/${channel}`),
    refetchInterval: 3000,
  });

  const send = useMutation({
    mutationFn: () => apiPost<ChatMessage>(`/chat/${channel}`, { text }),
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["chat", channel] });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const messages = messagesQ.data ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, channel]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="font-heading text-3xl font-bold tracking-tight">Chat da Matilha</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        O papo ao vivo dos fãs — cada mensagem vale +1 ponto no ranking.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Channels */}
        <aside className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" data-testid="chat-channels">
          {CHANNELS.map((c) => (
            <button
              key={c.id}
              type="button"
              data-testid={`chat-channel-${c.id}`}
              onClick={() => setChannel(c.id)}
              className={cn(
                "shrink-0 rounded-xl border px-3.5 py-2.5 text-left transition-colors lg:w-full",
                channel === c.id
                  ? "border-primary/50 bg-primary/10"
                  : "border-border bg-card hover:border-primary/30",
              )}
            >
              <span className={cn("flex items-center gap-1.5 text-sm font-semibold", channel === c.id && "text-primary")}>
                <Hash className="h-3.5 w-3.5" /> {c.label}
              </span>
              <span className="mt-0.5 hidden text-xs text-muted-foreground lg:block">{c.description}</span>
            </button>
          ))}
        </aside>

        {/* Messages */}
        <Card className="flex h-[64svh] min-h-96 flex-col overflow-hidden p-0" data-testid="chat-panel">
          <div className="flex-1 space-y-3 overflow-y-auto p-4" data-testid="chat-messages">
            {messagesQ.isLoading ? (
              [0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />)
            ) : messages.length === 0 ? (
              <p className="pt-10 text-center text-sm text-muted-foreground">
                Nenhuma mensagem neste canal ainda. Diga um oi!
              </p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex items-start gap-2.5" data-testid={`chat-message-${message.id}`}>
                  <Avatar
                    name={message.author.name}
                    username={message.author.username}
                    avatar_url={message.author.avatar_url}
                    size="xs"
                  />
                  <div className="min-w-0">
                    <p className="text-xs">
                      <Link to={`/perfil/${message.author.username}`} className="font-semibold hover:text-primary">
                        {message.author.name}
                      </Link>{" "}
                      <span className="text-muted-foreground">· {timeAgo(message.created_at)}</span>
                    </p>
                    <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-relaxed">
                      {message.text}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {me ? (
            <form
              className="flex items-center gap-2 border-t border-border p-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (text.trim()) send.mutate();
              }}
            >
              <Input
                data-testid="chat-input"
                placeholder={`Mensagem para # ${channel.replace(/-/g, " ")}...`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={500}
              />
              <Button type="submit" size="icon" data-testid="chat-send-button" disabled={!text.trim() || send.isPending}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <div className="border-t border-border p-4 text-center text-sm text-muted-foreground">
              <Link to="/login" data-testid="chat-login-link" className="text-primary hover:underline">
                Entre com sua conta
              </Link>{" "}
              para conversar com a matilha.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}