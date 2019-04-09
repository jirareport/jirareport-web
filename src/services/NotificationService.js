import * as M from "materialize-css";

export default {
    notifySuccess: message => {
        M.toast({
            html: message,
            classes: "green darken-1"
        });
    },
    notifyError: message => {
        M.toast({
            html: message,
            classes: "red darken-1"
        });
    }
};
