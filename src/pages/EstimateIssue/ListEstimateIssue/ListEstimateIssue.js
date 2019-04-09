import React, { Component } from "react";

import { HttpService, NotificationService } from "services";
import moment from "moment";
import queryString from "query-string";

import LeadTimeFilterValidator from "validators/LeadTimeFilterValidator";

import { EstimateIssueTable, PageHeader } from "components";
import EstimateIssueFilter from "pages/EstimateIssue/ListEstimateIssue/EstimateIssueFilter/EstimateIssueFilter";

class ListEstimateIssue extends Component {
    state = {
        board: {
            feature: {
                impediment: false,
                dueDate: false,
                epic: false,
                estimate: false,
                system: false,
                project: false,
                dynamicField: false,
                leadTimes: false
            }
        },
        leadTimeFilter: {
            startDate: moment().subtract(5, "months").format("DD/MM/YYYY"),
            endDate: moment().format("DD/MM/YYYY"),
            field: null
        },
        estimates: [],
        errors: {},
        isLoading: false,
        sortOptions: {
            field: "key",
            direction: "DESC"
        }
    };

    componentDidMount() {
        const { boardId } = this.props.match.params;

        this.retrieveBoard(boardId);
        this.retrieveEstimatesByQueryParams(boardId);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location.search !== prevProps.location.search) {
            const { boardId } = this.props.match.params;
            this.retrieveEstimatesByQueryParams(boardId);
        }
    }

    retrieveEstimatesByQueryParams = boardId => {
        const leadTimeFilter = queryString.parse(this.props.location.search);
        if (this.props.location.search) {
            this.setState({
                leadTimeFilter
            });

            this.searchEstimates(boardId, leadTimeFilter);
        }
    };


    retrieveBoard = async boardId => {
        const { data } = await HttpService.get(`/boards/${boardId}`);

        this.setState({
            board: data
        });
    };

    searchEstimates = async (boardId, leadTimeFilter) => {
        const validator = new LeadTimeFilterValidator(leadTimeFilter);
        if (validator.hasErrors()) {
            this.setState({
                errors: validator.errors()
            });

            return;
        }

        this.setState({
            isLoading: true
        });

        const query = {
            startDate: moment(leadTimeFilter.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            endDate: moment(leadTimeFilter.endDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            filter: leadTimeFilter.field
        };

        try {
            const { data } = await HttpService.get(`/boards/${boardId}/estimates`, { params: query });

            this.setState({
                estimates: data
            });
        } catch ({ response }) {
            if (response.status === 400) {
                const { data } = response;

                if (data["startDateIsBeforeEndDate"]) {
                    NotificationService.notifyError(data["startDateIsBeforeEndDate"]);
                }

                if (data["board.fluxColumn"]) {
                    NotificationService.notifyError(data["board.fluxColumn"]);
                }

                this.setState({
                    errors: response.data
                });
            } else {
                NotificationService.notifyError("Falha ao realizar a busca");
            }
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    handleFilter = event => {
        event.preventDefault();

        this.updateLocationSearch();

        const { board, leadTimeFilter } = this.state;
        this.searchEstimates(board.id, leadTimeFilter);
    };

    handleChangeValue = (name, value) => {
        this.setState({
            leadTimeFilter: {
                ...this.state.leadTimeFilter,
                [name]: value
            }
        });
    };

    updateLocationSearch = () => {
        const { leadTimeFilter } = this.state;

        this.props.history.push({
            search: queryString.stringify(leadTimeFilter)
        });
    };

    saveSortedEstimates = ({ estimates, sortOptions }) => {
        this.setState({
            estimates,
            sortOptions
        });
    };

    render() {
        const { board, leadTimeFilter, estimates, sortOptions, errors, isLoading } = this.state;

        return <>
            <PageHeader title="Previsibilidade" small={board.name}/>

            <EstimateIssueFilter leadTimeFilter={leadTimeFilter}
                                 board={board}
                                 loading={isLoading}
                                 errors={errors}
                                 changeValue={this.handleChangeValue}
                                 handleFilter={this.handleFilter}/>

            <EstimateIssueTable estimates={estimates}
                                sortOptions={sortOptions}
                                board={board}
                                saveSortedEstimates={this.saveSortedEstimates}
                                isLoading={isLoading}/>
        </>;
    }
}


export default ListEstimateIssue;
