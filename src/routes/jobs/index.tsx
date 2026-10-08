import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { JobCard, useWarmup } from "@/components/agent-ui";
import { Chip, EmptyState, PageHeader, PrimaryButton, RangeSlider, SecondaryButton, Sheet, Skeleton, useGuard } from "@/components/ui-app";
import { INDUSTRIES, JOB_TYPES, type JobType } from "@/lib/agent-data";

export const Route = createFileRoute("/jobs/")({
  component: JobsPage,
});

function JobsPage() {
  const app = useGuard();
  const navigate = useNavigate();
  const loading = useWarmup();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [industry, setIndustry] = useState("All");
  const [location, setLocation] = useState("All");
  const [type, setType] = useState<JobType | "All">("All");
  const [fee, setFee] = useState([0, 8000]);
  const [sort, setSort] = useState<"newest" | "fee">("newest");

  const locations = ["All", ...new Set(app.jobs.map((job) => job.location))];
  const jobs = useMemo(() => {
    const list = app.jobs.filter((job) => {
      const hay = `${job.title} ${job.company} ${job.location}`.toLowerCase();
      if (query && !hay.includes(query.toLowerCase())) return false;
      if (industry !== "All" && job.industry !== industry) return false;
      if (location !== "All" && job.location !== location) return false;
      if (type !== "All" && job.type !== type) return false;
      if (job.fee < fee[0] || job.fee > fee[1]) return false;
      return true;
    });
    return list.sort((a, b) => (sort === "fee" ? b.fee - a.fee : b.posted.localeCompare(a.posted)));
  }, [app.jobs, query, industry, location, type, fee, sort]);

  return (
    <div className="min-h-dvh bg-background pb-8">
      <PageHeader title="Open jobs" subtitle="Referral fees shown on every requisition" fallback="/home" />
      <div className="space-y-3 px-4">
        <div className="flex gap-2">
          <label className="flex h-[52px] flex-1 items-center gap-2 rounded-[12px] border border-border bg-card px-3">
            <Search size={18} className="text-muted-foreground" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, employer, city" className="h-full w-full bg-transparent text-[15px] outline-none" />
          </label>
          <button type="button" aria-label="Filters" onClick={() => setOpen(true)} className="flex h-[52px] w-12 items-center justify-center rounded-[12px] border border-border bg-card">
            <SlidersHorizontal size={18} />
          </button>
        </div>
        <div className="flex gap-2">
          <Chip active={sort === "newest"} onClick={() => setSort("newest")}>Newest</Chip>
          <Chip active={sort === "fee"} onClick={() => setSort("fee")}>Highest fee</Chip>
        </div>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState title="No matching jobs" body="Widen the fee range or clear a filter to see open requisitions." action={<PrimaryButton onClick={() => { setIndustry("All"); setLocation("All"); setType("All"); setFee([0, 8000]); setQuery(""); }}>Clear filters</PrimaryButton>} />
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              action={
                <div className="grid grid-cols-2 gap-2">
                  <SecondaryButton onClick={() => navigate({ to: "/jobs/$jobId", params: { jobId: job.id } })}>Details</SecondaryButton>
                  <PrimaryButton onClick={() => navigate({ to: "/refer", search: { job: job.id } })}>Refer</PrimaryButton>
                </div>
              }
            />
          ))
        )}
      </div>
      <Sheet
        open={open}
        title="Filters"
        onClose={() => setOpen(false)}
        footer={<PrimaryButton className="w-full" onClick={() => setOpen(false)}>Show jobs</PrimaryButton>}
      >
        <p className="mb-2 text-[13px] font-medium">Industry</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {["All", ...INDUSTRIES].map((item) => (
            <Chip key={item} active={industry === item} onClick={() => setIndustry(item)}>{item}</Chip>
          ))}
        </div>
        <p className="mb-2 text-[13px] font-medium">Location</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {locations.map((item) => (
            <Chip key={item} active={location === item} onClick={() => setLocation(item)}>{item}</Chip>
          ))}
        </div>
        <p className="mb-2 text-[13px] font-medium">Job type</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {(["All", ...JOB_TYPES] as const).map((item) => (
            <Chip key={item} active={type === item} onClick={() => setType(item)}>{item}</Chip>
          ))}
        </div>
        <p className="mb-2 text-[13px] font-medium">Referral fee ${fee[0].toLocaleString()} – ${fee[1].toLocaleString()}</p>
        <RangeSlider value={fee} min={0} max={8000} step={250} onChange={setFee} />
      </Sheet>
    </div>
  );
}
