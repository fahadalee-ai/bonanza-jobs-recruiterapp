import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EmployerMark, FeeChip, StepProgress } from "@/components/agent-ui";
import { Card, PrimaryButton, SecondaryButton, StickyBar, TextArea, TextField, useGuard } from "@/components/ui-app";
import { DIRECTORY, SKILL_SUGGESTIONS, feeSplit, type ReferralType } from "@/lib/agent-data";
import { formatPhone, haptic, usd } from "@/lib/format";
import { SuccessMark } from "@/components/ui-app";

export const Route = createFileRoute("/refer")({
  validateSearch: (search: Record<string, unknown>) => ({
    job: typeof search.job === "string" ? search.job : "",
  }),
  component: ReferFlow,
});

const TYPES: { id: ReferralType; label: string }[] = [
  { id: "Existing Candidate", label: "On Bonanza" },
  { id: "New Candidate", label: "New" },
  { id: "Passive Candidate", label: "Passive" },
];

function ReferFlow() {
  const app = useGuard();
  const { job: preset } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [jobId, setJobId] = useState(preset);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ReferralType>("New Candidate");
  const [lookup, setLookup] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    employer: "",
    title: "",
    linkedin: "",
    photo: "",
  });
  const [resumeName, setResumeName] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillQuery, setSkillQuery] = useState("");
  const [years, setYears] = useState("5 years");
  const [education, setEducation] = useState("Bachelor’s");
  const [availability, setAvailability] = useState("2 weeks");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ id: string; code: string } | null>(null);
  const [duplicate, setDuplicate] = useState(false);

  const job = app.jobs.find((item) => item.id === jobId);
  const jobs = useMemo(
    () => app.jobs.filter((item) => `${item.title} ${item.company} ${item.location}`.toLowerCase().includes(query.toLowerCase())),
    [app.jobs, query],
  );
  const suggestions = SKILL_SUGGESTIONS.filter((skill) => skill.toLowerCase().includes(skillQuery.toLowerCase()) && !skills.includes(skill));

  if (!app.user) return <div className="min-h-dvh bg-background" />;

  const patch = (partial: Partial<typeof form>) => setForm((current) => ({ ...current, ...partial }));

  const goNext = () => {
    setError("");
    if (step === 1 && !job) return setError("Select a requisition.");
    if (step === 2) {
      if (!form.firstName || !form.lastName || !form.email.includes("@") || form.phone.replace(/\D/g, "").length < 10 || !form.city) {
        return setError("Complete the candidate’s name, email, phone, and city.");
      }
    }
    if (step === 3 && !resumeName) return setError("Upload a resume to continue.");
    if (step === 4 && (recommendation.trim().length < 100 || recommendation.trim().length > 1000)) {
      return setError("Recommendation must be 100 to 1,000 characters.");
    }
    setStep((value) => value + 1);
  };

  const submit = () => {
    if (!job) return;
    const response = app.submitReferral({
      jobId: job.id,
      type,
      candidate: form,
      resumeName,
      skills,
      years,
      education,
      availability,
      expectedSalary,
      recommendation: recommendation.trim(),
      consent,
    });
    if (!response.ok) {
      setDuplicate(true);
      return;
    }
    haptic();
    setResult({ id: response.id, code: response.code });
  };

  if (result) {
    return (
      <div className="flex min-h-dvh flex-col items-center bg-background px-5 pb-32 pt-16 text-center">
        <SuccessMark />
        <h1 className="mt-5 text-2xl font-semibold text-heading">Referral submitted</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">Referral ID</p>
        <p className="text-lg font-semibold text-[#7A22C8]">{result.code}</p>
        <div className="mt-8 w-full space-y-3">
          <PrimaryButton className="w-full" onClick={() => navigate({ to: "/referrals/$referralId", params: { referralId: result.id } })}>
            View Referral
          </PrimaryButton>
          <SecondaryButton
            className="w-full"
            onClick={() => {
              setResult(null);
              setStep(1);
              setJobId("");
              setRecommendation("");
              setResumeName("");
            }}
          >
            Refer Another
          </SecondaryButton>
        </div>
      </div>
    );
  }

  if (duplicate) {
    return (
      <div className="min-h-dvh bg-background px-5 pb-28 pt-16">
        <h1 className="text-2xl font-semibold text-heading">Duplicate referral</h1>
        <p className="mt-3 text-[15px] leading-6 text-muted-foreground">
          This candidate is already referred to {job?.title}. Open the existing referral instead of sending another.
        </p>
        <PrimaryButton className="mt-6 w-full" onClick={() => navigate({ to: "/referrals" })}>
          My Referrals
        </PrimaryButton>
        <SecondaryButton className="mt-3 w-full" onClick={() => setDuplicate(false)}>
          Back to review
        </SecondaryButton>
      </div>
    );
  }

  const split = job ? feeSplit(job.fee) : { m1: 0, m2: 0 };

  return (
    <div className="min-h-dvh bg-background px-4 pb-44 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <p className="text-[12px] font-semibold text-[#7A22C8]">Refer a candidate</p>
      <h1 className="text-2xl font-semibold text-heading">
        {["Select a job", "Candidate information", "Resume and skills", "Recommendation", "Review and submit"][step - 1]}
      </h1>
      <div className="mt-4">
        <StepProgress step={step} total={5} />
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <TextField label="Search requisitions" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, employer, city" />
          {jobs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setJobId(item.id)}
              className={`w-full rounded-[16px] bg-card p-4 text-left shadow-[0_4px_16px_rgba(27,27,47,0.06)] ${jobId === item.id ? "ring-2 ring-[#7A22C8]" : ""}`}
            >
              <div className="flex items-center gap-3">
                <EmployerMark name={item.company} />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-heading">{item.title}</span>
                  <span className="block text-[13px] text-muted-foreground">{item.company} · {item.location}</span>
                </span>
                <FeeChip amount={item.fee} />
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 2 && job && (
        <div>
          <div className="mb-4 grid grid-cols-3 gap-1 rounded-[12px] bg-[#EEF0F6] p-1 dark:bg-white/10">
            {TYPES.map((item) => (
              <button key={item.id} type="button" onClick={() => setType(item.id)} className={`min-h-11 rounded-[10px] px-1 text-[12px] font-semibold ${type === item.id ? "bg-card text-[#7A22C8] shadow-sm" : "text-muted-foreground"}`}>
                {item.label}
              </button>
            ))}
          </div>
          <p className="mb-3 text-[12px] text-muted-foreground">
            {type === "Existing Candidate" ? "Search by email to link a Bonanza profile." : type === "Passive Candidate" ? "Someone not actively applying." : "A candidate who is new to Bonanza."}
          </p>
          {type === "Existing Candidate" && (
            <div className="mb-3 flex gap-2">
              <input value={lookup} onChange={(event) => setLookup(event.target.value)} placeholder="elena.ortiz@email.com" className="h-[52px] flex-1 rounded-[12px] border border-border bg-card px-3" />
              <SecondaryButton
                onClick={() => {
                  const found = DIRECTORY.find((item) => item.email.toLowerCase() === lookup.trim().toLowerCase());
                  if (!found) return setError("No Bonanza profile uses that email.");
                  setForm(found);
                  setError("");
                }}
              >
                Link
              </SecondaryButton>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <TextField label="First name" value={form.firstName} onChange={(event) => patch({ firstName: event.target.value })} />
            <TextField label="Last name" value={form.lastName} onChange={(event) => patch({ lastName: event.target.value })} />
          </div>
          <TextField label="Email" type="email" value={form.email} onChange={(event) => patch({ email: event.target.value })} />
          <TextField label="Phone" value={form.phone} onChange={(event) => patch({ phone: formatPhone(event.target.value) })} placeholder="(512) 555-0100" />
          <TextField label="City / State" value={form.city} onChange={(event) => patch({ city: event.target.value })} placeholder="Austin, TX" />
          <TextField label="Current employer" value={form.employer} onChange={(event) => patch({ employer: event.target.value })} />
          <TextField label="Current title" value={form.title} onChange={(event) => patch({ title: event.target.value })} />
          <TextField label="LinkedIn URL" value={form.linkedin} onChange={(event) => patch({ linkedin: event.target.value })} />
          <TextField label="Employer" value={job.company} readOnly />
        </div>
      )}

      {step === 3 && (
        <div>
          <label className="mb-4 block rounded-[16px] border border-dashed border-[#7A22C8] bg-card p-4">
            <span className="block text-[15px] font-semibold text-heading">Resume</span>
            <span className="mt-1 block text-[13px] text-muted-foreground">PDF, DOC, or DOCX. 5 MB max.</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf"
              className="mt-3 block w-full text-sm"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) {
                  setResumeName("");
                  setResumeError("That file is over 5 MB.");
                  return;
                }
                if (file.name.toLowerCase().includes("fail")) {
                  setResumeName("");
                  setResumeError("Upload failed. Try the file again.");
                  return;
                }
                setResumeError("");
                setResumeName(file.name);
              }}
            />
            {resumeName && (
              <span className="mt-3 block rounded-xl bg-[#F6F7FB] p-3 text-[13px] dark:bg-white/5">
                Preview ready · {resumeName}
              </span>
            )}
            {resumeError && <span className="mt-2 block text-[13px] font-medium text-danger">{resumeError}</span>}
          </label>
          <TextField label="Find a skill" value={skillQuery} onChange={(event) => setSkillQuery(event.target.value)} />
          <div className="mb-4 flex flex-wrap gap-2">
            {suggestions.slice(0, 6).map((skill) => (
              <button key={skill} type="button" onClick={() => setSkills((current) => [...current, skill])} className="h-9 rounded-full border border-border px-3 text-[13px] font-semibold">
                {skill}
              </button>
            ))}
            {skills.map((skill) => (
              <button key={skill} type="button" onClick={() => setSkills((current) => current.filter((item) => item !== skill))} className="h-9 rounded-full bg-[#F3E8FF] px-3 text-[13px] font-semibold text-[#6B21A8]">
                {skill} ×
              </button>
            ))}
          </div>
          <label className="mb-4 block">
            <span className="mb-1.5 block text-[13px] font-medium">Years of experience</span>
            <select value={years} onChange={(event) => setYears(event.target.value)} className="h-[52px] w-full rounded-[12px] border border-border bg-card px-3">
              {["0–1 years", "2–4 years", "5 years", "8 years", "11–15 years", "15+ years"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="mb-4 block">
            <span className="mb-1.5 block text-[13px] font-medium">Education</span>
            <select value={education} onChange={(event) => setEducation(event.target.value)} className="h-[52px] w-full rounded-[12px] border border-border bg-card px-3">
              {["High school", "Associate", "Bachelor’s", "Master’s", "Doctorate"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="mb-4 block">
            <span className="mb-1.5 block text-[13px] font-medium">Availability</span>
            <select value={availability} onChange={(event) => setAvailability(event.target.value)} className="h-[52px] w-full rounded-[12px] border border-border bg-card px-3">
              {["Immediate", "2 weeks", "30 days", "60 days"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <TextField label="Expected salary" value={expectedSalary} onChange={(event) => setExpectedSalary(event.target.value)} placeholder="$160,000" />
        </div>
      )}

      {step === 4 && (
        <div>
          <TextArea label="Why is this candidate a great fit?" value={recommendation} maxLength={1000} onChange={(event) => setRecommendation(event.target.value)} />
          <p className={`-mt-2 mb-4 text-[12px] ${recommendation.trim().length < 100 ? "text-danger" : "text-muted-foreground"}`}>
            {recommendation.trim().length} / 1,000 · minimum 100
          </p>
          <Card>
            <p className="text-[13px] font-semibold text-heading">Helper tips</p>
            <p className="mt-1 text-[13px] leading-5 text-muted-foreground">Name the skills that match the requisition, one measurable achievement, and why the culture fit is real.</p>
          </Card>
          <label className="mt-4 flex items-start gap-3 text-[15px]">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-5 w-5 accent-[#7A22C8]" />
            Candidate has agreed to this referral
          </label>
        </div>
      )}

      {step === 5 && job && (
        <div className="space-y-3">
          <Summary title="Job" body={`${job.title} · ${job.company}`} onEdit={() => setStep(1)} />
          <Summary title="Candidate" body={`${form.firstName} ${form.lastName} · ${form.email} · ${type}`} onEdit={() => setStep(2)} />
          <Summary title="Resume" body={`${resumeName || "None"} · ${skills.join(", ") || "No skills"}`} onEdit={() => setStep(3)} />
          <Summary title="Recommendation" body={recommendation} onEdit={() => setStep(4)} />
          <Card className="bg-gradient-to-br from-[#2B1F6E] to-[#7A22C8] text-white">
            <p className="text-[13px] text-white/80">Fee preview</p>
            <p className="mt-2 flex justify-between text-[15px]"><span>Milestone 1</span><span className="font-semibold text-[#F5D98A]">{usd(split.m1)}</span></p>
            <p className="mt-1 flex justify-between text-[15px]"><span>Milestone 2</span><span className="font-semibold text-[#86EFAC]">{usd(split.m2)}</span></p>
          </Card>
        </div>
      )}

      {error && <p className="mt-3 text-[13px] font-medium text-danger">{error}</p>}
      <StickyBar aboveTabs>
        {step < 5 ? (
          <PrimaryButton className="w-full" onClick={goNext}>Next</PrimaryButton>
        ) : (
          <PrimaryButton className="w-full" onClick={submit}>Submit Referral</PrimaryButton>
        )}
      </StickyBar>
    </div>
  );
}

function Summary({ title, body, onEdit }: { title: string; body: string; onEdit: () => void }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-semibold text-muted-foreground">{title}</p>
        <button type="button" onClick={onEdit} className="text-[13px] font-semibold text-[#0FAEE5]">Edit</button>
      </div>
      <p className="mt-1 text-[15px] leading-6 text-heading">{body}</p>
    </Card>
  );
}
