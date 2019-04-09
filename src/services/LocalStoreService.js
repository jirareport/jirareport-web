let key = "persisted-state";

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
            localStorage.removeItem(key);
        } catch {
        }
    }
};
