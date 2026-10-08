import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEMO_EMAIL,
  JOBS,
  PENDING_AGENT,
  REJECTED_AGENT,
  SEED_AGENT,
  SEED_NOTICES,
  SEED_PAYMENTS,
  SEED_REFERRALS,
  SUSPENDED_AGENT,
  emptyAgent,
  feeSplit,
  type Agent,
  type Notice,
  type Payment,
  type Referral,
  type SignupDraft,
  type ThemeMode,
} from "./agent-data";
import { clearStorage, readStorage, writeStorage } from "./storage";
import { addBusinessDays, prettyDate } from "./format";

export const STORAGE_KEY = "bonanza.agent.v1";
export const ONBOARDED_KEY = "bonanza.agent.onboarded";

export type Toast = { id: number; title: string; body?: string };

export type ReferralInput = {
  jobId: string;
  type: Referral["type"];
  candidate: Referral["candidate"];
  resumeName: string;
  skills: string[];
  years: string;
  education: string;
  availability: string;
  expectedSalary: string;
  recommendation: string;
  consent: boolean;
};

type Snapshot = {
  onboarded: boolean;
  sessionId: string | null;
  users: Agent[];
  referrals: Referral[];
  payments: Payment[];
  notifications: Notice[];
  theme: ThemeMode;
};

type Store = Snapshot & {
  hydrated: boolean;
  user: Agent | null;
  jobs: typeof JOBS;
  toasts: Toast[];
  pendingSignup: SignupDraft | null;
  resetEmail: string;
  lastPayoutId: string | null;
  markOnboarded: () => void;
  login: (
    email: string,
    password: string,
    remember?: boolean,
  ) => { ok: true } | { ok: false; reason: "invalid" | "suspended" | "locked" };
  loginWithBiometric: () => { ok: true } | { ok: false; reason: "unset" };
  beginSignup: (draft: SignupDraft) => { ok: true } | { ok: false; reason: "exists" };
  verifyOtp: () => boolean;
  requestReset: (email: string) => boolean;
  resetPassword: (password: string) => boolean;
  approveDemo: () => void;
  reapply: () => void;
  logout: () => void;
  deleteAccount: () => void;
  updateUser: (patch: Partial<Agent>) => void;
  submitReferral: (input: ReferralInput) => { ok: true; id: string; code: string } | { ok: false; reason: "duplicate" | "signedout" };
  requestWithdrawal: (input: {
    amount: number;
    methodId: string;
  }) => { ok: true; id: string } | { ok: false; reason: "balance" | "tax" | "method" | "min" | "signedout" };
  markAllRead: () => void;
  markRead: (id: string) => void;
  removeNotification: (id: string) => void;
  pushToast: (title: string, body?: string) => void;
  dismissToast: (id: number) => void;
  setTheme: (theme: ThemeMode) => void;
};

const Ctx = createContext<Store | null>(null);
let skipSessionPersist = false;

function seenOnboarding() {
  return readStorage(ONBOARDED_KEY) === "1";
}

function rememberOnboarding() {
  writeStorage(ONBOARDED_KEY, "1");
}

function fresh(): Snapshot {
  return {
    onboarded: false,
    sessionId: null,
    users: [SEED_AGENT, PENDING_AGENT, REJECTED_AGENT, SUSPENDED_AGENT],
    referrals: SEED_REFERRALS,
    payments: SEED_PAYMENTS,
    notifications: SEED_NOTICES,
    theme: "light",
  };
}

