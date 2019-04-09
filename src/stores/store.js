import { combineReducers, createStore } from "redux";

import authReducer from "./ducks/auth";

import { HttpService, LocalStoreService } from "services";

const reducers = combineReducers({
    auth: authReducer
});

const persistedState = LocalStoreService.loadState();

if (persistedState && persistedState.auth && persistedState.auth.token) {
    HttpService.initAuthInterceptor(persistedState.auth.token);
}

const store = createStore(reducers, persistedState);

store.subscribe(() => {
    LocalStoreService.saveState({
        auth: store.getState().auth
    });
});

export default store;
