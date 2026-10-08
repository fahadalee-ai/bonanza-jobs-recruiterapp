import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Clock3, Mail } from "lucide-react";
import { useEffect } from "react";
import { Logo } from "@/components/brand";
import { PrimaryButton, SecondaryButton } from "@/components/ui-app";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/pending")({
  component: Pending,
});

function Pending() {
  const app = useApp();
  const navigate = useNavigate();
  const user = app.user;

  useEffect(() => {
    if (app.hydrated && !user) navigate({ to: "/login", replace: true });
    if (user?.status === "active") navigate({ to: "/home", replace: true });
  }, [app.hydrated, user, navigate]);

  if (!user) return <div className="min-h-dvh bg-background" />;
  const rejected = user.status === "rejected";

  return (
    <div className="flex min-h-dvh flex-col bg-background px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <Logo height={56} />
      <div className="mt-8 rounded-[16px] bg-card p-5 text-center shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${rejected ? "bg-[#FEE2E2] text-[#991B1B]" : "bg-[#F3E8FF] text-[#6B21A8]"}`}>
          {rejected ? <Mail size={28} /> : <Clock3 size={28} />}
        </div>
        <p className="mt-4 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Application status</p>
        <h1 className="mt-1 text-2xl font-semibold text-heading">{rejected ? "Application not approved" : "Application submitted"}</h1>
        <p className="mt-3 text-[15px] leading-6 text-muted-foreground">
          {rejected
            ? user.rejectionReason
            : "Thanks, " + user.firstName + ". We’ll notify you within 24–48 hours after we review your W-9 and profile."}
        </p>
        <p className={`mt-4 inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${rejected ? "bg-[#FEE2E2] text-[#991B1B]" : "bg-[#FEF3C7] text-[#92400E]"}`}>
          {rejected ? "Rejected" : "Pending approval"}
        </p>
      </div>
      <div className="mt-auto space-y-3 pt-8">
        {rejected ? (
          <PrimaryButton
            className="w-full"
            onClick={() => {
              app.reapply();
            }}
          >
            Re-apply
          </PrimaryButton>
        ) : (
          <PrimaryButton className="w-full" onClick={() => app.approveDemo()}>
            Demo: approve application
          </PrimaryButton>
        )}
        <SecondaryButton className="w-full" onClick={() => navigate({ to: "/support" })}>
          Contact Support
        </SecondaryButton>
        <button type="button" onClick={() => app.logout()} className="w-full py-2 text-sm font-semibold text-muted-foreground">
          Log out
        </button>
      </div>
    </div>
  );
}
