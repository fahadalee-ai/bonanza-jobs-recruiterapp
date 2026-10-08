import findJobsImage from "@/img/onboarding-find-jobs.jpg";
import applyImage from "@/img/onboarding-apply.jpg";
import referredImage from "@/img/onboarding-referred.jpg";

export type ThemeMode = "light" | "dark" | "system";

export type WorkMode = "On-site" | "Remote" | "Hybrid";
export type JobType = "Full-time" | "Part-time" | "Contract";
export type ExperienceLevel = "Entry" | "Mid" | "Senior" | "Executive";
export type AppStatus =
  | "Submitted"
  | "Under Review"
  | "Accepted"
  | "Rejected"
  | "Interview"
  | "Offer"
  | "Hired"
  | "Withdrawn";

export type Question = {
  id: string;
  type: "text" | "yesno" | "choice";
  prompt: string;
  options?: string[];
};

export type Job = {
  id: string;
  title: string;
  company: string;
  initials: string;
  city: string;
  state: string;
  locationLabel: string;
  coords?: { lat: number; lng: number };
  workMode: WorkMode;
  jobType: JobType;
  salaryMin: number;
  salaryMax: number;
  salaryUnit: "yr" | "hr";
  postedDays: number;
  easyApply: boolean;
  match: number;
  industry: string;
  experience: ExperienceLevel;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  about: string;
  skills: string[];
  featured?: boolean;
};

export type TimelineStep = {
  id: string;
  label: string;
  date?: string;
  state: "done" | "current" | "future";
};

export type Application = {
  id: string;
  jobId: string;
  userId: string;
  status: AppStatus;
  appliedLabel: string;
  updatedLabel: string;
  resumeName: string;
  coverLetter?: string;
  referredBy?: string;
  notes?: string;
  timeline: TimelineStep[];
  interview?: {
    date: string;
    time: string;
    type: "Phone" | "Video" | "On-site";
    detail: string;
    confirmed: boolean;
  };
  offer?: {
    salary: string;
    bonus: string;
    schedule: string;
    start: string;
  };
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  gpa?: string;
};

export type Certification = {
  id: string;
  name: string;
  org: string;
  issued: string;
  expires: string;
  credential: string;
};

export type Preferences = {
  roles: string[];
  locations: string[];
  workModes: WorkMode[];
  jobTypes: JobType[];
  salaryMin: number;
  salaryMax: number;
  salaryUnit: "yr" | "hr";
  availability: string;
  authorization: string;
  relocate: boolean;
  alerts: boolean;
};

export type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  headline: string;
  summary: string;
  photo: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  linkedin: string;
  portfolio: string;
  industry: string;
  desiredTitle: string;
  resumeName: string;
  resumeSize: string;
  resumeUpdated: string;
  resumeVisible: boolean;
  visibleToEmployers: boolean;
  profileViews: number;
  skills: { name: string; level?: string }[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  preferences: Preferences;
};

export type Notice = {
  id: string;
  bucket: "Today" | "Earlier";
  title: string;
  body: string;
  time: string;
  read: boolean;
  href: string;
  kind: "status" | "interview" | "match" | "message" | "view" | "referral";
};

export type SavedSearch = { id: string; label: string; query: string };

export const DEMO_EMAIL = "jordan.ellis@email.com";
export const DEMO_PASSWORD = "Bonanza123!";

export const PHOTO =
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=480&h=480&q=80";

export const ONBOARDING = [
  {
    title: "Find Jobs That Fit Your Career",
    body: "Search thousands of verified US jobs by role, location, and salary, all in one place.",
    image: findJobsImage,
    alt: "Professional working on a laptop in a bright modern office",
  },
  {
    title: "Apply in Just a Few Taps",
    body: "Upload your resume once and apply instantly. Track every application from submitted to hired.",
    image: applyImage,
    alt: "Smiling professional holding a phone in a bright office",
  },
  {
    title: "Get Referred, Get Hired Faster",
    body: "Top recruiters can refer you directly to employers, giving your profile a priority review.",
    image: referredImage,
    alt: "Two professionals shaking hands in an office",
  },
] as const;

