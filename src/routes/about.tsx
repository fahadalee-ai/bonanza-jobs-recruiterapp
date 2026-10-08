import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "@/components/brand";
import { PageHeader } from "@/components/ui-app";

export const Route = createFileRoute("/about")({
  component: () => (
    <div className="min-h-dvh bg-background pb-8">
      <PageHeader title="About" fallback="/settings" />
      <div className="px-5">
        <Logo height={56} />
        <p className="mt-4 text-[15px] leading-6 text-muted-foreground">
          Bonanza Jobs helps referral agents introduce qualified people to US employers and track fees from submission through 90-day retention.
        </p>
      </div>
    </div>
  ),
});