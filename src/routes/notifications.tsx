import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { EmptyState, PageHeader, useGuard } from "@/components/ui-app";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const app = useGuard();
  const navigate = useNavigate();
  const startX = useRef(0);
  if (!app.user) return <div className="min-h-dvh bg-background" />;
  const groups = ["Today", "Earlier"] as const;

  return (
    <div className="min-h-dvh bg-background pb-8">
      <PageHeader
        title="Notifications"
        fallback="/profile"
        right={<button type="button" onClick={() => app.markAllRead()} className="text-sm font-semibold text-[#0FAEE5]">Mark all read</button>}
      />
      <div className="space-y-4 px-4">
        {app.notifications.length === 0 && <EmptyState title="No notifications" body="Status changes, milestone alerts, and payout updates will land here." />}
        {groups.map((group) => {
          const items = app.notifications.filter((item) => item.group === group);
          if (!items.length) return null;
          return (
            <section key={group}>
              <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">{group}</h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-[16px]">
                    <button
                      type="button"
                      onTouchStart={(event) => {
                        startX.current = event.touches[0]?.clientX ?? 0;
                      }}
                      onTouchEnd={(event) => {
                        const end = event.changedTouches[0]?.clientX ?? startX.current;
                        if (startX.current - end > 70) app.removeNotification(item.id);
                      }}
                      onClick={() => {
                        app.markRead(item.id);
                        if (item.href.startsWith("/referrals/")) {
                          const id = item.href.split("/")[2] ?? "";
                          if (item.href.includes("timeline")) navigate({ to: "/referrals/$referralId/timeline", params: { referralId: id } });
                          else if (item.href.includes("milestones")) navigate({ to: "/referrals/$referralId/milestones", params: { referralId: id } });
                          else navigate({ to: "/referrals/$referralId", params: { referralId: id } });
                        } else if (item.href.startsWith("/payments/")) {
                          navigate({ to: "/payments/$paymentId", params: { paymentId: item.href.split("/")[2] ?? "" } });
                        } else if (item.href.startsWith("/jobs/")) {
                          navigate({ to: "/jobs/$jobId", params: { jobId: item.href.split("/")[2] ?? "" } });
                        }
                      }}
                      className={`w-full bg-card p-4 text-left shadow-[0_4px_16px_rgba(27,27,47,0.06)] ${item.read ? "opacity-70" : ""}`}
                    >
                      <p className="font-semibold text-heading">{item.title}</p>
                      <p className="mt-1 text-[14px] leading-5 text-muted-foreground">{item.body}</p>
                      <p className="mt-1 text-[12px] text-muted-foreground">{item.time}</p>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
