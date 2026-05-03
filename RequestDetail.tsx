import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Mail, Chrome, Facebook } from "lucide-react";

const Auth = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">((params.get("mode") === "signin" ? "signin" : "signup") as "signin" | "signup");
  const redirect = params.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const socialLogin = async (provider: "google" | "facebook") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}${redirect}` },
    });
    if (error) toast.error(error.message);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name || email.split("@")[0] } },
        });
        if (error) {
          toast.error(error.message);
        } else if (data.session) {
          toast.success("Account created. You are now logged in.");
          nav(redirect);
        } else {
          toast.info("Account created. Disable email confirmation in Supabase to allow instant login.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) toast.error(error.message);
        else nav(redirect);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-elegant">
        <Link to="/" className="flex flex-col items-center gap-2 mb-6">
          <Logo className="h-14 w-14" />
          <span className="font-bold text-xl">Nearby<span className="text-accent">Pro</span></span>
        </Link>
        <h1 className="text-2xl font-bold text-center mb-1">{mode === "signin" ? "Sign in" : "New here? Create account"}</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {mode === "signin" ? "Access chat, jobs, provider tools and admin." : "Create a free account with email and password. No long forms."}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button type="button" variant="outline" onClick={() => socialLogin("google")} className="gap-2">
            <Chrome className="h-4 w-4" /> Google
          </Button>
          <Button type="button" variant="outline" onClick={() => socialLogin("facebook")} className="gap-2">
            <Facebook className="h-4 w-4" /> Facebook
          </Button>
        </div>
        <div className="relative mb-4 text-center text-xs text-muted-foreground">
          <span className="bg-card px-2 relative z-10">or use email</span>
          <div className="absolute left-0 right-0 top-1/2 border-t" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <Button type="submit" disabled={busy} className="w-full bg-gradient-brand">
            {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <div className="text-sm text-center mt-4 text-muted-foreground">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button className="text-accent font-medium" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </div>
      </Card>
    </div>
  );
};
export default Auth;
