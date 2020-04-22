import React, { Component } from "react";

import { AlertService, BoardService, IssuePeriodService } from "services";
import moment from "moment";
import queryString from "query-string";

import { Chart, Choose, PageHeader, Sidebar, When, IssueTypePerformanceCompare } from "components";
import { Button, Col, DatePicker, Link, Panel, Row, Table } from "components/ui";

class ListIssuePeriods extends Component {
    state = {
        board: {
            feature: {
                efficiency: false,
                estimate: false,
                leadTimes: false
            }
        },
        filter: {
            startDate: moment().subtract(6, 'months').format("DD/MM/YYYY"),
            endDate: moment().endOf("month").format("DD/MM/YYYY")
        },
        issuePeriods: {
            periods: [],
            charts: {
                leadTime: {},
                throughput: {},
                issueTypePerformanceCompareChart: {},
                throughputByEstimate: {},
                leadTimeCompareChart: {}
            }
        },
        currentTab: "Listagem",
        isLoading: true
    };

    async componentDidMount() {
        await this.setState({
            isLoading: true
        });

        const { boardId } = this.props.match.params;
        this.setState({
            board: await BoardService.findById(boardId),
            issuePeriods: await this.retrieveIssuePeriodsByQueryParams(boardId),
            currentTab: "Listagem",
            isLoading: false
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location.search !== prevProps.location.search) {
            const { boardId } = this.props.match.params;
            this.setState({
                issuePeriods: await this.retrieveIssuePeriodsByQueryParams(boardId)
            });
        }
    }

    changeTab = tab => {
        this.setState({
            currentTab: tab
        });
    };

    removeIssuePeriod = async id => {
        const willRemove = await AlertService.confirmRemove();
        if (willRemove) {
            await this.setState({
                isLoading: true
            });

            const { board, filter } = this.state;

            await IssuePeriodService.delete(board.id, id)
            this.setState({
                issuePeriods: await IssuePeriodService.findAll(board.id, filter),
                isLoading: false
            });
        }
    };

    updateIssuePeriod = async id => {
        await this.setState({
            isLoading: true
        });

        const { board, filter } = this.state;

        this.setState({
            errors: await IssuePeriodService.update(board.id, id),
            issuePeriods: await IssuePeriodService.findAll(board.id, filter),
            isLoading: false
        });
    };

    handleFilter = async e => {
        e.preventDefault();

        this.updateLocationSearch();

        await this.setState({
            isLoading: true
        });

        const { board, filter } = this.state;
        this.setState({
            issuePeriods: await IssuePeriodService.findAll(board.id, filter),
            isLoading: false
        });
    };

    changeFilterValue = (name, value) => {
        this.setState(state => ({
            filter: {
                ...state.filter,
                [name]: value
            }
        }));
    };

    updateLocationSearch = () => {
        const { filter } = this.state;

        this.props.history.push({
            search: queryString.stringify(filter)
        });
    };

    retrieveIssuePeriodsByQueryParams = async boardId => {
        if (this.props.location.search) {
            await this.setState({
                filter: queryString.parse(this.props.location.search)
            });
        }
        return await IssuePeriodService.findAll(boardId, this.state.filter);
    };

    render() {
        const { board, filter, currentTab, isLoading, issuePeriods } = this.state;
        const tabs = [
            {
                name: "Listagem",
            },
            {
                name: "Lead Time",
            },
            {
                name: "Throughput",
            },
            {
                name: "Performance Por Tipo",
            },
            {
                name: "Throughput Por Estimativa",
                active: board.feature.estimate
            },
            {
                name: "Lead Times",
                active: board.feature.leadTimes
            }
        ];

        return <Row>
            <Col s={12}>
                <PageHeader title="Períodos" small={board.name} action={
                    <Link to={`/boards/${board.id}/issue-periods/new`}>Novo período</Link>
                }/>
            </Col>

            <Col s={12}>
                <Panel collapsible defaultClose title="Filtro" actions={
                    <Button onClick={this.handleFilter} disabled={isLoading}>Filtrar</Button>
                }>
                    <Row>
                        <Col s={12} l={6}>
                            <DatePicker name="startDate"
                                        value={filter.startDate}
                                        changeValue={this.changeFilterValue}
                                        label="Data inicial"/>
                        </Col>
                        <Col s={12} l={6}>
                            <DatePicker name="endDate"
                                        value={filter.endDate}
                                        changeValue={this.changeFilterValue}
                                        label="Data final"/>
                        </Col>
                    </Row>
                </Panel>
            </Col>

            <Sidebar l={2} s={12} changeTab={this.changeTab} items={tabs}/>

            <Col l={10} s={12}>
                <Choose current={currentTab}>
                    <When active="Listagem">
                        <Panel loading={isLoading} title="Listagem" wrapper="div">
                            <Table data={issuePeriods.periods}
                                   rows={[
                                       {
                                           label: "Período",
                                           value: "name"
                                       },
                                       {
                                           label: "Lead Time",
                                           value: "leadTime"
                                       },
                                       {
                                           label: "Throughput",
                                           value: "throughput"
                                       },
                                       {
                                           label: "WIP Médio",
                                           value: "wipAvg"
                                       },
                                       {
                                           label: "Eficiência Média",
                                           value: it => `${it.avgPctEfficiency}%`,
                                           active: board.feature.efficiency
                                       }
                                   ]}
                                   actions={period => [
                                       <Button type="button" small onClick={() => this.removeIssuePeriod(period.id)}>
                                           Remover
                                       </Button>,
                                       <Button type="button" small onClick={() => this.updateIssuePeriod(period.id)}>
                                           Atualizar
                                       </Button>,
                                       <a href={period.detailsUrl} target="_blank" rel="noopener noreferrer"
                                          title="Ver no JIRA" className="btn waves-effect waves-light btn-small">
                                           Ver no JIRA
                                       </a>,
                                       <Link small to={`/boards/${board.id}/issue-periods/${period.id}`}>
                                           Ver Detalhes
                                       </Link>
                                   ]}
                                   emptyMessage="Nenhum período cadastrado."/>
                        </Panel>
                    </When>

                    <When active="Lead Time">
                        <Chart loading={isLoading}
                               title="Lead Time"
                               beginAtZero
                               key="leadtime-chart"
                               chartType="bar"
                               data={issuePeriods.charts.leadTime}/>
                    </When>

                    <When active="Throughput">
                        <Chart loading={isLoading}
                               title="Throughput"
                               chartType="bar"
                               beginAtZero
                               key="throughput-chart"
                               data={issuePeriods.charts.throughput}/>
                    </When>

                    <When active="Performance Por Tipo">
                        <IssueTypePerformanceCompare loading={isLoading}
                                                     data={issuePeriods.charts.issueTypePerformanceCompareChart}/>
                    </When>

                    <When active="Throughput Por Estimativa">
                        <Chart loading={isLoading}
                               stacked
                               beginAtZero
                               title="Throughput Por Estimativa"
                               key="throughput-by-estimate-chart"
                               data={issuePeriods.charts.throughputByEstimate}/>
                    </When>

                    <When active="Lead Times">
                        <Chart loading={isLoading}
                               multiAxis
                               beginAtZero
                               title="Lead Times"
                               key="lead-times-chart"
                               data={issuePeriods.charts.leadTimeCompareChart}/>
                    </When>
                </Choose>
            </Col>
        </Row>;
    }
}

export default ListIssuePeriods;
