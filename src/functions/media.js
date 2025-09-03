import axios from "axios";

const API_BASE_URL = "https://bargaouiserver.onrender.com/api";

export const getAllMedia = async () => await axios.get(`${API_BASE_URL}/media`);

export const deleteMedia = async (filename) =>
  await axios.delete(`${API_BASE_URL}/media/${filename}`);
