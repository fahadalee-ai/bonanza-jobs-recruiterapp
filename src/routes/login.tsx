import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Fingerprint } from "lucide-react";
import { useState } from "react";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/agent-data";
import { haptic } from "@/lib/format";
import { useApp } from "@/lib/store";
import { Logo } from "@/components/brand";
import { PasswordField, PrimaryButton, TextField, Toggle } from "@/components/ui-app";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const { login, loginWithBiometric, users } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const go = (address: string) => {
    const account = users.find((item) => item.email === address.trim().toLowerCase());
    haptic();
    if (account?.status === "pending" || account?.status === "rejected") navigate({ to: "/pending" });
    else navigate({ to: "/home" });
  };

  const submit = () => {
    setBusy(true);
    window.setTimeout(() => {
      const result = login(email, password, remember);
      setBusy(false);
      if (!result.ok) {
        setError(
          result.reason === "suspended"
            ? "This account is suspended. Contact support to restore access."
            : result.reason === "locked"
              ? "Too many attempts. Try again in a few minutes."
              : "Those credentials don’t match our records.",
        );
        return;
      }
      setError("");
      go(email);
    }, 350);
  };

  return (
    <div className="min-h-dvh bg-background px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <Logo height={56} />
      <h1 className="mt-6 text-2xl font-semibold leading-7 text-heading">Welcome back</h1>
      <p className="mt-2 text-[15px] leading-6 text-muted-foreground">Log in to your referral agent account.</p>
      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" />
        <PasswordField label="Password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" />
        {error && <p className="-mt-2 mb-3 text-[13px] font-medium text-danger">{error}</p>}
        <div className="-mt-1 mb-2 flex items-center justify-between">
          <Toggle checked={remember} onChange={setRemember} label="Remember me" />
        </div>
        <div className="mb-4 flex justify-end">
          <Link to="/forgot" className="text-sm font-semibold text-[#7A22C8]">
            Forgot password?
          </Link>
        </div>
        <PrimaryButton className="w-full" disabled={busy}>
          {busy ? "Signing in…" : "Log In"}
        </PrimaryButton>
      </form>
      <button
        type="button"
        onClick={() => {
          const result = loginWithBiometric();
          if (!result.ok) {
            setError("Face ID isn’t set up yet. Turn it on in Settings after you sign in.");
            return;
          }
          haptic();
          navigate({ to: "/home" });
        }}
        className="mt-3 flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] border border-border bg-card text-[15px] font-semibold text-heading"
      >
        <Fingerprint size={18} strokeWidth={1.75} />
        Sign in with Face ID
      </button>
      <button
        type="button"
        onClick={() => {
          setEmail(DEMO_EMAIL);
          setPassword(DEMO_PASSWORD);
          setError("");
        }}
        className="mt-4 w-full rounded-[16px] bg-[#F3E8FF] px-4 py-3 text-left text-[13px] leading-5 text-[#6B21A8] dark:bg-[#7A22C8]/20 dark:text-[#E9D5FF]"
      >
        Use sample agent {DEMO_EMAIL}
        <span className="mt-1 block text-[12px] text-[#6B21A8]/80 dark:text-[#E9D5FF]/80">Password {DEMO_PASSWORD}. Pending: pending.agent@email.com · Suspended: suspended.agent@email.com</span>
      </button>
      <p className="mt-6 text-center text-[15px]">
        <button type="button" onClick={() => navigate({ to: "/signup" })} className="font-semibold text-[#7A22C8]">
          Register as Referral Agent
        </button>
      </p>
    </div>
  );
}
