import { createFileRoute } from "@tanstack/react-router";
import { CountdownRing, MoneyLegend } from "@/components/agent-ui";
import { Card, PageHeader, StatusBadge, useGuard } from "@/components/ui-app";
import { candidateName } from "@/lib/agent-data";
import { usd } from "@/lib/format";
import type { Milestone } from "@/lib/agent-data";

export const Route = createFileRoute("/referrals/$referralId/milestones")({
  component: MilestonesPage,
});

function MilestonesPage() {
  const { referralId } = Route.useParams();
  const app = useGuard();
  const referral = app.referrals.find((item) => item.id === referralId && item.userId === app.user?.id);

  if (!app.user) return <div className="min-h-dvh bg-background" />;
  if (!referral) {
    return (
      <div className="min-h-dvh bg-background">
        <PageHeader title="Milestones" fallback="/referrals" />
      </div>
    );
  }

  const total = referral.m1.amount + referral.m2.amount;
  const earned = [referral.m1, referral.m2].filter((item) => item.state === "Earned" || item.state === "Paid").reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-dvh bg-background pb-10 dark:bg-background">
      <PageHeader title="Milestone tracking" subtitle={candidateName(referral)} fallback={`/referrals/${referral.id}`} />
      <div className="space-y-4 px-4">
        <MilestoneCard
          title="Milestone 1 · Offer acceptance"
          milestone={referral.m1}
          trigger="Released when the candidate accepts the offer"
        />
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-heading">Milestone 2 · 90-day retention</h2>
              <p className="mt-1 text-[28px] font-bold leading-8 text-[#F5B301]">{usd(referral.m2.amount)}</p>
              <div className="mt-2"><StatusBadge status={referral.m2.state} /></div>
            </div>
            {typeof referral.m2.daysLeft === "number" && referral.m2.state !== "Failed" && referral.m2.state !== "Paid" && (
              <CountdownRing daysLeft={referral.m2.daysLeft} />
            )}
          </div>
          <p className="mt-3 text-[14px] leading-5 text-muted-foreground">Released when the candidate is still employed 90 days after the start date.</p>
          {referral.m2.start && (
            <p className="mt-2 text-[13px] text-foreground">Start {referral.m2.start} · End {referral.m2.end}</p>
          )}
          {referral.m2.earnedOn && <p className="mt-1 text-[13px] text-foreground">Earned {referral.m2.earnedOn}</p>}
          {referral.m2.paidOn && <p className="mt-1 text-[13px] text-[#166534]">Paid {referral.m2.paidOn}</p>}
          {(referral.m2.state === "At Risk" || referral.m2.state === "Failed") && (
            <p className="mt-2 text-[13px] font-medium text-danger">Retention failed because the candidate left before day 90.</p>
          )}
        </Card>
        <Card>
          <MoneyLegend />
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-[13px]">
              <span className="text-muted-foreground">Earned progress</span>
              <span className="font-semibold text-heading">{usd(earned)} of {usd(total)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#EEF0F6] dark:bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-[#F5B301] to-[#16A34A]" style={{ width: `${total ? (earned / total) * 100 : 0}%` }} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MilestoneCard({ title, milestone, trigger }: { title: string; milestone: Milestone; trigger: string }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-heading">{title}</h2>
      <p className="mt-1 text-[28px] font-bold leading-8 text-heading">{usd(milestone.amount)}</p>
      <div className="mt-2"><StatusBadge status={milestone.state} /></div>
      <p className="mt-3 text-[14px] leading-5 text-muted-foreground">{trigger}</p>
      {milestone.earnedOn && <p className="mt-2 text-[13px]">Date earned {milestone.earnedOn}</p>}
      {milestone.paidOn && <p className="mt-1 text-[13px] text-[#166534]">Payout status · Paid {milestone.paidOn}</p>}
      {!milestone.paidOn && milestone.state !== "Failed" && <p className="mt-1 text-[13px] text-muted-foreground">Payout status · {milestone.state}</p>}
    </Card>
  );
}
