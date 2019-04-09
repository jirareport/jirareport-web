import React, { Component } from "react";

import { HttpService, NotificationService } from "services";

import { HolidayFormFields, PageHeader } from "components";
import { Button, Panel, Row } from "components/ui";

class EditHoliday extends Component {
    state = {
        holiday: {
            description: "",
            date: ""
        },
        errors: {},
        isLoading: true
    };

    async componentDidMount() {
        const { boardId, holidayId } = this.props.match.params;

        this.retrieveHoliday(boardId, holidayId);
    }

    retrieveHoliday = async (boardId, holidayId) => {
        this.setState({
            isLoading: true
        });

        const response = await HttpService.get(`/boards/${boardId}/holidays/${holidayId}`);
        this.setState({
            holiday: response.data,
            isLoading: false
        });
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
            const { boardId, holidayId } = this.props.match.params;
            const { holiday } = this.state;

            await HttpService.put(`/boards/${boardId}/holidays/${holidayId}`, {
                description: holiday.description,
                date: holiday.date
            });

            NotificationService.notifySuccess("Feriado alterado com sucesso");
            this.props.history.push(`/boards/${boardId}/holidays`);
        } catch (error) {
            const response = error.response;
            if (response.status === 400) {
                this.setState({
                    errors: response.data
                });
            }
            NotificationService.notifyError("Falha ao alterar o feriado");
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    render() {
        const { holiday, isLoading, errors } = this.state;

        return <>
            <PageHeader title="Alterar feriado"/>

            <Panel title="Alterar feriado" loading={isLoading} actions={
                <Button onClick={this.handleSubmit}>Salvar</Button>
            }>
                <Row>
                    <HolidayFormFields holiday={holiday} errors={errors} changeValue={this.changeValue}/>
                </Row>
            </Panel>
        </>;
    }
}

export default EditHoliday;
