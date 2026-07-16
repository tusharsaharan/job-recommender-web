import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { CountUp } from "@/components/fx/CountUp";
import { useAuth } from "@/lib/auth";
import { apiCall } from "@/lib/api";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Overview | Jobly" },
      { name: "description", content: "Your Jobly workspace overview." },
    ],
  }),
  component: Dashboard,
});

interface JobSummary {
  _id: string;
  company?: string;
  createdAt?: string;
  title?: string;
}

interface ApplicationSummary {
  _id: string;
  atsScore?: number;
  createdAt?: string;
  seeker?: { name?: string };
  job?: { company?: string; title?: string };
  status?: string;
}

function Dashboard() {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);

  useEffect(() => {
    if (!token) return;

    let active = true;
    const loadWorkspace = async () => {
      const [jobsResult, applicationsResult] = await Promise.all([
        apiCall<unknown[]>(user?.role === "recruiter" ? "/jobs" : "/jobs/match", "GET", null, token).catch(() => []),
        apiCall<unknown[]>(
          user?.role === "recruiter" ? "/applications/recruiter" : "/applications/me",
          "GET",
          null,
          token,
        ).catch(() => []),
      ]);

      if (!active) return;
      setJobs(Array.isArray(jobsResult) ? jobsResult as JobSummary[] : []);
      setApplications(Array.isArray(applicationsResult) ? applicationsResult as ApplicationSummary[] : []);
    };

    const reloadWhenVisible = () => {
      if (document.visibilityState === "visible") void loadWorkspace();
    };

    void loadWorkspace();
    window.addEventListener("focus", loadWorkspace);
    document.addEventListener("visibilitychange", reloadWhenVisible);
    return () => {
      active = false;
      window.removeEventListener("focus", loadWorkspace);
      document.removeEventListener("visibilitychange", reloadWhenVisible);
    };
  }, [token, user?.id, user?._id, user?.role, user?.resumeText]);

  const isRecruiter = user?.role === "recruiter";
  const workspace = useMemo(() => summarizeWorkspace(jobs, applications), [jobs, applications]);

  return isRecruiter ? (
    <RecruiterOverview name={user?.name} workspace={workspace} />
  ) : (
    <CandidateOverview hasResume={Boolean(user?.resumeText)} name={user?.name} workspace={workspace} />
  );
}

