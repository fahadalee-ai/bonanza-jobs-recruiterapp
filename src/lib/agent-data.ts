export const DEMO_EMAIL = "avery.lang@email.com";
export const DEMO_PASSWORD = "Agent1234!";
export const PRIOR_PAID = 26750;

export type ThemeMode = "light" | "dark" | "system";
export type AgentStatus = "active" | "pending" | "rejected" | "suspended";
export type ReferralStatus =
  | "Submitted"
  | "Under Review"
  | "Accepted"
  | "Rejected"
  | "Interview"
  | "Offer"
  | "Hired"
  | "90-Day Retention"
  | "Referral Fee Earned"
  | "Paid";
export type MoneyState = "Pending" | "Eligible" | "Earned" | "Paid" | "At Risk" | "Failed";
export type PaymentStatus = "Pending" | "Processing" | "Paid" | "Failed";
export type ReferralType = "Existing Candidate" | "New Candidate" | "Passive Candidate";
export type JobType = "Full-time" | "Hybrid" | "On-site" | "Contract";

export type PayoutMethod = {
  id: string;
  kind: "ach" | "paypal";
  label: string;
  detail: string;
  verified: boolean;
};

export type Agent = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  photo: string;
  headline: string;
  rating: number;
  memberSince: string;
  level: string;
  nextLevel: string;
  levelProgress: number;
  yearsExperience: number;
  industries: string[];
  specialties: string[];
  linkedin: string;
  bio: string;
  city: string;
  state: string;
  status: AgentStatus;
  rejectionReason: string;
  placementRate: number;
  avgDaysToHire: number;
  payoutMethods: PayoutMethod[];
  w9Status: "On file" | "Missing";
  w9Name: string;
  taxLast4: string;
  address: string;
  biometric: boolean;
  twoFactor: boolean;
  available: number;
  priorPaid: number;
  notifPrefs: {
    status: boolean;
    milestones: boolean;
    payouts: boolean;
    jobs: boolean;
    feedback: boolean;
  };
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  industry: string;
  salary: string;
  fee: number;
  openings: number;
  posted: string;
  description: string;
  requirements: string[];
};

export type Milestone = {
  amount: number;
  state: MoneyState;
  earnedOn?: string;
  paidOn?: string;
  daysLeft?: number;
  start?: string;
  end?: string;
};

export type TimelineEvent = {
  label: string;
  date: string;
  note: string;
  state: "done" | "current" | "future" | "rejected";
};

export type Referral = {
  id: string;
  code: string;
  userId: string;
  jobId: string;
  type: ReferralType;
  status: ReferralStatus;
  submitted: string;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    employer: string;
    title: string;
    linkedin: string;
    photo: string;
  };
  resumeName: string;
  skills: string[];
  years: string;
  education: string;
  availability: string;
  expectedSalary: string;
  recommendation: string;
  consent: boolean;
  m1: Milestone;
  m2: Milestone;
  timeline: TimelineEvent[];
  feedback: string;
  interview?: { date: string; time: string; mode: string };
};

export type Payment = {
  id: string;
  reference: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  expected: string;
  referralId: string;
  candidate: string;
  milestone: "Offer Acceptance" | "90-Day Retention" | "Withdrawal";
  method: string;
  userId: string;
};

export type Notice = {
  id: string;
  group: "Today" | "Earlier";
  title: string;
  body: string;
  time: string;
  read: boolean;
  href: string;
};

export type SignupDraft = {
  name: string;
  email: string;
  phone: string;
  password: string;
  years: string;
  industries: string[];
  specialties: string;
  linkedin: string;
  bio: string;
  payout: "ach" | "paypal";
  bankName: string;
  accountLast4: string;
  paypalEmail: string;
  taxLast4: string;
  w9Name: string;
  agreed: boolean;
};

export type DirectoryCandidate = Referral["candidate"];

const LIFECYCLE: ReferralStatus[] = [
  "Submitted",
  "Under Review",
  "Accepted",
  "Interview",
  "Offer",
  "Hired",
  "90-Day Retention",
  "Referral Fee Earned",
  "Paid",
];

export function buildTimeline(
  status: ReferralStatus,
  dates: Partial<Record<string, string>>,
  notes: Partial<Record<string, string>> = {},
  rejectReason = "",
): TimelineEvent[] {
  if (status === "Rejected") {
    return ["Submitted", "Under Review", "Rejected"].map((label, index) => ({
      label,
      date: dates[label] ?? "",
      note: label === "Rejected" ? rejectReason : (notes[label] ?? ""),
      state: index < 2 ? "done" : "rejected",
    }));
  }
  const current = LIFECYCLE.indexOf(status);
  return LIFECYCLE.map((label, index) => ({
    label,
    date: index <= current ? (dates[label] ?? "") : "",
    note: notes[label] ?? "",
    state: index < current ? "done" : index === current ? "current" : "future",
  }));
}

