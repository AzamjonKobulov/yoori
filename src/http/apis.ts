import axios from "axios";

export const apiID = axios.create({
    baseURL: "https://api-dev.id.yoori.ru",
    withCredentials: true,
});
export const apiCP = axios.create({
    baseURL: "https://api-dev.yoori.pro",
    withCredentials: true,
});

//########### JWT ###########

apiCP.interceptors.request.use((config: any) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (config.url === "https://api-dev.id.yoori.ru/auth/v1/refresh/") {
        delete apiCP.defaults.headers.Authorization;
    }

    return config;
});

apiID.interceptors.request.use((config: any) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (config.url === "https://api-dev.id.yoori.ru/auth/v1/refresh/") {
        delete apiID.defaults.headers.Authorization;
    }

    return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];
const Queue = (token: any) => {
    for (let i = 0; i < failedQueue.length; i++) {
        failedQueue[i](token);
    }
    failedQueue = [];
};

const refresh = async (refresh_token: string) =>
    apiID
        .post("/auth/v1/refresh/", { refresh_token })
        .then((response) => {
            const accessToken = response.data.access_token;
            const refreshToken = response.data.refresh_token;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            Queue(accessToken);
        })
        .catch((err) => {
            Queue(null);
        });

apiCP.interceptors.response.use(null, async (error) => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (error.response.status === 401 && !error.config._retry) {
        if (isRefreshing) {
            return new Promise((token) => {
                failedQueue.push(token);
            })
                .then((token) => {
                    error.config.headers.Authorization = `Bearer + ${token}`;
                    error.config.retry;
                    return apiCP(error.config);
                })
                .catch((err) => Promise.reject(err));
        }
        error.config._retry = true;
        isRefreshing = true;
        await refresh(String(refreshToken)).finally(
            () => (isRefreshing = false)
        );
        error.config.headers.Authorization = `Bearer + ${localStorage.getItem("accessToken")}`;
        return apiCP(error.config);
    }
    if (error.response.status === 401)
        window.location.href = "/auth/sign-in";
    return Promise.reject(error);
});

apiID.interceptors.response.use(null, async (error) => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (error.response.status === 401 && !error.config._retry) {
        if (isRefreshing) {
            return new Promise((token) => {
                failedQueue.push(token);
            })
                .then((token) => {
                    error.config.headers.Authorization = `Bearer + ${token}`;
                    error.config.retry;
                    return apiID(error.config);
                })
                .catch((err) => Promise.reject(err));
        }
        error.config._retry = true;
        isRefreshing = true;
        await refresh(String(refreshToken)).finally(
            () => (isRefreshing = false)
        );
        error.config.headers.Authorization = `Bearer + ${localStorage.getItem("accessToken")}`;
        return apiID(error.config);
    }
    if (error.response.status === 401)
        window.location.href = "/auth/sign-in";
    return Promise.reject(error);
});

//########### CSRF ###########

async function refreshCSRF(apiInstance: any, docsPath = "/docs") {
    const res = await apiInstance.get(docsPath);
    console.log(res);
}

apiID.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 403 && !error.config._retry) {
            error.config._retry = true;
            await refreshCSRF(apiID);
            return apiID(error.config);
        }
        return Promise.reject(error);
    }
);

apiCP.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 403 && !error.config._retry) {
            error.config._retry = true;
            await refreshCSRF(apiCP);
            return apiCP(error.config);
        }
        return Promise.reject(error);
    }
);