export const CITIES: { label: string; coords: { lat: number; lng: number } | null }[] = [
  { label: "Austin, TX", coords: { lat: 30.2672, lng: -97.7431 } },
  { label: "Chicago, IL", coords: { lat: 41.8781, lng: -87.6298 } },
  { label: "San Francisco, CA", coords: { lat: 37.7749, lng: -122.4194 } },
  { label: "New York, NY", coords: { lat: 40.7128, lng: -74.006 } },
  { label: "Boston, MA", coords: { lat: 42.3601, lng: -71.0589 } },
  { label: "Denver, CO", coords: { lat: 39.7392, lng: -104.9903 } },
  { label: "Miami, FL", coords: { lat: 25.7617, lng: -80.1918 } },
  { label: "Remote, USA", coords: null },
];

export const INDUSTRIES = [
  "IT & Software",
  "Design & Creative",
  "Finance & Accounting",
  "Healthcare",
  "Marketing",
  "Hospitality",
  "Operations",
];

export const SKILL_SUGGESTIONS = [
  "Product Design",
  "Figma",
  "Design Systems",
  "User Research",
  "Prototyping",
  "UX Writing",
  "SQL",
  "Stakeholder Management",
  "Accessibility",
  "Workshop Facilitation",
];

export const QUESTIONS: Question[] = [
  {
    id: "auth",
    type: "yesno",
    prompt: "Are you legally authorized to work in the United States?",
  },
  {
    id: "sponsor",
    type: "yesno",
    prompt: "Will you now or in the future require visa sponsorship?",
  },
  {
    id: "years",
    type: "text",
    prompt: "How many years of relevant experience do you have?",
  },
  {
    id: "mode",
    type: "choice",
    prompt: "Which work arrangement can you start in?",
    options: ["On-site", "Hybrid", "Remote"],
  },
];

const benefits = [
  "Medical, dental, and vision from day one",
  "401(k) with employer match",
  "Flexible PTO and paid holidays",
  "Annual learning stipend",
];

