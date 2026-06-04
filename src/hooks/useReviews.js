import { useCallback, useEffect, useState } from "react";

import { reviewService } from "../services";

const useReviews = ({ page = 1, limit = 12 } = {}) => {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await reviewService.getReviews({
        page,
        limit,
      });

      setReviews(result.data || []);
      setTotal(result.total || 0);
    } catch (err) {
      setError(err.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

const addReview = async ({ reviewTitle, message, rating }) => {
  try {
    setSubmitting(true);
    setError("");

    const result = await reviewService.createReview({
      reviewTitle,
      message,
      rating,
    });

    setReviews((prev) => [result.review, ...prev]);
    setTotal((prev) => prev + 1);

    return result.review;
  } catch (err) {
    setError(err.message || "Failed to submit review");
    throw err;
  } finally {
    setSubmitting(false);
  }
};

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    total,
    loading,
    submitting,
    error,
    addReview,
    refetch: fetchReviews,
  };
};

export default useReviews;
