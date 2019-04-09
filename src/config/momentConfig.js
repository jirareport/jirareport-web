import moment from "moment";
import ptBrLocale from "moment/locale/pt-br";

moment.updateLocale("pt-br", {
    ...ptBrLocale,
    weekdaysMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
});
