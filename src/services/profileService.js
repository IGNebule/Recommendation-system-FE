import API from "../api/api";

const getMe = async () => {
  const res = await API.get("/profile/me");

  return res.data;
};

const updateProfile = async ({ name, username, bio }) => {
  const res = await API.put("/profile/me", {
    name,
    username,
    bio,
  });

  return res.data;
};

const updateAvatar = async (file) => {
  const formData = new FormData();

  formData.append("avatar", file);

  const res = await API.put("/profile/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export default {
  getMe,
  updateProfile,
  updateAvatar,
};
