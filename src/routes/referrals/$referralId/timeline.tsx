import { createFileRoute } from "@tanstack/react-router";
import { candidateName } from "@/lib/agent-data";
import { PageHeader, useGuard } from "@/components/ui-app";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/referrals/$referralId/timeline")({
  component: TimelinePage,
});

function TimelinePage() {
  const { referralId } = Route.useParams();
  const app = useGuard();
  const referral = app.referrals.find((item) => item.id === referralId && item.userId === app.user?.id);

  if (!app.user) return <div className="min-h-dvh bg-background" />;
  if (!referral) {
    return (
      <div className="min-h-dvh bg-background">
        <PageHeader title="Timeline" fallback="/referrals" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background pb-10">
      <PageHeader title="Status tracking" subtitle={candidateName(referral)} fallback={`/referrals/${referral.id}`} />
      <ol className="px-5">
        {referral.timeline.map((event, index) => (
          <li key={event.label} className="relative flex gap-4 pb-6">
            {index < referral.timeline.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-border" />}
            <span
              className={cn(
                "relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full",
                event.state === "done" && "bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5]",
                event.state === "current" && "bg-[#0FAEE5] animate-[step-pulse_1.6s_ease_infinite]",
                event.state === "future" && "bg-[#E5E7EB] dark:bg-white/20",
                event.state === "rejected" && "bg-[#DC2626]",
              )}
            />
            <div>
              <p className={cn("font-semibold", event.state === "future" ? "text-muted-foreground" : "text-heading")}>{event.label}</p>
              {event.date && <p className="text-[13px] text-muted-foreground">{event.date}</p>}
              {event.note && <p className="mt-1 text-[14px] leading-5 text-foreground">{event.note}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
