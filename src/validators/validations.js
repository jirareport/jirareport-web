export default {
    isEmptyObject: obj =>
        !obj || (Object.entries(obj).length === 0 && obj.constructor === Object),
    isEmpty: str =>
        !str
};
