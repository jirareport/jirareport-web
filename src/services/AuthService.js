import HttpService from "./HttpService";
import LocalStoreService from "services/LocalStoreService";

export default {
    login: async (username, password) => {
        const bodyFormData = new FormData();
        bodyFormData.set("username", username);
        bodyFormData.set("password", password);

        const loginResponse = await HttpService.axios({
            method: "POST",
            url: "/login",
            data: bodyFormData,
            config: {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        });

        const token = loginResponse.headers["x-auth-token"];
        HttpService.initAuthInterceptor(token);
        const userConfig = await HttpService.get("/users/me/configs");

        return {
            token,
            userConfig: userConfig.data
        };
    },
    logout: async () => {
        LocalStoreService.cleanState();
        HttpService.removeAuthInterceptor();
    }
};


