import React, { Component } from "react";

import { HttpService, NotificationService } from "services";

import { PageHeader } from "components";
import { Button, Col, Panel, Row, Table } from "components/ui";

class CreateBoard extends Component {
    state = {
        filter: {
            name: ""
        },
        projects: [],
        filteredProjects: [],
        isLoading: true
    };

    componentDidMount() {
        this.retrieveProjects();
    }

    retrieveProjects = async () => {
        this.setState({
            isLoading: true
        });

        const response = await HttpService.get("/projects");

        this.setState({
            projects: response.data,
            filteredProjects: response.data,
            isLoading: false
        });
    };

    handleFilter = event => {
        event.preventDefault();

        const { filter, projects } = this.state;

        this.setState({
            filteredProjects: projects.filter(p => p.name.toUpperCase().includes(filter.name.toUpperCase()))
        });
    };

    handleChange = event => {
        this.setState({
            filter: {
                ...this.state.filter,
                [event.target.name]: event.target.value
            }
        });
    };

    createBoard = async (event, project) => {
        event.preventDefault();

        this.setState({
            isLoading: true
        });

        try {
            const response = await HttpService.post("/boards", {
                externalId: project.id,
                name: project.name
            });

            const location = response.headers.location.split("/");
            const boardId = location[location.length - 1];

            this.props.history.push({ pathname: `/boards/${boardId}/edit` });
            NotificationService.notifySuccess("Board criado com sucesso");
        } catch (e) {
            NotificationService.notifyError("Falha ao criar o board");
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    render() {
        const { isLoading, filter, filteredProjects } = this.state;

        return <>
            <PageHeader title="Novo Board"/>

            <Panel title="Filtro" actions={
                <Button type="submit" onClick={this.handleFilter}>
                    Filtrar
                </Button>
            }>
                <Row>
                    <Col className="input-field" s={12}>
                        <input id="board-name"
                               type="text"
                               name="name"
                               onChange={this.handleChange}
                               value={filter.name}/>
                        <label htmlFor="board-name">Nome</label>
                    </Col>
                </Row>
            </Panel>

            <Panel wrapper="div" title="Projetos" loading={isLoading}>
                <Table data={filteredProjects}
                       rows={[
                           {
                               label: "ID",
                               value: "id"
                           },
                           {
                               label: "Nome",
                               value: "name"
                           }
                       ]}
                       actions={(project) => [
                           <Button link className="blue-text" onClick={(e) => this.createBoard(e, project)}>
                               Salvar
                           </Button>
                       ]}
                       emptyMessage="Nenhum projeto encontrado"/>
            </Panel>
        </>;
    }
}

export default CreateBoard;
