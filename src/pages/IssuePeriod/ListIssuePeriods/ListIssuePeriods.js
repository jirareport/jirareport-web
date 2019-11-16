import React, { Component } from "react";

import { AlertService, HttpService, NotificationService } from "services";
import moment from "moment";

import { Chart, Choose, PageHeader, Sidebar, When } from "components";
import { Button, Col, Link, Panel, Row, Table } from "components/ui";
import CreateIssuePeriodForm from "./CreateIssuePeriodForm/CreateIssuePeriodForm";

class ListIssuePeriods extends Component {
    state = {
        board: {
            feature: {
                efficiency: false,
                estimate: false,
                leadTimes: false
            }
        },
        issuePeriod: {
            startDate: moment().startOf("month").format("DD/MM/YYYY"),
            endDate: moment().endOf("month").format("DD/MM/YYYY")
        },
        errors: {},
        issuePeriods: {
            periods: [],
            charts: {
                leadTime: {},
                throughput: {},
                throughputByEstimate: {},
                leadTimeCompareChart: {}
            }
        },
        currentTab: "Listagem",
        isLoading: true
    };

    componentDidMount() {
        const { boardId } = this.props.match.params;

        this.retrieveBoard(boardId);
        this.retrieveIssuePeriods(boardId);
    }

    retrieveBoard = async boardId => {
        const { data } = await HttpService.get(`/boards/${boardId}`);

        this.setState({
            board: data
        });
    };

    retrieveIssuePeriods = async boardId => {
        this.setState({
            isLoading: true
        });

        const { data } = await HttpService.get(`/boards/${boardId}/issue-periods`);

        this.setState({
            issuePeriods: data,
            currentTab: "Listagem",
            isLoading: false
        });
    };

    changeCreateFormValue = (target, value) => {
        this.setState({
            issuePeriod: {
                ...this.state.issuePeriod,
                [target]: value
            }
        });
    };

    handleCreateFormSubmit = async event => {
        event.preventDefault();

        this.setState({
            isLoading: true
        });

        const { board, issuePeriod } = this.state;
        const body = {
            startDate: issuePeriod.startDate,
            endDate: issuePeriod.endDate
        };

        try {
            await HttpService.post(`/boards/${board.id}/issue-periods`, body);
            this.retrieveIssuePeriods(board.id);

            NotificationService.notifySuccess("Período inserido com sucesso");
        } catch ({ response }) {
            if (response.status === 400) {
                const { data } = response;

                for (let [key, value] of Object.entries(data)) {
                    value.forEach(error => {
                        console.log(`${key} => ${value}`);
                        NotificationService.notifyError(error);
                    })
                }

                this.setState({
                    errors: response.data
                });
            } else {
                NotificationService.notifyError("Falha ao cadastrar período");
            }
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    changeTab = tab => {
        this.setState({
            currentTab: tab
        });
    };

    removeIssuePeriod = async id => {
        const willRemove = await AlertService.confirmRemove();
        if (willRemove) {
            this.setState({
                isLoading: true
            });

            try {
                const { board } = this.state;
                await HttpService.delete(`/boards/${board.id}/issue-periods/${id}`);

                this.retrieveIssuePeriods(board.id);
                NotificationService.notifySuccess("Período removido com sucesso");
            } catch (error) {
                NotificationService.notifyError("Falha ao remover o período");
            } finally {
                this.setState({
                    isLoading: false
                });
            }
        }
    };

    updateIssuePeriod = async id => {
        this.setState({
            isLoading: true
        });

        try {
            const { board } = this.state;
            await HttpService.put(`/boards/${board.id}/issue-periods/${id}`);

            this.retrieveIssuePeriods(board.id);
            NotificationService.notifySuccess("Período atualizado com sucesso");
        } catch (error) {
            NotificationService.notifyError("Falha ao atualizar o período");
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    render() {
        const { board, issuePeriod, currentTab, isLoading, issuePeriods, errors } = this.state;
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
                <PageHeader title="Períodos" small={board.name}/>
            </Col>

            <Col s={12}>
                <CreateIssuePeriodForm issuePeriod={issuePeriod}
                                       isLoading={isLoading}
                                       handleSubmit={this.handleCreateFormSubmit}
                                       changeValue={this.changeCreateFormValue}
                                       errors={errors}/>
            </Col>

            <Sidebar l={2} s={12} changeTab={this.changeTab} items={tabs}/>

            <Col l={10} s={12}>
                <Choose current={currentTab}>
                    <When active="Listagem">
                        <Panel loading={isLoading} title="Listagem" wrapper="div">
                            <Table data={issuePeriods.periods}
                                   rows={[
                                       {
                                           label: "ID",
                                           value: "dates"
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
