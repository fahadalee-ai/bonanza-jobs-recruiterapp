import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { OtpBoxes } from "@/components/agent-ui";
import { Logo } from "@/components/brand";
import { AuthCanvas, PrimaryButton } from "@/components/ui-app";
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
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const target = mode === "reset" ? resetEmail : pendingSignup?.email;

  return (
    <AuthCanvas>
      <Logo variant="white" height={72} />
      <h1 className="mt-6 text-[28px] font-semibold leading-8 text-white">Enter the code</h1>
      <p className="mt-2 text-[15px] leading-6 text-white/85">
        We sent a 6-digit code to {target || "your email"}.
      </p>
      <div className="mt-6 rounded-3xl bg-white p-4 shadow-[0_16px_40px_rgba(15,11,42,0.22)]">
        <OtpBoxes value={code} onChange={setCode} />
        <PrimaryButton
          className="mt-6 w-full"
          onClick={() => {
            haptic();
            if (mode === "reset") navigate({ to: "/reset" });
            else {
              verifyOtp();
              navigate({ to: "/pending" });
            }
          }}
        >
          Verify
        </PrimaryButton>
        <button
          type="button"
          disabled={seconds > 0}
          onClick={() => setSeconds(30)}
          className="mt-4 w-full text-sm font-semibold text-[#2B1F6E] disabled:opacity-40"
        >
          {seconds > 0 ? `Resend code in ${seconds}s` : "Resend code"}
        </button>
      </div>
    </AuthCanvas>
  );
}
