import React, { Component } from "react";

import moment from "moment";

import { DataTable, EstimateIssueModal } from "components";
import { Button, Panel } from "components/ui";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class EstimateIssueTable extends Component {
    state = {
        estimateDetailed: null
    };

    sortEstimates = (estimates, sortOptions, field, saveSortedEstimates) => {
        let result;

        if (field === "startDate" || field === "endDate") {
            result = estimates.sort((a, b) => moment(a[field], "DD/MM/YYYY") - moment(b[field], "DD/MM/YYYY"));
        } else {
            result = estimates.sort((a, b) => (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0));
        }

        if (sortOptions.direction === "ASC") {
            result = estimates.reverse();
        }

        saveSortedEstimates({
            estimates: result,
            sortOptions: {
                field,
                direction: sortOptions.direction === "ASC" ? "DESC" : "ASC"
            }
        });
    };

    closeDetailsModal = () => {
        this.setState({
            estimateDetailed: null
        });
    };

    openDetailsModal = estimate => {
        this.setState({
            estimateDetailed: estimate
        });
    };

    retrieveCsvData = () => {
        const { board, estimates } = this.props;
        const headers = [
            "Key",
            "Resumo",
            "Tipo",
            "Início",
            "Lead Time",
            "Previsão Média",
            "Percentil 50",
            "Percentil 75",
            "Percentil 90",
            ...board.feature.impediment ? ["Tempo Em Impedimento"] : [],
            ...board.feature.epic ? ["Épico"] : [],
            ...board.feature.estimate ? ["Estimativa"] : [],
            ...board.feature.system ? ["Sistema"] : [],
            ...board.feature.project ? ["Projeto"] : [],
            "Prioridade",
            "Criador"
        ];

        return [
            headers,
            ...estimates.map(estimate => [
                estimate.key,
                estimate.summary,
                estimate.issueType,
                estimate.startDate,
                estimate.leadTime,
                estimate.estimateDateAvg,
                estimate.estimateDatePercentile50,
                estimate.estimateDatePercentile75,
                estimate.estimateDatePercentile90,
                ...board.feature.impediment ? [estimate.impedimentTime] : [],
                ...board.feature.epic ? [estimate.epic] : [],
                ...board.feature.estimate ? [estimate.estimate] : [],
                ...board.feature.system ? [estimate.system] : [],
                ...board.feature.project ? [estimate.project] : [],
                estimate.priority,
                estimate.creator
            ])
        ];
    };

    render() {
        const { estimateDetailed } = this.state;
        const { estimates, sortOptions, board, isLoading, saveSortedEstimates } = this.props;

        return <Panel title="Listagem de Estimativas"
                      small="Shift + Scroll para navegar na horizontal"
                      loading={isLoading}
                      wrapper="div"
                      actions={estimates.length > 0 &&
                      <CSVLink data={this.retrieveCsvData()} filename="issues.csv"
                               className="btn waves-effect waves-light">
                          <FontAwesomeIcon icon="download"/> Exportar
                      </CSVLink>
                      }>
            <DataTable data={estimates}
                       sortData={field => this.sortEstimates(estimates, sortOptions, field, saveSortedEstimates)}
                       sortOptions={sortOptions}
                       rows={[
                           {
                               label: "Key",
                               value: "key",
                               small: true,
                               sort: true
                           },
                           {
                               label: "Resumo",
                               value: "summary",
                               large: true
                           },
                           {
                               label: "Tipo",
                               value: "issueType",
                               sort: true
                           },
                           {
                               value: "startDate",
                               label: "Início",
                               small: true,
                               sort: true
                           },
                           {
                               value: "leadTime",
                               label: "Lead Time",
                               small: true,
                               sort: true
                           },
                           {
                               value: "estimateDateAvg",
                               label: "Previsão Média",
                               small: true,
                               sort: true
                           },
                           {
                               value: "estimateDatePercentile50",
                               label: "Percentil 50",
                               small: true,
                               sort: true
                           },
                           {
                               value: "estimateDatePercentile75",
                               label: "Percentil 75",
                               small: true,
                               sort: true
                           },
                           {
                               value: "estimateDatePercentile90",
                               label: "Percentil 90",
                               small: true,
                               sort: true
                           },
                           {
                               value: "impedimentTime",
                               label: "Tempo Em Impedimento",
                               small: true,
                               sort: true
                           },
                           {
                               value: "epic",
                               label: "Épico",
                               active: board.feature.epic,
                               sort: true
                           },
                           {
                               value: "estimate",
                               label: "Estimativa",
                               active: board.feature.estimate,
                               sort: true
                           },
                           {
                               value: "system",
                               label: "Sistema",
                               active: board.feature.system,
                               sort: true
                           },
                           {
                               label: "Projeto",
                               value: "project",
                               active: board.feature.project,
                               sort: true
                           },
                           {
                               label: "Prioridade",
                               value: "priority",
                               sort: true
                           },
                           {
                               label: "Criador",
                               value: "creator",
                               sort: true
                           }
                       ]}
                       actions={estimate => [
                           <a href={estimate.detailsUrl} target="_blank" rel="noopener noreferrer"
                              title="Ver no JIRA" className="btn waves-effect waves-light btn-small">
                               Ver no JIRA
                           </a>,
                           <Button small onClick={() => this.openDetailsModal(estimate)}>
                               Ver Detalhes
                           </Button>
                       ]}
                       emptyMessage="Nenhum item encontrado."
            />

            <EstimateIssueModal estimate={estimateDetailed}
                                handleClose={this.closeDetailsModal}/>
        </Panel>;
    }
}


export default EstimateIssueTable;