function RecruiterOverview({ name, workspace }: { name?: string; workspace: WorkspaceSummary }) {
  const firstName = name?.trim().split(/\s+/)[0] || "there";

  return (
    <main className="mx-auto max-w-7xl px-6 pb-16 pt-28 sm:px-10">
      <header className="flex flex-col justify-between gap-8 border-b border-border pb-8 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <p className="marker-num">Recruiting workspace | live pipeline</p>
          <h1 className="font-display mt-4 text-[clamp(2.7rem,5.4vw,5.5rem)] text-ink">
            Good to see you, {firstName}.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/68">
            Your current hiring picture, grounded in the roles and candidates already in the workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/post-job" className="pill-mint">
            Post a role
          </Link>
          <Link
            to="/applicants"
            className="inline-flex min-h-10 items-center rounded-md border border-border px-4 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            Review applicants
          </Link>
        </div>
      </header>

      <dl className="grid divide-y divide-border border-b border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        <Metric label="Open roles" value={workspace.jobs.length} />
        <Metric label="Applications" value={workspace.applications.length} />
        <Metric label="Average fit" value={workspace.averageScore} suffix="%" />
        <Metric label="Shortlisted" value={workspace.shortlisted} />
      </dl>

      <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="surface p-6 sm:p-7"
          aria-labelledby="application-activity-heading"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="marker-num">Applicant activity</p>
              <h2 id="application-activity-heading" className="font-display mt-2 text-2xl text-ink">Last seven days</h2>
            </div>
            <p className="text-sm text-ink/55">Live application volume</p>
          </div>
          <div className="mt-7 h-52 sm:h-64">
            {workspace.applications.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={workspace.activity} margin={{ bottom: 0, left: -20, right: 0, top: 4 }}>
                  <XAxis
                    axisLine={false}
                    dataKey="label"
                    tick={{ fill: "#0F2A22B3", fontSize: 12 }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ border: "1px solid #C7EFDD", borderRadius: 8, boxShadow: "0 14px 30px -22px rgba(26, 38, 51, 0.35)" }}
                    cursor={{ stroke: "#B7F1D5", strokeWidth: 1 }}
                    formatter={(value) => [value, "Applications"]}
                  />
                  <Area
                    dataKey="applications"
                    fill="#D6F5E5"
                    fillOpacity={0.82}
                    stroke="#1F8F6A"
                    strokeWidth={2.25}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyGraphic label="Application activity will appear here once candidates apply." />
            )}
          </div>
        </motion.section>

        <section className="surface p-6 sm:p-7" aria-labelledby="pipeline-heading">
          <p className="marker-num">Pipeline composition</p>
          <h2 id="pipeline-heading" className="font-display mt-2 text-2xl text-ink">Where candidates are now</h2>
          <div className="mt-8 space-y-6">
            <PipelineBar label="New" value={workspace.applied} total={workspace.applications.length} color="bg-[#B7F1D5]" />
            <PipelineBar label="Shortlisted" value={workspace.shortlisted} total={workspace.applications.length} color="bg-[#57CFA0]" />
            <PipelineBar label="Closed" value={workspace.rejected} total={workspace.applications.length} color="bg-[#7CB8A2]" />
          </div>
          <Link to="/applicants" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-ink/65">
            Open candidate pipeline
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </section>

      <section className="mt-10 border-y border-border py-7" aria-labelledby="recent-applicants-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="marker-num">Latest activity</p>
            <h2 id="recent-applicants-heading" className="font-display mt-2 text-3xl text-ink">Recent candidates</h2>
          </div>
          <Link to="/applicants" className="text-sm font-semibold text-ink hover:text-ink/65">See all applicants</Link>
        </div>
        <div className="mt-6 divide-y divide-border">
          {workspace.recentApplications.length > 0 ? workspace.recentApplications.map((application) => (
            <div key={application._id} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{application.seeker?.name || "Candidate"}</p>
                <p className="mt-1 truncate text-sm text-ink/55">{application.job?.title || "Role"}</p>
              </div>
              <StatusLabel status={application.status} />
              <p className="text-sm font-semibold text-ink/72">{typeof application.atsScore === "number" ? `${Math.round(application.atsScore)}% fit` : "Score pending"}</p>
            </div>
          )) : <p className="py-8 text-sm leading-6 text-ink/60">No candidate activity yet. Publish a role when you are ready to start the pipeline.</p>}
        </div>
      </section>
    </main>
  );
}