function loadSnapshot(): Snapshot {
  const seen = seenOnboarding();
  const raw = readStorage(STORAGE_KEY);
  if (!raw) return { ...fresh(), onboarded: seen };
  try {
    const parsed = JSON.parse(raw) as Snapshot;
    if (!parsed.users?.length || !parsed.referrals) return { ...fresh(), onboarded: seen };
    if (!parsed.users.some((user) => user.email === DEMO_EMAIL)) parsed.users = [SEED_AGENT, ...parsed.users];
    const onboarded = Boolean(parsed.onboarded) || seen;
    if (onboarded) rememberOnboarding();
    return { ...fresh(), ...parsed, users: parsed.users, onboarded };
  } catch {
    return { ...fresh(), onboarded: seen };
  }
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState<Snapshot>(fresh);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [pendingSignup, setPendingSignup] = useState<SignupDraft | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [lastPayoutId, setLastPayoutId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadSnapshot();
    setSnap(loaded);
    const pending = readStorage("bonanza.agent.pending", true);
    const reset = readStorage("bonanza.agent.reset", true);
    if (pending) setPendingSignup(JSON.parse(pending) as SignupDraft);
    if (reset) setResetEmail(reset);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const next = skipSessionPersist ? { ...snap, sessionId: null } : snap;
    const onboarded = next.onboarded || seenOnboarding();
    writeStorage(STORAGE_KEY, JSON.stringify({ ...next, onboarded }));
  }, [snap, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    const apply = (dark: boolean) => root.classList.toggle("dark", dark);
    if (snap.theme === "dark") {
      apply(true);
      return;
    }
    if (snap.theme === "light") {
      apply(false);
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    apply(media.matches);
    const onChange = () => apply(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [snap.theme, hydrated]);

  const user = snap.users.find((item) => item.id === snap.sessionId) ?? null;

  const api = useMemo<Store>(() => {
    const pushToast = (title: string, body?: string) => {
      const id = Date.now() + Math.random();
      setToasts((list) => [...list, { id, title, body }]);
      window.setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 3200);
    };

    const updateUser = (patch: Partial<Agent>) => {
      setSnap((current) => {
        if (!current.sessionId) return current;
        return {
          ...current,
          users: current.users.map((item) => (item.id === current.sessionId ? { ...item, ...patch } : item)),
        };
      });
    };

    return {
      ...snap,
      hydrated,
      user,
      jobs: JOBS,
      toasts,
      pendingSignup,
      resetEmail,
      lastPayoutId,
      markOnboarded: () => {
        rememberOnboarding();
        setSnap((current) => ({ ...current, onboarded: true }));
      },
      login: (email, password, remember = true) => {
        if (Date.now() < lockedUntil) return { ok: false, reason: "locked" };
        const found = snap.users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
        if (!found || found.password !== password) {
          const next = attempts + 1;
          setAttempts(next);
          if (next >= 5) setLockedUntil(Date.now() + 2 * 60 * 1000);
          return { ok: false, reason: "invalid" };
        }
        if (found.status === "suspended") return { ok: false, reason: "suspended" };
        setAttempts(0);
        skipSessionPersist = !remember;
        setSnap((current) => ({ ...current, sessionId: found.id, onboarded: true }));
        return { ok: true };
      },
      loginWithBiometric: () => {
        const found = snap.users.find((item) => item.biometric && item.status === "active");
        if (!found) return { ok: false, reason: "unset" };
        setSnap((current) => ({ ...current, sessionId: found.id, onboarded: true }));
        return { ok: true };
      },
      beginSignup: (draft) => {
        if (snap.users.some((item) => item.email.toLowerCase() === draft.email.trim().toLowerCase())) {
          return { ok: false, reason: "exists" };
        }
        setPendingSignup(draft);
        writeStorage("bonanza.agent.pending", JSON.stringify(draft), true);
        return { ok: true };
      },
      verifyOtp: () => {
        if (!pendingSignup) return false;
        const created = emptyAgent(pendingSignup, `a-${Date.now()}`);
        setSnap((current) => ({
          ...current,
          users: [...current.users, created],
          sessionId: created.id,
          onboarded: true,
        }));
        setPendingSignup(null);
        clearStorage("bonanza.agent.pending", true);
        return true;
      },
      requestReset: (email) => {
        const found = snap.users.some((item) => item.email === email.trim().toLowerCase());
        if (!found) return false;
        const clean = email.trim().toLowerCase();
        setResetEmail(clean);
        writeStorage("bonanza.agent.reset", clean, true);
        return true;
      },
      resetPassword: (password) => {
        const email = resetEmail.trim().toLowerCase();
        const found = snap.users.find((item) => item.email === email);
        if (!found) return false;
        setSnap((current) => ({
          ...current,
          users: current.users.map((item) => (item.email === email ? { ...item, password } : item)),
        }));
        setResetEmail("");
        clearStorage("bonanza.agent.reset", true);
        return true;
      },
      approveDemo: () => updateUser({ status: "active", rejectionReason: "" }),
      reapply: () => {
        updateUser({ status: "pending", rejectionReason: "" });
        pushToast("Application resubmitted", "We'll notify you within 24–48 hours.");
      },
      logout: () => setSnap((current) => ({ ...current, sessionId: null })),
      deleteAccount: () =>
        setSnap((current) => ({
          ...current,
          sessionId: null,
          users: current.users.filter((item) => item.id !== current.sessionId),
          referrals: current.referrals.filter((item) => item.userId !== current.sessionId),
          payments: current.payments.filter((item) => item.userId !== current.sessionId),
        })),
      updateUser,
      submitReferral: (input) => {
        if (!user) return { ok: false, reason: "signedout" };
        const duplicate = snap.referrals.some(
          (item) =>
            item.userId === user.id &&
            item.jobId === input.jobId &&
            item.candidate.email.toLowerCase() === input.candidate.email.toLowerCase() &&
            item.status !== "Rejected",
        );
        if (duplicate) return { ok: false, reason: "duplicate" };
        const job = JOBS.find((item) => item.id === input.jobId);
        const split = feeSplit(job?.fee ?? 0);
        const id = `r-${Date.now()}`;
        const code = `REF-2026-${String(Math.floor(100000 + Math.random() * 899999))}`;
        const label = prettyDate(todayIso());
        const referral: Referral = {
          id,
          code,
          userId: user.id,
          jobId: input.jobId,
          type: input.type,
          status: "Submitted",
          submitted: todayIso(),
          candidate: input.candidate,
          resumeName: input.resumeName,
          skills: input.skills,
          years: input.years,
          education: input.education,
          availability: input.availability,
          expectedSalary: input.expectedSalary,
          recommendation: input.recommendation,
          consent: input.consent,
          m1: { amount: split.m1, state: "Pending" },
          m2: { amount: split.m2, state: "Pending" },
          feedback: "",
          timeline: [
            { label: "Submitted", date: label, note: "Referral received.", state: "current" },
            ...["Under Review", "Accepted", "Interview", "Offer", "Hired", "90-Day Retention", "Referral Fee Earned", "Paid"].map(
              (step) => ({ label: step, date: "", note: "", state: "future" as const }),
            ),
          ],
        };
        const notice: Notice = {
          id: `n-${Date.now()}`,
          group: "Today",
          title: "Referral submitted",
          body: `${input.candidate.firstName} ${input.candidate.lastName} is in for ${job?.title ?? "this role"}.`,
          time: "Just now",
          read: false,
          href: `/referrals/${id}`,
        };
        setSnap((current) => ({
          ...current,
          referrals: [referral, ...current.referrals],
          notifications: [notice, ...current.notifications],
        }));
        return { ok: true, id, code };
      },
      requestWithdrawal: ({ amount, methodId }) => {
        if (!user) return { ok: false, reason: "signedout" };
        if (user.w9Status !== "On file") return { ok: false, reason: "tax" };
        const method = user.payoutMethods.find((item) => item.id === methodId);
        if (!method?.verified) return { ok: false, reason: "method" };
        if (amount < 50) return { ok: false, reason: "min" };
        if (amount > user.available) return { ok: false, reason: "balance" };
        const id = `p-${Date.now()}`;
        const reference = `PAY-2026-${String(100000 + Math.floor(Math.random() * 899999))}`;
        const payment: Payment = {
          id,
          reference,
          amount,
          status: "Processing",
          date: todayIso(),
          expected: addBusinessDays(new Date(), 4),
          referralId: "",
          candidate: "Wallet withdrawal",
          milestone: "Withdrawal",
          method: `${method.label} ${method.detail}`,
          userId: user.id,
        };
        setLastPayoutId(id);
        setSnap((current) => ({
          ...current,
          payments: [payment, ...current.payments],
          users: current.users.map((item) =>
            item.id === user.id ? { ...item, available: Math.round((item.available - amount) * 100) / 100 } : item,
          ),
          notifications: [
            {
              id: `n-${Date.now()}`,
              group: "Today",
              title: "Withdrawal requested",
              body: `${reference} is processing. Expected ${payment.expected}.`,
              time: "Just now",
              read: false,
              href: `/payments/${id}`,
            },
            ...current.notifications,
          ],
        }));
        return { ok: true, id };
      },
      markAllRead: () =>
        setSnap((current) => ({
          ...current,
          notifications: current.notifications.map((item) => ({ ...item, read: true })),
        })),
      markRead: (id) =>
        setSnap((current) => ({
          ...current,
          notifications: current.notifications.map((item) => (item.id === id ? { ...item, read: true } : item)),
        })),
      removeNotification: (id) =>
        setSnap((current) => ({
          ...current,
          notifications: current.notifications.filter((item) => item.id !== id),
        })),
      pushToast,
      dismissToast: (id) => setToasts((list) => list.filter((item) => item.id !== id)),
      setTheme: (theme) => setSnap((current) => ({ ...current, theme })),
    };
  }, [snap, hydrated, user, toasts, lockedUntil, attempts, pendingSignup, resetEmail, lastPayoutId]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useApp() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}
