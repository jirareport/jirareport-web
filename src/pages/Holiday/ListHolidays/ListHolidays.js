import React, { Component } from "react";

import { AlertService, HttpService, NotificationService } from "services";
import queryString from "query-string";

import { Button, Link, Pagination, Panel, Table } from "components/ui";
import { PageHeader } from "components";

import "./ListHolidays.scss";

class ListHolidays extends Component {
    state = {
        board: {},
        holidays: {
            content: []
        },
        page: 0,
        isLoading: true
    };

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location.search !== prevProps.location.search) {
            const query = queryString.parse(this.props.location.search);
            this.setState({
                page: query.page
            });

            this.retrieveHolidays(this.state.board.id, query.page);
        }
    }

    async componentDidMount() {
        const { page } = queryString.parse(this.props.location.search);

        const { boardId } = this.props.match.params;
        const board = await this.retrieveBoard(boardId);

        this.setState({
            board,
            page
        });

        this.retrieveHolidays(board.id, page);
    }

    retrieveBoard = async boardId => {
        const response = await HttpService.get(`/boards/${boardId}`);
        return response.data;
    };

    retrieveHolidays = async (boardId, page) => {
        this.setState({
            isLoading: true
        });

        const response = await HttpService.get(`/boards/${boardId}/holidays`, { params: { page } });
        this.setState({
            holidays: response.data,
            isLoading: false
        });
    };

    deleteHoliday = async id => {
        try {
            const willRemove = await AlertService.confirmRemove();
            if (willRemove) {
                this.setState({
                    isLoading: true
                });

                const { board, page } = this.state;

                await HttpService.delete(`/boards/${board.id}/holidays/${id}`);

                this.retrieveHolidays(board.id, page);
                NotificationService.notifySuccess("Feriado removido com sucesso");
            }
        } catch (error) {
            NotificationService.notifyError("Falha ao remover o feriado");
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    goToPage = async page => {
        this.setState({
            page: page
        });

        const { board } = this.state;

        this.updateLocationSearch(board.id, page);
        this.retrieveHolidays(board.id, page);
    };

    updateLocationSearch = (boardId, page) => {
        const search = page === 0 ? "" : queryString.stringify({ page });
        this.props.history.push({
            pathname: `/boards/${boardId}/holidays`,
            search: search
        });
    };

    importHolidays = async () => {
        try {
            const { board, page } = this.state;
            await HttpService.post(`/boards/${board.id}/holidays`, {}, {
                params: {
                    import: true
                }
            });
            this.retrieveHolidays(board.id, page);
            NotificationService.notifySuccess("Feriados importados com sucesso");
        } catch (error) {
            const response = error.response;
            if (response.status === 400) {
                NotificationService.notifyError(response.data.message);
            } else {
                NotificationService.notifyError("Falha ao importar os feriados");
            }
        }
    };

    render() {
        const { isLoading, board, holidays } = this.state;

        return <>
            <PageHeader title="Feriados" small={board.name} action={
                <div className="list-holidays__actions">
                    <Button type="button" onClick={this.importHolidays}>Importar Feriados</Button>
                    <Link to={`/boards/${board.id}/holidays/new`}>Novo Feriado</Link>
                </div>
            }/>

            <Panel title="Feriados" loading={isLoading}>
                <Table data={holidays.content}
                       rows={[
                           {
                               label: "Data",
                               value: "date"
                           },
                           {
                               label: "Descrição",
                               value: "description"
                           }
                       ]}
                       actions={holiday => [
                           <Button small type="button" onClick={() => this.deleteHoliday(holiday.id)}>
                               Remover
                           </Button>,
                           <Link small to={`/boards/${board.id}/holidays/${holiday.id}/edit`}>
                               Alterar
                           </Link>
                       ]}
                       emptyMessage="Nenhum feriado cadastrado."/>

                <Pagination data={holidays} goToPage={this.goToPage}/>
            </Panel>
        </>;
    }
}

export default ListHolidays;
