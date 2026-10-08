import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PrimaryButton, Sheet, StickyBar, useGuard } from "@/components/ui-app";
import { haptic, usd } from "@/lib/format";

export const Route = createFileRoute("/withdraw/")({
  component: WithdrawPage,
});

function WithdrawPage() {
  const app = useGuard();
  const navigate = useNavigate();
  const user = app.user;
  const [amount, setAmount] = useState("");
  const [methodId, setMethodId] = useState(user?.payoutMethods.find((item) => item.verified)?.id ?? "");
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  if (!user) return <div className="min-h-dvh bg-background" />;

  const value = Number(amount);
  const method = user.payoutMethods.find((item) => item.id === methodId);

  const ask = () => {
    if (!Number.isFinite(value) || value <= 0) return setError("Enter an amount.");
    if (value < 50) return setError("Minimum withdrawal is $50.00.");
    if (value > user.available) return setError("That amount is higher than your available balance.");
    if (user.w9Status !== "On file") return setError("Add a W-9 in payout settings before requesting a payout.");
    if (!method?.verified) return setError("That payout method isn’t verified yet.");
    setError("");
    setConfirm(true);
  };

  return (
    <div className="min-h-dvh bg-background pb-28">
      <PageHeader title="Request payout" subtitle={`${usd(user.available)} available`} fallback="/wallet" />
      <div className="px-4">
        <label className="mb-4 block">
          <span className="mb-1.5 block text-[13px] font-medium">Amount</span>
          <input
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value.replace(/[^\d.]/g, ""))}
            placeholder="0.00"
            className="h-[52px] w-full rounded-[12px] border border-border bg-card px-3 text-[28px] font-bold outline-none focus:border-[#7A22C8]"
          />
        </label>
        <button type="button" onClick={() => setAmount(user.available.toFixed(2))} className="mb-4 text-sm font-semibold text-[#7A22C8]">
          Withdraw all
        </button>
        <p className="mb-2 text-[13px] font-medium">Payout method</p>
        <div className="space-y-2">
          {user.payoutMethods.map((item) => (
            <button key={item.id} type="button" onClick={() => setMethodId(item.id)} className={`flex w-full items-center justify-between rounded-[16px] border bg-card p-4 text-left ${methodId === item.id ? "border-[#7A22C8]" : "border-border"}`}>
              <span>
                <span className="block font-semibold">{item.label}</span>
                <span className="block text-[13px] text-muted-foreground">{item.detail}</span>
              </span>
              <span className="text-[12px] font-semibold text-muted-foreground">{item.verified ? "Verified" : "Not verified"}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-[13px] leading-5 text-muted-foreground">No Bonanza fee on ACH. Processing time is 3–5 business days after confirmation.</p>
        {error && <p className="mt-3 text-[13px] font-medium text-danger">{error}</p>}
      </div>
      <StickyBar>
        <PrimaryButton className="w-full" onClick={ask}>Request Payout</PrimaryButton>
      </StickyBar>
      <Sheet
        open={confirm}
        title="Confirm payout"
        onClose={() => setConfirm(false)}
        footer={
          <PrimaryButton
            className="w-full"
            onClick={() => {
              const result = app.requestWithdrawal({ amount: value, methodId });
              if (!result.ok) {
                setConfirm(false);
                setError(
                  result.reason === "balance"
                    ? "Insufficient balance."
                    : result.reason === "tax"
                      ? "Your tax form is missing."
                      : result.reason === "method"
                        ? "Payout method is not verified."
                        : "Check the amount and try again.",
                );
                return;
              }
              haptic();
              navigate({ to: "/withdraw/success" });
            }}
          >
            Confirm with Face ID
          </PrimaryButton>
        }
      >
        <p className="text-[15px] leading-6">
          Send {usd(value || 0)} to {method?.label} {method?.detail}. You’ll get a reference number and an expected date.
        </p>
      </Sheet>
    </div>
  );
}
