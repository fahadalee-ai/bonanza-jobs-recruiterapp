import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { Logo } from "@/components/brand";
import { AuthCanvas, PrimaryButton, TextField } from "@/components/ui-app";

export const Route = createFileRoute("/forgot")({
  component: Forgot,
});

function Forgot() {
  const { requestReset } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <AuthCanvas>
      <Logo variant="white" height={72} />
      <h1 className="mt-6 text-[28px] font-semibold leading-8 text-white">Reset your password</h1>
      <p className="mt-2 text-[15px] leading-6 text-white/85">We’ll email a 6-digit code to verify it’s you.</p>
      <form
        className="mt-6 rounded-3xl bg-white p-4 shadow-[0_16px_40px_rgba(15,11,42,0.22)]"
        onSubmit={(event) => {
          event.preventDefault();
          requestReset(email);
          navigate({ to: "/verify", search: { mode: "reset" } });
        }}
      >
        <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" />
        <PrimaryButton className="w-full">Send code</PrimaryButton>
      </form>
    </AuthCanvas>
  );
}
