import api from './api';
import {login} from './endpoints';
import type { AxiosResponse } from 'axios';

export const LoginUser=(data:Record<string, unknown>): Promise<AxiosResponse>=>{
    return api.post(`${login}/`, data);
}