import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/agent-data";
import { haptic } from "@/lib/format";
import { useApp } from "@/lib/store";
import { Logo } from "@/components/brand";
import { AuthCanvas, PasswordField, PrimaryButton, TextField, Toggle } from "@/components/ui-app";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const { login, loginWithBiometric, users } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
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
      login(email, password, remember);
      setBusy(false);
      go(email);
    }, 350);
  };

  return (
    <AuthCanvas>
      <Logo variant="white" height={72} />
      <h1 className="mt-6 text-[28px] font-semibold leading-8 text-white">Welcome back</h1>
      <p className="mt-2 text-[15px] leading-6 text-white/85">Sign in to your referral agent account.</p>
      <form
        className="mt-6 rounded-3xl bg-white p-4 shadow-[0_16px_40px_rgba(15,11,42,0.22)]"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" />
        <PasswordField label="Password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" />
        <div className="-mt-2 mb-2 flex justify-end">
          <Link to="/forgot" className="text-sm font-semibold text-[#2B1F6E]">
            Forgot password?
          </Link>
        </div>
        <div className="mb-2">
          <Toggle checked={remember} onChange={setRemember} label="Remember me" />
        </div>
        <PrimaryButton className="w-full" disabled={busy}>
          {busy ? "Signing in…" : "Log In"}
        </PrimaryButton>
        <button
          type="button"
          onClick={() => {
            loginWithBiometric();
            haptic();
            navigate({ to: "/home" });
          }}
          className="mt-3 w-full text-center text-[15px] font-semibold text-[#2B1F6E]"
        >
          Sign in with Face ID
        </button>
        <button
          type="button"
          onClick={() => {
            setEmail(DEMO_EMAIL);
            setPassword(DEMO_PASSWORD);
          }}
          className="mt-3 w-full text-center text-[13px] leading-5 text-[#4B5563]"
        >
          Sample agent: {DEMO_EMAIL}
          <span className="mt-1 block">Password {DEMO_PASSWORD}. Pending and suspended use the same password.</span>
        </button>
      </form>
      <div className="mt-6 space-y-3 text-center">
        <button type="button" onClick={() => navigate({ to: "/signup" })} className="w-full text-[15px] font-semibold text-white">
          Register as Referral Agent
        </button>
        <button type="button" onClick={() => navigate({ to: "/role" })} className="w-full text-[15px] font-semibold text-white">
          Switch role
        </button>
        <p className="text-[13px] leading-5 text-white">
          By continuing you agree to our{" "}
          <Link to="/terms" className="font-semibold underline underline-offset-2">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="font-semibold underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </AuthCanvas>
  );
}
