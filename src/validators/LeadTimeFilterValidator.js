import FormValidator from "validators/FormValidator";
import validations from "validators/validations";

class LeadTimeFilterValidator extends FormValidator {
    constructor(data) {
        super(data, [
            {
                field: "startDate",
                method: validations.isEmpty,
                validWhen: false,
                message: "Não pode ser vazio."
            },
            {
                field: "endDate",
                method: validations.isEmpty,
                validWhen: false,
                message: "Não pode ser vazio."
            },
            {
                field: "field",
                method: validations.isEmpty,
                validWhen: false,
                message: "Não pode ser vazio."
            }
        ]);
    }
}

export default LeadTimeFilterValidator;
