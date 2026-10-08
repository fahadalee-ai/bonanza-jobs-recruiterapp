import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart, Donut, MoneyLegend, Refreshable, useWarmup } from "@/components/agent-ui";
import { Card, PageHeader, PrimaryButton, SecondaryButton, Skeleton, StatusBadge, useGuard } from "@/components/ui-app";
import { EARNINGS_MONTHS, moneyBuckets } from "@/lib/agent-data";
import { prettyDate, usd } from "@/lib/format";

export const Route = createFileRoute("/earnings")({
  component: EarningsPage,
});

function EarningsPage() {
  const app = useGuard();
  const navigate = useNavigate();
  const loading = useWarmup();
  const [range, setRange] = useState<3 | 6 | 12>(6);
  const user = app.user;
  if (!user) return <div className="min-h-dvh bg-background" />;

  const mine = app.referrals.filter((item) => item.userId === user.id);
  const buckets = moneyBuckets(mine);
  const lifetime = user.priorPaid + buckets.Paid + buckets.Earned;
  const pendingBalance = buckets.Pending + buckets.Eligible;
  const months = user.id === "a1" ? EARNINGS_MONTHS.slice(-range) : EARNINGS_MONTHS.slice(-range).map((row) => ({ ...row, amount: 0 }));
  const payments = app.payments.filter((item) => item.userId === user.id).slice(0, 4);
  const parts = [
    { label: "Pending", value: buckets.Pending, color: "#F59E0B" },
    { label: "Eligible", value: buckets.Eligible, color: "#0FAEE5" },
    { label: "Earned", value: buckets.Earned, color: "#F5B301" },
    { label: "Paid", value: buckets.Paid, color: "#16A34A" },
  ];

  return (
    <Refreshable onRefresh={() => undefined}>
      <div className="min-h-dvh bg-background pb-28">
        <PageHeader title="Earnings" back={false} />
        {loading ? (
          <div className="space-y-3 px-4"><Skeleton className="h-32" /><Skeleton className="h-48" /></div>
        ) : (
          <div className="space-y-4 px-4">
            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
              <BalanceCard label="Available balance" amount={usd(user.available)} className="from-[#7A22C8] to-[#0FAEE5]" />
              <BalanceCard label="Pending balance" amount={usd(pendingBalance)} className="from-[#B45309] to-[#F59E0B]" />
              <BalanceCard label="Lifetime earnings" amount={usd(lifetime)} className="from-[#166534] to-[#16A34A]" />
            </div>
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-heading">Monthly earnings</h2>
                <div className="flex gap-1">
                  {([3, 6, 12] as const).map((item) => (
                    <button key={item} type="button" onClick={() => setRange(item)} className={`h-8 rounded-full px-2.5 text-[12px] font-semibold ${range === item ? "bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5] text-white" : "bg-[#EEF0F6] text-foreground dark:bg-white/10"}`}>
                      {item}M
                    </button>
                  ))}
                </div>
              </div>
              <BarChart rows={months} />
            </Card>
            <Card>
              <h2 className="text-lg font-semibold text-heading">Money states</h2>
              <div className="mt-3 flex items-center gap-4">
                <Donut parts={parts} />
                <div className="space-y-1 text-[13px]">
                  {parts.map((part) => (
                    <p key={part.label} className="flex justify-between gap-3"><span className="text-muted-foreground">{part.label}</span><span className="font-semibold">{usd(part.value)}</span></p>
                  ))}
                </div>
              </div>
              <div className="mt-3"><MoneyLegend /></div>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <PrimaryButton onClick={() => navigate({ to: "/withdraw" })}>Request Withdrawal</PrimaryButton>
              <SecondaryButton onClick={() => navigate({ to: "/payments" })}>Payment History</SecondaryButton>
            </div>
            <section>
              <h2 className="mb-3 text-lg font-semibold text-heading">Recent transactions</h2>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <button key={payment.id} type="button" onClick={() => navigate({ to: "/payments/$paymentId", params: { paymentId: payment.id } })} className="flex w-full items-center justify-between rounded-[16px] bg-card p-4 text-left shadow-[0_4px_16px_rgba(27,27,47,0.06)] dark:border dark:border-white/10">
                    <span>
                      <span className="block font-semibold text-heading">{usd(payment.amount)}</span>
                      <span className="block text-[12px] text-muted-foreground">{payment.reference} · {prettyDate(payment.date)}</span>
                    </span>
                    <StatusBadge status={payment.status} />
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </Refreshable>
  );
}

function BalanceCard({ label, amount, className }: { label: string; amount: string; className: string }) {
  return (
    <article className={`w-[78%] shrink-0 snap-center rounded-[16px] bg-gradient-to-br p-4 text-white ${className}`}>
      <p className="text-[13px] text-white/80">{label}</p>
      <p className="mt-2 text-[28px] font-bold leading-8">{amount}</p>
    </article>
  );
}
