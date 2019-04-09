export const Types = {
    LOGIN: "auth/LOGIN",
    LOGOUT: "auth/LOGOUT",
    UPDATE_CONFIG: "auth/UPDATE_CONFIG"
};

const initialState = {
    isLoggedIn: false,
    token: null,
    userConfig: {
        username: null,
        leadTimeChartType: "LINE",
        throughputChartType: "BAR"
    }
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case Types.LOGIN:
            return {
                ...state,
                isLoggedIn: true,
                token: action.token,
                userConfig: action.userConfig
            };
        case Types.LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                token: null,
                userConfig: {}
            };
        case Types.UPDATE_CONFIG:
            return {
                ...state,
                userConfig: action.userConfig
            };
        default:
            return state;
    }
}

export const authActions = {
    login: (token, userConfig) => ({
        type: Types.LOGIN,
        token,
        userConfig
    }),

    logout: () => ({
        type: Types.LOGOUT
    }),

    updateUserConfig: userConfig => ({
        type: Types.UPDATE_CONFIG,
        userConfig
    })
};

