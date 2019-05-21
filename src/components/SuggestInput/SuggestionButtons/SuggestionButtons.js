import React, { Component } from "react";

import classnames from "classnames";

import { Button, Preloader } from "components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ManualSuggestion from "components/SuggestInput/ManualSuggestion/ManualSuggestion";

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

export default SuggestionButtons;
