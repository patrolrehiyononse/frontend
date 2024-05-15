import axios from "axios";
import { response } from "express";

const app = axios.create({
    // baseURL: "http://127.0.0.1:8000/",
    baseURL: "https://gpsrehiyononse.online/",
    // withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
});

app.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // config.withCredentials = true;
            // config.headers['Content-Type'] = 'multipart/form-data';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let refreshSubscribers = [];

app.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response: { status } } = error;
        if (status === 401 && !config._retry) {
            if (!isRefreshing) {
                isRefreshing = true;
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                try {
                    const response = await axios.post('https://gpsrehiyononse.online/api/token/refresh/', { refresh: refreshToken });
                    // const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: refreshToken });
                    const { access: newToken } = response.data;
                    localStorage.setItem('access_token', newToken);
                    isRefreshing = false;

                    // Update the original request headers with the new token
                    config.headers.Authorization = `Bearer ${newToken}`;

                    // Execute the original request with the new token
                    return app(config);
                } catch (refreshError) {
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                } finally {
                    refreshSubscribers = [];
                }
            } else {
                return new Promise((resolve) => {
                    refreshSubscribers.push((token: any) => {
                        config.headers.Authorization = `Bearer ${token}`;
                        resolve(app(config));
                    });
                });
            }
        }

        return Promise.reject(error);
    }
);

export default app;
