let key = "persisted-state";
let i18n_key = 'i18n-key'

export default {
    loadState: () => {
        try {
            const serializedState = localStorage.getItem(key);
            if (serializedState === null) {
                return undefined;
            }
            return JSON.parse(serializedState);
        } catch (err) {
            return undefined;
        }
    },
    saveState: state => {
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem(key, serializedState);
        } catch {
        }
    },
    cleanState: () => {
        try {
            localStorage.removeItem(key)
        } catch {
        }
    },
    setI18n: value => {
        localStorage.setItem(i18n_key, value)
    },
    getI18n: () => 
        localStorage.getItem(i18n_key),
};
