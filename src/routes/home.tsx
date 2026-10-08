import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useMemo, useState } from "react";
import { AgentChip, BarChart, FeeChip, PipelineChart, ReferralCard, Refreshable, Stars, useWarmup } from "@/components/agent-ui";
import { Avatar, Card, PrimaryButton, SecondaryButton, SectionTitle, Skeleton, useGuard } from "@/components/ui-app";
import { EARNINGS_MONTHS, isHire, moneyBuckets, pipelineCounts } from "@/lib/agent-data";
import { usd } from "@/lib/format";

export const Route = createFileRoute("/home")({
  component: Dashboard,
});

function Dashboard() {
  const app = useGuard();
  const navigate = useNavigate();
  const loading = useWarmup();
  const [pulse, setPulse] = useState(0);
  const user = app.user;

  const mine = useMemo(() => app.referrals.filter((item) => item.userId === user?.id), [app.referrals, user?.id]);
  if (!user) return <div className="min-h-dvh bg-background" />;

  const buckets = moneyBuckets(mine);
  const unread = app.notifications.filter((item) => !item.read).length;
  const due = mine
    .filter((item) => item.status === "90-Day Retention" && (item.m2.daysLeft ?? 99) <= 70)
    .sort((a, b) => (a.m2.daysLeft ?? 0) - (b.m2.daysLeft ?? 0));
  const kpis = [
    ["Referrals Sent", mine.length, "text-heading"],
    ["Under Review", mine.filter((item) => item.status === "Under Review").length, "text-[#075F7A]"],
    ["Interviews", mine.filter((item) => item.status === "Interview").length, "text-[#6B21A8]"],
    ["Offers", mine.filter((item) => item.status === "Offer").length, "text-[#92400E]"],
    ["Hires", mine.filter((item) => isHire(item.status)).length, "text-[#166534]"],
    ["Pending Fees", usd(buckets.Pending + buckets.Eligible), "text-[#B45309]"],
    ["Earned", usd(buckets.Earned), "text-[#8A6500]"],
    ["Paid", usd(buckets.Paid), "text-[#166534]"],
  ];

  return (
    <Refreshable onRefresh={() => setPulse((value) => value + 1)}>
      <div className="bg-background pb-32" key={pulse}>
        <header className="bg-gradient-to-br from-[#7A22C8] via-[#5A2AD4] to-[#0FAEE5] px-4 pb-16 pt-[max(0.75rem,env(safe-area-inset-top))] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={user.photo} name={`${user.firstName} ${user.lastName}`} className="h-11 w-11 ring-2 ring-white/40" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold leading-7">Hi, {user.firstName}</h1>
                  <AgentChip light />
                </div>
                <Stars value={user.rating || 5} className="text-white" />
              </div>
            </div>
            <button type="button" aria-label="Notifications" onClick={() => navigate({ to: "/notifications" })} className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
              <Bell size={20} strokeWidth={1.75} />
              {unread > 0 && <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F5B301] px-1 text-[10px] font-bold text-[#2B1F6E]">{unread}</span>}
            </button>
          </div>
        </header>

        <div className="relative z-10 -mt-10 space-y-5 px-4">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-36" />
              <Skeleton className="h-28" />
              <Skeleton className="h-40" />
            </div>
          ) : (
            <>
              <Card className="bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5] text-white">
                <p className="text-[13px] text-white/80">Available balance</p>
                <p className="mt-1 text-[28px] font-bold leading-8">{usd(user.available)}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => navigate({ to: "/withdraw" })} className="h-11 rounded-[14px] bg-white text-[14px] font-semibold text-[#7A22C8]">
                    Request Payout
                  </button>
                  <button type="button" onClick={() => navigate({ to: "/wallet" })} className="h-11 rounded-[14px] border border-white/70 text-[14px] font-semibold text-white">
                    View Wallet
                  </button>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                {kpis.map(([label, value, tone]) => (
                  <div key={label} className="rounded-[16px] bg-card p-3.5 shadow-[0_4px_16px_rgba(27,27,47,0.06)] dark:border dark:border-white/10">
                    <p className={`text-[22px] font-bold leading-7 ${tone}`}>{value}</p>
                    <p className="mt-1 text-[12px] leading-4 text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              <section>
                <SectionTitle>Referral pipeline</SectionTitle>
                <Card>
                  <PipelineChart rows={pipelineCounts(mine)} />
                </Card>
              </section>

              <section>
                <SectionTitle>Earnings trend</SectionTitle>
                <Card>
                  <BarChart rows={user.id === "a1" ? EARNINGS_MONTHS.slice(-6) : EARNINGS_MONTHS.slice(-6).map((row) => ({ ...row, amount: 0 }))} />
                </Card>
              </section>

              <section>
                <SectionTitle action={<button type="button" onClick={() => navigate({ to: "/jobs" })} className="text-sm font-semibold text-[#0FAEE5]">See all</button>}>
                  Open job opportunities
                </SectionTitle>
                <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
                  {app.jobs.slice(0, 4).map((job) => (
                    <button key={job.id} type="button" onClick={() => navigate({ to: "/jobs/$jobId", params: { jobId: job.id } })} className="w-[260px] shrink-0 rounded-[16px] bg-card p-4 text-left shadow-[0_4px_16px_rgba(27,27,47,0.06)] dark:border dark:border-white/10">
                      <p className="text-[12px] text-muted-foreground">{job.company}</p>
                      <p className="mt-1 font-semibold text-heading">{job.title}</p>
                      <p className="mt-1 text-[13px] text-muted-foreground">{job.location}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <FeeChip amount={job.fee} />
                        <span className="text-[13px] font-semibold text-[#7A22C8]">Refer</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <SectionTitle action={<button type="button" onClick={() => navigate({ to: "/referrals" })} className="text-sm font-semibold text-[#0FAEE5]">See all</button>}>
                  Recent referrals
                </SectionTitle>
                <div className="space-y-3">
                  {mine.slice(0, 3).map((referral) => (
                    <ReferralCard key={referral.id} referral={referral} job={app.jobs.find((job) => job.id === referral.jobId)} />
                  ))}
                </div>
              </section>

              <section>
                <SectionTitle>Milestones due soon</SectionTitle>
                <div className="space-y-3">
                  {due.map((referral) => (
                    <Card key={referral.id} onClick={() => navigate({ to: "/referrals/$referralId/milestones", params: { referralId: referral.id } })}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-heading">
                            {referral.candidate.firstName} {referral.candidate.lastName}
                          </p>
                          <p className="text-[13px] text-muted-foreground">90-day retention · {usd(referral.m2.amount)}</p>
                        </div>
                        <p className="text-right text-[22px] font-bold leading-7 text-[#7A22C8]">{referral.m2.daysLeft}d</p>
                      </div>
                    </Card>
                  ))}
                  {due.length === 0 && <Card><p className="text-sm text-muted-foreground">No retention clocks are close.</p></Card>}
                </div>
              </section>

              <div className="grid grid-cols-2 gap-3">
                <PrimaryButton onClick={() => navigate({ to: "/refer", search: { job: "" } })}>Refer</PrimaryButton>
                <SecondaryButton onClick={() => navigate({ to: "/earnings" })}>Earnings</SecondaryButton>
              </div>
            </>
          )}
        </div>
      </div>
    </Refreshable>
  );
}
