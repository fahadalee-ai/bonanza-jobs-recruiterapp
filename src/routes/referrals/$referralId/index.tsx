import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { candidateName } from "@/lib/agent-data";
import { Card, PageHeader, PrimaryButton, SecondaryButton, StatusBadge, useGuard } from "@/components/ui-app";
import { prettyDate, usd } from "@/lib/format";

export const Route = createFileRoute("/referrals/$referralId/")({
  component: ReferralDetail,
});

function ReferralDetail() {
  const { referralId } = Route.useParams();
  const app = useGuard();
  const navigate = useNavigate();
  const referral = app.referrals.find((item) => item.id === referralId && item.userId === app.user?.id);
  const job = app.jobs.find((item) => item.id === referral?.jobId);

  if (!app.user) return <div className="min-h-dvh bg-background" />;
  if (!referral || !job) {
    return (
      <div className="min-h-dvh bg-background">
        <PageHeader title="Referral unavailable" fallback="/referrals" />
        <p className="px-5 text-[15px] text-muted-foreground">We couldn’t load this referral.</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background pb-28">
      <PageHeader title={candidateName(referral)} subtitle={`${job.title} · ${job.company}`} fallback="/referrals" />
      <div className="space-y-3 px-4">
        <div className="flex items-center justify-between">
          <StatusBadge status={referral.status} />
          <span className="text-[12px] font-semibold text-muted-foreground">{referral.code}</span>
        </div>
        <Card>
          <h2 className="text-lg font-semibold text-heading">Candidate summary</h2>
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
            {referral.candidate.title} at {referral.candidate.employer}. {referral.candidate.city}. {referral.candidate.email} · {referral.candidate.phone}
          </p>
          <p className="mt-1 text-[13px] text-[#0FAEE5]">{referral.type}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">Job info</h2>
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{job.title} at {job.company}, {job.location}. Submitted {prettyDate(referral.submitted)}.</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">My recommendation</h2>
          <p className="mt-2 text-[15px] leading-6 text-foreground">{referral.recommendation}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">Documents</h2>
          <p className="mt-2 text-[15px] text-foreground">{referral.resumeName}</p>
          <p className="text-[13px] text-muted-foreground">{referral.skills.join(" · ")} · {referral.years} · {referral.education}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">Employer feedback</h2>
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{referral.feedback || "No notes yet."}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">Fee summary</h2>
          <div className="mt-3 space-y-2">
            <FeeRow label="Milestone 1 · Offer acceptance" amount={referral.m1.amount} state={referral.m1.state} />
            <FeeRow label="Milestone 2 · 90-day retention" amount={referral.m2.amount} state={referral.m2.state} />
          </div>
        </Card>
        <PrimaryButton className="w-full" onClick={() => navigate({ to: "/referrals/$referralId/timeline", params: { referralId } })}>
          View Full Timeline
        </PrimaryButton>
        <SecondaryButton className="w-full" onClick={() => navigate({ to: "/referrals/$referralId/milestones", params: { referralId } })}>
          Milestone Tracking
        </SecondaryButton>
        <SecondaryButton className="w-full" onClick={() => navigate({ to: "/support" })}>
          Contact Support
        </SecondaryButton>
      </div>
    </div>
  );
}

function FeeRow({ label, amount, state }: { label: string; amount: number; state: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[14px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold text-heading">{usd(amount)} · {state}</span>
    </div>
  );
}