export const INDUSTRIES = ["Healthcare", "Technology", "Finance", "Media", "Logistics", "Manufacturing"];
export const JOB_TYPES: JobType[] = ["Full-time", "Hybrid", "On-site", "Contract"];
export const SKILL_SUGGESTIONS = [
  "Product Design",
  "Figma",
  "React",
  "TypeScript",
  "Nursing",
  "ICU",
  "Salesforce",
  "SQL",
  "Python",
  "HIPAA",
  "Cybersecurity",
  "Stakeholder Management",
];

export const ONBOARDING = [
  {
    title: "Refer Talent, Earn Rewards",
    body: "Recommend qualified candidates to top US employers and earn referral fees on every successful hire.",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=80",
    alt: "Recruiter on a phone call in a modern workspace",
  },
  {
    title: "Track Every Referral",
    body: "Follow each candidate from submission to hire with real-time status updates.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
    alt: "Professional viewing a dashboard on a tablet",
  },
  {
    title: "Get Paid in Two Milestones",
    body: "Earn at Offer Acceptance and again after 90-Day Retention. Withdraw anytime from your wallet.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
    alt: "Smiling professional looking at a payment notification on a phone",
  },
];

export const EARNINGS_MONTHS = [
  { label: "Nov", amount: 2200 },
  { label: "Dec", amount: 4100 },
  { label: "Jan", amount: 1800 },
  { label: "Feb", amount: 3600 },
  { label: "Mar", amount: 2900 },
  { label: "Apr", amount: 5400 },
  { label: "May", amount: 3100 },
  { label: "Jun", amount: 4700 },
  { label: "Jul", amount: 2600 },
  { label: "Aug", amount: 6250 },
  { label: "Sep", amount: 3900 },
  { label: "Oct", amount: 2100 },
];

export const REVIEWS = [
  {
    id: "rv1",
    employer: "Northstar Health",
    rating: 5,
    comment: "Avery’s candidates show up prepared and stay. Sofia was a smooth hire.",
    date: "Sep 15, 2026",
  },
  {
    id: "rv2",
    employer: "Lumen Financial",
    rating: 4,
    comment: "Strong technical slate. Communication was fast throughout the loop.",
    date: "Aug 2, 2026",
  },
  {
    id: "rv3",
    employer: "Harborview Clinics",
    rating: 5,
    comment: "Reliable healthcare referrals with clear context on each candidate.",
    date: "Jun 18, 2026",
  },
];

export const BADGES = ["Top Referrer", "Quick Responder", "Healthcare Specialist", "90-Day Club"];

export const JOBS: Job[] = [
  {
    id: "j1",
    title: "Senior Product Designer",
    company: "Northstar Health",
    location: "Austin, TX",
    type: "Hybrid",
    industry: "Healthcare",
    salary: "$145,000 – $175,000 / yr",
    fee: 4500,
    openings: 2,
    posted: "2026-10-02",
    description:
      "Northstar Health is hiring a senior product designer to shape the patient scheduling experience used by clinics across Texas. You will partner with clinical ops and engineering in a hybrid Austin studio.",
    requirements: [
      "6+ years of product design for B2B or healthcare software",
      "A portfolio with shipped mobile and web work",
      "Experience facilitating critique with clinicians",
      "Comfort with Figma, design systems, and usability testing",
    ],
  },
  {
    id: "j2",
    title: "Staff Software Engineer",
    company: "Lumen Financial",
    location: "New York, NY",
    type: "Hybrid",
    industry: "Finance",
    salary: "$180,000 – $220,000 / yr",
    fee: 8000,
    openings: 1,
    posted: "2026-09-28",
    description:
      "Lumen Financial is scaling its payments platform and needs a staff engineer who has led TypeScript services in a regulated environment. The team sits in Midtown three days a week.",
    requirements: [
      "8+ years building production backend services",
      "TypeScript, Node, and PostgreSQL",
      "Experience with SOC 2 or banking controls",
      "Track record mentoring senior engineers",
    ],
  },
  {
    id: "j3",
    title: "Registered Nurse",
    company: "Harborview Clinics",
    location: "Seattle, WA",
    type: "Full-time",
    industry: "Healthcare",
    salary: "$95,000 – $120,000 / yr",
    fee: 3000,
    openings: 4,
    posted: "2026-10-04",
    description:
      "Harborview Clinics is adding day-shift RNs for its outpatient specialty network. This is a full-time employed role with benefits, not a travel contract.",
    requirements: [
      "Active Washington RN license",
      "2+ years of outpatient or ICU experience",
      "BLS certification",
      "Comfort with Epic charting",
    ],
  },
  {
    id: "j4",
    title: "Enterprise Account Executive",
    company: "Brightline Media",
    location: "Chicago, IL",
    type: "Full-time",
    industry: "Media",
    salary: "$110,000 – $140,000 / yr + commission",
    fee: 6000,
    openings: 2,
    posted: "2026-09-20",
    description:
      "Brightline Media wants an enterprise seller who can open Fortune 1000 brand budgets. Territory is the Midwest, with a downtown Chicago office.",
    requirements: [
      "5+ years of enterprise media or SaaS sales",
      "Consistent $1M+ annual quota attainment",
      "Salesforce hygiene and forecast discipline",
      "Existing Midwest brand relationships are a plus",
    ],
  },
  {
    id: "j5",
    title: "Data Analyst",
    company: "Pinnacle Logistics",
    location: "Dallas, TX",
    type: "Hybrid",
    industry: "Logistics",
    salary: "$85,000 – $105,000 / yr",
    fee: 2500,
    openings: 1,
    posted: "2026-10-01",
    description:
      "Pinnacle Logistics is hiring an analyst to own on-time delivery reporting for its southern network. Hybrid from the Dallas hub.",
    requirements: [
      "3+ years in analytics or operations research",
      "SQL and a BI tool such as Tableau or Looker",
      "Clear written updates for non-technical leaders",
      "Supply chain exposure is preferred",
    ],
  },
  {
    id: "j6",
    title: "Cybersecurity Analyst",
    company: "Redwood Bank",
    location: "Charlotte, NC",
    type: "On-site",
    industry: "Finance",
    salary: "$120,000 – $150,000 / yr",
    fee: 5000,
    openings: 1,
    posted: "2026-10-06",
    description:
      "Redwood Bank is staffing its detection team. The analyst monitors identity alerts and partners with branch technology on containment. On-site in Charlotte.",
    requirements: [
      "4+ years in SOC or detection engineering",
      "SIEM experience and incident write-ups",
      "Understanding of banking access controls",
      "Willingness to join a rotating on-call",
    ],
  },
];

