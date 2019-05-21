import React, { Component } from "react";

import PropTypes from "prop-types";
import classnames from "classnames";
import moment from "moment";

import { SingleDatePicker } from "react-dates";

import "./DatePicker.scss";

const datePattern = "DD/MM/YYYY";

class DatePicker extends Component {
    state = {
        focused: false,
        date: this.props.value ? moment(this.props.value, datePattern) : null
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.value && this.props.value !== prevProps.value) {
            this.setState({
                date: this.props.value ? moment(this.props.value, datePattern) : null
            });
        }
    }

    handleFocus = ({ focused }) => {
        this.setState({ focused });
    };

    handleDateChange = date => {
        this.setState({
            date
        });

        const { changeValue, name } = this.props;
        changeValue(name, date ? date.format(datePattern) : "");
    };

    render() {
        const { name, label, errors } = this.props;
        const { date, focused } = this.state;

        return <div className="input-field">
            <SingleDatePicker hideKeyboardShortcutsPanel
                              noBorder
                              isOutsideRange={() => false}
                              date={date}
                              onDateChange={this.handleDateChange}
                              focused={focused}
                              onFocusChange={this.handleFocus}
                              id={name}
                              numberOfMonths={1}
                              placeholder=""
                              showDefaultInputIcon
                              inputIconPosition="after"
                              displayFormat={datePattern}/>
            <label htmlFor={name} className={classnames({
                "active": Boolean(date),
                "date-picker__label--focused": focused
            })}>{label}</label>
            {errors && errors.map(e => <span key={e} className="helper-text red-text darken-1">{e}</span>)}
        </div>;
    }
}

DatePicker.propTypes = {
    name: PropTypes.string.isRequired,
    errors: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.string,
    label: PropTypes.string,
    changeValue: PropTypes.func.isRequired
};

export default DatePicker;
