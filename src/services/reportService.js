import API from "../api/api";

const getReport = async () => {
  const res = await API.get("/reports");

  return res.data;
};

const debugVector = async (text) => {
  const res = await API.post("/reports/debug", {
    text,
  });

  return res.data;
};

export default {
  getReport,
  debugVector,
};