export const JOBS: Job[] = [
  {
    id: "j5",
    title: "Product Designer",
    company: "Northstar Health",
    initials: "NH",
    city: "Austin",
    state: "TX",
    locationLabel: "Austin, TX",
    coords: { lat: 30.2672, lng: -97.7431 },
    workMode: "Hybrid",
    jobType: "Full-time",
    salaryMin: 95000,
    salaryMax: 125000,
    salaryUnit: "yr",
    postedDays: 2,
    easyApply: true,
    match: 96,
    industry: "Design & Creative",
    experience: "Mid",
    featured: true,
    overview:
      "Northstar Health is hiring a Product Designer to shape patient and clinician tools used across clinics in Texas. You will own flows from research through shipped UI, partnering with product and engineering in our downtown Austin studio.",
    responsibilities: [
      "Design end-to-end experiences for scheduling, records, and follow-up care",
      "Run lightweight research with clinicians and patients",
      "Maintain the design system and partner with engineering on implementation",
      "Present work in weekly critiques and to clinical stakeholders",
    ],
    requirements: [
      "4+ years designing digital products for web or mobile",
      "A portfolio with shipped product work, not only marketing",
      "Comfort with Figma, prototyping, and accessible UI",
      "Experience collaborating with engineers in an agile team",
    ],
    benefits,
    about:
      "Northstar Health operates outpatient clinics across Texas and builds the software its care teams use every day. The Austin hub is a bright, open studio a short walk from the lake.",
    skills: ["Product Design", "Figma", "Design Systems", "User Research"],
  },
  {
    id: "j12",
    title: "Design Systems Lead",
    company: "FinVenture Labs",
    initials: "FV",
    city: "Austin",
    state: "TX",
    locationLabel: "Austin, TX",
    coords: { lat: 30.271, lng: -97.74 },
    workMode: "Hybrid",
    jobType: "Full-time",
    salaryMin: 110000,
    salaryMax: 135000,
    salaryUnit: "yr",
    postedDays: 7,
    easyApply: true,
    match: 93,
    industry: "Design & Creative",
    experience: "Senior",
    featured: true,
    overview:
      "Lead the design system that powers FinVenture’s banking products. You will set component standards, coach product designers, and work with engineers to keep web and iOS in sync.",
    responsibilities: [
      "Own the component library, tokens, and contribution model",
      "Partner with product designers on complex financial flows",
      "Define accessibility and content standards",
      "Report system adoption and quality to design leadership",
    ],
    requirements: [
      "6+ years in product design, including design systems",
      "Experience shipping a multi-platform component library",
      "Clear writing and critique skills",
      "Familiarity with design tokens and front-end constraints",
    ],
    benefits,
    about:
      "FinVenture Labs builds consumer finance products for credit unions. The Austin office is hybrid, three days a week, with a quiet focus on craft.",
    skills: ["Design Systems", "Figma", "Accessibility", "Product Design"],
  },
  {
    id: "j11",
    title: "UX Researcher",
    company: "CloudPeak Technologies",
    initials: "CP",
    city: "Remote",
    state: "USA",
    locationLabel: "Remote, USA",
    workMode: "Remote",
    jobType: "Contract",
    salaryMin: 55,
    salaryMax: 75,
    salaryUnit: "hr",
    postedDays: 0,
    easyApply: true,
    match: 91,
    industry: "Design & Creative",
    experience: "Mid",
    overview:
      "A six-month contract to study how operations teams adopt CloudPeak’s workflow platform. You will plan studies, synthesize findings, and brief product squads every sprint.",
    responsibilities: [
      "Plan and run interviews, surveys, and usability tests",
      "Turn findings into decisions the squad can ship",
      "Build a lightweight research repository",
      "Coach designers on evaluative testing",
    ],
    requirements: [
      "3+ years in UX research for B2B software",
      "Comfort with mixed methods and tight timelines",
      "Clear written readouts for non-researchers",
      "Authorization to work in the United States",
    ],
    benefits: ["Contract through Bonanza Jobs", "Remote within the US", "Weekly paid syncs", "Potential to convert"],
    about:
      "CloudPeak Technologies builds workflow software for distributed operations teams. This role is fully remote for candidates in the United States.",
    skills: ["User Research", "Workshop Facilitation", "UX Writing"],
  },
  {
    id: "j1",
    title: "Senior Full Stack Software Architect",
    company: "TechCorp Innovations LLC",
    initials: "TC",
    city: "San Francisco",
    state: "CA",
    locationLabel: "San Francisco, CA",
    coords: { lat: 37.7749, lng: -122.4194 },
    workMode: "Hybrid",
    jobType: "Full-time",
    salaryMin: 145000,
    salaryMax: 175000,
    salaryUnit: "yr",
    postedDays: 6,
    easyApply: false,
    match: 64,
    industry: "IT & Software",
    experience: "Senior",
    featured: true,
    overview:
      "TechCorp is looking for a senior architect to guide a TypeScript platform used by hiring teams nationwide. The role blends hands-on design with mentorship across web and API squads.",
    responsibilities: [
      "Set architecture for services, data, and the web client",
      "Review designs for reliability, security, and cost",
      "Mentor senior engineers across two product areas",
      "Partner with product on sequencing platform work",
    ],
    requirements: [
      "8+ years building production web platforms",
      "Strong TypeScript, API, and cloud experience",
      "A track record of leading without a large hierarchy",
      "Hybrid presence in San Francisco, two days a week",
    ],
    benefits,
    about:
      "TechCorp Innovations LLC builds software for staffing and talent teams. The San Francisco studio overlooks the Embarcadero.",
    skills: ["TypeScript", "System Design", "AWS", "Stakeholder Management"],
  },
  {
    id: "j2",
    title: "Lead DevOps & Cloud Engineer",
    company: "TechCorp Innovations LLC",
    initials: "TC",
    city: "Remote",
    state: "USA",
    locationLabel: "Remote, USA",
    workMode: "Remote",
    jobType: "Full-time",
    salaryMin: 155000,
    salaryMax: 185000,
    salaryUnit: "yr",
    postedDays: 4,
    easyApply: false,
    match: 58,
    industry: "IT & Software",
    experience: "Senior",
    featured: true,
    overview:
      "Own cloud reliability for TechCorp’s customer platform. You will lead infrastructure, delivery pipelines, and on-call practice for a fully remote US team.",
    responsibilities: [
      "Run AWS environments, IaC, and delivery pipelines",
      "Set SLOs and improve incident response",
      "Partner with security on access and secrets",
      "Coach squads on operability",
    ],
    requirements: [
      "7+ years in cloud infrastructure or DevOps",
      "Production AWS and infrastructure-as-code",
      "Clear incident communication",
      "US work authorization",
    ],
    benefits,
    about: "TechCorp Innovations LLC is a remote-friendly software company serving staffing teams across the country.",
    skills: ["AWS", "Kubernetes", "CI/CD", "Observability"],
  },
  {
    id: "j8",
    title: "Data Analyst",
    company: "FinVenture Labs",
    initials: "FV",
    city: "Austin",
    state: "TX",
    locationLabel: "Austin, TX",
    coords: { lat: 30.26, lng: -97.75 },
    workMode: "Hybrid",
    jobType: "Full-time",
    salaryMin: 78000,
    salaryMax: 98000,
    salaryUnit: "yr",
    postedDays: 5,
    easyApply: true,
    match: 71,
    industry: "Finance & Accounting",
    experience: "Entry",
    overview:
      "Help product and finance teams see what members do inside FinVenture’s apps. You will write SQL, build dashboards, and explain the story behind the numbers.",
    responsibilities: [
      "Build and maintain trusted dashboards",
      "Answer product questions with SQL and clear writeups",
      "Define metrics with design and product partners",
      "Flag data quality issues early",
    ],
    requirements: [
      "2+ years in analytics or a related field",
      "Strong SQL and spreadsheet skills",
      "Comfort explaining numbers to non-analysts",
      "Hybrid schedule in Austin",
    ],
    benefits,
    about: "FinVenture Labs is an Austin fintech working with credit unions across the South and Midwest.",
    skills: ["SQL", "Dashboards", "Stakeholder Management"],
  },
  {
    id: "j7",
    title: "Marketing Manager",
    company: "CloudPeak Technologies",
    initials: "CP",
    city: "Denver",
    state: "CO",
    locationLabel: "Denver, CO",
    coords: { lat: 39.7392, lng: -104.9903 },
    workMode: "Remote",
    jobType: "Full-time",
    salaryMin: 85000,
    salaryMax: 110000,
    salaryUnit: "yr",
    postedDays: 3,
    easyApply: true,
    match: 62,
    industry: "Marketing",
    experience: "Mid",
    overview:
      "Lead lifecycle and product marketing for CloudPeak’s operations platform. The role is remote, with optional time in the Denver loft.",
    responsibilities: [
      "Own launch plans for product releases",
      "Run lifecycle email and in-app campaigns",
      "Brief sales with clear positioning",
      "Report pipeline influence each month",
    ],
    requirements: [
      "5+ years in B2B marketing",
      "Experience launching software to operations buyers",
      "Strong writing and project management",
      "US-based, remote",
    ],
    benefits,
    about: "CloudPeak Technologies helps distributed teams run daily operations. Marketing sits with product in a remote-first group.",
    skills: ["Product Marketing", "Lifecycle", "Writing"],
  },
  {
    id: "j3",
    title: "Senior Financial Controller",
    company: "Apex Global Solutions Inc.",
    initials: "AG",
    city: "New York",
    state: "NY",
    locationLabel: "New York, NY",
    coords: { lat: 40.7128, lng: -74.006 },
    workMode: "On-site",
    jobType: "Full-time",
    salaryMin: 150000,
    salaryMax: 190000,
    salaryUnit: "yr",
    postedDays: 9,
    easyApply: false,
    match: 41,
    industry: "Finance & Accounting",
    experience: "Executive",
    featured: true,
    overview:
      "Apex Global needs a controller to lead close, reporting, and advisory for a multi-entity professional services firm based in Midtown.",
    responsibilities: [
      "Own monthly close and management reporting",
      "Advise operators on margin and hiring plans",
      "Lead a team of six across accounting",
      "Partner with audit and tax advisors",
    ],
    requirements: [
      "8+ years in accounting, with people leadership",
      "CPA preferred",
      "Experience with NetSuite or a similar ERP",
      "On-site in New York five days a week",
    ],
    benefits,
    about: "Apex Global Solutions Inc. advises growth-stage companies from its New York headquarters.",
    skills: ["GAAP", "NetSuite", "Leadership", "FP&A"],
  },
  {
    id: "j4",
    title: "Clinical Trial Program Director",
    company: "BioHealth Therapeutics & Labs",
    initials: "BH",
    city: "Boston",
    state: "MA",
    locationLabel: "Boston, MA",
    coords: { lat: 42.3601, lng: -71.0589 },
    workMode: "Hybrid",
    jobType: "Full-time",
    salaryMin: 160000,
    salaryMax: 200000,
    salaryUnit: "yr",
    postedDays: 12,
    easyApply: false,
    match: 36,
    industry: "Healthcare",
    experience: "Executive",
    featured: true,
    overview:
      "Direct a portfolio of clinical programs for BioHealth’s therapeutics group. You will coordinate sites, vendors, and internal science leads from the Boston lab campus.",
    responsibilities: [
      "Set timelines and budgets for active trials",
      "Unblock site startup and enrollment",
      "Report status to clinical leadership",
      "Hold vendors to quality agreements",
    ],
    requirements: [
      "8+ years in clinical operations",
      "Experience directing multi-site studies",
      "Calm communication with scientific stakeholders",
      "Hybrid schedule in Boston",
    ],
    benefits,
    about: "BioHealth Therapeutics & Labs develops therapies and runs studies from its Boston campus.",
    skills: ["Clinical Operations", "Vendor Management", "GCP"],
  },
  {
    id: "j6",
    title: "ICU Registered Nurse",
    company: "Horizon Behavioral Care",
    initials: "HB",
    city: "Chicago",
    state: "IL",
    locationLabel: "Chicago, IL",
    coords: { lat: 41.8781, lng: -87.6298 },
    workMode: "On-site",
    jobType: "Full-time",
    salaryMin: 42,
    salaryMax: 58,
    salaryUnit: "hr",
    postedDays: 1,
    easyApply: true,
    match: 28,
    industry: "Healthcare",
    experience: "Mid",
    overview:
      "Horizon is staffing ICU nurses for its Chicago medical campus. Shifts are 12 hours, with differentials for nights and weekends.",
    responsibilities: [
      "Deliver bedside care for critical patients",
      "Coordinate with physicians and respiratory therapy",
      "Document accurately in the EHR",
      "Precept new nurses after orientation",
    ],
    requirements: [
      "Active Illinois RN license",
      "2+ years of ICU experience",
      "BLS and ACLS",
      "On-site at the Chicago campus",
    ],
    benefits: ["Shift differentials", "Medical coverage", "Tuition help", "Commuter benefit"],
    about: "Horizon Behavioral Care runs clinical facilities across the Midwest, including a full-service campus in Chicago.",
    skills: ["Critical Care", "EHR", "Patient Advocacy"],
  },
  {
    id: "j9",
    title: "Guest Experience Lead",
    company: "Munzi Hospitality Group",
    initials: "MH",
    city: "Miami",
    state: "FL",
    locationLabel: "Miami, FL",
    coords: { lat: 25.7617, lng: -80.1918 },
    workMode: "On-site",
    jobType: "Full-time",
    salaryMin: 70000,
    salaryMax: 90000,
    salaryUnit: "yr",
    postedDays: 8,
    easyApply: true,
    match: 44,
    industry: "Hospitality",
    experience: "Mid",
    overview:
      "Lead front-of-house teams at Munzi’s flagship Miami property. You will own arrival, service recovery, and the daily rhythm of the lobby.",
    responsibilities: [
      "Lead a team of guest experience associates",
      "Handle escalations with calm and follow-through",
      "Watch scores and coach in the moment",
      "Coordinate with housekeeping and events",
    ],
    requirements: [
      "4+ years in luxury or upscale hospitality",
      "People leadership experience",
      "Nights and weekends as the operation requires",
      "On-site in Miami",
    ],
    benefits,
    about: "Munzi Hospitality Group operates hotels and restaurants along the East Coast, with its flagship in Miami.",
    skills: ["Hospitality", "Team Leadership", "Service Recovery"],
  },
  {
    id: "j10",
    title: "Executive Assistant",
    company: "Apex Health Systems",
    initials: "AH",
    city: "Chicago",
    state: "IL",
    locationLabel: "Chicago, IL",
    coords: { lat: 41.89, lng: -87.62 },
    workMode: "Hybrid",
    jobType: "Full-time",
    salaryMin: 62000,
    salaryMax: 78000,
    salaryUnit: "yr",
    postedDays: 2,
    easyApply: true,
    match: 52,
    industry: "Operations",
    experience: "Entry",
    overview:
      "Support the VP of Talent Acquisition at Apex Health Systems. The week mixes Chicago headquarters time with two remote days.",
    responsibilities: [
      "Manage a complex calendar and travel",
      "Prepare briefing notes for leadership meetings",
      "Coordinate candidate dinners and board logistics",
      "Keep confidential information discreet",
    ],
    requirements: [
      "2+ years supporting an executive",
      "Excellent writing and calendar judgment",
      "Comfort with Google Workspace",
      "Hybrid in Chicago",
    ],
    benefits,
    about: "Apex Health Systems is a multi-site care organization. Talent acquisition sits in the Chicago headquarters.",
    skills: ["Calendar Management", "Writing", "Discretion"],
  },
];

