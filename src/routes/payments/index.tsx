import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Chip, EmptyState, PageHeader, SecondaryButton, Sheet, StatusBadge, useGuard } from "@/components/ui-app";
import type { PaymentStatus } from "@/lib/agent-data";
import { prettyDate, usd } from "@/lib/format";

export const Route = createFileRoute("/payments/")({
  component: PaymentsPage,
});

const FILTERS = ["All", "Pending", "Processing", "Paid", "Failed"] as const;

function PaymentsPage() {
  const app = useGuard();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-12-31");
  const [open, setOpen] = useState(false);
  const user = app.user;

  const rows = useMemo(() => {
    return app.payments.filter((item) => {
      if (item.userId !== user?.id) return false;
      if (filter !== "All" && item.status !== (filter as PaymentStatus)) return false;
      if (item.date < from || item.date > to) return false;
      return true;
    });
  }, [app.payments, user?.id, filter, from, to]);

  if (!user) return <div className="min-h-dvh bg-background" />;

  const exportCsv = () => {
    const header = "reference,amount,status,date,candidate,milestone,method";
    const body = rows.map((item) => [item.reference, item.amount.toFixed(2), item.status, item.date, item.candidate, item.milestone, item.method].join(",")).join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bonanza-payments.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-dvh bg-background pb-8">
      <PageHeader title="Payment history" fallback="/earnings" right={<SecondaryButton className="h-11 px-3" onClick={exportCsv}>Export</SecondaryButton>} />
      <div className="space-y-3 px-4">
        <div className="flex gap-2 overflow-x-auto">
          {FILTERS.map((item) => (
            <Chip key={item} active={filter === item} onClick={() => setFilter(item)}>{item}</Chip>
          ))}
          <Chip onClick={() => setOpen(true)}>Dates</Chip>
        </div>
        {rows.length === 0 ? (
          <EmptyState title="No payments in this range" body="Paid, processing, and failed payouts will show here with a reference number." />
        ) : (
          rows.map((payment) => (
            <button key={payment.id} type="button" onClick={() => navigate({ to: "/payments/$paymentId", params: { paymentId: payment.id } })} className="w-full rounded-[16px] bg-card p-4 text-left shadow-[0_4px_16px_rgba(27,27,47,0.06)] dark:border dark:border-white/10">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[22px] font-bold text-heading">{usd(payment.amount)}</p>
                <StatusBadge status={payment.status} />
              </div>
              <p className="mt-1 text-[13px] text-muted-foreground">{prettyDate(payment.date)} · {payment.reference}</p>
              <p className="mt-1 text-[13px] text-foreground">{payment.candidate} · {payment.milestone}</p>
            </button>
          ))
        )}
      </div>
      <Sheet open={open} title="Date range" onClose={() => setOpen(false)}>
        <label className="mb-3 block text-[13px] font-medium">From
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="mt-1 h-[52px] w-full rounded-[12px] border border-border px-3" />
        </label>
        <label className="block text-[13px] font-medium">To
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="mt-1 h-[52px] w-full rounded-[12px] border border-border px-3" />
        </label>
      </Sheet>
    </div>
  );
}
