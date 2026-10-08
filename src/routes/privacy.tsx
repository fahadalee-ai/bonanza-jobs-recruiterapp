import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-app";

export const Route = createFileRoute("/privacy")({
  component: () => (
    <div className="min-h-dvh bg-background pb-8">
      <PageHeader title="Privacy" fallback="/settings" />
      <div className="space-y-3 px-5 text-[15px] leading-6 text-muted-foreground">
        <p>We use your profile, payout method, and tax identifier to operate referrals and issue Form 1099-NEC. The full SSN or EIN is not stored in this demo. Only the last four digits stay on the device.</p>
        <p>Candidate resumes are shared with the employer on the requisition you select. Employer feedback is visible to you on that referral.</p>
        <p>You can delete the agent account from Settings. That removes the local profile on this device.</p>
      </div>
    </div>
  ),
});
