export default {
    cleanFilter: obj => {
        return Object.keys(obj)
            .filter(key => Boolean(obj[key]))
            .reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {});
    }
};
