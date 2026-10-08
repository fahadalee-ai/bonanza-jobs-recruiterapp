import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PrimaryButton } from "@/components/ui-app";

export const Route = createFileRoute("/session-expired")({
  component: function SessionExpired() {
    const navigate = useNavigate();
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="text-2xl font-semibold text-heading">Session expired</h1>
        <p className="mt-2 max-w-[280px] text-[15px] leading-6 text-muted-foreground">Sign in again to get back to your referrals and wallet.</p>
        <PrimaryButton className="mt-6 w-full" onClick={() => navigate({ to: "/login" })}>Log In</PrimaryButton>
      </div>
    );
  },
});
