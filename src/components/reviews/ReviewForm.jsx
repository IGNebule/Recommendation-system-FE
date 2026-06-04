import { useState } from "react";
import { Link } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const StarRating = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const active = starValue <= value;

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange(starValue)}
            className={`text-3xl transition hover:scale-110 ${
              active ? "text-yellow-400" : "text-white/20 hover:text-yellow-300"
            }`}
            aria-label={`${starValue} stars`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

const ReviewForm = ({ onSubmit, submitting = false }) => {
  const { isAuthenticated, user } = useAuth();

  const [form, setForm] = useState({
    reviewTitle: "",
    message: "",
    rating: 5,
  });

  const [success, setSuccess] = useState("");
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.reviewTitle.trim() || !form.message.trim()) {
      setLocalError("Review title and review message are required.");
      return;
    }

    try {
      setLocalError("");

      await onSubmit(form);

      setForm({
        reviewTitle: "",
        message: "",
        rating: 5,
      });

      setSuccess("Thanks! Your review has been submitted.");

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      setLocalError(err.message || "Failed to submit review");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-6">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
          Leave a Review
        </p>

        <h2 className="mt-3 text-2xl font-black text-white">
          Login to share your experience.
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-white/55">
          Reviews use your profile nickname and avatar automatically.
        </p>

        <Link
          to="/login"
          className="mt-5 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
    >
      <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
        Leave a Review
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        How was your GameRec experience?
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-white/55">
        Posting as{" "}
        <span className="font-semibold text-white">
          {user?.username || user?.name || user?.email}
        </span>
        . Your profile picture and reviewer title will be added automatically.
      </p>

      <div className="mt-6 space-y-5">
        <input
          name="reviewTitle"
          value={form.reviewTitle}
          onChange={handleChange}
          placeholder="Review title"
          className="h-12 w-full rounded-xl border border-white/10 bg-[#100f18] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-500"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Write your review..."
          rows={6}
          className="w-full resize-none rounded-xl border border-white/10 bg-[#100f18] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-500"
        />

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/35">
            Rating
          </p>

          <StarRating
            value={Number(form.rating)}
            onChange={(rating) =>
              setForm((prev) => ({
                ...prev,
                rating,
              }))
            }
          />
        </div>
      </div>

      {(localError || success) && (
        <p
          className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
            localError
              ? "border-red-500/20 bg-red-500/10 text-red-300"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {localError || success}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
