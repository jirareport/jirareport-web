import React, { Component } from "react";

import * as PropTypes from "prop-types";
import { HttpService } from "services";

import { Button, Preloader, Table } from "components/ui";
import { ChangelogTable, ImpedimentHistoryTable } from "components";
import ReactModal from "react-modal";

import "./style.scss";

class IssueModal extends Component {
    state = {
        loading: true,
        issue: {}
    };

    componentDidMount() {
        this.retrieveIssue();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.issueId !== prevProps.issueId) {
            this.retrieveIssue();
        }
    }

    retrieveIssue = async () => {
        const { board, issueId } = this.props;

        if (issueId) {
            const { data } = await HttpService.get(`/boards/${board.id}/issues/${issueId}`);
            this.setState({
                issue: data,
                loading: false
            });
        }
    };

    handleClose = () => {
        this.setState({
            loading: true,
            issue: {}
        });
        this.props.closeModal();
    };

    render() {
        let { isOpen, board } = this.props;
        let { loading, issue } = this.state;

        return <ReactModal isOpen={isOpen}
                           onRequestClose={this.handleClose}
                           className="modal"
                           overlayClassName="modal-overlay">
            {loading ? <>
                <Preloader/>
            </> : <>
                <div className="modal-header">
                    <h5>{issue.key}</h5>
                </div>
                <div className="modal-content">

                    <h5 className="modal__section-header">Lead Time Por Coluna</h5>
                    <ChangelogTable changelog={issue.changelog}/>

                    {board.feature.leadTimes && <>
                        <h5 className="modal__section-header modal__section-header--space-top">Lead Times</h5>
                        <Table data={issue.leadTimes}
                               rows={[
                                   {
                                       label: "Nome",
                                       value: "name"
                                   },
                                   {
                                       label: "Início",
                                       value: "startDate"
                                   },
                                   {
                                       label: "Fim",
                                       value: "endDate"
                                   },
                                   {
                                       label: "Lead Time",
                                       value: "leadTime"
                                   }
                               ]}
                        />
                    </>}

                    {board.feature.dueDate && <>
                        <h5 className="modal__section-header modal__section-header--space-top">
                            Atualizações de Estimativa
                        </h5>
                        <Table data={issue.dueDateHistory}
                               rows={[
                                   {
                                       label: "Data de Atualização",
                                       value: "created"
                                   },
                                   {
                                       label: "Due Date",
                                       value: "dueDate"
                                   }
                               ]}
                               emptyMessage="Nenhuma informação encontrada."/>
                    </>}

                    {board.feature.efficiency && <>
                        <h5 className="modal__section-header modal__section-header--space-top">
                            Eficiência
                        </h5>
                        <div className="issue-modal__efficiency-item">
                            <span className="issue-modal__efficiency-item__label">Touch Time:</span>
                            <span
                                className="issue-modal__efficiency-item__value">{issue.touchTime.toFixed(2)} Horas</span>
                        </div>
                        <div className="issue-modal__efficiency-item">
                            <span className="issue-modal__efficiency-item__label">Wait Time:</span>
                            <span
                                className="issue-modal__efficiency-item__value">{issue.waitTime.toFixed(2)} Horas</span>
                        </div>
                        <div className="issue-modal__efficiency-item">
                            <span className="issue-modal__efficiency-item__label">Eficiência:</span>
                            <span
                                className="issue-modal__efficiency-item__value">{issue.pctEfficiency.toFixed(2)}%</span>
                        </div>
                    </>}

                    {board.feature.impediment && <>
                        <h5 className="modal__section-header modal__section-header--space-top">
                            Histórico de Impedimentos
                        </h5>
                        <ImpedimentHistoryTable impedimentHistory={issue.impedimentHistory}/>
                    </>}

                </div>
                <div className="modal-footer">
                    <Button onClick={this.handleClose}>Fechar</Button>
                </div>
            </>}
        </ReactModal>;
    }
}

IssueModal.propTypes = {
    isOpen: PropTypes.bool,
    issueId: PropTypes.number,
    board: PropTypes.object,
    closeModal: PropTypes.func
};

export default IssueModal;
