import React from "react";

import classnames from "classnames";

import { Chip, Col } from "components/ui";
import SuggestionButtons from "components/SuggestInput/SuggestionButtons/SuggestionButtons";

import "./SuggestInput.scss";

const SuggestInputLabel = ({ children, big }) =>
    <label className={classnames({ "active": !big })}>
        {children}
    </label>;

const SuggestValueContainer = ({ children, hasItem }) =>
    <div className={classnames("input-field suggest-input__label-container", {
        "suggest-input__label-container--not-empty": hasItem,
        "suggest-input__label-container--empty": !hasItem
    })}>
        {children}
    </div>;

const SuggestInputErrors = ({ errors }) => errors ? errors.map(e =>
    <span key={e} className="suggest-input__error-label helper-text red-text darken-1">{e}</span>
) : null;

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
        <SuggestValueContainer hasItem={hasItem}>
            <SuggestInputLabel big={hasItem}>{label}</SuggestInputLabel>

            {value && <div className="suggest-input__chips">
                {value.map(vl => <Chip key={vl} close={() => remove(vl)}>
                    {vl}
                </Chip>)}
            </div>}
        </SuggestValueContainer>

        <SuggestionButtons suggestions={suggestions}
                           values={value}
                           add={add}
                           keepCase={keepCase}/>

        <SuggestInputErrors errors={errors}/>
    </Col>;
};

export const SuggestInput = ({ name, changeValue, value, label, suggestions, errors, keepCase, s, m, l, xl }) => {
    const hasItem = !value;
    const add = suggestion => {
        changeValue(name, keepCase ? suggestion : suggestion.toUpperCase());
    };

    return <Col className="suggest-input__container" s={s} m={m} l={l} xl={xl}>
        <SuggestValueContainer hasItem={hasItem}>
            <SuggestInputLabel big={hasItem}>{label}</SuggestInputLabel>

            {value && <div className="suggest-input__chips">
                <Chip close={() => changeValue(name, "")}>
                    {value}
                </Chip>
            </div>}
        </SuggestValueContainer>

        <SuggestionButtons suggestions={suggestions}
                           values={[value]}
                           add={add}
                           keepCase={keepCase}/>

        <SuggestInputErrors errors={errors}/>
    </Col>;
};