const photo = {
  avery: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  priya: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  marcus: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  elena: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
  daniel: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  sofia: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80",
  james: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  riley: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
  amira: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  chris: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
  taylor: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
  nina: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
};

export const DIRECTORY: DirectoryCandidate[] = [
  {
    firstName: "Elena",
    lastName: "Ortiz",
    email: "elena.ortiz@email.com",
    phone: "(206) 555-0142",
    city: "Seattle, WA",
    employer: "Cascade Medical Group",
    title: "Registered Nurse",
    linkedin: "https://www.linkedin.com/in/elenaortiz",
    photo: photo.elena,
  },
  {
    firstName: "Nina",
    lastName: "Brooks",
    email: "nina.brooks@email.com",
    phone: "(512) 555-0148",
    city: "Austin, TX",
    employer: "Atlas Digital",
    title: "Product Designer",
    linkedin: "https://www.linkedin.com/in/ninabrooks",
    photo: photo.nina,
  },
];

function half(fee: number) {
  return Math.round((fee / 2) * 100) / 100;
}

export const SEED_AGENT: Agent = {
  id: "a1",
  firstName: "Avery",
  lastName: "Lang",
  email: DEMO_EMAIL,
  phone: "(512) 555-0198",
  password: DEMO_PASSWORD,
  photo: photo.avery,
  headline: "Healthcare and product recruiting",
  rating: 4.8,
  memberSince: "Jan 2024",
  level: "Silver",
  nextLevel: "Gold",
  levelProgress: 72,
  yearsExperience: 8,
  industries: ["Healthcare", "Technology"],
  specialties: ["Product Design", "Clinical Operations"],
  linkedin: "https://www.linkedin.com/in/averylang",
  bio: "Independent referral agent connecting US healthcare and technology employers with vetted candidates. Eight years of recruiting, with extra care for hires who stay through day 90.",
  city: "Austin",
  state: "TX",
  status: "active",
  rejectionReason: "",
  placementRate: 68,
  avgDaysToHire: 24,
  payoutMethods: [
    { id: "pm1", kind: "ach", label: "Bank of America", detail: "Checking ****1234", verified: true },
    { id: "pm2", kind: "paypal", label: "PayPal", detail: "avery.lang@email.com", verified: false },
  ],
  w9Status: "On file",
  w9Name: "W9-Avery-Lang.pdf",
  taxLast4: "4821",
  address: "1200 Congress Ave, Austin, TX 78701",
  biometric: true,
  twoFactor: false,
  available: 8450,
  priorPaid: PRIOR_PAID,
  notifPrefs: { status: true, milestones: true, payouts: true, jobs: true, feedback: true },
};

export const PENDING_AGENT: Agent = {
  ...SEED_AGENT,
  id: "a-pending",
  firstName: "Casey",
  lastName: "Nguyen",
  email: "pending.agent@email.com",
  photo: "",
  headline: "New referral agent",
  rating: 0,
  status: "pending",
  available: 0,
  priorPaid: 0,
  biometric: false,
  w9Status: "On file",
};

