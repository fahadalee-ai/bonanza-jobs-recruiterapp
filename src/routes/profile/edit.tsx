import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { INDUSTRIES } from "@/lib/agent-data";
import { PageHeader, PrimaryButton, StickyBar, TextArea, TextField, useGuard } from "@/components/ui-app";
import { haptic } from "@/lib/format";

export const Route = createFileRoute("/profile/edit")({
  component: EditProfile,
});

function EditProfile() {
  const app = useGuard();
  const navigate = useNavigate();
  const user = app.user;
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [headline, setHeadline] = useState(user?.headline ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [state, setState] = useState(user?.state ?? "");
  const [linkedin, setLinkedin] = useState(user?.linkedin ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [industries, setIndustries] = useState(user?.industries ?? []);
  const [specialties, setSpecialties] = useState(user?.specialties.join(", ") ?? "");

  if (!user) return <div className="min-h-dvh bg-background" />;

  return (
    <div className="min-h-dvh bg-background pb-28">
      <PageHeader title="Edit profile" fallback="/profile" />
      <div className="px-4">
        <div className="grid grid-cols-2 gap-3">
          <TextField label="First name" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          <TextField label="Last name" value={lastName} onChange={(event) => setLastName(event.target.value)} />
        </div>
        <TextField label="Headline" value={headline} onChange={(event) => setHeadline(event.target.value)} />
        <TextField label="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="City" value={city} onChange={(event) => setCity(event.target.value)} />
          <TextField label="State" value={state} onChange={(event) => setState(event.target.value)} />
        </div>
        <p className="mb-2 text-[13px] font-medium">Industries</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {INDUSTRIES.map((industry) => {
            const on = industries.includes(industry);
            return (
              <button key={industry} type="button" onClick={() => setIndustries((current) => on ? current.filter((item) => item !== industry) : [...current, industry])} className={`h-9 rounded-full px-3 text-[13px] font-semibold ${on ? "bg-gradient-to-r from-[#7A22C8] to-[#0FAEE5] text-white" : "border border-border bg-card"}`}>
                {industry}
              </button>
            );
          })}
        </div>
        <TextField label="Specialties" value={specialties} onChange={(event) => setSpecialties(event.target.value)} hint="Separate with commas" />
        <TextField label="LinkedIn" value={linkedin} onChange={(event) => setLinkedin(event.target.value)} />
        <TextArea label="Bio" value={bio} onChange={(event) => setBio(event.target.value)} />
      </div>
      <StickyBar>
        <PrimaryButton
          className="w-full"
          onClick={() => {
            app.updateUser({
              firstName,
              lastName,
              phone,
              headline,
              city,
              state,
              linkedin,
              bio,
              industries,
              specialties: specialties.split(",").map((item) => item.trim()).filter(Boolean),
            });
            haptic();
            app.pushToast("Profile saved");
            navigate({ to: "/profile" });
          }}
        >
          Save
        </PrimaryButton>
      </StickyBar>
    </div>
  );
}
