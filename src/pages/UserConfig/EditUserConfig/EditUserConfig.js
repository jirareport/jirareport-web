import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { authActions } from "stores/ducks/auth";

import { HttpService, NotificationService } from "services";

import { PageHeader } from "components";
import { Button, Col, InputField, Panel, Row, Select } from "components/ui";

class EditUserConfig extends Component {
    state = {
        userConfig: {
            state: "",
            city: "",
            holidayToken: "",
            leadTimeChartType: "",
            throughputChartType: ""
        },
        errors: {}
    };

    async componentDidMount() {
        const { data } = await HttpService.get("/users/me/configs");
        this.setState({
            userConfig: data
        });
    }

    changeValue = (key, value) => {
        this.setState({
            userConfig: {
                ...this.state.userConfig,
                [key]: value
            }
        });
    };

    handleSubmit = async event => {
        event.preventDefault();

        try {
            const { userConfig } = this.state;
            const body = {
                state: userConfig.state,
                city: userConfig.city,
                holidayToken: userConfig.holidayToken,
                leadTimeChartType: userConfig.leadTimeChartType,
                throughputChartType: userConfig.throughputChartType
            };

            await HttpService.put("/users/me/configs", body);
            await this.updateConfigs();

            NotificationService.notifySuccess("Preferências alterada com sucesso");
            this.props.history.push("/boards");
        } catch ({ response }) {
            if (response.status === 400) {
                const { data } = response;

                this.setState({
                    errors: data
                });
            } else {
                NotificationService.notifyError("Falha ao alterar preferências");
            }
        }
    };

    updateConfigs = async () => {
        const { data } = await HttpService.get("/users/me/configs");
        this.props.updateUserConfig(data);
    };

    render() {
        const { userConfig, errors } = this.state;

        return <>
            <PageHeader title="Alterar Preferências"/>

            <Panel title="Preferências" actions={
                <Button type="submit" onClick={this.handleSubmit}>Salvar</Button>
            }>
                <Row>
                    <InputField s={12}
                                value={userConfig.state}
                                name="state"
                                onChange={e => this.changeValue(e.target.name, e.target.value)}
                                errors={errors["state"]}
                                label="Sigla do estado"/>

                    <InputField s={12}
                                value={userConfig.city}
                                name="city"
                                onChange={e => this.changeValue(e.target.name, e.target.value)}
                                errors={errors["city"]}
                                label="Cidade"/>

                    <InputField s={12}
                                value={userConfig.holidayToken}
                                name="holidayToken"
                                onChange={e => this.changeValue(e.target.name, e.target.value)}
                                errors={errors["holidayToken"]}
                                label="Token de Feriados"
                                help={<a target="_blank"
                                         rel="noopener noreferrer"
                                         href="http://www.calendario.com.br/api_feriados_municipais_estaduais_nacionais.php">
                                    Obter Token
                                </a>}/>

                    <Col s={12}>
                        <Select value={userConfig.leadTimeChartType}
                                label="Tipo De Gráfico Para Lead Time"
                                onChange={selected => this.changeValue("leadTimeChartType", (selected || {}).value)}
                                options={[
                                    {
                                        label: "Bar",
                                        value: "BAR"
                                    },
                                    {
                                        label: "Doughnut",
                                        value: "DOUGHNUT"
                                    },
                                    {
                                        label: "Pie",
                                        value: "PIE"
                                    }
                                ]}/>
                    </Col>

                    <Col s={12}>
                        <Select value={userConfig.throughputChartType}
                                label="Tipo De Gráfico Para Throughput"
                                onChange={selected => this.changeValue("throughputChartType", (selected || {}).value)}
                                options={[
                                    {
                                        label: "Bar",
                                        value: "BAR"
                                    },
                                    {
                                        label: "Doughnut",
                                        value: "DOUGHNUT"
                                    },
                                    {
                                        label: "Pie",
                                        value: "PIE"
                                    }
                                ]}/>
                    </Col>
                </Row>
            </Panel>
        </>;
    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators({
        ...authActions
    }, dispatch);

export default connect(null, mapDispatchToProps)(EditUserConfig);