export const REJECTED_AGENT: Agent = {
  ...SEED_AGENT,
  id: "a-rejected",
  firstName: "Riley",
  lastName: "Cole",
  email: "rejected.agent@email.com",
  photo: "",
  headline: "",
  rating: 0,
  status: "rejected",
  rejectionReason:
    "We need a completed W-9 and at least one verifiable recruiting reference before this referral agent application can be approved.",
  available: 0,
  priorPaid: 0,
  biometric: false,
  w9Status: "Missing",
  w9Name: "",
};

export const SUSPENDED_AGENT: Agent = {
  ...SEED_AGENT,
  id: "a-suspended",
  firstName: "Jordan",
  lastName: "Pike",
  email: "suspended.agent@email.com",
  status: "suspended",
  available: 0,
  priorPaid: 0,
  biometric: false,
};

const m = (amount: number, state: MoneyState, extra: Partial<Milestone> = {}): Milestone => ({
  amount,
  state,
  ...extra,
});

export const SEED_REFERRALS: Referral[] = [
  {
    id: "r1",
    code: "REF-2026-004812",
    userId: "a1",
    jobId: "j1",
    type: "New Candidate",
    status: "Submitted",
    submitted: "2026-10-06",
    candidate: {
      firstName: "Priya",
      lastName: "Shah",
      email: "priya.shah@email.com",
      phone: "(512) 555-0177",
      city: "Austin, TX",
      employer: "Helio Apps",
      title: "Product Designer",
      linkedin: "https://www.linkedin.com/in/priyashah",
      photo: photo.priya,
    },
    resumeName: "Priya-Shah-Resume.pdf",
    skills: ["Product Design", "Figma", "Healthcare"],
    years: "7 years",
    education: "Bachelor’s",
    availability: "2 weeks",
    expectedSalary: "$160,000",
    recommendation:
      "Priya has shipped patient-facing scheduling tools and presents her work with the same clarity Northstar’s clinical partners expect. She is local to Austin and can start within two weeks.",
    consent: true,
    m1: m(2250, "Pending"),
    m2: m(2250, "Pending"),
    feedback: "",
    timeline: buildTimeline("Submitted", { Submitted: "Oct 6, 2026" }, { Submitted: "Referral received by Northstar Health." }),
  },
  {
    id: "r2",
    code: "REF-2026-004790",
    userId: "a1",
    jobId: "j2",
    type: "Passive Candidate",
    status: "Under Review",
    submitted: "2026-10-03",
    candidate: {
      firstName: "Marcus",
      lastName: "Webb",
      email: "marcus.webb@email.com",
      phone: "(917) 555-0114",
      city: "New York, NY",
      employer: "Harbor Payments",
      title: "Staff Engineer",
      linkedin: "https://www.linkedin.com/in/marcuswebb",
      photo: photo.marcus,
    },
    resumeName: "Marcus-Webb-Resume.pdf",
    skills: ["TypeScript", "PostgreSQL", "Payments"],
    years: "11 years",
    education: "Bachelor’s",
    availability: "30 days",
    expectedSalary: "$210,000",
    recommendation:
      "Marcus leads a payments platform team and has already operated under SOC 2 controls. He is passive, so I confirmed he will take a conversation with Lumen before submitting.",
    consent: true,
    m1: m(4000, "Pending"),
    m2: m(4000, "Pending"),
    feedback: "Recruiter is comparing Marcus with one internal finalist.",
    timeline: buildTimeline(
      "Under Review",
      { Submitted: "Oct 3, 2026", "Under Review": "Oct 4, 2026" },
      { "Under Review": "Lumen Financial opened the packet." },
    ),
  },
  {
    id: "r3",
    code: "REF-2026-004755",
    userId: "a1",
    jobId: "j3",
    type: "Existing Candidate",
    status: "Interview",
    submitted: "2026-09-26",
    candidate: {
      firstName: "Elena",
      lastName: "Ortiz",
      email: "elena.ortiz@email.com",
      phone: "(206) 555-0142",
      city: "Seattle, WA",
      employer: "Cascade Medical Group",
      title: "Registered Nurse",
      linkedin: "https://www.linkedin.com/in/elenaortiz",
      photo: photo.elena,
    },
    resumeName: "Elena-Ortiz-Resume.pdf",
    skills: ["Nursing", "ICU", "Epic"],
    years: "6 years",
    education: "Bachelor’s",
    availability: "Immediate",
    expectedSalary: "$112,000",
    recommendation:
      "Elena is already on Bonanza, licensed in Washington, and has outpatient plus ICU time. Harborview asked for day-shift availability, which she confirmed.",
    consent: true,
    m1: m(1500, "Pending"),
    m2: m(1500, "Pending"),
    feedback: "Hiring manager wants a panel focused on outpatient workflow.",
    interview: { date: "Oct 14, 2026", time: "10:00 AM CT", mode: "Video" },
    timeline: buildTimeline(
      "Interview",
      {
        Submitted: "Sep 26, 2026",
        "Under Review": "Sep 28, 2026",
        Accepted: "Sep 30, 2026",
        Interview: "Oct 14, 2026",
      },
      { Interview: "Tue, Oct 14, 2026 · 10:00 AM CT · Video" },
    ),
  },
  {
    id: "r4",
    code: "REF-2026-004701",
    userId: "a1",
    jobId: "j4",
    type: "New Candidate",
    status: "Offer",
    submitted: "2026-09-18",
    candidate: {
      firstName: "Daniel",
      lastName: "Kim",
      email: "daniel.kim@email.com",
      phone: "(312) 555-0160",
      city: "Chicago, IL",
      employer: "Fieldstone Brands",
      title: "Account Executive",
      linkedin: "https://www.linkedin.com/in/danielkim",
      photo: photo.daniel,
    },
    resumeName: "Daniel-Kim-Resume.pdf",
    skills: ["Salesforce", "Enterprise Sales"],
    years: "8 years",
    education: "Bachelor’s",
    availability: "2 weeks",
    expectedSalary: "$135,000 + commission",
    recommendation:
      "Daniel has cleared a $1.4M media quota for three straight years in the Midwest. Brightline’s open roles match the brands he already calls on.",
    consent: true,
    m1: m(3000, "Eligible"),
    m2: m(3000, "Pending"),
    feedback: "Verbal offer extended. Waiting on Daniel’s written acceptance.",
    timeline: buildTimeline(
      "Offer",
      {
        Submitted: "Sep 18, 2026",
        "Under Review": "Sep 20, 2026",
        Accepted: "Sep 22, 2026",
        Interview: "Sep 29, 2026",
        Offer: "Oct 1, 2026",
      },
      { Offer: "Milestone 1 becomes eligible when Daniel accepts." },
    ),
  },
  {
    id: "r5",
    code: "REF-2026-004640",
    userId: "a1",
    jobId: "j4",
    type: "Passive Candidate",
    status: "Accepted",
    submitted: "2026-09-22",
    candidate: {
      firstName: "Chris",
      lastName: "Patel",
      email: "chris.patel@email.com",
      phone: "(312) 555-0188",
      city: "Chicago, IL",
      employer: "Northline Ads",
      title: "Senior Account Executive",
      linkedin: "https://www.linkedin.com/in/chrispatel",
      photo: photo.chris,
    },
    resumeName: "Chris-Patel-Resume.docx",
    skills: ["Salesforce", "Media Sales"],
    years: "9 years",
    education: "Bachelor’s",
    availability: "30 days",
    expectedSalary: "$140,000 + commission",
    recommendation:
      "Chris is a passive Midwest seller with clean Salesforce history. I flagged that he needs a 30-day notice, which Brightline accepted.",
    consent: true,
    m1: m(3000, "Pending"),
    m2: m(3000, "Pending"),
    feedback: "Accepted for interview scheduling.",
    timeline: buildTimeline(
      "Accepted",
      { Submitted: "Sep 22, 2026", "Under Review": "Sep 24, 2026", Accepted: "Sep 26, 2026" },
      { Accepted: "Brightline will send interview times." },
    ),
  },
  {
    id: "r6",
    code: "REF-2026-004410",
    userId: "a1",
    jobId: "j1",
    type: "New Candidate",
    status: "90-Day Retention",
    submitted: "2026-08-12",
    candidate: {
      firstName: "Sofia",
      lastName: "Nguyen",
      email: "sofia.nguyen@email.com",
      phone: "(512) 555-0133",
      city: "Austin, TX",
      employer: "Northstar Health",
      title: "Senior Product Designer",
      linkedin: "https://www.linkedin.com/in/sofianguyen",
      photo: photo.sofia,
    },
    resumeName: "Sofia-Nguyen-Resume.pdf",
    skills: ["Product Design", "Figma", "HIPAA"],
    years: "8 years",
    education: "Master’s",
    availability: "Immediate",
    expectedSalary: "$168,000",
    recommendation:
      "Sofia’s portfolio is clinic workflow, not generic consumer apps. She accepted Northstar and started on September 10.",
    consent: true,
    m1: m(2250, "Earned", { earnedOn: "Sep 9, 2026" }),
    m2: m(2250, "Pending", { daysLeft: 62, start: "Sep 10, 2026", end: "Dec 9, 2026" }),
    feedback: "Offer accepted. Retention clock started Sep 10, 2026.",
    timeline: buildTimeline(
      "90-Day Retention",
      {
        Submitted: "Aug 12, 2026",
        "Under Review": "Aug 14, 2026",
        Accepted: "Aug 16, 2026",
        Interview: "Aug 25, 2026",
        Offer: "Sep 4, 2026",
        Hired: "Sep 10, 2026",
        "90-Day Retention": "Sep 10, 2026",
      },
      { "90-Day Retention": "62 days remaining. Check date Dec 9, 2026." },
    ),
  },
  {
    id: "r7",
    code: "REF-2026-004288",
    userId: "a1",
    jobId: "j2",
    type: "Existing Candidate",
    status: "Referral Fee Earned",
    submitted: "2026-06-02",
    candidate: {
      firstName: "Amira",
      lastName: "Hassan",
      email: "amira.hassan@email.com",
      phone: "(646) 555-0190",
      city: "New York, NY",
      employer: "Lumen Financial",
      title: "Staff Software Engineer",
      linkedin: "https://www.linkedin.com/in/amirahassan",
      photo: photo.amira,
    },
    resumeName: "Amira-Hassan-Resume.pdf",
    skills: ["TypeScript", "PostgreSQL", "Cybersecurity"],
    years: "10 years",
    education: "Master’s",
    availability: "30 days",
    expectedSalary: "$205,000",
    recommendation:
      "Amira completed 90 days at Lumen. Milestone 1 is paid and Milestone 2 is earned, waiting on the next payout run.",
    consent: true,
    m1: m(4000, "Paid", { earnedOn: "Jul 1, 2026", paidOn: "Jul 8, 2026" }),
    m2: m(4000, "Earned", { earnedOn: "Sep 28, 2026" }),
    feedback: "Retention confirmed by Lumen HR on Sep 28, 2026.",
    timeline: buildTimeline(
      "Referral Fee Earned",
      {
        Submitted: "Jun 2, 2026",
        "Under Review": "Jun 4, 2026",
        Accepted: "Jun 6, 2026",
        Interview: "Jun 16, 2026",
        Offer: "Jun 24, 2026",
        Hired: "Jul 1, 2026",
        "90-Day Retention": "Sep 28, 2026",
        "Referral Fee Earned": "Sep 28, 2026",
      },
      { "Referral Fee Earned": "Milestone 2 earned. Payout is queued." },
    ),
  },
  {
    id: "r8",
    code: "REF-2026-003910",
    userId: "a1",
    jobId: "j1",
    type: "New Candidate",
    status: "Paid",
    submitted: "2026-04-02",
    candidate: {
      firstName: "James",
      lastName: "Carter",
      email: "james.carter@email.com",
      phone: "(512) 555-0104",
      city: "Austin, TX",
      employer: "Northstar Health",
      title: "Senior Product Designer",
      linkedin: "https://www.linkedin.com/in/jamescarter",
      photo: photo.james,
    },
    resumeName: "James-Carter-Resume.pdf",
    skills: ["Product Design", "Figma"],
    years: "9 years",
    education: "Bachelor’s",
    availability: "2 weeks",
    expectedSalary: "$170,000",
    recommendation:
      "James completed both milestones. Offer acceptance and 90-day retention were each paid at $2,250.",
    consent: true,
    m1: m(2250, "Paid", { earnedOn: "May 12, 2026", paidOn: "May 18, 2026" }),
    m2: m(2250, "Paid", { earnedOn: "Aug 10, 2026", paidOn: "Aug 14, 2026" }),
    feedback: "Both milestones paid. Reference PAY-2026-001245 covers Milestone 1.",
    timeline: buildTimeline(
      "Paid",
      {
        Submitted: "Apr 2, 2026",
        "Under Review": "Apr 4, 2026",
        Accepted: "Apr 8, 2026",
        Interview: "Apr 20, 2026",
        Offer: "May 6, 2026",
        Hired: "May 18, 2026",
        "90-Day Retention": "Aug 10, 2026",
        "Referral Fee Earned": "Aug 10, 2026",
        Paid: "Aug 14, 2026",
      },
      { Paid: "Paid in full. PAY-2026-001245 and PAY-2026-001188." },
    ),
  },
  {
    id: "r9",
    code: "REF-2026-004502",
    userId: "a1",
    jobId: "j1",
    type: "New Candidate",
    status: "Rejected",
    submitted: "2026-09-18",
    candidate: {
      firstName: "Riley",
      lastName: "Brooks",
      email: "riley.brooks@email.com",
      phone: "(737) 555-0166",
      city: "Austin, TX",
      employer: "Studio North",
      title: "Product Designer",
      linkedin: "https://www.linkedin.com/in/rileybrooks",
      photo: photo.riley,
    },
    resumeName: "Riley-Brooks-Resume.pdf",
    skills: ["Figma", "Product Design"],
    years: "4 years",
    education: "Bachelor’s",
    availability: "Immediate",
    expectedSalary: "$140,000",
    recommendation:
      "Riley is a strong visual designer. I noted the healthcare gap and still believed the systems work would transfer.",
    consent: true,
    m1: m(2250, "Failed"),
    m2: m(2250, "Failed"),
    feedback: "Rejected — the team needs deeper healthcare product experience.",
    timeline: buildTimeline(
      "Rejected",
      { Submitted: "Sep 18, 2026", "Under Review": "Sep 20, 2026", Rejected: "Sep 22, 2026" },
      {},
      "Not enough healthcare product experience for this requisition.",
    ),
  },
  {
    id: "r10",
    code: "REF-2026-004220",
    userId: "a1",
    jobId: "j5",
    type: "New Candidate",
    status: "90-Day Retention",
    submitted: "2026-07-02",
    candidate: {
      firstName: "Taylor",
      lastName: "Brooks",
      email: "taylor.brooks@email.com",
      phone: "(214) 555-0129",
      city: "Dallas, TX",
      employer: "Pinnacle Logistics",
      title: "Data Analyst",
      linkedin: "https://www.linkedin.com/in/taylorbrooks",
      photo: photo.taylor,
    },
    resumeName: "Taylor-Brooks-Resume.pdf",
    skills: ["SQL", "Python"],
    years: "5 years",
    education: "Bachelor’s",
    availability: "2 weeks",
    expectedSalary: "$98,000",
    recommendation:
      "Taylor has owned on-time reporting for a regional carrier. Pinnacle hired Taylor and Milestone 1 is already paid.",
    consent: true,
    m1: m(1250, "Paid", { earnedOn: "Jul 28, 2026", paidOn: "Aug 4, 2026" }),
    m2: m(1250, "Pending", { daysLeft: 18, start: "Jul 28, 2026", end: "Oct 26, 2026" }),
    feedback: "Retention check is coming up on Oct 26, 2026.",
    timeline: buildTimeline(
      "90-Day Retention",
      {
        Submitted: "Jul 2, 2026",
        "Under Review": "Jul 6, 2026",
        Accepted: "Jul 8, 2026",
        Interview: "Jul 15, 2026",
        Offer: "Jul 22, 2026",
        Hired: "Jul 28, 2026",
        "90-Day Retention": "Jul 28, 2026",
      },
      { "90-Day Retention": "18 days remaining." },
    ),
  },
];