const pipeline: TimelineStep[] = [
  { id: "Submitted", label: "Submitted", state: "future" },
  { id: "Under Review", label: "Under Review", state: "future" },
  { id: "Interview", label: "Interview", state: "future" },
  { id: "Offer", label: "Offer", state: "future" },
  { id: "Hired", label: "Hired", state: "future" },
];

function steps(current: string, dates: Record<string, string>): TimelineStep[] {
  const order = pipeline.map((step) => step.id);
  const index = order.indexOf(current);
  return pipeline.map((step, i) => ({
    ...step,
    date: dates[step.id],
    state: i < index ? "done" : i === index ? "current" : "future",
  }));
}

export const SEED_USER: Candidate = {
  id: "u-jordan",
  firstName: "Jordan",
  lastName: "Ellis",
  email: DEMO_EMAIL,
  phone: "(512) 555-0148",
  password: DEMO_PASSWORD,
  headline: "Product Designer",
  summary:
    "Product designer in Austin focused on healthcare and fintech. I turn research into clear interfaces, and I care as much about the design system as the first-use flow.",
  photo: PHOTO,
  address: "1200 S Congress Ave",
  city: "Austin",
  state: "TX",
  zip: "78704",
  linkedin: "",
  portfolio: "",
  industry: "Design & Creative",
  desiredTitle: "Product Designer",
  resumeName: "Jordan_Ellis_Resume.pdf",
  resumeSize: "248 KB",
  resumeUpdated: "Oct 2, 2026",
  resumeVisible: true,
  visibleToEmployers: true,
  profileViews: 28,
  skills: [
    { name: "Product Design", level: "Expert" },
    { name: "Figma", level: "Expert" },
    { name: "Design Systems", level: "Advanced" },
    { name: "User Research", level: "Advanced" },
    { name: "Prototyping", level: "Advanced" },
  ],
  experience: [
    {
      id: "ex1",
      title: "Product Designer",
      company: "Brightline Digital",
      location: "Austin, TX",
      start: "Mar 2022",
      end: "Present",
      current: true,
      description:
        "Lead designer for a patient scheduling product. Shipped a design system used by four squads and cut task time on the booking flow by 22%.",
    },
  ],
  education: [
    {
      id: "ed1",
      school: "The University of Texas at Austin",
      degree: "B.A.",
      field: "Visual Communication",
      start: "2016",
      end: "2020",
      gpa: "3.6",
    },
  ],
  certifications: [],
  preferences: {
    roles: ["Product Designer", "UX Designer"],
    locations: ["Austin, TX", "Remote, USA"],
    workModes: ["Hybrid", "Remote"],
    jobTypes: ["Full-time"],
    salaryMin: 95000,
    salaryMax: 130000,
    salaryUnit: "yr",
    availability: "2 weeks",
    authorization: "US Citizen",
    relocate: false,
    alerts: true,
  },
};

