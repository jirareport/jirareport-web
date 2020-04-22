import Swal from "sweetalert2";

const AlertService = {
    confirmRemove() {
        return Swal.fire({
            type: "warning",
            title: "Tem certeza?",
            text: "Essa ação não poderá ser desfeita.",
            confirmButtonText: "Remover",
            confirmButtonClass: "btn red darken-1 waves-light",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonClass: "btn blue lighten-1 waves-light",
            reverseButtons: true,
            buttonsStyling: false
        }).then(result => result.value);
    },

    internalServerError(traceId) {
        return Swal.fire({
            title: "Ocorreu um erro interno, tente novamente mais tarde.",
            html: ` <h5>Para ajudar a investigar o problema envie <strong>"${traceId}"</strong> para um administrador.</h5> `,
            type: "error",
            width: "40%",
            confirmButtonClass: "btn blue lighten-1 waves-light",
            confirmButtonText: "Fechar",
            buttonsStyling: false
        });
    }
};


export default AlertService;
