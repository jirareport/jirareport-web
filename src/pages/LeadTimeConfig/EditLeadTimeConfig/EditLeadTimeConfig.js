import React, { Component } from "react";

import { HttpService, NotificationService } from "services";

import { LeadTimeConfigFormFields, PageHeader } from "components";
import { Button, Panel, Row } from "components/ui";

class EditLeadTimeConfig extends Component {
    state = {
        leadTimeConfig: {
            name: "",
            startColumn: "",
            endColumn: ""
        },
        errors: {},
        statuses: [],
        boardId: null,
        isLoading: true
    };

    async componentDidMount() {
        const { boardId, leadTimeConfigId } = this.props.match.params;
        this.setState({
            boardId
        });

        this.retrieveStatuses(boardId);
        this.retrieveLeadTimeConfig(boardId, leadTimeConfigId);
    }


    retrieveStatuses = async boardId => {
        const response = await HttpService.get(`/boards/${boardId}/statuses`);
        this.setState({
            statuses: response.data
        });
    };


    retrieveLeadTimeConfig = async (boardId, id) => {
        this.setState({
            isLoading: true
        });

        const response = await HttpService.get(`/boards/${boardId}/lead-time-configs/${id}`);

        this.setState({
            leadTimeConfig: response.data,
            isLoading: false
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
            const { boardId, leadTimeConfig } = this.state;
            await HttpService.put(`/boards/${boardId}/lead-time-configs/${leadTimeConfig.id}`, {
                name: leadTimeConfig.name,
                startColumn: leadTimeConfig.startColumn,
                endColumn: leadTimeConfig.endColumn
            });
            NotificationService.notifySuccess("Configuração de lead time alterada com sucesso");
            this.props.history.push({ pathname: `/boards/${boardId}/lead-time-configs` });
        } catch (error) {
            const response = error.response;
            if (response.status === 400) {
                this.setState({
                    errors: response.data
                });
            }
            NotificationService.notifyError("Falha ao alterar configuração de lead time");
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    render() {
        const { isLoading, leadTimeConfig, statuses, errors } = this.state;

        return <>
            <PageHeader title="Alterar Configuração de Lead Time"/>

            <Panel title="Alterar Configuração de Lead Time" loading={isLoading} actions={
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

export default EditLeadTimeConfig;
