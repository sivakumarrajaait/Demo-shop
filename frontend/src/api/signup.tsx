import api from './api';
import {signup} from './endpoints';
import type { AxiosResponse } from 'axios';

export const Signup=(data: Record<string, unknown>): Promise<AxiosResponse>=>{
    return api.post(`${signup}/register`, data);
}

