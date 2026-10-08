import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/ui-app";

export const Route = createFileRoute("/help")({
  component: HelpPage,
});

const FAQS = [
  ["When do I get paid?", "Milestone 1 is released when the candidate accepts the offer. Milestone 2 is released after they stay 90 days."],
  ["What does each money state mean?", "Pending is waiting on the employer. Eligible can be released. Earned is confirmed and queued. Paid has reached your payout method."],
  ["Why was a referral rejected?", "Open the referral timeline. The employer note explains the reason, and you can refer someone else to the same job."],
  ["What is the minimum withdrawal?", "$50.00 to a verified ACH account or PayPal. A W-9 must be on file."],
];

function HelpPage() {
  const [open, setOpen] = useState(0);
  return (
    <div className="min-h-dvh bg-background pb-8">
      <PageHeader title="Help Center" fallback="/settings" />
      <div className="space-y-2 px-4">
        {FAQS.map(([question, answer], index) => (
          <button key={question} type="button" onClick={() => setOpen(index)} className="w-full rounded-[16px] bg-card p-4 text-left shadow-[0_4px_16px_rgba(27,27,47,0.06)]">
            <p className="font-semibold text-heading">{question}</p>
            {open === index && <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{answer}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}
