import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, FileText, Globe, LifeBuoy, Lock, LogOut, Moon, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import { MenuRow } from "@/components/agent-ui";
import { Card, ConfirmDialog, PageHeader, PasswordField, PrimaryButton, Toggle, useGuard } from "@/components/ui-app";
import type { ThemeMode } from "@/lib/agent-data";
import { strengthOk } from "@/components/ui-app";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const app = useGuard();
  const navigate = useNavigate();
  const user = app.user;
  const [password, setPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  if (!user) return <div className="min-h-dvh bg-background" />;
  const prefs = user.notifPrefs;

  return (
    <div className="min-h-dvh bg-background pb-10">
      <PageHeader title="Settings" fallback="/profile" />
      <div className="space-y-3 px-4">
        <Card>
          <p className="mb-1 text-[13px] font-semibold text-muted-foreground">Notification preferences</p>
          <Toggle checked={prefs.status} onChange={(status) => app.updateUser({ notifPrefs: { ...prefs, status } })} label="Referral status" />
          <Toggle checked={prefs.milestones} onChange={(milestones) => app.updateUser({ notifPrefs: { ...prefs, milestones } })} label="Milestones and retention" />
          <Toggle checked={prefs.payouts} onChange={(payouts) => app.updateUser({ notifPrefs: { ...prefs, payouts } })} label="Payouts" />
          <Toggle checked={prefs.jobs} onChange={(jobs) => app.updateUser({ notifPrefs: { ...prefs, jobs } })} label="New matching jobs" />
          <Toggle checked={prefs.feedback} onChange={(feedback) => app.updateUser({ notifPrefs: { ...prefs, feedback } })} label="Employer feedback" />
        </Card>
        <Card>
          <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-muted-foreground"><Lock size={16} /> Security</p>
          <PasswordField label="New password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <PrimaryButton
            className="mb-3 w-full"
            onClick={() => {
              if (!strengthOk(password)) return app.pushToast("Password needs 8 characters, upper, lower, and a number");
              app.updateUser({ password });
              setPassword("");
              app.pushToast("Password updated");
            }}
          >
            Update password
          </PrimaryButton>
          <Toggle checked={user.biometric} onChange={(biometric) => app.updateUser({ biometric })} label="Face ID / biometrics" />
          <Toggle checked={user.twoFactor} onChange={(twoFactor) => app.updateUser({ twoFactor })} label="Two-factor authentication" hint="Codes go to your mobile number" />
        </Card>
        <Card>
          <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-muted-foreground"><Moon size={16} /> Appearance</p>
          <div className="grid grid-cols-3 gap-2">
            {(["light", "dark", "system"] as ThemeMode[]).map((mode) => (
              <button key={mode} type="button" onClick={() => app.setTheme(mode)} className={`h-11 rounded-[12px] text-[13px] font-semibold capitalize ${app.theme === mode ? "bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5] text-white" : "border border-border"}`}>
                {mode}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-muted-foreground">Dark mode is tuned for Dashboard, Earnings, and Milestone tracking.</p>
        </Card>
        <Card>
          <p className="mb-1 flex items-center gap-2 text-[13px] font-semibold text-muted-foreground"><Globe size={16} /> Language</p>
          <p className="text-[15px] font-medium">English (US)</p>
        </Card>
        <Card>
          <MenuRow icon={<LifeBuoy size={20} />} label="Help Center" to="/help" />
          <MenuRow icon={<Bell size={20} />} label="Contact Support" to="/support" />
          <MenuRow icon={<FileText size={20} />} label="Terms" to="/terms" />
          <MenuRow icon={<Shield size={20} />} label="Privacy" to="/privacy" />
          <MenuRow icon={<FileText size={20} />} label="Referral Agent Agreement" to="/agreement" />
          <MenuRow icon={<LogOut size={20} />} label="Log out" onClick={() => setConfirmLogout(true)} />
          <MenuRow icon={<Trash2 size={20} />} label="Delete account" danger onClick={() => setConfirmDelete(true)} />
        </Card>
      </div>
      <ConfirmDialog open={confirmLogout} title="Log out?" body="You can sign back in with your email and password." confirmLabel="Log out" onClose={() => setConfirmLogout(false)} onConfirm={() => { app.logout(); navigate({ to: "/welcome" }); }} />
      <ConfirmDialog open={confirmDelete} title="Delete account?" body="This removes your agent profile from this device." confirmLabel="Delete" danger onClose={() => setConfirmDelete(false)} onConfirm={() => { app.deleteAccount(); navigate({ to: "/welcome" }); }} />
    </div>
  );
}
