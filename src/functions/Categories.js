import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCategories = async () =>
  await axios.get(`${API_BASE_URL}/categories`);

export const getCategory = async (slug) =>
  await axios.get(`${API_BASE_URL}/category/${slug}`);

export const removeCategory = async (id) =>
  await axios.delete(`${API_BASE_URL}/category/${id}`, {});

export const updateCategory = async (slug, category) =>
  await axios.put(`${API_BASE_URL}/category/${slug}`, category, {});

export const createCategory = async (category) =>
  await axios.post(`${API_BASE_URL}/category`, { category });

export const getCategorySubs = async (_id) =>
  await axios.get(`${API_BASE_URL}/category/subs/${_id}`);
