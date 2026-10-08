import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { salaryLabel, postedLabel, money } from "@/lib/format";
import { CITIES, INDUSTRIES, type Job } from "@/lib/mock-data";
import { EMPTY_FILTERS, type JobFilters } from "@/lib/jobs";
import { Chip, PrimaryButton, RangeSlider, SecondaryButton, Sheet } from "@/components/ui-app";
import { cn } from "@/lib/utils";

export function CompanyMark({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF2F6] text-[13px] font-bold text-navy dark:bg-white/10 dark:text-foreground",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function JobCard({
  job,
  saved,
  onOpen,
  onSave,
  compact,
}: {
  job: Job;
  saved?: boolean;
  onOpen: () => void;
  onSave?: () => void;
  compact?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-white bg-white p-3.5 shadow-[0_8px_22px_rgba(27,27,47,0.08)] dark:border-white/10 dark:bg-card">
      <div className="flex items-start gap-3">
        <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 gap-3 text-left">
          <CompanyMark initials={job.initials} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[16px] font-semibold leading-5 text-heading">{job.title}</span>
            <span className="mt-0.5 block truncate text-[13px] font-medium text-foreground">{job.company}</span>
            <span className="block truncate text-[13px] text-muted-foreground">{job.locationLabel}</span>
          </span>
        </button>
        {onSave && (
          <button
            type="button"
            aria-label={saved ? "Remove saved job" : "Save job"}
            onClick={onSave}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F6F7FB] dark:bg-white/10"
          >
            <Heart size={18} strokeWidth={1.75} className={saved ? "fill-[#7A22C8] text-[#7A22C8]" : "text-[#6B7280]"} />
          </button>
        )}
      </div>
      {!compact && (
        <button type="button" onClick={onOpen} className="mt-3 flex w-full items-center justify-between gap-3 text-left">
          <span className="text-[15px] font-bold text-[#2B1F6E] dark:text-foreground">{salaryLabel(job.salaryMin, job.salaryMax, job.salaryUnit)}</span>
          <span className="shrink-0 text-xs font-medium text-muted-foreground">{postedLabel(job.postedDays)}</span>
        </button>
      )}
      <button type="button" onClick={onOpen} className="mt-2.5 flex w-full flex-wrap items-center gap-1.5 text-left">
        <span className="rounded-full bg-[#E0F4FC] px-2.5 py-1 text-[11px] font-semibold text-[#075F7A] dark:bg-[#0FAEE5]/15 dark:text-[#8FDBF5]">
          {job.jobType}
        </span>
        <span className="rounded-full bg-[#EEF0F6] px-2.5 py-1 text-[11px] font-semibold text-foreground">{job.workMode}</span>
        {job.easyApply && (
          <span className="rounded-full bg-[#F3E8FF] px-2.5 py-1 text-[11px] font-semibold text-[#6B21A8] dark:bg-[#7A22C8]/25 dark:text-[#E9D5FF]">
            Easy Apply
          </span>
        )}
        <span className="ml-auto rounded-full bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5] px-2.5 py-1 text-[11px] font-semibold text-white">
          {job.match}% match
        </span>
      </button>
    </article>
  );
}

