import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Bonanza Jobs" }] }),
  component: Splash,
});

function Splash() {
  const { hydrated, user, onboarded } = useApp();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!hydrated || leaving) return;
    const timer = window.setTimeout(() => {
      setLeaving(true);
      if (user?.status === "active") navigate({ to: "/home", replace: true });
      else if (user && (user.status === "pending" || user.status === "rejected")) navigate({ to: "/pending", replace: true });
      else if (!onboarded) navigate({ to: "/onboarding", replace: true });
      else navigate({ to: "/welcome", replace: true });
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [hydrated, navigate, leaving, user, onboarded]);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-[#F7F4FC] to-[#E7D4F7] px-6">
      <div className="animate-[splash-pop_0.8s_ease] text-center">
        <div className="relative mx-auto w-fit rounded-[28px] bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5] p-[3px] shadow-[0_16px_40px_rgba(122,34,200,0.18)]">
          <div className="rounded-[25px] bg-white px-5 py-4">
            <Logo height={72} />
          </div>
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
            <span className="absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-[splash-shimmer_1.6s_ease_0.2s_1]" />
          </span>
        </div>
        <p className="mt-6 text-[15px] font-semibold tracking-wide text-[#2B1F6E]">Refer. Earn. Grow.</p>
      </div>
      <div className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-10 right-10 h-1.5 overflow-hidden rounded-full bg-[#E7D4F7]">
        <div className="h-full w-full origin-left bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5] animate-[bar-fill_2s_linear_forwards]" />
      </div>
    </div>
  );
}
