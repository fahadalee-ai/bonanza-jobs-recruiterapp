import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { BADGES, REVIEWS, isHire } from "@/lib/agent-data";
import { Card, PageHeader, useGuard } from "@/components/ui-app";

export const Route = createFileRoute("/reputation")({
  component: ReputationPage,
});

function ReputationPage() {
  const app = useGuard();
  const user = app.user;
  if (!user) return <div className="min-h-dvh bg-background" />;
  const mine = app.referrals.filter((item) => item.userId === user.id);
  const hires = mine.filter((item) => isHire(item.status)).length;
  const showHistory = user.id === "a1";

  return (
    <div className="min-h-dvh bg-background pb-8">
      <PageHeader title="Reputation" fallback="/profile" />
      <div className="space-y-3 px-4">
        <Card className="text-center">
          <p className="text-[40px] font-bold leading-none text-heading">{(user.rating || 0).toFixed(1)}</p>
          <div className="mt-2 flex justify-center gap-1 text-[#F5B301]">
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} size={18} className={index < Math.round(user.rating) ? "fill-[#F5B301]" : ""} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-[13px]">
            <Stat label="Placement" value={`${user.placementRate}%`} />
            <Stat label="Referrals" value={String(mine.length)} />
            <Stat label="Hires" value={String(hires)} />
          </div>
          <p className="mt-3 text-[13px] text-muted-foreground">Average time to hire · {user.avgDaysToHire || 0} days</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-heading">{user.level}</h2>
            <span className="text-[13px] font-semibold text-[#7A22C8]">{user.nextLevel}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EEF0F6] dark:bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5]" style={{ width: `${user.levelProgress}%` }} />
          </div>
          <p className="mt-2 text-[13px] text-muted-foreground">{user.levelProgress}% toward {user.nextLevel}. Gold unlocks priority requisitions and a $25 minimum payout.</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">Badges</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(showHistory ? BADGES : ["New Agent"]).map((badge) => (
              <span key={badge} className="rounded-full bg-[#F3E8FF] px-3 py-1 text-[12px] font-semibold text-[#6B21A8] dark:bg-[#7A22C8]/25 dark:text-[#E9D5FF]">{badge}</span>
            ))}
          </div>
        </Card>
        <h2 className="pt-2 text-lg font-semibold text-heading">Employer reviews</h2>
        {(showHistory ? REVIEWS : []).map((review) => (
          <Card key={review.id}>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-heading">{review.employer}</p>
              <span className="text-[13px] font-semibold text-[#8A6500]">{review.rating}.0</span>
            </div>
            <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{review.comment}</p>
            <p className="mt-2 text-[12px] text-muted-foreground">{review.date}</p>
          </Card>
        ))}
        {!showHistory && <Card><p className="text-[14px] text-muted-foreground">Reviews appear after your first completed hire.</p></Card>}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[18px] font-bold text-heading">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}
