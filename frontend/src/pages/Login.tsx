import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import { beginSession } from "@/lib/session";
import { apiErrorMessage } from "@/lib/fan";
import type { UserPublic } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PHOTO_LOBOS =
  "https://customer-assets-0z36b82j.emergentagent.net/job_jao-fans/artifacts/161jlttd_IMG_1603.jpeg";
  
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const qc = useQueryClient();
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: () => apiPost<UserPublic>("/auth/login", { email, password }),
    onSuccess: async () => {
      await beginSession(qc);
      toast.success("Bem-vindo de volta à matilha!");
      navigate("/");
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  return (
    <div className="grid min-h-svh bg-background text-foreground lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={PHOTO_LOBOS}
          alt="Retrato da era Lobos, com buquê de flores"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D090A] via-[#0D090A]/35 to-transparent" />
        <blockquote className="absolute bottom-12 left-10 right-10" data-testid="login-quote">
          <p className="font-heading text-2xl font-medium italic leading-snug text-[#FFF9F5]">
            “Enquanto me beija, eu finjo que esqueci.”
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#B5A4A7]">Anti-Herói · 2019</p>
        </blockquote>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-6 sm:p-8" data-testid="login-card">
          <Link to="/" data-testid="login-logo-link" className="mb-8 inline-flex items-center gap-2">
            <Star className="h-5 w-5 fill-primary text-primary" />
            <span className="font-heading text-xl font-bold tracking-tight">QG Jão</span>
          </Link>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Bem-vindo de volta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre para curtir, comentar e pontuar na matilha.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              login.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                data-testid="login-email-input"
                type="email"
                required
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                data-testid="login-password-input"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              data-testid="login-submit-button"
              disabled={login.isPending}
            >
              {login.isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Ainda não faz parte da matilha?{" "}
            <Link to="/cadastro" data-testid="login-register-link" className="text-primary hover:underline">
              Criar conta de fã
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}