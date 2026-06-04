import API from "../api/api";

const getTrendingGames = async ({
  page = 1,
  limit = 15,
  minYear,
  genre,
  tag,
  category,
} = {}) => {
  const res = await API.get("/discover/trending", {
    params: {
      page,
      limit,
      minYear,
      genre,
      tag,
      category
    },
  });

  return res.data;
};

const getTopRatedGames = async ({
  page = 1,
  limit = 15,
  minReviews = 100,
  minYear,
  genre,
  tag,
  category,
} = {}) => {
  const res = await API.get("/discover/top-rated", {
    params: {
      page,
      limit,
      minReviews,
      minYear,
      genre,
      tag,
      category,
    },
  });

  return res.data;
};

const getMostPlayedGames = async ({
  page = 1,
  limit = 15,
  minYear,
  genre,
  tag,
  category,
} = {}) => {
  const res = await API.get("/discover/most-played", {
    params: {
      page,
      limit,
      minYear,
      genre,
      tag,
      category,
    },
  });

  return res.data;
};

export default {
  getTrendingGames,
  getTopRatedGames,
  getMostPlayedGames,
};
