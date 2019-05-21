import React, { Component } from "react";

import { HttpService, NotificationService } from "services";

import { PageHeader } from "components";
import { Button } from "components/ui";

import BasicConfig from "./BasicConfig/BasicConfig";
import AdvancedConfig from "./AdvancedConfig/AdvancedConfig";

import "./EditBoard.scss";

class EditBoard extends Component {
    state = {
        board: {},
        statuses: [],
        issueTypes: [],
        errors: {},
        customFields: [],
        isLoading: true
    };

    async componentDidMount() {
        const { boardId } = this.props.match.params;
        const board = await this.retrieveBoard(boardId);

        this.retrieveIssueTypes(board.externalId);
        this.retrieveStatuses(board.id);
        this.retrieveCustomFields();
    }

    retrieveIssueTypes = async externalId => {
        const response = await HttpService.get(`/projects/${externalId}`);
        this.setState({
            issueTypes: response.data.issueTypes.map(it => it.name)
        });
    };

    retrieveBoard = async boardId => {
        this.setState({
            isLoading: true
        });

        const response = await HttpService.get(`/boards/${boardId}`);

        const board = response.data;
        this.setState({
            board: board,
            isLoading: false
        });

        return board;
    };

    retrieveCustomFields = async () => {
        const response = await HttpService.get(`/fields`);

        const customFields = response.data.map(customField => ({
            label: `${customField.name} (${customField.id})`,
            value: customField.id
        }));

        this.setState({
            customFields
        });
    };

    retrieveStatuses = async boardId => {
        const response = await HttpService.get(`/boards/${boardId}/statuses`);
        this.setState({
            statuses: response.data
        });
    };

    changeValue = (target, value) => {
        this.setState({
            board: {
                ...this.state.board,
                [target]: value
            }
        });
    };

    handleSubmit = async event => {
        event.preventDefault();

        const { boardId } = this.props.match.params;

        try {
            await HttpService.put(`/boards/${boardId}`, this.state.board);
            NotificationService.notifySuccess("Board alterado com sucesso");
            this.props.history.push("/boards");
        } catch (error) {
            const response = error.response;
            if (response.status === 400) {
                this.setState({
                    errors: response.data
                });
            }
            NotificationService.notifyError("Falha ao atualizar o board");
        }
    };

    render() {
        const { isLoading, errors, customFields, statuses, issueTypes, board } = this.state;

        return <>
            <PageHeader title="Configurações" small={board.name}/>

            <form>
                <BasicConfig loading={isLoading}
                             board={board}
                             statuses={statuses}
                             changeValue={this.changeValue}
                             errors={errors}/>

                <AdvancedConfig loading={isLoading}
                                board={board}
                                issueTypes={issueTypes}
                                changeValue={this.changeValue}
                                customFields={customFields}
                                statuses={statuses}/>

                <div className="right-align edit-board__actions">
                    <Button type="submit" onClick={this.handleSubmit}>Salvar</Button>
                </div>
            </form>
        </>;
    }
}

export default EditBoard;
