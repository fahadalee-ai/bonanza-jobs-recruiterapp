import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, PageHeader, PrimaryButton, TextField, useGuard } from "@/components/ui-app";

export const Route = createFileRoute("/payout")({
  component: PayoutSettings,
});

function PayoutSettings() {
  const app = useGuard();
  const user = app.user;
  const [address, setAddress] = useState(user?.address ?? "");
  const [bank, setBank] = useState("");
  const [last4, setLast4] = useState("");
  if (!user) return <div className="min-h-dvh bg-background" />;

  return (
    <div className="min-h-dvh bg-background pb-8">
      <PageHeader title="Payout and tax" fallback="/profile" />
      <div className="space-y-3 px-4">
        <Card>
          <h2 className="text-lg font-semibold text-heading">Payout methods</h2>
          <div className="mt-3 space-y-3">
            {user.payoutMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{method.label}</p>
                  <p className="text-[13px] text-muted-foreground">{method.detail}</p>
                </div>
                <span className={`text-[12px] font-semibold ${method.verified ? "text-[#166534]" : "text-[#B45309]"}`}>
                  {method.verified ? "Verified" : "Not verified"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <TextField label="Bank" value={bank} onChange={(event) => setBank(event.target.value)} />
            <TextField label="Last 4" value={last4} onChange={(event) => setLast4(event.target.value.replace(/\D/g, "").slice(0, 4))} />
          </div>
          <PrimaryButton
            className="w-full"
            onClick={() => {
              if (last4.length < 4) return app.pushToast("Enter the last 4 digits");
              app.updateUser({
                payoutMethods: [
                  ...user.payoutMethods,
                  { id: `pm-${Date.now()}`, kind: "ach", label: bank || "Bank account", detail: `Checking ****${last4}`, verified: false },
                ],
              });
              setBank("");
              setLast4("");
              app.pushToast("Payout method added", "We’ll verify it before you can withdraw.");
            }}
          >
            Add bank account
          </PrimaryButton>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">Tax documents</h2>
          <p className="mt-2 text-[15px]">W-9 · {user.w9Status}</p>
          <p className="text-[13px] text-muted-foreground">{user.w9Name || "No file on record"} · SSN/EIN •••-••-{user.taxLast4 || "----"}</p>
          <label className="mt-3 block text-[13px] font-medium">
            Upload or replace W-9
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="mt-2 block w-full text-sm"
              onChange={(event) => {
                const name = event.target.files?.[0]?.name;
                if (!name) return;
                app.updateUser({ w9Status: "On file", w9Name: name });
                app.pushToast("W-9 updated");
              }}
            />
          </label>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-heading">1099 downloads</h2>
          {["2025", "2024"].map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => {
                const blob = new Blob([`Bonanza Jobs 1099-NEC ${year}\nAgent ${user.firstName} ${user.lastName}\nTIN •••-••-${user.taxLast4}\n`], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `Bonanza-1099-${year}.txt`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="mt-2 flex h-12 w-full items-center justify-between text-[15px] font-medium"
            >
              Form 1099-NEC {year}
              <span className="text-[#0FAEE5]">Download</span>
            </button>
          ))}
        </Card>
        <Card>
          <TextField label="Mailing address" value={address} onChange={(event) => setAddress(event.target.value)} />
          <PrimaryButton className="w-full" onClick={() => { app.updateUser({ address }); app.pushToast("Address saved"); }}>
            Save address
          </PrimaryButton>
        </Card>
      </div>
    </div>
  );
}
