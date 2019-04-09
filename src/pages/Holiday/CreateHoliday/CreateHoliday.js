import React, { Component } from "react";

import { HttpService, NotificationService } from "services";

import { HolidayFormFields, PageHeader } from "components";
import { Button, Panel, Row } from "components/ui";

class CreateHoliday extends Component {
    state = {
        holiday: {
            description: "",
            date: "",
        },
        errors: {},
        isLoading: false
    };

    changeValue = (name, value) => {
        this.setState({
            holiday: {
                ...this.state.holiday,
                [name]: value
            }
        });
    };

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({
            isLoading: true
        });

        try {
            const { boardId } = this.props.match.params;
            const { holiday } = this.state;

            await HttpService.post(`/boards/${boardId}/holidays`, {
                description: holiday.description,
                date: holiday.date
            });

            NotificationService.notifySuccess("Feriado cadastrado com sucesso");
            this.props.history.push(`/boards/${boardId}/holidays`);
        } catch (error) {
            const response = error.response;
            if (response.status === 400) {
                this.setState({
                    errors: response.data
                });
            }
            NotificationService.notifyError("Falha ao cadastrar o feriado");
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    render() {
        const { holiday, errors } = this.state;

        return <>
            <PageHeader title="Novo feriado"/>

            <Panel title="Novo feriado" actions={
                <Button onClick={this.handleSubmit}>Salvar</Button>
            }>
                <Row>
                    <HolidayFormFields holiday={holiday} errors={errors} changeValue={this.changeValue}/>
                </Row>
            </Panel>
        </>;
    }
}

export default CreateHoliday;