export const SEED_PAYMENTS: Payment[] = [
  {
    id: "p1",
    reference: "PAY-2026-001245",
    amount: 2250,
    status: "Paid",
    date: "2026-05-18",
    expected: "May 18, 2026",
    referralId: "r8",
    candidate: "James Carter",
    milestone: "Offer Acceptance",
    method: "Bank of America ****1234",
    userId: "a1",
  },
  {
    id: "p2",
    reference: "PAY-2026-001188",
    amount: 2250,
    status: "Paid",
    date: "2026-08-14",
    expected: "Aug 14, 2026",
    referralId: "r8",
    candidate: "James Carter",
    milestone: "90-Day Retention",
    method: "Bank of America ****1234",
    userId: "a1",
  },
  {
    id: "p3",
    reference: "PAY-2026-001302",
    amount: 4000,
    status: "Paid",
    date: "2026-07-08",
    expected: "Jul 8, 2026",
    referralId: "r7",
    candidate: "Amira Hassan",
    milestone: "Offer Acceptance",
    method: "Bank of America ****1234",
    userId: "a1",
  },
  {
    id: "p4",
    reference: "PAY-2026-001276",
    amount: 1250,
    status: "Paid",
    date: "2026-08-04",
    expected: "Aug 4, 2026",
    referralId: "r10",
    candidate: "Taylor Brooks",
    milestone: "Offer Acceptance",
    method: "Bank of America ****1234",
    userId: "a1",
  },
  {
    id: "p5",
    reference: "PAY-2026-001310",
    amount: 2000,
    status: "Processing",
    date: "2026-10-06",
    expected: "Oct 10, 2026",
    referralId: "",
    candidate: "Wallet withdrawal",
    milestone: "Withdrawal",
    method: "Bank of America ****1234",
    userId: "a1",
  },
  {
    id: "p6",
    reference: "PAY-2026-000980",
    amount: 500,
    status: "Failed",
    date: "2026-09-12",
    expected: "Sep 12, 2026",
    referralId: "",
    candidate: "Wallet withdrawal",
    milestone: "Withdrawal",
    method: "PayPal avery.lang@email.com",
    userId: "a1",
  },
];

