import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, BadgeCheck, Settings, Star, Wallet } from "lucide-react";
import { AgentChip, MenuRow, Stars } from "@/components/agent-ui";
import { Avatar, Card, useGuard } from "@/components/ui-app";

export const Route = createFileRoute("/profile/")({
  component: ProfilePage,
});

function ProfilePage() {
  const app = useGuard();
  const navigate = useNavigate();
  const user = app.user;
  if (!user) return <div className="min-h-dvh bg-background" />;

  return (
    <div className="min-h-dvh bg-background pb-28">
      <header className="bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5] px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))] text-white">
        <div className="flex items-center gap-3">
          <Avatar src={user.photo} name={`${user.firstName} ${user.lastName}`} className="h-16 w-16 ring-2 ring-white/40" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold leading-7">{user.firstName} {user.lastName}</h1>
              <AgentChip light />
            </div>
            <p className="text-[14px] text-white/85">{user.headline}</p>
            <div className="mt-1 flex items-center gap-2 text-[13px]">
              <Stars value={user.rating || 0} className="text-white" />
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">{user.level}</span>
              <span>Since {user.memberSince}</span>
            </div>
          </div>
        </div>
      </header>
      <div className="space-y-3 px-4 pt-4">
        <Card>
          <h2 className="text-lg font-semibold text-heading">Personal info</h2>
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{user.email}<br />{user.phone}<br />{user.city} {user.state}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">Professional info</h2>
          <p className="mt-2 text-[15px] text-foreground">{user.industries.join(" · ") || "Add industries"}</p>
          <p className="mt-1 text-[14px] text-muted-foreground">{user.specialties.join(" · ")}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">Bio</h2>
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{user.bio || "Add a short bio."}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">LinkedIn</h2>
          <p className="mt-2 break-all text-[15px] text-[#0FAEE5]">{user.linkedin || "Not added"}</p>
        </Card>
        <button type="button" onClick={() => navigate({ to: "/profile/edit" })} className="h-[52px] w-full rounded-[14px] bg-gradient-to-br from-[#7A22C8] to-[#0FAEE5] text-[15px] font-semibold text-white">
          Edit Profile
        </button>
        <Card>
          <MenuRow icon={<Star size={20} />} label="Ratings and reputation" to="/reputation" />
          <MenuRow icon={<Wallet size={20} />} label="Payout and tax" to="/payout" />
          <MenuRow icon={<Bell size={20} />} label="Notifications" to="/notifications" />
          <MenuRow icon={<Settings size={20} />} label="Settings and support" to="/settings" />
          <MenuRow icon={<BadgeCheck size={20} />} label="Referral agent agreement" to="/agreement" />
        </Card>
      </div>
    </div>
  );
}
