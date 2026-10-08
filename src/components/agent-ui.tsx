import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Star } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { candidateName, nextHint, type Job, type Referral } from "@/lib/agent-data";
import { prettyDate, usd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui-app";

export function EmployerMark({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF0F6] text-[13px] font-bold text-[#2B1F6E] dark:bg-white/10 dark:text-white">
      {initials}
    </span>
  );
}

export function FeeChip({ amount }: { amount: number }) {
  return (
    <span className="inline-flex rounded-full bg-[#FFF4CC] px-2.5 py-1 text-[12px] font-semibold text-[#7A5B00] dark:bg-[#F5B301]/20 dark:text-[#F5D98A]">
      {usd(amount)}
    </span>
  );
}

export function AgentChip({ light = false }: { light?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-semibold",
        light ? "bg-white/25 text-white" : "bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5] text-white",
      )}
    >
      Agent
    </span>
  );
}

export function JobCard({ job, action }: { job: Job; action?: ReactNode }) {
  return (
    <article className="rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(27,27,47,0.06)] dark:border dark:border-white/10 dark:shadow-none">
      <div className="flex items-start gap-3">
        <EmployerMark name={job.company} />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-medium text-muted-foreground">{job.company}</p>
          <h3 className="text-[15px] font-semibold leading-5 text-heading">{job.title}</h3>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {job.location} · {job.type}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <FeeChip amount={job.fee} />
        <span className="text-[12px] text-muted-foreground">{job.openings} openings</span>
        <span className="text-[12px] text-muted-foreground">{prettyDate(job.posted)}</span>
      </div>
      <p className="mt-2 text-[13px] text-muted-foreground">{job.salary}</p>
      {action && <div className="mt-3">{action}</div>}
    </article>
  );
}

export function ReferralCard({ referral, job }: { referral: Referral; job?: Job }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate({ to: "/referrals/$referralId", params: { referralId: referral.id } })}
      className="block w-full rounded-[16px] bg-card p-4 text-left shadow-[0_4px_16px_rgba(27,27,47,0.06)] dark:border dark:border-white/10 dark:shadow-none"
    >
      <div className="flex items-start gap-3">
        <img src={referral.candidate.photo} alt="" className="h-11 w-11 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-heading">{candidateName(referral)}</p>
            <StatusBadge status={referral.status} />
          </div>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {job?.title} · {job?.company}
          </p>
          <p className="mt-2 text-[12px] text-muted-foreground">Submitted {prettyDate(referral.submitted)}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <FeeChip amount={referral.status === "Rejected" ? 0 : referral.m1.amount + referral.m2.amount} />
        <span className="text-right text-[12px] font-medium text-[#7A22C8] dark:text-[#D8B4FE]">{nextHint(referral)}</span>
      </div>
    </button>
  );
}

export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex justify-between text-[12px] font-medium text-muted-foreground">
        <span>
          Step {step} of {total}
        </span>
        <span>{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn("h-1.5 flex-1 rounded-full", index < step ? "bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5]" : "bg-[#E5E7EB] dark:bg-white/10")}
          />
        ))}
      </div>
    </div>
  );
}

export function MoneyLegend() {
  const items = [
    ["Pending", "bg-[#F59E0B]"],
    ["Eligible", "bg-[#0FAEE5]"],
    ["Earned", "bg-[#F5B301]"],
    ["Paid", "bg-[#16A34A]"],
  ];
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {items.map(([label, color]) => (
        <span key={label} className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <span className={cn("h-2 w-2 rounded-full", color)} />
          {label}
        </span>
      ))}
    </div>
  );
}

