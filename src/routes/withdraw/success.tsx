import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SuccessMark, PrimaryButton, SecondaryButton } from "@/components/ui-app";
import { usd } from "@/lib/format";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/withdraw/success")({
  component: WithdrawSuccess,
});

function WithdrawSuccess() {
  const { payments, lastPayoutId } = useApp();
  const navigate = useNavigate();
  const payment = payments.find((item) => item.id === lastPayoutId) ?? payments[0];

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background px-5 pt-16 text-center">
      <SuccessMark />
      <h1 className="mt-5 text-2xl font-semibold text-heading">Payout requested</h1>
      <p className="mt-2 text-[28px] font-bold text-heading">{payment ? usd(payment.amount) : ""}</p>
      <p className="mt-2 text-[15px] text-muted-foreground">Reference {payment?.reference}</p>
      <p className="mt-1 text-[15px] text-muted-foreground">Expected {payment?.expected}</p>
      <div className="mt-8 w-full space-y-3">
        <PrimaryButton className="w-full" onClick={() => navigate({ to: "/payments" })}>View Payment History</PrimaryButton>
        <SecondaryButton className="w-full" onClick={() => navigate({ to: "/earnings" })}>Back to Earnings</SecondaryButton>
      </div>
    </div>
  );
}
