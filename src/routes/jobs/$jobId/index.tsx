import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { EmployerMark, FeeChip } from "@/components/agent-ui";
import { Card, PageHeader, PrimaryButton, StickyBar, useGuard } from "@/components/ui-app";
import { feeSplit } from "@/lib/agent-data";
import { prettyDate, usd } from "@/lib/format";

export const Route = createFileRoute("/jobs/$jobId/")({
  component: JobDetail,
});

function JobDetail() {
  const { jobId } = Route.useParams();
  const app = useGuard();
  const navigate = useNavigate();
  const job = app.jobs.find((item) => item.id === jobId);

  if (!app.user) return <div className="min-h-dvh bg-background" />;
  if (!job) {
    return (
      <div className="min-h-dvh bg-background">
        <PageHeader title="Job unavailable" fallback="/jobs" />
        <p className="px-5 text-[15px] leading-6 text-muted-foreground">We couldn’t load this requisition. It may have been filled or removed.</p>
      </div>
    );
  }

  const split = feeSplit(job.fee);
  return (
    <div className="min-h-dvh bg-background pb-28">
      <PageHeader title={job.title} subtitle={job.company} fallback="/jobs" />
      <div className="space-y-4 px-4">
        <Card>
          <div className="flex items-center gap-3">
            <EmployerMark name={job.company} />
            <div>
              <p className="font-semibold text-heading">{job.company}</p>
              <p className="text-[13px] text-muted-foreground">{job.location} · {job.type} · {job.industry}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <FeeChip amount={job.fee} />
            <span className="text-[13px] text-muted-foreground">{job.openings} openings · {prettyDate(job.posted)}</span>
          </div>
          <p className="mt-2 text-[14px] text-foreground">{job.salary}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">About the role</h2>
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{job.description}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">Requirements</h2>
          <ul className="mt-2 space-y-2 text-[15px] leading-6 text-muted-foreground">
            {job.requirements.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">Fee breakdown</h2>
          <div className="mt-3 space-y-2 text-[15px]">
            <p className="flex justify-between"><span>Milestone 1 · Offer acceptance</span><span className="font-semibold text-[#8A6500]">{usd(split.m1)}</span></p>
            <p className="flex justify-between"><span>Milestone 2 · 90-day retention</span><span className="font-semibold text-[#166534]">{usd(split.m2)}</span></p>
          </div>
        </Card>
      </div>
      <StickyBar>
        <PrimaryButton className="w-full" onClick={() => navigate({ to: "/refer", search: { job: job.id } })}>
          Refer a Candidate
        </PrimaryButton>
      </StickyBar>
    </div>
  );
}
