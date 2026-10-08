import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-app";

export const Route = createFileRoute("/terms")({
  component: () => (
    <div className="min-h-dvh bg-background pb-8">
      <PageHeader title="Terms" fallback="/settings" />
      <div className="space-y-3 px-5 text-[15px] leading-6 text-muted-foreground">
        <p>Bonanza Jobs provides the referral agent tools for introducing candidates to US employers. You are responsible for the accuracy of each referral and for having the candidate’s permission.</p>
        <p>Fees are quoted on the requisition and split into offer acceptance and 90-day retention. Amounts change if the employer closes the role or the candidate leaves early.</p>
        <p>Accounts can be suspended for duplicate submissions, invented candidates, or misuse of employer data.</p>
      </div>
    </div>
  ),
});