export function FilterSheet({
  open,
  initial,
  countFor,
  onClose,
  onApply,
}: {
  open: boolean;
  initial: JobFilters;
  countFor: (filters: JobFilters) => number;
  onClose: () => void;
  onApply: (filters: JobFilters) => void;
}) {
  const [draft, setDraft] = useState(initial);
  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);
  const count = useMemo(() => countFor(draft), [countFor, draft]);
  const cities = CITIES.filter((city) => city.label.toLowerCase().includes(draft.location.toLowerCase()));

  const toggle = (key: "jobTypes" | "workModes", value: string) => {
    setDraft((current) => {
      const list = current[key];
      return {
        ...current,
        [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });
  };

  return (
    <Sheet
      open={open}
      title="Filters"
      onClose={onClose}
      footer={
        <div className="grid grid-cols-[1fr_1.4fr] gap-3">
          <SecondaryButton
            onClick={() => {
              setDraft(EMPTY_FILTERS);
            }}
          >
            Reset
          </SecondaryButton>
          <PrimaryButton
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Show {count.toLocaleString("en-US")} Jobs
          </PrimaryButton>
        </div>
      }
    >
      <label className="mb-4 block">
        <span className="mb-1.5 block text-[13px] font-medium">Keyword</span>
        <input
          value={draft.q}
          onChange={(event) => setDraft({ ...draft, q: event.target.value })}
          placeholder="Role, skill, or company"
          className="h-[52px] w-full rounded-xl border border-border bg-background px-3.5 outline-none focus:border-[#7A22C8] focus:ring-4 focus:ring-[#7A22C8]/15"
        />
      </label>
      <label className="mb-2 block">
        <span className="mb-1.5 block text-[13px] font-medium">Location</span>
        <input
          value={draft.location}
          onChange={(event) => setDraft({ ...draft, location: event.target.value })}
          placeholder="City, state"
          className="h-[52px] w-full rounded-xl border border-border bg-background px-3.5 outline-none focus:border-[#7A22C8] focus:ring-4 focus:ring-[#7A22C8]/15"
        />
      </label>
      {draft.location && (
        <div className="mb-3 flex flex-wrap gap-2">
          {cities.slice(0, 4).map((city) => (
            <Chip key={city.label} active={draft.location === city.label} onClick={() => setDraft({ ...draft, location: city.label })}>
              {city.label}
            </Chip>
          ))}
        </div>
      )}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-[13px]">
          <span className="font-medium">Radius</span>
          <span className="text-muted-foreground">{draft.radius} miles</span>
        </div>
        <RangeSlider value={[draft.radius]} min={5} max={100} step={5} onChange={(value) => setDraft({ ...draft, radius: value[0] ?? 25 })} />
        <p className="text-xs text-muted-foreground">Remote roles stay visible unless you filter work mode.</p>
      </div>
      <p className="mb-2 text-[13px] font-medium">Job type</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {["Full-time", "Part-time", "Contract"].map((item) => (
          <Chip key={item} active={draft.jobTypes.includes(item)} onClick={() => toggle("jobTypes", item)}>
            {item}
          </Chip>
        ))}
      </div>
      <p className="mb-2 text-[13px] font-medium">Work mode</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {["On-site", "Remote", "Hybrid"].map((item) => (
          <Chip key={item} active={draft.workModes.includes(item)} onClick={() => toggle("workModes", item)}>
            {item}
          </Chip>
        ))}
      </div>
      <label className="mb-4 block">
        <span className="mb-1.5 block text-[13px] font-medium">Industry</span>
        <select
          value={draft.industry}
          onChange={(event) => setDraft({ ...draft, industry: event.target.value })}
          className="h-[52px] w-full rounded-xl border border-border bg-background px-3 outline-none"
        >
          <option value="">Any industry</option>
          {INDUSTRIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <p className="mb-2 text-[13px] font-medium">Experience</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {["Entry", "Mid", "Senior", "Executive"].map((item) => (
          <Chip
            key={item}
            active={draft.experience === item}
            onClick={() => setDraft({ ...draft, experience: draft.experience === item ? "" : item })}
          >
            {item}
          </Chip>
        ))}
      </div>
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-[13px]">
          <span className="font-medium">Salary range</span>
          <span className="text-muted-foreground">
            {money(draft.salary[0], "yr")} – {money(draft.salary[1], "yr")}
          </span>
        </div>
        <RangeSlider
          value={draft.salary}
          min={40000}
          max={220000}
          step={5000}
          onChange={(value) => setDraft({ ...draft, salary: [value[0] ?? 40000, value[1] ?? 220000] })}
        />
      </div>
      <p className="mb-2 text-[13px] font-medium">Date posted</p>
      <div className="mb-2 flex flex-wrap gap-2">
        {[
          ["any", "Any time"],
          ["1", "24 hours"],
          ["7", "7 days"],
          ["30", "30 days"],
        ].map(([id, label]) => (
          <Chip key={id} active={draft.posted === id} onClick={() => setDraft({ ...draft, posted: id as JobFilters["posted"] })}>
            {label}
          </Chip>
        ))}
      </div>
    </Sheet>
  );
}

export function SortSheet({
  open,
  value,
  onClose,
  onChange,
}: {
  open: boolean;
  value: "relevant" | "newest" | "salary" | "match";
  onClose: () => void;
  onChange: (value: "relevant" | "newest" | "salary" | "match") => void;
}) {
  const options = [
    ["relevant", "Most relevant"],
    ["newest", "Newest"],
    ["salary", "Salary: high to low"],
    ["match", "Match %"],
  ] as const;
  return (
    <Sheet open={open} title="Sort" onClose={onClose}>
      <div className="space-y-2 pb-4">
        {options.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              onChange(id);
              onClose();
            }}
            className={cn(
              "flex h-[52px] w-full items-center justify-between rounded-xl border px-4 text-left text-[15px] font-medium",
              value === id ? "border-[#7A22C8] bg-[#7A22C8]/5" : "border-border",
            )}
          >
            {label}
            <span className={cn("h-4 w-4 rounded-full border-2", value === id ? "border-[#0FAEE5] bg-[#0FAEE5]" : "border-border")} />
          </button>
        ))}
      </div>
    </Sheet>
  );
}
