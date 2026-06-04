import { Link } from "react-router-dom";
import ReviewsSection from "../components/reviews/ReviewsSection"

const techStack = [
  "React + Vite",
  "Tailwind CSS",
  "Node.js + Express",
  "MongoDB",
  "FastAPI",
  "TF-IDF",
  "Cosine Similarity",
  "Steam Dataset",
];

const engineSteps = [
  {
    title: "Game DNA Extraction",
    description:
      "Every game is analyzed through genres, tags, categories, descriptions, themes, mechanics, and player-facing metadata.",
  },
  {
    title: "Text Vectorization",
    description:
      "The system transforms game information into weighted text patterns using TF-IDF, so important terms become mathematically meaningful.",
  },
  {
    title: "Similarity Matching",
    description:
      "Cosine Similarity compares one game profile with thousands of others to find titles with the closest structural and thematic match.",
  },
];

const AboutPage = () => {
  return (
    <div className="mx-auto w-full max-w-[1260px] px-4 py-10 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#100f18] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] md:p-12">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#66c0f4]/10 blur-3xl" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="animate-fade-up">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
              About GameRec
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              Stop scrolling. Start finding games that actually fit you.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
              GameRec exists for the moment when you spend two hours scrolling
              through Steam, a console store, or a massive catalog, only to
              close the page without choosing anything.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/discover"
                className="rounded bg-violet-600 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-violet-500"
              >
                Explore Games
              </Link>

              <a
                href="https://github.com/IGNebule"
                target="_blank"
                rel="noreferrer"
                className="rounded border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white/80 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                View GitHub
              </a>
            </div>
          </div>

          <div className="animate-float-soft rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="rounded-xl bg-[#171622] p-5">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/35">
                Recommendation Concept
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
                  <p className="text-sm font-bold text-violet-200">
                    Input Game
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    Tags, genres, category, description, and game profile
                  </p>
                </div>

                <div className="text-center text-white/35">↓</div>

                <div className="rounded-xl border border-[#66c0f4]/20 bg-[#66c0f4]/10 p-4">
                  <p className="text-sm font-bold text-[#9ddcff]">
                    TF-IDF + Cosine Similarity
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    Mathematical similarity search across the catalog
                  </p>
                </div>

                <div className="text-center text-white/35">↓</div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <p className="text-sm font-bold text-emerald-200">
                    Better Matches
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    Hidden gems and relevant recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* MISSION */}
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="animate-fade-up rounded-2xl border border-white/10 bg-white/[0.035] p-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-red-300">
            The Problem
          </p>

          <h2 className="mt-3 text-2xl font-black">
            The Netflix effect for gaming.
          </h2>

          <p className="mt-4 leading-relaxed text-white/55">
            Modern game stores are overloaded with discounts, trending charts,
            algorithmic hype, and endless thumbnails. The result is familiar:
            too many choices, too little confidence, and a backlog that keeps
            growing.
          </p>
        </div>

        <div className="animate-fade-up rounded-2xl border border-white/10 bg-white/[0.035] p-6 [animation-delay:120ms]">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
            The Mission
          </p>

          <h2 className="mt-3 text-2xl font-black">
            Recommendations based on game DNA.
          </h2>

          <p className="mt-4 leading-relaxed text-white/55">
            GameRec is built to bypass generic popularity and help players find
            games based on actual similarity: themes, tags, mechanics, genre
            structure, descriptions, and player-facing metadata.
          </p>
        </div>
      </section>
      {/* TECHNICAL OVERVIEW */}
      <section className="mt-12">
        <div className="mb-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
            How the Magic Happens
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Our Recommendation Engine
          </h2>

          <p className="mt-3 max-w-3xl text-white/55">
            The system does not only ask “what is popular?” It asks “what is
            structurally similar to the games you already like?”
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {engineSteps.map((step, index) => (
            <article
              key={step.title}
              className="animate-fade-up rounded-2xl border border-white/10 bg-[#100f18] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)]"
              style={{
                animationDelay: `${index * 120}ms`,
              }}
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 font-mono text-sm font-black text-violet-300">
                0{index + 1}
              </div>

              <h3 className="text-lg font-black">{step.title}</h3>

              <p className="mt-3 text-sm leading-relaxed text-white/50">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>
      {/* DATA ATTRIBUTION */}
      <section className="mt-12 rounded-2xl border border-white/10 bg-[#100f18] p-6 md:p-8">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#66c0f4]">
          Data & Attributions
        </p>

        <h2 className="mt-3 text-3xl font-black">
          Built on real game catalog data.
        </h2>

        <p className="mt-4 max-w-4xl leading-relaxed text-white/55">
          GameRec uses a processed Steam game dataset containing game titles,
          descriptions, genres, tags, categories, ratings, playtime statistics,
          screenshots, header images, and media metadata. These fields are
          transformed into frontend-ready catalog data and machine-learning
          content data for recommendation processing.
        </p>

        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-white/40">
          Game assets, names, descriptions, and media belong to their respective
          owners and publishers. This project is intended for educational,
          research, and portfolio purposes.
        </p>
      </section>
      {/* CREATOR + STACK */}
      <section className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
            The Creator
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Independent, passion-driven, and built full-stack.
          </h2>

          <p className="mt-4 leading-relaxed text-white/55">
            This project was built by a developer who enjoys full-stack
            engineering, machine learning, and video games. The goal is not only
            to make a working recommendation system, but also to design a usable
            product experience around it.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/IGNebule"
              target="_blank"
              rel="noreferrer"
              className="rounded bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#100f18] transition hover:bg-white/85"
            >
              GitHub Repository
            </a>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="rounded border border-white/10 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              Portfolio
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#100f18] p-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
            Powered By
          </p>

          <h2 className="mt-3 text-3xl font-black">Project Stack</h2>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {techStack.map((tech) => (
              <div
                key={tech}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/75 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
              >
                {tech}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
            <p className="text-sm leading-relaxed text-violet-100/80">
              The recommendation pipeline is separated into a frontend, a
              Node.js backend, and a FastAPI machine-learning service. This
              keeps the UI, API logic, and ML logic cleanly separated.
            </p>
          </div>
        </div>
      </section>
      <ReviewsSection
        title="Player Experiences"
        description="Discover real-world stories from players who found better game recommendations."
        limit={6}
        showCTA={true}
      />{" "}
    </div>
  );
};

export default AboutPage;