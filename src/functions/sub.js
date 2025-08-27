import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export const getSubs = async () => await axios.get(`${API_BASE_URL}/subs`);

export const getSub = async (slug) =>
  await axios.get(`${API_BASE_URL}/sub/${slug}`);

export const removeSub = async (slug, authtoken) =>
  await axios.delete(`${API_BASE_URL}/sub/${slug}`, {});

export const updateSub = async (slug, sub, authtoken) =>
  await axios.put(`${API_BASE_URL}/sub/${slug}`, sub, {});

export const createSub = async (sub, authtoken) =>
  await axios.post(`${API_BASE_URL}/sub`, { sub });
