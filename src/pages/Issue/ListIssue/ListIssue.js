import React, { Component, Fragment } from "react";

import { HttpService, NotificationService } from "services";
import moment from "moment/moment";

import {
    ColumnTimeAverageTable,
    CardNumber,
    Chart,
    Choose,
    Histogram,
    IssueTable,
    PageHeader,
    Sidebar,
    When
} from "components";
import { Col, Panel, Row } from "components/ui";
import ListIssueFilters from "pages/Issue/ListIssue/ListIssueFilters/ListIssueFilters";
import queryString from "query-string/index";
import IssueFilterValidator from "validators/IssueFilterValidator";

class ListIssue extends Component {
    state = {
        board: {
            feature: {
                system: false,
                estimate: false,
                project: false,
                epic: false,
                dynamicField: false
            }
        },
        filters: {
            systems: [],
            estimates: [],
            issueTypes: [],
            projects: [],
            priorities: [],
            epics: [],
            dynamicFieldsValues: []
        },
        sandbox: {
            leadTime: 0,
            throughput: 0,
            issues: [],
            charts: {
                histogram: {},
                leadTimeByType: {},
                throughputByType: {},
                leadTimeByPriority: {},
                throughputByPriority: {},
                leadTimeByEstimate: {},
                throughputByEstimate: {},
                leadTimeBySystem: {},
                throughputBySystem: {},
                leadTimeByProject: {},
                throughputByProject: {},
                leadTimeCompareChart: {},
                dynamicCharts: [],
            },
            columnTimeAverages: [],
            weeklyThroughput: {}
        },
        filterKeys: [],
        issueFilter: {
            startDate: null,
            endDate: null
        },
        sortOptions: {
            field: "key",
            direction: "ASC"
        },
        errors: {},
        dynamicFieldConfigs: [],
        currentTab: "Listagem",
        isLoading: false
    };

