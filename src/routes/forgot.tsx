import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { Logo } from "@/components/brand";
import { PrimaryButton, TextField } from "@/components/ui-app";

export const Route = createFileRoute("/forgot")({
  component: Forgot,
});

function Forgot() {
  const { requestReset } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="min-h-dvh bg-background px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <Logo height={56} />
      <h1 className="mt-6 text-2xl font-semibold text-heading">Reset your password</h1>
      <p className="mt-2 text-[15px] leading-6 text-muted-foreground">We’ll email a 6-digit code to verify it’s you.</p>
      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (!requestReset(email)) {
            setError("We couldn’t find an agent account with that email.");
            return;
          }
          navigate({ to: "/verify", search: { mode: "reset" } });
        }}
      >
        <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" error={error} />
        <PrimaryButton className="w-full">Send code</PrimaryButton>
      </form>
    </div>
  );
}