export const SEED_APPLICATIONS: Application[] = [
  {
    id: "a1",
    jobId: "j5",
    userId: "u-jordan",
    status: "Interview",
    appliedLabel: "Oct 1, 2026",
    updatedLabel: "Oct 7, 2026",
    resumeName: "Jordan_Ellis_Resume.pdf",
    referredBy: "Melissa Karthy",
    notes: "Your patient-portal case study was a strong match for the clinic scheduling work.",
    timeline: steps("Interview", {
      Submitted: "Oct 1, 2026",
      "Under Review": "Oct 3, 2026",
      Interview: "Oct 16, 2026",
    }),
    interview: {
      date: "Thursday, October 16, 2026",
      time: "10:30 AM CT",
      type: "Video",
      detail: "Video link shared in your invite",
      confirmed: false,
    },
  },
  {
    id: "a2",
    jobId: "j11",
    userId: "u-jordan",
    status: "Under Review",
    appliedLabel: "Oct 3, 2026",
    updatedLabel: "Oct 6, 2026",
    resumeName: "Jordan_Ellis_Resume.pdf",
    timeline: steps("Under Review", {
      Submitted: "Oct 3, 2026",
      "Under Review": "Oct 6, 2026",
    }),
  },
  {
    id: "a3",
    jobId: "j12",
    userId: "u-jordan",
    status: "Offer",
    appliedLabel: "Sep 22, 2026",
    updatedLabel: "Oct 7, 2026",
    resumeName: "Jordan_Ellis_Resume.pdf",
    notes: "The hiring manager would like a decision by October 15.",
    timeline: steps("Offer", {
      Submitted: "Sep 22, 2026",
      "Under Review": "Sep 24, 2026",
      Interview: "Oct 2, 2026",
      Offer: "Oct 7, 2026",
    }),
    interview: {
      date: "Thursday, October 2, 2026",
      time: "1:00 PM CT",
      type: "Video",
      detail: "Completed",
      confirmed: true,
    },
    offer: {
      salary: "$118,000 / year",
      bonus: "10% annual bonus target",
      schedule: "Hybrid · Austin, TX · 3 days on site",
      start: "November 3, 2026",
    },
  },
  {
    id: "a4",
    jobId: "j1",
    userId: "u-jordan",
    status: "Submitted",
    appliedLabel: "Oct 5, 2026",
    updatedLabel: "Oct 5, 2026",
    resumeName: "Jordan_Ellis_Resume.pdf",
    timeline: steps("Submitted", { Submitted: "Oct 5, 2026" }),
  },
  {
    id: "a5",
    jobId: "j7",
    userId: "u-jordan",
    status: "Rejected",
    appliedLabel: "Sep 18, 2026",
    updatedLabel: "Oct 4, 2026",
    resumeName: "Jordan_Ellis_Resume.pdf",
    notes: "They moved forward with a candidate who has led B2B product marketing.",
    timeline: steps("Under Review", {
      Submitted: "Sep 18, 2026",
      "Under Review": "Sep 21, 2026",
    }),
  },
];

