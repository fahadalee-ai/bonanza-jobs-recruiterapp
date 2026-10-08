import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ONBOARDING } from "@/lib/agent-data";
import { useApp } from "@/lib/store";
import { PrimaryButton } from "@/components/ui-app";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { markOnboarded } = useApp();
  const slide = ONBOARDING[index] ?? ONBOARDING[0];
  const last = index === ONBOARDING.length - 1;

  const finish = () => {
    markOnboarded();
    navigate({ to: "/welcome", replace: true });
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="relative h-[55dvh] overflow-hidden">
        <img key={slide.image} src={slide.image} alt={slide.alt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#7A22C8]/30 to-[#0FAEE5]/25 mix-blend-multiply" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        <button
          type="button"
          onClick={finish}
          className="absolute right-4 top-[max(0.85rem,env(safe-area-inset-top))] rounded-full bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md"
        >
          Skip
        </button>
      </div>
      <div className="flex min-h-[45dvh] flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2">
        <h1 className="text-2xl font-semibold leading-7 text-heading">{slide.title}</h1>
        <p className="mt-3 text-[16px] leading-6 text-muted-foreground">{slide.body}</p>
        <div className="mb-5 mt-auto flex justify-center gap-2 pt-8">
          {ONBOARDING.map((item, dot) => (
            <span key={item.title} className={dot === index ? "h-2 w-6 rounded-full bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5]" : "h-2 w-2 rounded-full bg-[#E5E7EB]"} />
          ))}
        </div>
        <PrimaryButton
          className="w-full"
          onClick={() => {
            if (last) finish();
            else setIndex((value) => value + 1);
          }}
        >
          {last ? "Get Started" : "Next"}
        </PrimaryButton>
      </div>
    </div>
  );
}
