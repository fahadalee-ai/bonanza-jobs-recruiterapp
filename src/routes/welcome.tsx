import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/brand";
import { AuthCanvas, PrimaryButton, SecondaryButton } from "@/components/ui-app";

export const Route = createFileRoute("/welcome")({
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  return (
    <AuthCanvas>
      <Logo variant="white" height={72} />
      <h1 className="mt-6 text-[28px] font-semibold leading-8 text-white">Turn your network into income</h1>
      <p className="mt-2 text-[15px] leading-6 text-white/85">
        Refer qualified candidates to US employers and earn at offer acceptance and again after 90 days.
      </p>
      <div className="mt-6 space-y-3 rounded-3xl bg-white p-4 shadow-[0_16px_40px_rgba(15,11,42,0.22)]">
        <PrimaryButton className="w-full" onClick={() => navigate({ to: "/login" })}>
          Log In
        </PrimaryButton>
        <SecondaryButton className="w-full" onClick={() => navigate({ to: "/signup" })}>
          Register as Referral Agent
        </SecondaryButton>
      </div>
      <button type="button" onClick={() => navigate({ to: "/role" })} className="mt-6 w-full text-[15px] font-semibold text-white">
        Switch role
      </button>
    </AuthCanvas>
  );
}
