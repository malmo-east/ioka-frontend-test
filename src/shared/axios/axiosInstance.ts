import axios, { AxiosRequestConfig } from 'axios';

import { BASE_URL, API_KEY } from '../../constants';

export function getApiKeyHeader(): Record<string, string> {
    return { "API-KEY": `${API_KEY}` };
}

const config: AxiosRequestConfig = { baseURL: BASE_URL, headers: {...getApiKeyHeader()} };
export const axiosInstance = axios.create(config);