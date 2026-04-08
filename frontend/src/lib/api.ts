import axios from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = (token: string) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};
