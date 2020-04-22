import React, { Component } from "react";

import { IssuePeriodService } from "services";
import moment from "moment";
import validations from "validators/validations";

import { Button, Radio, Col, DatePicker, Panel, Row, Select } from "components/ui";
import { PageHeader } from "components";

class CreateIssuePeriod extends Component {
    state = {
        selectorType: "DATES",
        issuePeriod: {
            startDate: moment().startOf("month").format("DD/MM/YYYY"),
            endDate: moment().endOf("month").format("DD/MM/YYYY"),
            month: `${moment().month() + 1}`
        },
        isLoading: false,
        errors: {}
    };

    changeValue = async (target, value) => {
        await this.setState(state => ({
            issuePeriod: {
                ...state.issuePeriod,
                month: `${moment().month() + 1}`,
                [target]: value
            }
        }));

        const { issuePeriod } = this.state;
        const startDate = moment(issuePeriod.startDate, 'DD/MM/YYYY');
        const endDate = moment(issuePeriod.endDate, 'DD/MM/YYYY');

        if (startDate.month() === endDate.month()) {
            this.setState(state => ({
                issuePeriod: {
                    ...state.issuePeriod,
                    month: `${startDate.month() + 1}`
                }
            }));
        }
    };

    changeSelectorType = (name, value) => {
        this.setState({
            selectorType: value
        });
    };

    handleSubmit = async event => {
        event.preventDefault();

        await this.setState({
            isLoading: true
        });

        const { boardId } = this.props.match.params;
        const { issuePeriod } = this.state;

        const errors = await IssuePeriodService.create(boardId, issuePeriod);
        if (validations.isEmptyObject(errors)) {
            this.props.history.push(`/boards/${boardId}/issue-periods`);
        } else {
            this.setState({
                errors,
                isLoading: false
            });
        }
    };

    handleMonthSelect = month => {
        const date = moment([moment().year(), month - 1]);

        this.setState(state => ({
            issuePeriod: {
                startDate: date.clone().startOf('month').format("DD/MM/YYYY"),
                endDate: date.clone().endOf('month').format("DD/MM/YYYY"),
                month: month
            }
        }));
    };

    render() {
        const { issuePeriod, selectorType, isLoading, errors } = this.state;

        return <>
            <PageHeader title="Novo período"/>

            <Panel title="Novo Período" loading={isLoading} actions={
                <Button onClick={this.handleSubmit} disabled={isLoading}>Salvar</Button>
            }>
                <Row>
                    <Radio name="selectorType"
                           value={selectorType}
                           options={[
                               {
                                   name: "Utilizar seletor de datas",
                                   value: "DATES"
                               },
                               {
                                   name: "Utilizar seletor de mês",
                                   value: "MONTH"
                               }
                           ]}
                           onChange={this.changeSelectorType}/>
                    {
                        selectorType === "DATES" ? <>
                                <Col s={12}>
                                    <DatePicker name="startDate"
                                                value={issuePeriod.startDate}
                                                changeValue={this.changeValue}
                                                label="Data inicial"
                                                errors={errors["startDate"]}/>
                                </Col>
                                <Col s={12}>
                                    <DatePicker name="endDate"
                                                value={issuePeriod.endDate}
                                                changeValue={this.changeValue}
                                                label="Data final"
                                                errors={errors["endDate"]}/>
                                </Col>
                            </> :
                            <Col s={12}>
                                <Select value={`${issuePeriod.month}`}
                                        label="Mês"
                                        withoutWrapper
                                        onChange={selected => this.handleMonthSelect((selected || {}).value)}
                                        options={[
                                            {
                                                label: "Janeiro",
                                                value: "1"
                                            },
                                            {
                                                label: "Fevereiro",
                                                value: "2"
                                            },
                                            {
                                                label: "Março",
                                                value: "3"
                                            },
                                            {
                                                label: "Abril",
                                                value: "4"
                                            },
                                            {
                                                label: "Maio",
                                                value: "5"
                                            },
                                            {
                                                label: "Junho",
                                                value: "6"
                                            },
                                            {
                                                label: "Julho",
                                                value: "7"
                                            },
                                            {
                                                label: "Agosto",
                                                value: "8"
                                            },
                                            {
                                                label: "Setembro",
                                                value: "9"
                                            },
                                            {
                                                label: "Outubro",
                                                value: "10"
                                            },
                                            {
                                                label: "Novembro",
                                                value: "11"
                                            },
                                            {
                                                label: "Dezembro",
                                                value: "12"
                                            },
                                        ]}/>
                            </Col>
                    }
                </Row>
            </Panel>
        </>;
    }
}

export default CreateIssuePeriod;