    componentDidMount() {
        const { boardId } = this.props.match.params;

        this.retrieveBoard(boardId);
        this.retrieveFilters(boardId);
        this.retrieveDynamicFieldConfigs(boardId);
        this.retrieveIssuesByQueryParams(boardId);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location.search !== prevProps.location.search) {
            const { boardId } = this.props.match.params;
            this.retrieveIssuesByQueryParams(boardId);
        }
    }

    retrieveBoard = async boardId => {
        const { data } = await HttpService.get(`/boards/${boardId}`);

        this.setState({
            board: data
        });
    };

    retrieveFilters = async boardId => {
        const { data } = await HttpService.get(`/boards/${boardId}/issues/filters`);

        this.setState({
            filters: data
        });
    };

    retrieveFilterKeys = async (boardId, issueFilter) => {
        const query = {
            ...issueFilter,
            startDate: moment(issueFilter.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            endDate: moment(issueFilter.endDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        };

        const { data } = await HttpService.get(`/boards/${boardId}/issues/filters/keys`, { params: query });

        this.setState({
            filterKeys: data.keys.map(key => ({
                label: key,
                value: key
            }))
        });
    };

    handleFilterChangeValue = (name, value) => {
        this.setState({
            issueFilter: {
                ...this.state.issueFilter,
                [name]: value
            }
        });
    };

    searchIssues = async (boardId, issueFilter) => {
        const validator = new IssueFilterValidator(issueFilter);
        if (validator.hasErrors()) {
            this.setState({
                errors: validator.errors()
            });

            return;
        }

        this.setState({
            isLoading: true,
            currentTab: "Listagem"
        });

        const query = {
            ...issueFilter,
            startDate: moment(issueFilter.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            endDate: moment(issueFilter.endDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        };

        try {
            this.retrieveFilterKeys(boardId, issueFilter);
            const { data } = await HttpService.get(`/boards/${boardId}/issues`, { params: query });

            this.setState({
                sandbox: data
            });
        } catch ({ response }) {
            if (response.status === 400) {
                const { data } = response;

                if (data["startDateIsBeforeEndDate"]) {
                    NotificationService.notifyError(data["startDateIsBeforeEndDate"]);
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

        const { board, issueFilter } = this.state;

        this.searchIssues(board.id, issueFilter);
    };

    retrieveDynamicFieldConfigs = async boardId => {
        const { data } = await HttpService.get(`/boards/${boardId}/dynamic-field-configs`);

        this.setState({
            dynamicFieldConfigs: data
        });
    };

    changeTab = tab => {
        this.setState({
            currentTab: tab
        });
    };

    saveSortedIssues = ({ issues, sortOptions }) => {
        this.setState({
            issuePeriod: {
                ...this.state.issuePeriod,
                issues
            },
            sortOptions
        });
    };

    updateLocationSearch = () => {
        const { issueFilter } = this.state;

        this.props.history.push({
            search: queryString.stringify(issueFilter)
        });
    };

    retrieveIssuesByQueryParams = boardId => {
        const issueFilter = queryString.parse(this.props.location.search);
        if (this.props.location.search) {
            this.setState({
                issueFilter,
                errors: {}
            });

            this.searchIssues(boardId, issueFilter);
        }
    };

    render() {
        const { issueFilter, board, filters, filterKeys, dynamicFieldConfigs, currentTab, sortOptions, isLoading, errors, sandbox } = this.state;

        const tabs = [
            {
                name: "Listagem"
            },
            {
                name: "Histograma"
            },
            {
                name: "Lead Time Por Tipo"
            },
            {
                name: "Throughput Por Tipo"
            },
            {
                name: "Lead Time Por Prioridade"
            },
            {
                name: "Throughput Por Prioridade"
            },
            {
                name: "Lead Time Por Estimativa",
                active: board.feature.estimate
            },
            {
                name: "Throughput Por Estimativa",
                active: board.feature.estimate
            },
            {
                name: "Lead Time Por Sistema",
                active: board.feature.system
            },
            {
                name: "Throughput Por Sistema",
                active: board.feature.system
            },
            {
                name: "Lead Time Por Projeto",
                active: board.feature.project
            },
            {
                name: "Throughput Por Projeto",
                active: board.feature.project
            },
            {
                name: "Média De Tempo Por Coluna"
            },
            {
                name: "Throughput Semanal"
            },
            {
                name: "Lead Times",
                active: board.feature.leadTimes
            },
            ...(board.feature.dynamicField ? sandbox.charts.dynamicCharts.flatMap(dynamicFieldConfig => [
                {
                    name: `Lead Time Por ${dynamicFieldConfig.name}`
                },
                {
                    name: `Throughput Por ${dynamicFieldConfig.name}`
                }
            ]) : [])
        ];

        return <Row>
            <Col s={12}>
                <PageHeader title="SandBox" small={board.name}/>
            </Col>

            <ListIssueFilters issueFilter={issueFilter}
                              filters={filters}
                              filterKeys={filterKeys}
                              changeValue={this.handleFilterChangeValue}
                              handleFilter={this.handleFilter}
                              board={board}
                              errors={errors}
                              isLoading={isLoading}/>

            <Col s={12}>
                <Row>
                    <Col s={6}><CardNumber title="Lead Time" data={sandbox.leadTime.toFixed(2)}/></Col>
                    <Col s={6}><CardNumber title="Throughput" data={sandbox.throughput}/></Col>
                </Row>
            </Col>

            <Sidebar l={2} s={12} changeTab={this.changeTab} items={tabs}/>

            <Col l={10} s={12}>
                <Choose current={currentTab}>
                    <When active="Listagem">
                        <IssueTable issues={sandbox.issues}
                                    sortOptions={sortOptions}
                                    saveSortedIssues={this.saveSortedIssues}
                                    loading={isLoading}
                                    board={board}
                                    dynamicFieldConfigs={dynamicFieldConfigs}/>
                    </When>
                    <When active="Histograma">
                        <Histogram data={sandbox.charts.histogram} loading={isLoading}/>
                    </When>
                    <When active="Lead Time Por Tipo">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="LEAD_TIME"
                               title="Lead Time Por Tipo"
                               key="lead-time-by-type-chart"
                               data={sandbox.charts.leadTimeByType}/>
                    </When>
                    <When active="Throughput Por Tipo">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="THROUGHPUT"
                               title="Throughput Por Tipo"
                               key="throughput-by-type-chart"
                               data={sandbox.charts.throughputByType}/>
                    </When>
                    <When active="Lead Time Por Prioridade">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="LEAD_TIME"
                               title="Lead Time Por Prioridade"
                               key="lead-time-by-priority-chart"
                               data={sandbox.charts.leadTimeByPriority}/>
                    </When>
                    <When active="Throughput Por Prioridade">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="THROUGHPUT"
                               title="Throughput Por Prioridade"
                               key="throughput-by-priority-chart"
                               data={sandbox.charts.throughputByPriority}/>
                    </When>
                    <When active="Lead Time Por Estimativa">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="LEAD_TIME"
                               title="Lead Time Por Estimativa"
                               key="lead-time-by-estimate-chart"
                               data={sandbox.charts.leadTimeByEstimate}/>
                    </When>
                    <When active="Throughput Por Estimativa">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="THROUGHPUT"
                               title="Throughput Por Estimativa"
                               key="throughput-by-estimate-chart"
                               data={sandbox.charts.throughputByEstimate}/>
                    </When>
                    <When active="Lead Time Por Sistema">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="LEAD_TIME"
                               title="Lead Time Por Sistema"
                               key="lead-time-by-system-chart"
                               data={sandbox.charts.leadTimeBySystem}/>
                    </When>
                    <When active="Throughput Por Sistema">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="THROUGHPUT"
                               title="Throughput Por Sistema"
                               key="throughput-by-system-chart"
                               data={sandbox.charts.throughputBySystem}/>
                    </When>
                    <When active="Lead Time Por Projeto">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="LEAD_TIME"
                               title="Lead Time Por Projeto"
                               key="lead-time-by-project-chart"
                               data={sandbox.charts.leadTimeByProject}/>
                    </When>
                    <When active="Throughput Por Projeto">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="THROUGHPUT"
                               title="Throughput Por Projeto"
                               key="throughput-by-project-chart"
                               data={sandbox.charts.throughputByProject}/>
                    </When>
                    <When active="Média De Tempo Por Coluna">
                        <Panel title="Média De Tempo Por Coluna" loading={isLoading}>
                            <ColumnTimeAverageTable data={sandbox.columnTimeAverages}/>
                        </Panel>
                    </When>
                    <When active="Throughput Semanal">
                        <Chart loading={isLoading}
                               beginAtZero
                               chartType="bar"
                               key="weekly-throughput"
                               title="Throughput Semanal"
                               data={sandbox.weeklyThroughput}/>
                    </When>
                    <When active="Lead Times">
                        <Chart loading={isLoading}
                               beginAtZero
                               chartType="bar"
                               title="Lead Times"
                               key="lead-time-compare-chart"
                               data={sandbox.charts.leadTimeCompareChart}/>
                    </When>
                    {board.feature.dynamicField && sandbox.charts.dynamicCharts.map(dynamicChart =>
                        <Fragment key={dynamicChart.name}>
                            <When active={`Lead Time Por ${dynamicChart.name}`}>
                                <Chart loading={isLoading}
                                       beginAtZero
                                       dataType="LEAD_TIME"
                                       title={`Lead Time Por ${dynamicChart.name}`}
                                       key={`lead-time-by-${dynamicChart.name}-chart`}
                                       data={dynamicChart.leadTime}/>
                            </When>

                            <When active={`Throughput Por ${dynamicChart.name}`}>
                                <Chart loading={isLoading}
                                       beginAtZero
                                       dataType="THROUGHPUT"
                                       title={`Throughput Por ${dynamicChart.name}`}
                                       key={`throughput-by-${dynamicChart.name}-chart`}
                                       data={dynamicChart.throughput}/>
                            </When>
                        </Fragment>
                    )}
                </Choose>
            </Col>
        </Row>;
    }
}

export default ListIssue;
