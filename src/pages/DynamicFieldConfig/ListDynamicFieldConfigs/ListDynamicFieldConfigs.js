import React, { Component } from "react";

import { AlertService, HttpService, NotificationService } from "services";

import { PageHeader } from "components";
import { Button, Panel, Table } from "components/ui";
import DynamicFieldConfigForm from "./DynamicFieldConfigForm/DynamicFieldConfigForm";

class ListDynamicFieldConfigs extends Component {
    state = {
        board: {},
        dynamicFieldConfigs: [],
        dynamicFieldConfig: {
            name: "",
            field: ""
        },
        customFields: [],
        errors: {},
        isLoading: true
    };

    async componentDidMount() {
        const { boardId } = this.props.match.params;
        const board = await this.retrieveBoard(boardId);

        this.retrieveDynamicFieldConfigs(board.id);
        this.retrieveCustomFields();
    }

    retrieveDynamicFieldConfigs = async boardId => {
        this.setState({
            isLoading: true
        });

        const response = await HttpService.get(`/boards/${boardId}/dynamic-field-configs`);

        this.setState({
            dynamicFieldConfigs: response.data,
            isLoading: false
        });
    };

    retrieveBoard = async boardId => {
        const response = await HttpService.get(`/boards/${boardId}`);

        const board = response.data;
        this.setState({
            board: board
        });

        return board;
    };

    retrieveCustomFields = async () => {
        const response = await HttpService.get(`/fields`);
        this.setState({
            customFields: response.data.map(customField => ({
                label: `${customField.name} (${customField.id})`,
                value: customField.id
            }))
        });
    };

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({
            isLoading: true
        });

        const { board, dynamicFieldConfig } = this.state;

        try {
            await HttpService.post(`/boards/${board.id}/dynamic-field-configs`, dynamicFieldConfig);
            this.setState({
                dynamicFieldConfig: {
                    name: "",
                    field: ""
                },
                errors: {}
            });
            NotificationService.notifySuccess("Campo dinâmico inserido com sucesso");
            this.retrieveDynamicFieldConfigs(board.id);
        } catch (error) {
            const response = error.response;
            if (response.status === 400) {
                this.setState({
                    errors: response.data
                });
            }
            NotificationService.notifyError("Falha ao cadastrar o campo dinâmico");
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    changeValue = (target, value) => {
        this.setState({
            dynamicFieldConfig: {
                ...this.state.dynamicFieldConfig,
                [target]: value
            }
        });
    };

    removeDynamicFieldConfig = async id => {
        const { board } = this.state;

        try {
            const willDelete = await AlertService.confirmRemove();
            if (willDelete) {
                this.setState({
                    isLoading: true
                });

                await HttpService.delete(`/boards/${board.id}/dynamic-field-configs/${id}`);
                this.retrieveDynamicFieldConfigs(board.id);
                NotificationService.notifySuccess("Campo dinâmico removido com sucesso");
            }
        } catch (error) {
            NotificationService.notifyError("Falha ao remover o campo dinâmico");
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    render() {
        const { board, dynamicFieldConfigs, dynamicFieldConfig, customFields, isLoading, errors } = this.state;

        return <>
            <PageHeader title="Campos dinâmicos" small={board.name}/>

            <DynamicFieldConfigForm dynamicFieldConfig={dynamicFieldConfig}
                                    customFields={customFields}
                                    errors={errors}
                                    loading={isLoading}
                                    changeValue={this.changeValue}
                                    handleSubmit={this.handleSubmit}/>

            <Panel title="Campos dinâmicos" loading={isLoading}>
                <Table data={dynamicFieldConfigs}
                       rows={[
                           {
                               label: "Nome",
                               value: "name"
                           },
                           {
                               label: "Campo",
                               value: "field"
                           }
                       ]}
                       actions={dynamicFieldConfig => [
                           <Button small
                                   type="button"
                                   onClick={() => this.removeDynamicFieldConfig(dynamicFieldConfig.id)}>
                               Remover
                           </Button>
                       ]}
                       emptyMessage="Nenhum campo dinâmico cadastrado."/>
            </Panel>
        </>;
    }
}

export default ListDynamicFieldConfigs;
