import React, { Component } from "react";

import { Button, InputField, Row } from "components/ui";
import { Modal, ModalContent, ModalFooter, ModalHeader } from "components/Modal";

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

        return <Modal isOpen={open} closeModal={this.handleClose}>
            <ModalHeader title="Adicionar Manualmente"/>
            <form>
                <ModalContent>
                    <Row>
                        <InputField s={12}
                                    value={item}
                                    label="Item"
                                    name="item"
                                    errors={errors}
                                    onChange={this.handleChange}/>
                    </Row>
                </ModalContent>
                <ModalFooter>
                    <Button type="button" onClick={this.handleClose}>Fechar</Button>
                    <Button type="submit" onClick={this.handleSubmit}>Adicionar</Button>
                </ModalFooter>
            </form>
        </Modal>;
    }
}

export default ManualSuggestion;
