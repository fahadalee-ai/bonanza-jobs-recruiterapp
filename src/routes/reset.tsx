import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/brand";
import { AuthCanvas, PasswordChecklist, PasswordField, PrimaryButton } from "@/components/ui-app";
import { haptic } from "@/lib/format";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/reset")({
  component: Reset,
});

function Reset() {
  const { resetPassword } = useApp();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <AuthCanvas>
      <Logo variant="white" height={72} />
      <h1 className="mt-6 text-[28px] font-semibold leading-8 text-white">Choose a new password</h1>
      <p className="mt-2 text-[15px] leading-6 text-white/85">Use this the next time you sign in as a referral agent.</p>
      <form
        className="mt-6 rounded-3xl bg-white p-4 shadow-[0_16px_40px_rgba(15,11,42,0.22)]"
        onSubmit={(event) => {
          event.preventDefault();
          resetPassword(password);
          haptic();
          navigate({ to: "/login" });
        }}
      >
        <PasswordField label="New password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <PasswordChecklist password={password} />
        <PasswordField label="Confirm password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
        <PrimaryButton className="w-full">Update password</PrimaryButton>
      </form>
    </AuthCanvas>
  );
}
