import axios from "axios";

import * as querystring from "query-string";
import { AlertService, NotificationService } from "services";

import store from "stores/store";
import { authActions } from "stores/ducks/auth";

const { REACT_APP_API_URL: API_URL } = process.env;

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        "Accept-Language": "pt-BR"
    },
    paramsSerializer: params => querystring.stringify(params)
});

let authInterceptor;

instance.interceptors.response.use(
    response => response,
    error => {
        const { response } = error;
        if (response) {
            if (response.status === 500) {
                AlertService.internalServerError((response.data || {}).traceId);
            } else if (response.status === 401) {
                NotificationService.notifyError("Falha ao realizar autenticação");
                store.dispatch(authActions.logout());
            }
        }

        return Promise.reject(error);
    }
);

export default {
    initAuthInterceptor: token => {
        authInterceptor = instance.interceptors.request.use(config => {
            config.headers["X-Auth-Token"] = token;
            return config;
        });
    },
    removeAuthInterceptor: () => {
        instance.interceptors.request.eject(authInterceptor);
    },
    get: (...args) => instance.get.apply(this, args),
    post: (...args) => instance.post.apply(this, args),
    put: (...args) => instance.put.apply(this, args),
    delete: (...args) => instance.delete.apply(this, args),
    axios: instance
};