export const SEED_NOTICES: Notice[] = [
  {
    id: "n1",
    group: "Today",
    title: "Interview scheduled",
    body: "Elena Ortiz is set for Oct 14 at 10:00 AM CT with Harborview Clinics.",
    time: "8:10 AM",
    read: false,
    href: "/referrals/r3/timeline",
  },
  {
    id: "n2",
    group: "Today",
    title: "Milestone 1 is eligible",
    body: "Daniel Kim’s offer can release $3,000.00 when he accepts.",
    time: "7:40 AM",
    read: false,
    href: "/referrals/r4/milestones",
  },
  {
    id: "n3",
    group: "Today",
    title: "62 days of retention left",
    body: "Sofia Nguyen’s 90-day check at Northstar Health is Dec 9, 2026.",
    time: "Yesterday",
    read: false,
    href: "/referrals/r6/milestones",
  },
  {
    id: "n4",
    group: "Earlier",
    title: "Payout processed",
    body: "PAY-2026-001245 for $2,250.00 was paid to Bank of America ****1234.",
    time: "May 18",
    read: true,
    href: "/payments/p1",
  },
  {
    id: "n5",
    group: "Earlier",
    title: "New matching job",
    body: "Cybersecurity Analyst at Redwood Bank pays a $5,000.00 referral fee.",
    time: "Oct 6",
    read: true,
    href: "/jobs/j6",
  },
  {
    id: "n6",
    group: "Earlier",
    title: "Employer feedback",
    body: "Northstar Health passed on Riley Brooks for limited healthcare depth.",
    time: "Sep 22",
    read: true,
    href: "/referrals/r9",
  },
];