function CandidateOverview({
  hasResume,
  name,
  workspace,
}: {
  hasResume: boolean;
  name?: string;
  workspace: WorkspaceSummary;
}) {
  const firstName = name?.trim().split(/\s+/)[0] || "there";
  const primaryPath = hasResume ? "/jobs" : "/resume";
  const primaryLabel = hasResume ? "Browse matched roles" : "Upload your resume";

  return (
    <main className="mx-auto max-w-7xl px-6 pb-16 pt-28 sm:px-10">
      <header className="flex flex-col justify-between gap-8 border-b border-border pb-8 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <p className="marker-num">Candidate workspace</p>
          <h1 className="font-display mt-4 text-[clamp(2.7rem,5.4vw,5.5rem)] text-ink">Welcome back, {firstName}.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/68">
            {hasResume
              ? "Your resume is ready. Review where your experience aligns, then keep every application in view."
              : "Upload a resume to turn it into a profile and see evidence-led role matches."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={primaryPath} className="pill-mint">
            {primaryLabel}
          </Link>
          <Link
            to="/applications"
            className="inline-flex min-h-10 items-center rounded-md border border-border px-4 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            Applications
          </Link>
        </div>
      </header>

      <dl className="grid divide-y divide-border border-b border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <Metric label="Matched roles" value={workspace.jobs.length} />
        <Metric label="Applications" value={workspace.applications.length} />
        <Metric label="Average fit" value={workspace.averageScore} suffix="%" />
      </dl>

      <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
        <section className="surface p-6 sm:p-7" aria-labelledby="candidate-pulse-heading">
          <p className="marker-num">Application pulse</p>
          <h2 id="candidate-pulse-heading" className="font-display mt-2 text-2xl text-ink">Your pipeline at a glance</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <PipelineDatum label="Submitted" value={workspace.applied} />
            <PipelineDatum label="Shortlisted" value={workspace.shortlisted} tone="text-[#1F8F6A]" />
            <PipelineDatum label="Closed" value={workspace.rejected} tone="text-[#0F2A22]" />
          </div>
          <Link to="/applications" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-ink/65">
            Review your applications
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>

        <section className="surface p-6 sm:p-7">
          <p className="marker-num">Next best move</p>
          <h2 className="font-display mt-2 text-2xl text-ink">{hasResume ? "Explore fit, not just volume." : "Build the profile first."}</h2>
          <p className="mt-4 text-sm leading-6 text-ink/65">
            {hasResume
              ? "Each role can show a detailed score before you apply, so you can decide with the requirements in view."
              : "Your resume unlocks role matching, score explanations, and a clearer application history."}
          </p>
        </section>
      </section>
    </main>
  );
}

function Metric({
  label,
  suffix = "",
  value,
}: {
  label: string;
  suffix?: string;
  value: number;
}) {
  return (
    <div className="py-6 sm:px-6 sm:first:pl-0 lg:px-7">
      <dt className="text-sm font-semibold text-ink/60">{label}</dt>
      <dd className="font-display mt-3 text-4xl text-ink">
        <CountUp to={value} />{suffix}
      </dd>
    </div>
  );
}

function PipelineBar({ color, label, total, value }: { color: string; label: string; total: number; value: number }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-semibold text-ink/75">{label}</span>
        <span className="font-mono text-xs text-ink/55">{value} | {percentage}%</span>
      </div>
      <div className="mt-2 h-1.5 bg-ink/10">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function PipelineDatum({ label, tone = "text-ink", value }: { label: string; tone?: string; value: number }) {
  return (
    <div className="border-l-2 border-ink/12 pl-4">
      <p className="marker-num">{label}</p>
      <p className={`font-display mt-2 text-4xl ${tone}`}>{value}</p>
    </div>
  );
}

function StatusLabel({ status }: { status?: string }) {
  const normalized = status || "applied";
  const className = normalized === "shortlisted"
    ? "border-[#57CFA0] bg-[#D6F5E5] text-[#0F5A44]"
    : normalized === "rejected"
      ? "border-[#B7DFCE] bg-[#F1FAF5] text-[#2F5E4E]"
      : "border-[#C7EFDD] bg-[#EFFBF4] text-[#1F8F6A]";

  return <span className={`w-fit rounded-md border px-2.5 py-1 text-xs font-semibold capitalize ${className}`}>{normalized}</span>;
}

function EmptyGraphic({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center border-y border-dashed border-border px-6 text-center text-sm leading-6 text-ink/55">
      {label}
    </div>
  );
}

interface WorkspaceSummary {
  activity: { applications: number; label: string }[];
  applied: number;
  applications: ApplicationSummary[];
  averageScore: number;
  jobs: JobSummary[];
  recentApplications: ApplicationSummary[];
  rejected: number;
  shortlisted: number;
}

function summarizeWorkspace(jobs: JobSummary[], applications: ApplicationSummary[]): WorkspaceSummary {
  const scoredApplications = applications.filter((application) => typeof application.atsScore === "number");
  const averageScore = scoredApplications.length > 0
    ? Math.round(scoredApplications.reduce((sum, application) => sum + (application.atsScore ?? 0), 0) / scoredApplications.length)
    : 0;
  const applied = applications.filter((application) => application.status !== "shortlisted" && application.status !== "rejected").length;
  const shortlisted = applications.filter((application) => application.status === "shortlisted").length;
  const rejected = applications.filter((application) => application.status === "rejected").length;
  const activity = buildActivity(applications);
  const recentApplications = [...applications]
    .sort((left, right) => dateValue(right.createdAt) - dateValue(left.createdAt))
    .slice(0, 5);

  return { activity, applied, applications, averageScore, jobs, recentApplications, rejected, shortlisted };
}

function buildActivity(applications: ApplicationSummary[]) {
  const formatter = new Intl.DateTimeFormat(undefined, { weekday: "short" });
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return {
      applications: 0,
      key: date.toISOString().slice(0, 10),
      label: formatter.format(date),
    };
  });
  const byDate = new Map(days.map((day) => [day.key, day]));

  applications.forEach((application) => {
    if (!application.createdAt) return;
    const date = new Date(application.createdAt);
    if (Number.isNaN(date.getTime())) return;
    const day = byDate.get(date.toISOString().slice(0, 10));
    if (day) day.applications += 1;
  });

  return days.map(({ applications: count, label }) => ({ applications: count, label }));
}

function dateValue(value?: string) {
  const date = value ? new Date(value).getTime() : 0;
  return Number.isFinite(date) ? date : 0;
}
