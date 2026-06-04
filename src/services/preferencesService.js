import API from "../api/api";

const getPreferences = async () => {
  const res = await API.get("/preferences");

  return res.data;
};

const savePreference = async (appid) => {
  const res = await API.post(`/preferences/${appid}`);

  return res.data;
};

const removePreference = async (appid) => {
  const res = await API.delete(`/preferences/${appid}`);

  return res.data;
};

const updatePreferenceWeight = async ({ appid, weight }) => {
  const res = await API.patch(`/preferences/${appid}/weight`, {
    weight,
  });

  return res.data;
};

export default {
  getPreferences,
  savePreference,
  removePreference,
  updatePreferenceWeight,
};
