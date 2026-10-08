import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, PageHeader, PrimaryButton, StatusBadge, useGuard } from "@/components/ui-app";
import { candidateName, moneyBuckets } from "@/lib/agent-data";
import { usd } from "@/lib/format";

export const Route = createFileRoute("/wallet")({
  component: WalletPage,
});

function WalletPage() {
  const app = useGuard();
  const navigate = useNavigate();
  const user = app.user;
  if (!user) return <div className="min-h-dvh bg-background" />;
  const mine = app.referrals.filter((item) => item.userId === user.id);
  const buckets = moneyBuckets(mine);
  const waiting = mine.flatMap((referral) =>
    [referral.m1, referral.m2]
      .map((milestone, index) => ({ referral, milestone, label: index === 0 ? "Offer acceptance" : "90-day retention" }))
      .filter((item) => item.milestone.state === "Pending" || item.milestone.state === "Eligible" || item.milestone.state === "Earned"),
  );

  return (
    <div className="min-h-dvh bg-background pb-28">
      <PageHeader title="Wallet" fallback="/earnings" />
      <div className="space-y-4 px-4">
        <Card className="bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5] text-white">
          <p className="text-[13px] text-white/80">Available to withdraw</p>
          <p className="mt-1 text-[32px] font-bold leading-9">{usd(user.available)}</p>
          <p className="mt-2 text-[13px] text-white/80">Minimum withdrawal is $50.00. ACH arrives in 3–5 business days.</p>
        </Card>
        <PrimaryButton className="w-full" onClick={() => navigate({ to: "/withdraw" })}>Request Payout</PrimaryButton>
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-heading">Payout methods</h2>
            <button type="button" onClick={() => navigate({ to: "/payout" })} className="text-sm font-semibold text-[#0FAEE5]">Add / change</button>
          </div>
          <div className="space-y-3">
            {user.payoutMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{method.label}</p>
                  <p className="text-[13px] text-muted-foreground">{method.detail}</p>
                </div>
                <span className={`text-[12px] font-semibold ${method.verified ? "text-[#166534]" : "text-[#B45309]"}`}>
                  {method.verified ? "Verified" : "Not verified"}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">What is still waiting</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">{usd(buckets.Pending + buckets.Eligible + buckets.Earned)} is tied to open milestones.</p>
          <div className="mt-3 space-y-3">
            {waiting.slice(0, 5).map((item) => (
              <button key={`${item.referral.id}-${item.label}`} type="button" onClick={() => navigate({ to: "/referrals/$referralId/milestones", params: { referralId: item.referral.id } })} className="flex w-full items-center justify-between text-left">
                <span>
                  <span className="block text-[14px] font-medium">{candidateName(item.referral)}</span>
                  <span className="block text-[12px] text-muted-foreground">{item.label}</span>
                </span>
                <span className="text-right">
                  <span className="block font-semibold">{usd(item.milestone.amount)}</span>
                  <StatusBadge status={item.milestone.state} />
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
