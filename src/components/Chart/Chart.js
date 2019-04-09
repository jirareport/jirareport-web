import React, { Component } from "react";

import ChartJS from "chart.js";
import PropTypes from "prop-types";

import { Panel } from "components/ui";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as classnames from "classnames";
import validations from "validators/validations";

const fontSize = 16;
const colors = [
    { r: 33, g: 150, b: 243 },
    { r: 0, g: 150, b: 136 },
    { r: 63, g: 81, b: 181 },
    { r: 239, g: 108, b: 0 },
    { r: 0, g: 188, b: 212 },
    { r: 121, g: 85, b: 72 },
    { r: 156, g: 39, b: 176 },
    { r: 158, g: 158, b: 158 },
    { r: 253, g: 216, b: 53 },
    { r: 244, g: 67, b: 54 }
];

class Chart extends Component {
    chartRef = React.createRef();
    state = {
        chart: {
            toBase64Image: () => {
            },
            destroy: () => {
            }
        }
    };

    componentDidMount() {
        this.updateChart();
    }

    componentWillUnmount() {
        this.state.chart.destroy();
    }

    emptyData = () => {
        const { data } = this.props;

        return !data
            || validations.isEmptyObject(data)
            || (data.data && validations.isEmptyObject(data.data))
            || (data.labels && data.labels.length === 0);
    };

    updateChart = () => {
        const { title, beginAtZero, stacked, multiAxis, chartType, data } = this.props;

        if (!this.refs.chartRef) {
            return;
        }

        let labels = [];
        let datasets = [];

        if (multiAxis || stacked) {
            labels = data.labels;
            const datasourses = data.datasources;
            datasets = Object.keys(datasourses).map(it => ({
                label: it,
                data: datasourses[it]
            }));
        } else {
            labels = Object.keys(data.data);

            datasets = [{
                label: title,
                data: Object.values(data.data)
            }];
        }

        const selectedChartType = chartType || this.resolveChartType(this.props);

        datasets.forEach((dataset, i) => {
            const { r, g, b } = colors[i];

            if (stacked) {
                dataset.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                dataset.borderColor = `rgba(${r - 25}, ${g - 25}, ${b - 25})`;
                dataset.borderWidth = 2;
            } else {
                if (selectedChartType === "bar") {
                    dataset.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                } else {
                    dataset.backgroundColor = colors.map(c => `rgb(${c.r}, ${c.g}, ${c.b})`);
                }
            }
        });

        const chart = new ChartJS(this.refs.chartRef.getContext("2d"), {
                type: selectedChartType,
                data: {
                    labels,
                    datasets
                },
                options: {
                    responsive: true,
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontSize,
                                beginAtZero
                            },
                            stacked
                        }],
                        xAxes: [{
                            ticks: {
                                fontSize
                            },
                            stacked
                        }]
                    },
                    legend: {
                        labels: {
                            fontSize
                        }
                    },
                    plugins: {
                        datalabels: {
                            color: "#FFF",
                            font: {
                                weight: "bold",
                                size: 20
                            },
                            display: ctx => ctx.dataset.data[ctx.dataIndex] > 0 && ctx.chart.isDatasetVisible(ctx.datasetIndex),
                            formatter: value => isNaN(value) || value % 1 === 0 || value.toFixed === undefined ? value : value.toFixed(2),
                            clamp: true
                        }
                    },
                    animation: {
                        onComplete: () => {
                            this.setState({
                                base64Image: this.state.chart.toBase64Image()
                            });
                        }
                    }
                }
            }
        );

        this.setState({
            chart
        });
    };

    render() {
        const { loading, title, children } = this.props;
        const { base64Image } = this.state;

        if (this.emptyData()) {
            return <Panel wrapper="div" title={title} loading={loading}>
                <div className="center-align">
                    <h5>Nenhuma informação encontrada.</h5>
                </div>
            </Panel>;
        }

        return <Panel wrapper="div" title={title} loading={loading} actions={
            <a href={base64Image} download={title} className={classnames("btn waves-effect waves-light", {
                "disabled": !base64Image
            })}>
                <FontAwesomeIcon icon="download"/> Exportar
            </a>}>
            <canvas ref={"chartRef"}/>
            {children}
        </Panel>;
    }

    resolveChartType = ({ userConfig, dataType, stacked }) => {
        if (stacked) {
            return "bar";
        }

        switch (dataType) {
            case "LEAD_TIME":
                return userConfig.leadTimeChartType.toLowerCase();
            case "THROUGHPUT":
                return userConfig.throughputChartType.toLowerCase();
            default:
                return "bar";
        }
    };
}

Chart.propTypes = {
    title: PropTypes.string,
    beginAtZero: PropTypes.bool,
    data: PropTypes.any,
    stacked: PropTypes.bool,
    multiAxis: PropTypes.bool,
    dataType: PropTypes.oneOf(["LEAD_TIME", "THROUGHPUT"]),
    chartType: PropTypes.oneOf(["bar", "doughnut", "pie"]),
    loading: PropTypes.bool
};

const mapStateToProps = state => ({
    ...state.auth
});

export default connect(mapStateToProps, null)(Chart);
