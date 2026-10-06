import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import { beginSession } from "@/lib/session";
import { apiErrorMessage, eraLabel, ERAS } from "@/lib/fan";
import type { UserPublic } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PHOTO_ANTI_HEROI =
  "https://customer-assets-0z36b82j.emergentagent.net/job_jao-fans/artifacts/bx3o3paa_IMG_1604.jpeg";
export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [era, setEra] = useState("lobos");
  const qc = useQueryClient();
  const navigate = useNavigate();

  const register = useMutation({
    mutationFn: () =>
      apiPost<UserPublic>("/auth/register", {
        name,
        username: username.trim().replace(/^@/, "").toLowerCase(),
        email,
        password,
        favorite_era: era,
      }),
    onSuccess: async () => {
      await beginSession(qc);
      toast.success("Conta criada! Bem-vindo à matilha. 🐺");
      navigate("/");
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  return (
    <div className="grid min-h-svh bg-background text-foreground lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={PHOTO_ANTI_HEROI}
          alt="A era Anti-Herói: queda com flecha no peito, entre nuvens"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D090A] via-[#0D090A]/35 to-transparent" />
        <div className="absolute bottom-12 left-10 right-10" data-testid="register-quote">
          <p className="font-heading text-2xl font-medium italic leading-snug text-[#FFF9F5]">
            Todo fã tem uma era que lhe escolheu. Qual é a sua?
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#B5A4A7]">
             Lobos · Pirata · Anti-Herói · Super · Supernova · Memórias Póstumas
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-6 sm:p-8" data-testid="register-card">
          <Link to="/" data-testid="register-logo-link" className="mb-8 inline-flex items-center gap-2">
            <Star className="h-5 w-5 fill-primary text-primary" />
            <span className="font-heading text-xl font-bold tracking-tight">QG Jão</span>
          </Link>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Junte-se à matilha</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie sua conta de fã e comece a pontuar no ranking.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              register.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                data-testid="register-name-input"
                required
                minLength={2}
                placeholder="Como a matilha vai te chamar"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username">Seu @</Label>
              <Input
                id="username"
                data-testid="register-username-input"
                required
                pattern="[a-zA-Z0-9_]{3,20}"
                title="3 a 20 caracteres: letras, números e _"
                placeholder="loba_do_interior"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-email">E-mail</Label>
              <Input
                id="reg-email"
                data-testid="register-email-input"
                type="email"
                required
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-password">Senha</Label>
              <Input
                id="reg-password"
                data-testid="register-password-input"
                type="password"
                required
                minLength={6}
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-era">Era favorita</Label>
              <Select value={era} onValueChange={(v: string) => setEra(v)}>
                <SelectTrigger id="reg-era" data-testid="register-era-select" className="w-full">
                  <SelectValue>{(v: string) => eraLabel(v)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ERAS.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full"
              data-testid="register-submit-button"
              disabled={register.isPending}
            >
              {register.isPending ? "Criando conta..." : "Criar conta de fã"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já é da matilha?{" "}
            <Link to="/login" data-testid="register-login-link" className="text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
