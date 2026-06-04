import API from "../api/api";

const getReviews = async ({ page = 1, limit = 12 } = {}) => {
  const res = await API.get("/reviews", {
    params: {
      page,
      limit,
    },
  });

  return res.data;
};

const createReview = async ({ reviewTitle, message, rating }) => {
  const res = await API.post("/reviews", {
    reviewTitle,
    message,
    rating,
  });

  return res.data;
};

export default {
  getReviews,
  createReview,
};