export function PipelineChart({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  return (
    <div className="space-y-2.5">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[76px_1fr_20px] items-center gap-2">
          <span className="text-[12px] text-muted-foreground">{row.label}</span>
          <span className="h-2.5 overflow-hidden rounded-full bg-[#EEF0F6] dark:bg-white/10">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5]"
              style={{ width: `${(row.value / max) * 100}%` }}
            />
          </span>
          <span className="text-right text-[12px] font-semibold text-heading">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

export function BarChart({ rows }: { rows: { label: string; amount: number }[] }) {
  const max = Math.max(1, ...rows.map((row) => row.amount));
  return (
    <div className="flex h-36 items-end gap-1.5">
      {rows.map((row) => (
        <div key={row.label} className="flex min-w-0 flex-1 flex-col items-center gap-1">
          <div className="flex h-28 w-full items-end">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-[#7A22C8] to-[#0FAEE5]"
              style={{ height: `${Math.max(8, (row.amount / max) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">{row.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Donut({ parts }: { parts: { value: number; color: string; label: string }[] }) {
  const total = parts.reduce((sum, part) => sum + part.value, 0) || 1;
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="14" className="text-[#EEF0F6] dark:text-white/10" />
      {parts.map((part) => {
        const length = (part.value / total) * circ;
        const node = (
          <circle
            key={part.label}
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={part.color}
            strokeWidth="14"
            strokeDasharray={`${length} ${circ - length}`}
            strokeDashoffset={-offset}
          />
        );
        offset += length;
        return node;
      })}
    </svg>
  );
}

export function CountdownRing({ daysLeft, total = 90 }: { daysLeft: number; total?: number }) {
  const radius = 46;
  const circ = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, (total - daysLeft) / total));
  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-[#E5E7EB] dark:text-white/10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#count)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - progress * circ}
        />
        <defs>
          <linearGradient id="count" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7A22C8" />
            <stop offset="100%" stopColor="#0FAEE5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] font-bold leading-8 text-heading">{daysLeft}</span>
        <span className="text-[11px] text-muted-foreground">days left</span>
      </div>
    </div>
  );
}

export function useWarmup() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 600);
    return () => window.clearTimeout(timer);
  }, []);
  return loading;
}

export function Refreshable({ onRefresh, children }: { onRefresh: () => void; children: ReactNode }) {
  const [pull, setPull] = useState(0);
  const [busy, setBusy] = useState(false);
  const start = useRef(0);
  return (
    <div
      onTouchStart={(event) => {
        if (window.scrollY <= 0) start.current = event.touches[0]?.clientY ?? 0;
      }}
      onTouchMove={(event) => {
        if (!start.current || window.scrollY > 0) return;
        setPull(Math.max(0, Math.min(72, (event.touches[0]?.clientY ?? 0) - start.current)));
      }}
      onTouchEnd={() => {
        if (pull > 56 && !busy) {
          setBusy(true);
          window.setTimeout(() => {
            onRefresh();
            setBusy(false);
            setPull(0);
          }, 650);
        } else setPull(0);
        start.current = 0;
      }}
    >
      {(pull > 12 || busy) && (
        <p className="pt-2 text-center text-[12px] font-medium text-muted-foreground">{busy ? "Refreshing…" : "Release to refresh"}</p>
      )}
      {children}
    </div>
  );
}

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-[13px] font-semibold text-heading", className)}>
      <Star size={14} className="fill-[#F5B301] text-[#F5B301]" strokeWidth={1.75} />
      {value.toFixed(1)}
    </span>
  );
}

export function MenuRow({
  icon,
  label,
  hint,
  to,
  onClick,
  danger,
}: {
  icon: ReactNode;
  label: string;
  hint?: string;
  to?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  const className = "flex min-h-14 w-full items-center gap-3 text-left";
  const body = (
    <>
      <span className={cn("text-[#7A22C8]", danger && "text-danger")}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-[15px] font-medium", danger ? "text-danger" : "text-foreground")}>{label}</span>
        {hint && <span className="block text-[12px] text-muted-foreground">{hint}</span>}
      </span>
      <ChevronRight size={18} className="text-muted-foreground" />
    </>
  );
  if (to) {
    return (
      <Link to={to as "/"} className={className}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {body}
    </button>
  );
}

export function OtpBoxes({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length: 6 }, (_, index) => (
        <input
          key={index}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${index + 1}`}
          value={value[index] ?? ""}
          onChange={(event) => {
            const digit = event.target.value.replace(/\D/g, "").slice(-1);
            const next = value.split("");
            next[index] = digit;
            const joined = next.join("").slice(0, 6);
            onChange(joined);
            const sibling = event.target.nextElementSibling as HTMLInputElement | null;
            if (digit && sibling) sibling.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !value[index]) {
              const sibling = (event.target as HTMLInputElement).previousElementSibling as HTMLInputElement | null;
              sibling?.focus();
            }
          }}
          className="h-14 w-full rounded-[12px] border border-border bg-card text-center text-xl font-semibold outline-none focus:border-[#7A22C8] focus:ring-4 focus:ring-[#7A22C8]/15"
        />
      ))}
    </div>
  );
}