export function feeSplit(fee: number) {
  const first = half(fee);
  return { m1: first, m2: Math.round((fee - first) * 100) / 100 };
}

export function candidateName(referral: Referral) {
  return `${referral.candidate.firstName} ${referral.candidate.lastName}`;
}

export function nextHint(referral: Referral) {
  if (referral.status === "Submitted") return "Waiting for employer review";
  if (referral.status === "Under Review") return "Employer is reviewing";
  if (referral.status === "Accepted") return "Interview scheduling is next";
  if (referral.status === "Interview") return referral.interview ? `Interview ${referral.interview.date}` : "Interview scheduled";
  if (referral.status === "Offer") return "Milestone 1 releases when the offer is accepted";
  if (referral.status === "Hired") return "Retention period starts next";
  if (referral.status === "90-Day Retention") return `${referral.m2.daysLeft ?? 0} days to Milestone 2`;
  if (referral.status === "Referral Fee Earned") return "Payout processing";
  if (referral.status === "Paid") return "Both milestones paid";
  return "Closed";
}

export function isHire(status: ReferralStatus) {
  return status === "Hired" || status === "90-Day Retention" || status === "Referral Fee Earned" || status === "Paid";
}

export function moneyBuckets(referrals: Referral[]) {
  const buckets = { Pending: 0, Eligible: 0, Earned: 0, Paid: 0 };
  for (const referral of referrals) {
    for (const milestone of [referral.m1, referral.m2]) {
      if (milestone.state === "Pending" || milestone.state === "Eligible" || milestone.state === "Earned" || milestone.state === "Paid") {
        buckets[milestone.state] += milestone.amount;
      }
    }
  }
  return buckets;
}

