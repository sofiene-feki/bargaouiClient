import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export const getAllMedia = async () => await axios.get(`${API_BASE_URL}/media`);

export const deleteMedia = async (filename) =>
  await axios.delete(`${API_BASE_URL}/media/${filename}`);
