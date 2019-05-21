import React, { Component } from "react";

import PropTypes from "prop-types";
import classnames from "classnames";

import ReactSelect from "react-select";
import { Chip } from "components/ui";

import MenuList from "./MenuList";

import "./Select.scss";

const customStyles = {
    menu: (provided) => ({
        ...provided,
        zIndex: 3,
        borderRadius: 0,
        boxShadow: "none"
    }),
    menuList: (provided) => ({
        ...provided,
        padding: 0,
        boxShadow: "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);"
    }),
    option: (provided) => ({
        ...provided,
        backgroundColor: "#fff",
        color: "#444",
        "&:hover": {
            backgroundColor: "rgba(0,0,0,0.08)"
        },
        padding: "14px 16px"
    }),
    container: provided => ({
        ...provided,
        outline: "none"
    }),
    valueContainer: provided => ({
        ...provided,
        outline: "none",
        paddingLeft: 0
    }),
    control: (provided, state) => {
        return ({
            ...provided,
            borderColor: "transparent",
            boxShadow: state.isFocused ? "0 1px 0 0 #42A5F5" : "none",
            border: "none",
            borderRadius: 0,
            borderBottom: state.isFocused ? "1px solid #42A5F5" : "1px solid #9e9d9e",
            outline: "none",
            "&:hover": {
                borderColor: "none"
            }
        });
    },
    singleValue: provided => ({
        ...provided,
        color: "#070f17",
        fontSize: "16px"
    })
};

const IndicatorSeparator = () => {
    return <></>;
};

const DropdownIndicator = props => {
    return <i className={classnames("material-icons", {
        "react-select__dropdown-indicator--focused": props.isFocused
    })}>arrow_drop_down</i>;
};

const MultiValue = props => {
    return <Chip close={props.removeProps.onClick}>
        {props.children}
    </Chip>;
};

class Select extends Component {
    state = {
        isOpen: false
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.value !== nextProps.value || this.props.options !== nextProps.options;
    }

    render() {
        const { label, options, isMulti, onChange, value, withoutWrapper, disableLoadingWhenEmpty, errors, loading } = this.props;

        return <div className={classnames("react-select__wrapper", {
            "react-select__wrapper--spacing": !withoutWrapper
        })}>
            <label className={classnames({
                "react-select__label--focused": this.state.isOpen,
                "react-select__label--hidden": !value || value.length === 0,
            })}>{label}</label>
            <ReactSelect
                isFocused
                isMulti={isMulti}
                value={value && this.extractValue(value, options)}
                isClearable
                onChange={onChange}
                components={{
                    DropdownIndicator,
                    IndicatorSeparator,
                    MultiValue,
                    MenuList
                }}
                isLoading={disableLoadingWhenEmpty ? loading : options.length === 0}
                noOptionsMessage={() => "Nenhuma opção encontrada"}
                className="react-select__container"
                classNamePrefix="react-select"
                styles={customStyles}
                onFocus={() => this.setState({
                    isOpen: true
                })}
                onBlur={() => this.setState({
                    isOpen: false
                })}
                placeholder={label}
                options={options}
            />
            {errors && errors.map(e =>
                <span key={e} className="react-select__error-label helper-text red-text darken-1">{e}</span>)
            }
        </div>;
    }

    extractValue = (value, options) => {
        return Array.isArray(value) ? value.map(v => ({
            value: v,
            label: (options.find(o => o.value === v) || {}).label
        })) : {
            value: value,
            label: (options.find(o => o.value === value) || {}).label,
        };
    };
}

Select.propTypes = {
    isMulti: PropTypes.bool,
    label: PropTypes.string,
    options: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    withoutWrapper: PropTypes.bool,
    errors: PropTypes.array,
    disableLoadingWhenEmpty: PropTypes.bool
};

export default Select;
