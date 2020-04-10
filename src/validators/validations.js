export default {
    isEmptyObject: obj => {
        console.log(obj)
        return Object.entries(obj).length === 0 && obj.constructor === Object
    },
    isEmpty: str =>
        !str
};
