import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, PageHeader, SecondaryButton, StatusBadge, useGuard } from "@/components/ui-app";
import { prettyDate, usd } from "@/lib/format";

export const Route = createFileRoute("/payments/$paymentId")({
  component: ReceiptPage,
});

function ReceiptPage() {
  const { paymentId } = Route.useParams();
  const app = useGuard();
  const navigate = useNavigate();
  const payment = app.payments.find((item) => item.id === paymentId && item.userId === app.user?.id);

  if (!app.user) return <div className="min-h-dvh bg-background" />;
  if (!payment) {
    return (
      <div className="min-h-dvh bg-background">
        <PageHeader title="Receipt" fallback="/payments" />
        <p className="px-5 text-[15px] text-muted-foreground">This receipt is unavailable.</p>
      </div>
    );
  }

  const download = () => {
    const popup = window.open("", "_blank", "noopener,noreferrer,width=480,height=720");
    if (!popup) return;
    popup.document.write(`<!doctype html><title>${payment.reference}</title><body style="font-family:Inter,sans-serif;padding:32px;color:#1B1B2F"><h1>Bonanza Jobs</h1><p>Payment receipt</p><p><strong>${usd(payment.amount)}</strong></p><p>Reference ${payment.reference}</p><p>Status ${payment.status}</p><p>Date ${prettyDate(payment.date)}</p><p>Method ${payment.method}</p><p>${payment.candidate} · ${payment.milestone}</p></body>`);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  return (
    <div className="min-h-dvh bg-background pb-8">
      <PageHeader title="Receipt" subtitle={payment.reference} fallback="/payments" />
      <div className="space-y-3 px-4">
        <Card>
          <p className="text-[13px] text-muted-foreground">Amount</p>
          <p className="text-[32px] font-bold text-heading">{usd(payment.amount)}</p>
          <div className="mt-2"><StatusBadge status={payment.status} /></div>
        </Card>
        <Card>
          <Row label="Date" value={prettyDate(payment.date)} />
          <Row label="Expected" value={payment.expected} />
          <Row label="Method" value={payment.method} />
          <Row label="Reference" value={payment.reference} />
          <Row label="Type" value={payment.milestone} />
          <Row label="Candidate" value={payment.candidate} />
        </Card>
        {payment.referralId && (
          <SecondaryButton className="w-full" onClick={() => navigate({ to: "/referrals/$referralId", params: { referralId: payment.referralId } })}>
            View referral
          </SecondaryButton>
        )}
        <SecondaryButton className="w-full" onClick={download}>Download PDF</SecondaryButton>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-start justify-between gap-4 py-1.5 text-[14px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-heading">{value}</span>
    </p>
  );
}
