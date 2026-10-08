import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ReferralCard, useWarmup } from "@/components/agent-ui";
import { Chip, EmptyState, PageHeader, PrimaryLink, Sheet, Skeleton, useGuard } from "@/components/ui-app";
import type { ReferralStatus } from "@/lib/agent-data";

export const Route = createFileRoute("/referrals/")({
  component: ReferralsPage,
});

const FILTERS = ["All", "Submitted", "Under Review", "Interview", "Offer", "Hired", "Rejected", "Paid"] as const;

function ReferralsPage() {
  const app = useGuard();
  const loading = useWarmup();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [sort, setSort] = useState<"newest" | "status" | "fee">("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const user = app.user;

  const rows = useMemo(() => {
    const mine = app.referrals.filter((item) => item.userId === user?.id);
    const filtered = mine.filter((item) => {
      const name = `${item.candidate.firstName} ${item.candidate.lastName}`.toLowerCase();
      if (query && !name.includes(query.toLowerCase()) && !item.code.toLowerCase().includes(query.toLowerCase())) return false;
      if (filter === "All") return true;
      if (filter === "Hired") return item.status === "Hired" || item.status === "90-Day Retention" || item.status === "Referral Fee Earned";
      return item.status === (filter as ReferralStatus);
    });
    return filtered.sort((a, b) => {
      if (sort === "fee") return b.m1.amount + b.m2.amount - (a.m1.amount + a.m2.amount);
      if (sort === "status") return a.status.localeCompare(b.status);
      return b.submitted.localeCompare(a.submitted);
    });
  }, [app.referrals, user?.id, query, filter, sort]);

  if (!user) return <div className="min-h-dvh bg-background" />;

  return (
    <div className="min-h-dvh bg-background pb-28">
      <PageHeader title="My referrals" back={false} right={<button type="button" aria-label="Sort" onClick={() => setSortOpen(true)} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card"><ArrowUpDown size={18} /></button>} />
      <div className="space-y-3 px-4">
        <label className="flex h-[52px] items-center gap-2 rounded-[12px] border border-border bg-card px-3">
          <Search size={18} className="text-muted-foreground" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search candidate or referral ID" className="h-full w-full bg-transparent outline-none" />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((item) => (
            <Chip key={item} active={filter === item} onClick={() => setFilter(item)}>{item}</Chip>
          ))}
        </div>
        {loading ? (
          <div className="space-y-3"><Skeleton className="h-28" /><Skeleton className="h-28" /></div>
        ) : rows.length === 0 ? (
          <EmptyState title="No referrals yet" body="When you refer a candidate, status, fees, and the next milestone show up here." action={<PrimaryLink to="/refer">Refer a Candidate</PrimaryLink>} />
        ) : (
          rows.map((referral) => <ReferralCard key={referral.id} referral={referral} job={app.jobs.find((job) => job.id === referral.jobId)} />)
        )}
      </div>
      <Sheet open={sortOpen} title="Sort" onClose={() => setSortOpen(false)}>
        {(["newest", "status", "fee"] as const).map((item) => (
          <button key={item} type="button" onClick={() => { setSort(item); setSortOpen(false); }} className="flex h-12 w-full items-center justify-between text-[15px] font-medium">
            {item === "newest" ? "Newest" : item === "status" ? "Status" : "Fee amount"}
            {sort === item && <span className="text-[#7A22C8]">Selected</span>}
          </button>
        ))}
      </Sheet>
    </div>
  );
}
