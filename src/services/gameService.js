import API from "../api/api";

const getGames = async ({
  page = 1,
  limit = 15,
  minYear,
  genre,
  tag,
  category,
  sort,
  minReviews,
} = {}) => {
  const res = await API.get("/games", {
    params: {
      page,
      limit,
      minYear,
      genre,
      tag,
      category,
      sort,
      minReviews,
    },
  });

  return res.data;
};

const getGameById = async (appid) => {
  const res = await API.get(`/games/${appid}`);

  return res.data;
};

export default {
  getGames,
  getGameById,
};
