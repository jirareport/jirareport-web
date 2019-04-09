import FormValidator from "validators/FormValidator";
import validations from "validators/validations";

class IssueFilterValidator extends FormValidator {
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
            }
        ]);
    }
}

export default IssueFilterValidator;
