import React, { Component } from "react";

import moment from "moment";
import * as PropTypes from "prop-types";

import { DataTable, IssueModal } from "components";
import { Button, Panel } from "components/ui";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class IssueTable extends Component {
    state = {
        selectedIssue: null,
        detailsIsOpen: false
    };

    sortIssues = (issues, sortOptions, field, saveSortedIssues) => {
        let result;

        if (field === "startDate" || field === "endDate") {
            result = issues.sort((a, b) => moment(a[field], "DD/MM/YYYY") - moment(b[field], "DD/MM/YYYY"));
        } else {
            result = issues.sort((a, b) => (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0));
        }

        if (sortOptions.direction === "ASC") {
            result = issues.reverse();
        }

        saveSortedIssues({
            issues: result,
            sortOptions: {
                field,
                direction: sortOptions.direction === "ASC" ? "DESC" : "ASC"
            }
        });
    };

    closeDetailsModal = () => {
        this.setState({
            selectedIssue: null,
            detailsIsOpen: false
        });
    };

    openDetailsModal = async issueId => {
        this.setState({
            selectedIssue: issueId,
            detailsIsOpen: true
        });
    };

    retrieveCsvData = () => {
        const { board, issues, dynamicFieldConfigs } = this.props;

        const headers = [
            "Key",
            "Resumo",
            "Tipo",
            "Início",
            "Fim",
            "Lead Time",
            ...board.feature.impediment ? ["Tempo Em Impedimento"] : [],
            ...board.feature.dueDate ? ["Desvio de estimativa"] : [],
            ...board.feature.dueDate ? ["Alterações de estimativa"] : [],
            ...board.feature.epic ? ["Épico"] : [],
            ...board.feature.estimate ? ["Estimativa"] : [],
            ...board.feature.system ? ["Sistema"] : [],
            ...board.feature.project ? ["Projeto"] : [],
            "Prioridade",
            "Criador",
            ...board.feature.dynamicField ? dynamicFieldConfigs.map(it => it.name) : []
        ];

        return [
            headers,
            ...issues.map(issue => [
                issue.key,
                issue.summary,
                issue.issueType,
                issue.startDate,
                issue.endDate,
                issue.leadTime,
                ...board.feature.impediment ? [issue.impedimentTime] : [],
                ...board.feature.dueDate ? [issue.deviationOfEstimate] : [],
                ...board.feature.dueDate ? [issue.changeEstimateCount] : [],
                ...board.feature.epic ? [issue.epic] : [],
                ...board.feature.estimate ? [issue.estimate] : [],
                ...board.feature.system ? [issue.system] : [],
                ...board.feature.project ? [issue.project] : [],
                issue.priority,
                issue.creator,
                ...board.feature.dynamicField ? dynamicFieldConfigs.map(it => issue.dynamicFields[it.name]) : []
            ])
        ];
    };

    render() {
        const { issues, sortOptions, loading, board, dynamicFieldConfigs, saveSortedIssues } = this.props;
        const { selectedIssue, detailsIsOpen } = this.state;

        return <Panel title="Listagem"
                      small="Shift + Scroll para navegar na horizontal"
                      loading={loading}
                      wrapper="div"
                      actions={issues.length > 0 &&
                      <CSVLink data={this.retrieveCsvData()} filename="issues.csv"
                               className="btn waves-effect waves-light">
                          <FontAwesomeIcon icon="download"/> Exportar
                      </CSVLink>
                      }>
            <DataTable data={issues}
                       sortData={field => this.sortIssues(issues, sortOptions, field, saveSortedIssues)}
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
                               sort: true
                           },
                           {
                               value: "endDate",
                               label: "Fim",
                               sort: true
                           },
                           {
                               value: "leadTime",
                               label: "Lead Time",
                               small: true,
                               sort: true
                           },
                           {
                               value: "impedimentTime",
                               label: "Tempo Em Impedimento",
                               active: board.feature.impediment,
                               sort: true
                           },
                           {
                               value: "deviationOfEstimate",
                               label: "Desvio De Estimativa",
                               active: board.feature.dueDate,
                               sort: true
                           },
                           {
                               value: "changeEstimateCount",
                               label: "Alterações De Estimativa",
                               active: board.feature.dueDate,
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
                           },
                           ...(board.feature.dynamicField ? dynamicFieldConfigs.map(it => ({
                               label: it.name,
                               value: issue => issue.dynamicFields[it.name]
                           })) : [])
                       ]}
                       actions={issue => [
                           <a href={issue.detailsUrl} target="_blank" rel="noopener noreferrer"
                              title="Ver no JIRA" className="btn waves-effect waves-light btn-small">
                               Ver no JIRA
                           </a>,
                           <Button small onClick={() => this.openDetailsModal(issue.id)}>
                               Ver Detalhes
                           </Button>
                       ]}
                       emptyMessage="Nenhum item encontrado."
            />

            <IssueModal issueId={selectedIssue}
                        isOpen={detailsIsOpen}
                        board={board}
                        closeModal={this.closeDetailsModal}/>
        </Panel>;
    }
}

IssueTable.propTypes = {
    issues: PropTypes.array,
    sortOptions: PropTypes.object,
    loading: PropTypes.bool,
    board: PropTypes.object,
    dynamicFieldConfigs: PropTypes.array,
    saveSortedIssues: PropTypes.func
};

export default IssueTable;
