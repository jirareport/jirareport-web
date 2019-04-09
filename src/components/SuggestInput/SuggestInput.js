import React, { Component } from "react";

import classnames from "classnames";

import { Button, Chip, Col, InputField, Preloader, Row } from "components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactModal from "react-modal";

import "./style.scss";

class ManualSuggestion extends Component {
    state = {
        item: "",
        errors: []
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        const { item } = this.state;
        if (item.trim()) {
            this.props.addItem(item.trim());
            this.handleClose();
        } else {
            this.setState({
                errors: ["Não pode ser vazio."]
            });
        }
    };

    handleClose = () => {
        this.setState({
            item: "",
            errors: []
        });

        this.props.closeModal();
    };

    render() {
        const { open } = this.props;
        const { item, errors } = this.state;

        return <ReactModal isOpen={open}
                           onRequestClose={this.handleClose}
                           className="modal"
                           overlayClassName="modal-overlay">
            <div className="modal-header">
                <h5>Adicionar Manualmente</h5>
            </div>
            <form>
                <div className="modal-content">
                    <Row>
                        <InputField s={12}
                                    value={item}
                                    label="Item"
                                    name="item"
                                    errors={errors}
                                    onChange={this.handleChange}/>
                    </Row>
                </div>
                <div className="modal-footer">
                    <Button type="button" onClick={this.handleClose}>Fechar</Button>
                    <Button type="submit" onClick={this.handleSubmit}>Adicionar</Button>
                </div>
            </form>
        </ReactModal>;
    }
}

class SuggestionButtons extends Component {
    state = {
        manualInsertModalOpen: false
    };

    openModal = () => {
        this.setState({
            manualInsertModalOpen: true
        });
    };

    closeModal = () => {
        this.setState({
            manualInsertModalOpen: false
        });
    };

    render() {
        const { suggestions, add, values, keepCase } = this.props;
        const { manualInsertModalOpen } = this.state;

        if (suggestions.length === 0) {
            return <Preloader small/>;
        }

        return <div className="suggest-input__button-container">
            {suggestions.sort().map(suggestion =>
                <Button type="button" onClick={() => add(suggestion)} small key={suggestion} className={classnames({
                    "disabled": (values || []).includes(keepCase ? suggestion : suggestion.toUpperCase()),
                    "suggest-input__button--keep-case": keepCase
                })}>
                    {suggestion}
                </Button>
            )}

            <Button onClick={this.openModal} small type="button" title="Inserir Manualmente">
                <FontAwesomeIcon icon="plus"/>
            </Button>

            <ManualSuggestion open={manualInsertModalOpen}
                              closeModal={this.closeModal}
                              addItem={add}/>
        </div>;
    };
}

const inputLabel = (label, big) =>
    <label className={classnames({ "active": !big })}>
        {label}
    </label>;

const containerClasses = hasItem =>
    classnames("input-field suggest-input__label-container", {
        "suggest-input__label-container--not-empty": hasItem,
        "suggest-input__label-container--empty": !hasItem
    });

export const MultipleSuggestInput = ({ name, changeValue, value, label, suggestions, errors, keepCase, s, m, l, xl }) => {
    const add = suggestion => {
        const values = new Set([...(value || [])]);
        values.add(keepCase ? suggestion : suggestion.toUpperCase());
        changeValue(name, [...values]);
    };

    const remove = suggestion => {
        changeValue(name, value.filter(c => c.toUpperCase() !== suggestion.toUpperCase()));
    };

    const hasItem = (value || []).length === 0;

    return <Col className="suggest-input__container" s={s} m={m} l={l} xl={xl}>
        <div className={containerClasses(hasItem)}>
            {inputLabel(label, hasItem)}

            {value && <div className="suggest-input__chips">
                {value.map(vl => <Chip key={vl} close={() => remove(vl)}>
                    {vl}
                </Chip>)}
            </div>}
        </div>

        <SuggestionButtons suggestions={suggestions}
                           values={value}
                           add={add}
                           keepCase={keepCase}/>

        {errors && errors.map(e =>
            <span key={e} className="suggest-input__error-label helper-text red-text darken-1">{e}</span>)
        }
    </Col>;
};


export const SuggestInput = ({ name, changeValue, value, label, suggestions, errors, keepCase, s, m, l, xl }) => {
    const hasItem = !value;
    const add = suggestion => {
        changeValue(name, keepCase ? suggestion : suggestion.toUpperCase());
    };

    return <Col className="suggest-input__container" s={s} m={m} l={l} xl={xl}>
        <div className={containerClasses(hasItem)}>
            {inputLabel(label, hasItem)}

            {value && <div className="suggest-input__chips">
                <Chip close={() => changeValue(name, "")}>
                    {value}
                </Chip>
            </div>}
        </div>

        <SuggestionButtons suggestions={suggestions}
                           values={[value]}
                           add={add}
                           keepCase={keepCase}/>

        {errors && errors.map(e =>
            <span key={e} className="suggest-input__error-label helper-text red-text darken-1">{e}</span>)
        }
    </Col>;
};
