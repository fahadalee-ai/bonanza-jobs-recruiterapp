import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/brand";
import { PrimaryButton, SecondaryButton } from "@/components/ui-app";

export const Route = createFileRoute("/welcome")({
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col bg-background px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <Logo height={64} />
      <div className="mt-8 overflow-hidden rounded-[16px] bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5] p-5 text-white shadow-[0_12px_32px_rgba(122,34,200,0.22)]">
        <p className="text-[13px] font-semibold text-white/80">Referral Agent</p>
        <h1 className="mt-2 text-[28px] font-semibold leading-8">Turn your network into income</h1>
        <p className="mt-3 text-[15px] leading-6 text-white/90">
          Refer qualified candidates to US employers. Earn at offer acceptance and again after 90 days.
        </p>
      </div>
      <div className="mt-auto space-y-3 pt-10">
        <PrimaryButton className="w-full" onClick={() => navigate({ to: "/login" })}>
          Log In
        </PrimaryButton>
        <SecondaryButton className="w-full" onClick={() => navigate({ to: "/signup" })}>
          Register as Referral Agent
        </SecondaryButton>
        <button type="button" onClick={() => navigate({ to: "/role" })} className="w-full py-3 text-[15px] font-semibold text-[#7A22C8]">
          Switch role
        </button>
      </div>
    </div>
  );
}
