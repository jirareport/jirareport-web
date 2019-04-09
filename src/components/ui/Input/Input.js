import React, { Component } from "react";

import classnames from "classnames";

class Input extends Component {
    componentDidUpdate(prevProps) {
        if (this.props.errors !== prevProps.errors) {
            this.refs.input.focus();
        }
    }

    render() {
        const { name, onChange, value, label, help, errors } = this.props;

        const id = `input-${name}`;
        return <>
            <input id={id}
                   ref="input"
                   type="text"
                   name={name}
                   onChange={onChange}
                   value={value || ""}
                   {...this.props}/>
            <label htmlFor={id} className={classnames({
                "active": Boolean(value)
            })}>{label}</label>
            {help && <span className="helper-text">{help}</span>}
            {errors && errors.map(e => <span key={e} className="helper-text red-text darken-1">{e}</span>)}
        </>;
    }
}

export default Input;
