import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { PublicNav } from "@/components/Nav";
import heroImg from "@/assets/hero.jpg";
import step1 from "@/assets/step1.jpg";
import step2 from "@/assets/step2.jpg";
import step3 from "@/assets/step3.jpg";
import step4 from "@/assets/step4.jpg";

const WorkflowCanvas = lazy(() =>
  import("@/components/WorkflowCanvas").then(({ WorkflowCanvas: Component }) => ({ default: Component })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jobly | Clearer job matching" },
      {
        name: "description",
        content:
          "A calmer job-matching workspace for candidates and recruiters. Bring your resume, understand each match, and keep every application moving.",
      },
      { property: "og:title", content: "Jobly | Clearer job matching" },
      {
        property: "og:description",
        content: "A calmer way to understand opportunities and keep hiring conversations moving.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  {
    accent: "#8FECC1",
    eyebrow: "Profile intelligence",
    image: step1,
    number: "01",
    title: "Start with what is true.",
    description:
      "Upload your resume once. Jobly turns the skills and experience already there into a profile you can review and refine.",
  },
  {
    accent: "#7CE0B2",
    eyebrow: "Evidence-led matching",
    image: step2,
    number: "02",
    title: "See the fit before you apply.",
    description:
      "Every role is compared with the experience in your profile, so the score is useful context instead of a vague promise.",
  },
  {
    accent: "#57CFA0",
    eyebrow: "Focused review",
    image: step3,
    number: "03",
    title: "Spend time on the right roles.",
    description:
      "Review the requirements, match details, and opportunities in one quiet place before deciding where to invest your energy.",
  },
  {
    accent: "#2FB88A",
    eyebrow: "Connected follow-through",
    image: step4,
    number: "04",
    title: "Apply, then stay in the loop.",
    description:
      "Send an application, track its current status, and keep recruiter conversations attached to the role that started them.",
  },
] as const;

function Landing() {
  return (
    <main className="bg-cream text-ink">
      <PublicNav dark />
      <Hero />
      <ValueStatement />
      <JourneySection />
      <ClosingCall />
      <footer className="border-t border-border bg-cream px-6 py-8 sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-sm text-ink/55">
          <p>(c) 2026 Jobly</p>
          <p>Better job matching for candidates and recruiters.</p>
        </div>
      </footer>
    </main>
  );
}

function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-[100svh] min-h-[640px] items-center overflow-hidden border-b border-border"
    >
      <img
        src={heroImg}
        alt="Person working at a desk"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
      />
      {/* Warm gradient overlay (soft top, deeper bottom) + apricot radial glow for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,42,34,0.30) 0%, rgba(15,42,34,0.55) 55%, rgba(15,42,34,0.78) 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 12% 18%, rgba(143,236,193,0.35) 0%, rgba(143,236,193,0) 70%), radial-gradient(50% 45% at 88% 82%, rgba(47,184,138,0.30) 0%, rgba(47,184,138,0) 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-7xl items-center px-6 pb-24 pt-28 sm:px-10">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="marker-num text-white/85"
          >
            A softer way to look for work
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-display mt-5 max-w-3xl text-[clamp(2.9rem,6.2vw,6.2rem)] font-extrabold tracking-[-0.01em] text-white [text-shadow:0_4px_28px_rgb(43_23_25_/_0.4)]"
          >
            Jobly helps you find the role that feels right.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/88 sm:text-xl"
          >
            Bring your resume, follow the fit, and keep every application and conversation in one friendly place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link to="/auth" className="pill-mint-lg gap-2">
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#journey"
              className="inline-flex min-h-12 items-center gap-2 px-3 text-sm font-semibold text-white transition-all duration-200 hover:translate-y-[-1px] hover:text-white/80"
            >
              Explore the workflow
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decorative spline divider at the bottom of the hero */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-16 w-full"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z"
          fill="var(--cream)"
        />
      </svg>
    </section>
  );
}


