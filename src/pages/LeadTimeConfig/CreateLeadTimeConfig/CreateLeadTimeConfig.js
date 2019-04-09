import React, { Component } from "react";

import { HttpService, NotificationService } from "services";

import { LeadTimeConfigFormFields, PageHeader } from "components";
import { Button, Panel, Row } from "components/ui";

class CreateLeadTimeConfig extends Component {
    state = {
        board: {},
        leadTimeConfig: {
            name: "",
            startColumn: "",
            endColumn: ""
        },
        errors: {},
        statuses: [],
        isLoading: false
    };

    async componentDidMount() {
        const { boardId } = this.props.match.params;
        const board = await this.retrieveBoard(boardId);

        this.retrieveStatuses(board.id);
    }

    retrieveBoard = async boardId => {
        const response = await HttpService.get(`/boards/${boardId}`);
        const board = response.data;

        this.setState({
            board: board
        });

        return board;
    };

    retrieveStatuses = async boardId => {
        const response = await HttpService.get(`/boards/${boardId}/statuses`);
        this.setState({
            statuses: response.data
        });
    };

    changeValue = (target, value) => {
        this.setState({
            leadTimeConfig: {
                ...this.state.leadTimeConfig,
                [target]: value
            }
        });
    };

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({
            isLoading: true
        });

        try {
            const { board, leadTimeConfig } = this.state;
            await HttpService.post(`/boards/${board.id}/lead-time-configs`, leadTimeConfig);

            NotificationService.notifySuccess("Configuração de lead time inserida com sucesso");
            this.props.history.push({ pathname: `/boards/${board.id}/lead-time-configs` });
        } catch (error) {
            const response = error.response;
            if (response.status === 400) {
                this.setState({
                    errors: response.data
                });
            }
            NotificationService.notifyError("Falha ao cadastrar configuração de lead time");
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    render() {
        const { isLoading, board, leadTimeConfig, statuses, errors } = this.state;

        return <>
            <PageHeader title="Nova Configuração de Lead Time" small={board.name}/>

            <Panel title="Nova Configuração de lead Time" loading={isLoading} actions={
                <Button type="submit" onClick={this.handleSubmit}>Salvar</Button>
            }>
                <Row>
                    <LeadTimeConfigFormFields leadTimeConfig={leadTimeConfig}
                                              suggestions={statuses}
                                              errors={errors}
                                              changeValue={this.changeValue}/>
                </Row>
            </Panel>
        </>;
    }
}

export default CreateLeadTimeConfig;
