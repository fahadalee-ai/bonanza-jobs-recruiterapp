import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { INDUSTRIES, type SignupDraft } from "@/lib/agent-data";
import { StepProgress } from "@/components/agent-ui";
import { Logo } from "@/components/brand";
import { AuthCanvas, PasswordChecklist, PasswordField, PrimaryButton, SecondaryButton, TextArea, TextField } from "@/components/ui-app";
import { formatPhone } from "@/lib/format";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

const empty: SignupDraft = {
  name: "",
  email: "",
  phone: "",
  password: "",
  years: "5",
  industries: [],
  specialties: "",
  linkedin: "",
  bio: "",
  payout: "ach",
  bankName: "Bank of America",
  accountLast4: "",
  paypalEmail: "",
  taxLast4: "",
  w9Name: "",
  agreed: false,
};

function Signup() {
  const { beginSignup } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<SignupDraft>(empty);
  const [confirm, setConfirm] = useState("");
  const [tax, setTax] = useState("");
  const patch = (partial: Partial<SignupDraft>) => setDraft((current) => ({ ...current, ...partial }));

  const next = () => {
    if (step === 4) {
      beginSignup(draft);
      navigate({ to: "/verify", search: { mode: "signup" } });
      return;
    }
    setStep((value) => value + 1);
  };

  return (
    <AuthCanvas>
      <Logo variant="white" height={72} />
      <h1 className="mt-6 text-[28px] font-semibold leading-8 text-white">Referral agent application</h1>
      <p className="mt-2 text-[15px] leading-6 text-white/85">Create your account, then add payout and tax details.</p>
      <div className="mt-6 rounded-3xl bg-white p-4 text-foreground shadow-[0_16px_40px_rgba(15,11,42,0.22)]">
      <StepProgress step={step} total={4} />
      {step === 1 && (
        <>
          <TextField label="Full name" value={draft.name} onChange={(event) => patch({ name: event.target.value })} placeholder="Avery Lang" />
          <TextField label="Email" type="email" value={draft.email} onChange={(event) => patch({ email: event.target.value })} placeholder="you@email.com" />
          <TextField
            label="Mobile"
            inputMode="tel"
            value={draft.phone}
            onChange={(event) => patch({ phone: formatPhone(event.target.value) })}
            placeholder="(512) 555-0198"
            hint="US numbers only, +1"
          />
          <PasswordField label="Password" value={draft.password} onChange={(event) => patch({ password: event.target.value })} />
          <PasswordChecklist password={draft.password} />
          <PasswordField label="Confirm password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
        </>
      )}
      {step === 2 && (
        <>
          <label className="mb-4 block">
            <span className="mb-1.5 block text-[13px] font-medium">Recruiting experience</span>
            <select value={draft.years} onChange={(event) => patch({ years: event.target.value })} className="h-[52px] w-full rounded-[12px] border border-border bg-card px-3.5">
              {["1", "3", "5", "8", "10", "15"].map((year) => (
                <option key={year} value={year}>
                  {year} years
                </option>
              ))}
            </select>
          </label>
          <p className="mb-2 text-[13px] font-medium">Industries</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {INDUSTRIES.map((industry) => {
              const on = draft.industries.includes(industry);
              return (
                <button
                  key={industry}
                  type="button"
                  onClick={() =>
                    patch({
                      industries: on ? draft.industries.filter((item) => item !== industry) : [...draft.industries, industry],
                    })
                  }
                  className={`h-9 rounded-full px-3 text-[13px] font-semibold ${on ? "bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5] text-white" : "border border-border bg-card"}`}
                >
                  {industry}
                </button>
              );
            })}
          </div>
          <TextField label="Specialties" value={draft.specialties} onChange={(event) => patch({ specialties: event.target.value })} placeholder="Product design, clinical ops" />
          <TextField label="LinkedIn URL" value={draft.linkedin} onChange={(event) => patch({ linkedin: event.target.value })} placeholder="https://www.linkedin.com/in/you" />
          <TextArea label="Short bio" value={draft.bio} onChange={(event) => patch({ bio: event.target.value })} placeholder="How you recruit and who you place." />
        </>
      )}
      {step === 3 && (
        <>
          <p className="mb-2 text-[13px] font-medium">Payout method</p>
          <div className="mb-4 grid grid-cols-2 gap-2">
            {(
              [
                ["ach", "Bank ACH"],
                ["paypal", "PayPal"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => patch({ payout: id })}
                className={`h-[52px] rounded-[14px] text-[15px] font-semibold ${draft.payout === id ? "bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5] text-white" : "border border-border bg-card"}`}
              >
                {label}
              </button>
            ))}
          </div>
          {draft.payout === "ach" ? (
            <>
              <TextField label="Bank name" value={draft.bankName} onChange={(event) => patch({ bankName: event.target.value })} />
              <TextField label="Account last 4" inputMode="numeric" value={draft.accountLast4} onChange={(event) => patch({ accountLast4: event.target.value.replace(/\D/g, "").slice(0, 4) })} />
            </>
          ) : (
            <TextField label="PayPal email" value={draft.paypalEmail} onChange={(event) => patch({ paypalEmail: event.target.value })} />
          )}
          <TextField
            label="SSN or EIN"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={tax}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "").slice(0, 9);
              setTax(digits);
              patch({ taxLast4: digits.slice(-4) });
            }}
            hint={tax.length >= 4 ? `Only the last 4 (${tax.slice(-4)}) is saved. Used for 1099 reporting.` : "Masked. Used only for 1099 reporting."}
          />
          <label className="mb-4 block">
            <span className="mb-1.5 block text-[13px] font-medium">W-9</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              onChange={(event) => patch({ w9Name: event.target.files?.[0]?.name ?? "" })}
              className="block w-full text-sm"
            />
            {draft.w9Name && <span className="mt-1 block text-xs text-success">{draft.w9Name} attached</span>}
          </label>
        </>
      )}
      {step === 4 && (
        <div>
          <p className="text-[15px] leading-6 text-muted-foreground">
            You confirm the people you refer have agreed to be introduced, that fee amounts are split across offer acceptance and 90-day retention, and that payouts require a verified method plus a W-9.
          </p>
          <label className="mt-4 flex items-start gap-3 text-[15px]">
            <input type="checkbox" checked={draft.agreed} onChange={(event) => patch({ agreed: event.target.checked })} className="mt-1 h-5 w-5 accent-[#7A22C8]" />
            <span>
              I agree to the <Link to="/agreement" className="font-semibold text-[#7A22C8]">Referral Agent Agreement</Link> and{" "}
              <Link to="/privacy" className="font-semibold text-[#7A22C8]">Privacy Policy</Link>.
            </span>
          </label>
        </div>
      )}
      <div className="mt-2 flex gap-3">
        {step > 1 && (
          <SecondaryButton className="flex-1" onClick={() => setStep((value) => value - 1)}>
            Back
          </SecondaryButton>
        )}
        <PrimaryButton className="flex-1" onClick={next}>
          {step === 4 ? "Submit application" : "Continue"}
        </PrimaryButton>
      </div>
      </div>
    </AuthCanvas>
  );
}