function ValueStatement() {
  const principles = [
    "Use your real resume as the source of truth.",
    "Understand why a role is relevant before applying.",
    "Keep the application and the conversation together.",
  ];

  return (
    <section id="statement" className="border-b border-border bg-panel px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
        <div>
          <p className="marker-num text-ink/60">A better way to choose</p>
          <h2 className="font-display mt-5 max-w-xl text-[clamp(2.3rem,4.4vw,4.5rem)] text-ink">
            Less noise. Better next moves.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/72">
            Jobly is built around the decisions that matter: what your resume says, how a role aligns, and what happens after you apply.
          </p>
        </div>
        <ol className="border-t border-ink/15">
          {principles.map((principle, index) => (
            <li key={principle} className="flex gap-5 border-b border-ink/15 py-5 text-base text-ink/80 sm:text-lg">
              <span className="marker-num pt-1 text-warm">0{index + 1}</span>
              <span>{principle}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const isDesktop = useDesktopCanvas();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    const nextIndex = Math.min(STEPS.length - 1, Math.floor(latest * STEPS.length));
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  const activeStep = STEPS[activeIndex];

  return (
    <section id="journey" ref={sectionRef} className="relative bg-cream">
      <div className="relative hidden h-[400vh] md:block">
        <div className="sticky top-0 h-screen overflow-hidden">
          <WorkflowFallback visible={!isDesktop || !canvasReady} />
          {isDesktop ? (
            <div className="pointer-events-none absolute inset-y-0 left-[42%] right-0" aria-hidden="true">
              <Suspense fallback={null}>
                <WorkflowCanvas
                  onReady={() => setCanvasReady(true)}
                  reducedMotion={shouldReduceMotion ?? false}
                  scrollProgress={scrollYProgress}
                  steps={STEPS}
                />
              </Suspense>
            </div>
          ) : null}

          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between px-6 pb-10 pt-28 sm:px-10">
            <div className="max-w-md">
              <p className="marker-num text-ink/60">The four-step workflow</p>
              <motion.div
                key={activeStep.number}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mt-6"
              >
                <p className="marker-num text-warm">
                  Step {activeStep.number} | {activeStep.eyebrow}
                </p>
                <h2 className="font-display mt-4 text-[clamp(2.5rem,4.5vw,4.8rem)] text-ink">
                  {activeStep.title}
                </h2>
                <p className="mt-5 max-w-sm text-lg leading-relaxed text-ink/72">
                  {activeStep.description}
                </p>
              </motion.div>
            </div>

            <div className="flex items-end justify-between gap-10">
              <ol className="grid max-w-3xl grid-cols-4 gap-x-5 border-t border-ink/20 pt-4">
                {STEPS.map((step, index) => (
                  <li key={step.number} className={index === activeIndex ? "text-ink" : "text-ink/45"}>
                    <span className="marker-num block">{step.number}</span>
                    <span className="mt-1 block text-sm font-semibold leading-snug">{step.eyebrow}</span>
                  </li>
                ))}
              </ol>

              <div className="hidden text-right lg:block">
                <p className="marker-num text-ink/55">Scroll to move through the process</p>
                <div className="mt-3 h-px w-32 bg-ink/20">
                  <motion.div
                    className="h-px origin-left bg-ink"
                    style={{ scaleX: scrollYProgress }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-20 sm:px-10 md:hidden">
        <p className="marker-num text-ink/60">The four-step workflow</p>
        <h2 className="font-display mt-5 max-w-lg text-[clamp(2.4rem,11vw,4rem)] text-ink">
          A job search with better context.
        </h2>
        <ol className="mt-12 border-t border-ink/15">
          {STEPS.map((step) => (
            <li key={step.number} className="border-b border-ink/15 py-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="marker-num text-warm">Step {step.number}</p>
                  <h3 className="font-display mt-3 text-3xl text-ink">{step.title}</h3>
                </div>
                <span className="marker-num pt-1 text-right text-ink/55">{step.eyebrow}</span>
              </div>
              <p className="mt-4 text-base leading-relaxed text-ink/72">{step.description}</p>
              <div className="mt-6 overflow-hidden rounded-md border border-border bg-white p-2 shadow-soft">
                <img src={step.image} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <div className="mt-2 h-1" style={{ backgroundColor: step.accent }} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function WorkflowFallback({ visible }: { visible: boolean }) {
  const positions = [
    "left-[52%] top-[23%] z-20 -rotate-[4deg]",
    "right-[9%] top-[15%] z-10 rotate-[8deg] scale-90",
    "right-[17%] bottom-[9%] z-0 rotate-[14deg] scale-75",
    "left-[43%] bottom-[14%] z-10 -rotate-[11deg] scale-90",
  ];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {STEPS.map((step, index) => (
        <figure
          key={step.number}
          className={`absolute h-[360px] w-[270px] border border-border bg-white p-3 shadow-soft lg:h-[420px] lg:w-[315px] ${positions[index]}`}
        >
          <img src={step.image} alt="" className="h-[calc(100%-26px)] w-full object-cover" />
          <figcaption className="mt-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: step.accent }} />
            <span className="marker-num text-ink/50">Step {step.number}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function ClosingCall() {
  return (
    <section id="cta" className="border-t border-border bg-cream px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="marker-num text-ink/60">Make the next move</p>
          <h2 className="font-display mt-5 text-[clamp(2.5rem,5vw,5rem)] text-ink">
            Bring your resume. Leave with a clearer plan.
          </h2>
        </div>
        <Link to="/auth" className="pill-mint-lg shrink-0 gap-2">
          Start with Jobly
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function useDesktopCanvas() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isDesktop;
}