export const SEED_NOTICES: Notice[] = [
  {
    id: "n1",
    bucket: "Today",
    kind: "interview",
    title: "Interview with Northstar Health",
    body: "Video interview for Product Designer on Thu, Oct 16 at 10:30 AM CT.",
    time: "2h ago",
    read: false,
    href: "/applications/a1",
  },
  {
    id: "n2",
    bucket: "Today",
    kind: "view",
    title: "An employer viewed your profile",
    body: "Northstar Health looked at your resume and portfolio highlights.",
    time: "5h ago",
    read: false,
    href: "/profile",
  },
  {
    id: "n3",
    bucket: "Today",
    kind: "match",
    title: "New role matches your preferences",
    body: "UX Researcher at CloudPeak Technologies is a 91% match.",
    time: "8h ago",
    read: false,
    href: "/jobs/j11",
  },
  {
    id: "n6",
    bucket: "Earlier",
    kind: "message",
    title: "Message from FinVenture Labs",
    body: "Please review the offer details and respond by October 15.",
    time: "Yesterday",
    read: false,
    href: "/applications/a3",
  },
  {
    id: "n4",
    bucket: "Earlier",
    kind: "status",
    title: "Application under review",
    body: "CloudPeak Technologies is reviewing your UX Researcher application.",
    time: "Oct 6",
    read: true,
    href: "/applications/a2",
  },
  {
    id: "n5",
    bucket: "Earlier",
    kind: "referral",
    title: "You were referred",
    body: "Melissa Karthy referred you to Northstar Health for Product Designer.",
    time: "Oct 1",
    read: true,
    href: "/applications/a1",
  },
];

export function completeness(user: Candidate) {
  const checks = [
    Boolean(user.photo),
    Boolean(user.headline),
    user.summary.trim().length > 40,
    user.skills.length >= 3,
    user.experience.length >= 1,
    user.education.length >= 1,
    Boolean(user.resumeName),
    user.preferences.roles.length > 0,
    Boolean(user.phone),
    Boolean(user.city),
    user.certifications.length >= 1,
    Boolean(user.linkedin),
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

export function profileHint(user: Candidate) {
  if (user.skills.length < 3) return "Add skills to strengthen your matches";
  if (!user.resumeName) return "Upload a resume so employers can review you faster";
  if (!user.certifications.length) return "Add a certification to complete your profile";
  if (!user.linkedin) return "Add your LinkedIn so recruiters can learn more";
  if (!user.education.length) return "Add your education";
  return "Your profile is in great shape";
}

export function emptyTimeline(date: string): TimelineStep[] {
  return steps("Submitted", { Submitted: date });
}
