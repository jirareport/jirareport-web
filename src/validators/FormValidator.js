import validations from "validators/validations";

class FormValidator {

    constructor(data, constraints) {
        this._constraints = constraints;
        this._data = data;
    }

    hasErrors = () => {
        const result = {};

        this._constraints.forEach(constraint => {
            const data = this._data[constraint.field];
            if (constraint.method(data) !== constraint.validWhen) {
                result[constraint.field] = [
                    ...(result[constraint.field] || []),
                    constraint.message
                ];
            }
        });

        this._errors = result;

        return !validations.isEmptyObject(this._errors);
    };

    errors = () => {
        return this._errors;
    }

}

export default FormValidator;
