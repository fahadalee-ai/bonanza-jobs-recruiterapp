import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { OtpBoxes } from "@/components/agent-ui";
import { Logo } from "@/components/brand";
import { PrimaryButton } from "@/components/ui-app";
import { haptic } from "@/lib/format";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/verify")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "reset" ? "reset" : "signup",
  }),
  component: Verify,
});

function Verify() {
  const { mode } = Route.useSearch();
  const { verifyOtp, pendingSignup, resetEmail } = useApp();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const target = mode === "reset" ? resetEmail : pendingSignup?.email;

  return (
    <div className="min-h-dvh bg-background px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <Logo height={56} />
      <h1 className="mt-6 text-2xl font-semibold text-heading">Enter the code</h1>
      <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
        We sent a 6-digit code to {target || "your email"}. Use 123456 in this demo.
      </p>
      <div className="mt-6">
        <OtpBoxes value={code} onChange={setCode} />
      </div>
      {error && <p className="mt-3 text-[13px] font-medium text-danger">{error}</p>}
      <PrimaryButton
        className="mt-6 w-full"
        disabled={code.length < 6}
        onClick={() => {
          if (code !== "123456") {
            setError("That code isn’t valid. Try 123456.");
            return;
          }
          haptic();
          if (mode === "reset") navigate({ to: "/reset" });
          else if (verifyOtp()) navigate({ to: "/pending" });
          else setError("Start registration again so we can verify this email.");
        }}
      >
        Verify
      </PrimaryButton>
      <button
        type="button"
        disabled={seconds > 0}
        onClick={() => setSeconds(30)}
        className="mt-4 w-full text-sm font-semibold text-[#7A22C8] disabled:opacity-40"
      >
        {seconds > 0 ? `Resend code in ${seconds}s` : "Resend code"}
      </button>
    </div>
  );
}
