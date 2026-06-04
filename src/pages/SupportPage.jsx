import useReviews from "../hooks/useReviews";

import ReviewForm from "../components/reviews/ReviewForm";
import ReviewsSection from "../components/reviews/ReviewsSection";

const SupportPage = () => {
  const { addReview, submitting } = useReviews({
    limit: 12,
  });

  return (
    <div className="mx-auto w-full max-w-[1260px] px-4 py-10 text-white">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#100f18] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] md:p-12">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#66c0f4]/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative z-10">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#66c0f4]">
            Support & Community
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Share your GameRec experience.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            Your nickname, avatar, and reviewer title are taken from your
            profile automatically. Just write the review.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <ReviewForm onSubmit={addReview} submitting={submitting} />

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/35">
            Reviewer Titles
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            Your title grows with your library.
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-white/55">
            GameRec checks your saved preferences and assigns a title to your
            review automatically.
          </p>

          <div className="mt-6 grid gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-bold text-white">New Explorer</p>
              <p className="mt-1 text-xs text-white/45">0–4 saved games</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-bold text-white">Game Scout</p>
              <p className="mt-1 text-xs text-white/45">5+ saved games</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-bold text-white">Genre Explorer</p>
              <p className="mt-1 text-xs text-white/45">10+ saved games</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-bold text-white">Library Curator</p>
              <p className="mt-1 text-xs text-white/45">30+ saved games</p>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection
        title="Player Experiences"
        description="Discover real stories from players who tried the recommendation experience."
        limit={6}
      />
    </div>
  );
};

export default SupportPage;
