import API from "../api/api";

const getPersonalizedRecommendations = async () => {
  const res = await API.get("/recommendations");

  return res.data;
};

const getGameRecommendations = async (appid) => {
  const res = await API.get(`/recommendations/${appid}`);

  return res.data;
};

export default {
  getPersonalizedRecommendations,
  getGameRecommendations,
};
