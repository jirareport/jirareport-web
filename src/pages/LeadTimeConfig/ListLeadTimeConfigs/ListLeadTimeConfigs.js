import React, { Component } from "react";

import { AlertService, HttpService, NotificationService } from "services";

import { PageHeader } from "components";
import { Button, Link, Panel, Table } from "components/ui";

class ListLeadTimeConfigs extends Component {
    state = {
        board: {},
        leadTimeConfigs: [],
        isLoading: true
    };

    async componentDidMount() {
        const { boardId } = this.props.match.params;
        const board = await this.retrieveBoard(boardId);

        this.retrieveLeadTimeConfigs(board.id);
    }

    retrieveBoard = async boardId => {
        const response = await HttpService.get(`/boards/${boardId}`);
        const board = response.data;

        this.setState({
            board: board
        });

        return board;
    };

    retrieveLeadTimeConfigs = async boardId => {
        this.setState({
            isLoading: true
        });

        const response = await HttpService.get(`/boards/${boardId}/lead-time-configs`);
        this.setState({
            leadTimeConfigs: response.data,
            isLoading: false
        });
    };

    deleteLeadTimeConfig = async id => {
        try {
            const willRemove = await AlertService.confirmRemove();
            if (willRemove) {
                this.setState({
                    isLoading: true
                });

                const { board } = this.state;
                await HttpService.delete(`/boards/${board.id}/lead-time-configs/${id}`);
                NotificationService.notifySuccess("Configuração de lead time removida com sucesso");
                this.retrieveLeadTimeConfigs(board.id);
            }
        } catch (error) {
            NotificationService.notifyError("Falha ao remover configuração de lead time");
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    render() {
        const { board, leadTimeConfigs, isLoading } = this.state;

        return <>
            <PageHeader title="Configurações de Lead Times" small={board.name} action={
                <Link to={`/boards/${board.id}/lead-time-configs/new`}>Nova configuração de lead time</Link>
            }/>

            <Panel title="Configurações de Lead Times"
                   loading={isLoading}>
                <Table data={leadTimeConfigs}
                       rows={[
                           {
                               label: "Nome",
                               value: "name"
                           },
                           {
                               label: "Coluna inicial",
                               value: "startColumn"
                           },
                           {
                               label: "Coluna Final",
                               value: "endColumn"
                           }
                       ]}
                       actions={leadTimeConfig => [
                           <Button small type="button" onClick={() => this.deleteLeadTimeConfig(leadTimeConfig.id)}>
                               Remover
                           </Button>,
                           <Link small to={`/boards/${board.id}/lead-time-configs/${leadTimeConfig.id}/edit`}>
                               Alterar
                           </Link>
                       ]}
                       emptyMessage="Nenhuma configuração de lead time cadastrada."/>
            </Panel>
        </>;
    }
}

export default ListLeadTimeConfigs;
