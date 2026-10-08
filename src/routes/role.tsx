import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Briefcase, Building2, UserPlus } from "lucide-react";
import { Logo } from "@/components/brand";
import { Card, PageHeader } from "@/components/ui-app";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/role")({
  component: RoleSwitch,
});

const ROLES = [
  { id: "candidate", title: "Candidate", body: "Search US jobs and track your own applications.", icon: Briefcase, accent: "text-[#075F7A] bg-[#E7F8FE]" },
  { id: "employer", title: "Employer", body: "Post requisitions and review referred candidates.", icon: Building2, accent: "text-[#6B21A8] bg-[#F3E8FF]" },
  { id: "agent", title: "Referral Agent", body: "You’re here. Refer talent and earn on two milestones.", icon: UserPlus, accent: "text-white bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5]" },
];

function RoleSwitch() {
  const navigate = useNavigate();
  const { pushToast } = useApp();
  return (
    <div className="min-h-dvh bg-background pb-8">
      <PageHeader title="Switch role" fallback="/welcome" brand />
      <div className="space-y-3 px-4">
        <Logo height={48} className="mb-2" />
        {ROLES.map((role) => {
          const Icon = role.icon;
          return (
            <Card
              key={role.id}
              onClick={() => {
                if (role.id === "agent") navigate({ to: "/welcome" });
                else pushToast(`${role.title} portal`, "That experience opens in its own Bonanza Jobs app.");
              }}
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${role.accent}`}>
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block font-semibold text-heading">{role.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-5 text-muted-foreground">{role.body}</span>
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
