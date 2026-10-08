import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/brand";
import { PasswordChecklist, PasswordField, PrimaryButton, strengthOk } from "@/components/ui-app";
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
  const [error, setError] = useState("");

  return (
    <div className="min-h-dvh bg-background px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <Logo height={56} />
      <h1 className="mt-6 text-2xl font-semibold text-heading">Choose a new password</h1>
      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (!strengthOk(password)) {
            setError("Use a stronger password.");
            return;
          }
          if (password !== confirm) {
            setError("Passwords don’t match.");
            return;
          }
          if (!resetPassword(password)) {
            setError("Request a new code and try again.");
            return;
          }
          haptic();
          navigate({ to: "/login" });
        }}
      >
        <PasswordField label="New password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <PasswordChecklist password={password} />
        <PasswordField label="Confirm password" value={confirm} onChange={(event) => setConfirm(event.target.value)} error={error} />
        <PrimaryButton className="w-full">Update password</PrimaryButton>
      </form>
    </div>
  );
}