export function pipelineCounts(referrals: Referral[]) {
  const count = (statuses: ReferralStatus[]) => referrals.filter((item) => statuses.includes(item.status)).length;
  return [
    { label: "Submitted", value: count(["Submitted"]) },
    { label: "Review", value: count(["Under Review", "Accepted"]) },
    { label: "Interview", value: count(["Interview"]) },
    { label: "Offer", value: count(["Offer"]) },
    { label: "Hired", value: count(["Hired", "90-Day Retention", "Referral Fee Earned", "Paid"]) },
  ];
}

export function emptyAgent(draft: SignupDraft, id: string): Agent {
  const [firstName, ...rest] = draft.name.trim().split(/\s+/);
  const method: PayoutMethod =
    draft.payout === "paypal"
      ? { id: "pm-new", kind: "paypal", label: "PayPal", detail: draft.paypalEmail, verified: false }
      : {
          id: "pm-new",
          kind: "ach",
          label: draft.bankName || "Bank account",
          detail: `Checking ****${draft.accountLast4 || "0000"}`,
          verified: false,
        };
  return {
    id,
    firstName: firstName || "New",
    lastName: rest.join(" ") || "Agent",
    email: draft.email.trim().toLowerCase(),
    phone: draft.phone,
    password: draft.password,
    photo: "",
    headline: draft.specialties,
    rating: 0,
    memberSince: "Oct 2026",
    level: "New",
    nextLevel: "Silver",
    levelProgress: 10,
    yearsExperience: Number(draft.years) || 0,
    industries: draft.industries,
    specialties: draft.specialties.split(",").map((item) => item.trim()).filter(Boolean),
    linkedin: draft.linkedin,
    bio: draft.bio,
    city: "",
    state: "",
    status: "pending",
    rejectionReason: "",
    placementRate: 0,
    avgDaysToHire: 0,
    payoutMethods: [method],
    w9Status: draft.w9Name ? "On file" : "Missing",
    w9Name: draft.w9Name,
    taxLast4: draft.taxLast4,
    address: "",
    biometric: false,
    twoFactor: false,
    available: 0,
    priorPaid: 0,
    notifPrefs: { status: true, milestones: true, payouts: true, jobs: true, feedback: true },
  };
}
