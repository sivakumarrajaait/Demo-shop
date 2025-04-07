import api from './api';
import { product } from './endpoints';

import type { AxiosResponse } from 'axios';

export const createProduct = async (data: Record<string, unknown>): Promise<AxiosResponse> => {
  return api.post(`${product}/`, data);
};

export const getProducts = async (): Promise<AxiosResponse> => {
  return api.get(`${product}/`);
};

export const getSingleProduct = async (id: string): Promise<AxiosResponse> => {
  return api.get(`${product}/singleProduct`, { params: { _id: id } });
};

export const updateProduct = async (data: Record<string, unknown>): Promise<AxiosResponse> => {
  return api.put(`${product}/`, data);
};

export const deleteProduct = async (id: string): Promise<AxiosResponse> => {
  return api.delete(`${product}/`, { params: { _id: id } });
};

export const filterProduct = async (data: Record<string, unknown>): Promise<AxiosResponse> => {
  return api.get(`${product}/filter`, { params: data });
};
