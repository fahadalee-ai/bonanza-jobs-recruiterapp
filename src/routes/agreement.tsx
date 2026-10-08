import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-app";

export const Route = createFileRoute("/agreement")({
  component: () => (
    <div className="min-h-dvh bg-background pb-8">
      <PageHeader title="Agent agreement" fallback="/settings" />
      <div className="space-y-3 px-5 text-[15px] leading-6 text-muted-foreground">
        <p>This Referral Agent Agreement covers introductions you make through Bonanza Jobs. You confirm each person has agreed to be referred before you submit them.</p>
        <p>Milestone 1 is earned when the candidate accepts the employer’s offer. Milestone 2 is earned when that person remains employed through day 90. If they leave sooner, Milestone 2 is marked failed.</p>
        <p>Payouts require a verified bank or PayPal method and a W-9 on file. Bonanza may hold a payout while a referral is under review.</p>
      </div>
    </div>
  ),
});
