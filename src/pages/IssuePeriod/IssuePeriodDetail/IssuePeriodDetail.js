import React, { Component, Fragment } from "react";

import { HttpService } from "services";

import { Col, Panel, Row } from "components/ui";
import {
    CardNumber,
    Chart,
    Choose,
    Histogram,
    IssueTable,
    PageHeader,
    Sidebar,
    When,
    ColumnTimeAverageTable,
    IssueProgression
} from "components";

class IssuePeriodDetail extends Component {
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
        issuePeriod: {
            detail: {
                leadTime: 0,
                throughput: 0,
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
                columnTimeAverages: [],
                leadTimeCompareChart: {},
                dynamicCharts: [],
                issueProgression: {}
            },
            issues: [],
        },
        sortOptions: {
            field: "key",
            direction: "ASC"
        },
        dynamicFieldConfigs: [],
        currentTab: "Listagem",
        isLoading: true
    };

    componentDidMount() {
        const { boardId, issuePeriodId } = this.props.match.params;

        this.retrieveBoard(boardId);
        this.retrieveDynamicFieldConfigs(boardId);
        this.retrieveIssuePeriod(boardId, issuePeriodId);
    }

    retrieveBoard = async boardId => {
        const { data } = await HttpService.get(`/boards/${boardId}`);

        this.setState({
            board: data
        });
    };

    retrieveIssuePeriod = async (boardId, issuePeriodId) => {
        this.setState({
            isLoading: true
        });

        const { data } = await HttpService.get(`/boards/${boardId}/issue-periods/${issuePeriodId}`);

        this.setState({
            issuePeriod: data,
            isLoading: false
        });
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

    render() {
        const { issuePeriod, board, dynamicFieldConfigs, sortOptions, currentTab, isLoading } = this.state;
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
                name: "Lead Times",
                active: board.feature.leadTimes
            },
            {
                name: "Progressão das histórias"
            },
            ...(board.feature.dynamicField ? issuePeriod.detail.dynamicCharts.flatMap(dynamicFieldConfig => [
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
                <PageHeader title={`Detalhes do Período ${issuePeriod.detail.dates}`} small={board.name}/>
            </Col>

            <Col s={12}>
                <Row>
                    <Col s={6}><CardNumber title="Lead Time" data={issuePeriod.detail.leadTime}/></Col>
                    <Col s={6}><CardNumber title="Throughput" data={issuePeriod.detail.throughput}/></Col>
                </Row>
            </Col>

            <Sidebar l={2} s={12} changeTab={this.changeTab} items={tabs}/>

            <Col l={10} s={12}>
                <Choose current={currentTab}>
                    <When active="Listagem">
                        <IssueTable issues={issuePeriod.issues}
                                    sortOptions={sortOptions}
                                    saveSortedIssues={this.saveSortedIssues}
                                    loading={isLoading}
                                    board={board}
                                    dynamicFieldConfigs={dynamicFieldConfigs}/>
                    </When>
                    <When active="Histograma">
                        <Histogram data={issuePeriod.detail.histogram} loading={isLoading}/>
                    </When>
                    <When active="Lead Time Por Tipo">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="LEAD_TIME"
                               title="Lead Time Por Tipo"
                               key="lead-time-by-type-chart"
                               data={issuePeriod.detail.leadTimeByType}/>
                    </When>
                    <When active="Throughput Por Tipo">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="THROUGHPUT"
                               title="Throughput Por Tipo"
                               key="throughput-by-type-chart"
                               data={issuePeriod.detail.throughputByType}/>
                    </When>
                    <When active="Lead Time Por Prioridade">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="LEAD_TIME"
                               title="Lead Time Por Prioridade"
                               key="lead-time-by-priority-chart"
                               data={issuePeriod.detail.leadTimeByPriority}/>
                    </When>
                    <When active="Throughput Por Prioridade">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="THROUGHPUT"
                               title="Throughput Por Prioridade"
                               key="throughput-by-priority-chart"
                               data={issuePeriod.detail.throughputByPriority}/>
                    </When>
                    <When active="Lead Time Por Estimativa">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="LEAD_TIME"
                               title="Lead Time Por Estimativa"
                               key="lead-time-by-estimate-chart"
                               data={issuePeriod.detail.leadTimeByEstimate}/>
                    </When>
                    <When active="Throughput Por Estimativa">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="THROUGHPUT"
                               title="Throughput Por Estimativa"
                               key="throughput-by-estimate-chart"
                               data={issuePeriod.detail.throughputByEstimate}/>
                    </When>
                    <When active="Lead Time Por Sistema">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="LEAD_TIME"
                               title="Lead Time Por Sistema"
                               key="lead-time-by-system-chart"
                               data={issuePeriod.detail.leadTimeBySystem}/>
                    </When>
                    <When active="Throughput Por Sistema">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="THROUGHPUT"
                               title="Throughput Por Sistema"
                               key="throughput-by-system-chart"
                               data={issuePeriod.detail.throughputBySystem}/>
                    </When>
                    <When active="Lead Time Por Projeto">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="LEAD_TIME"
                               title="Lead Time Por Projeto"
                               key="lead-time-by-project-chart"
                               data={issuePeriod.detail.leadTimeByProject}/>
                    </When>
                    <When active="Throughput Por Projeto">
                        <Chart loading={isLoading}
                               beginAtZero
                               dataType="THROUGHPUT"
                               title="Throughput Por Projeto"
                               key="throughput-by-project-chart"
                               data={issuePeriod.detail.throughputByProject}/>
                    </When>
                    <When active="Média De Tempo Por Coluna">
                        <Panel title="Média De Tempo Por Coluna" loading={isLoading}>
                            <ColumnTimeAverageTable data={issuePeriod.detail.columnTimeAverages}/>
                        </Panel>
                    </When>
                    <When active="Lead Times">
                        <Chart loading={isLoading}
                               beginAtZero
                               chartType="bar"
                               title="Lead Times"
                               key="lead-time-compare-chart"
                               data={issuePeriod.detail.leadTimeCompareChart}/>
                    </When>
                    <When active="Progressão das histórias">
                        <Panel title="Progressão das histórias" loading={isLoading}>
                            <IssueProgression data={issuePeriod.detail.issueProgression}/>
                        </Panel>
                    </When>
                    {board.feature.dynamicField && issuePeriod.detail.dynamicCharts.map(dynamicChart =>
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

export default IssuePeriodDetail;
