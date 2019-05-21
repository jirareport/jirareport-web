import React, { Component } from "react";

import * as PropTypes from "prop-types";
import { HttpService } from "services";

import { Button, Preloader } from "components/ui";
import { ChangelogTable, DueDateHistoryTable, ImpedimentHistoryTable, LeadTimesTable } from "components";
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalSection } from "components/Modal";

import EfficiencyItem from "components/IssueModal/EfficiencyItem";

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

        return <Modal isOpen={isOpen} closeModal={this.handleClose}>
            {loading ? <>
                <Preloader/>
            </> : <>
                <ModalHeader title={issue.key}/>

                <ModalContent>
                    <ModalSection title="Lead Time Por Coluna">
                        <ChangelogTable changelog={issue.changelog}/>
                    </ModalSection>

                    {board.feature.leadTimes && <ModalSection title="Lead Times">
                        <LeadTimesTable leadTimes={issue.leadTimes}/>
                    </ModalSection>}

                    {board.feature.dueDate && <ModalSection title="Atualizações de Estimativa">
                        <DueDateHistoryTable dueDateHistory={issue.dueDateHistory}/>
                    </ModalSection>}

                    {board.feature.efficiency && <ModalSection title="Eficiência">
                        <EfficiencyItem label="Touch Time" value={`${issue.touchTime.toFixed(2)} Horas`}/>
                        <EfficiencyItem label="Wait Time" value={`${issue.waitTime.toFixed(2)} Horas`}/>
                        <EfficiencyItem label="Eficiência" value={`${issue.pctEfficiency.toFixed(2)}%`}/>
                    </ModalSection>}

                    {board.feature.impediment && <ModalSection title="Histórico de Impedimentos">
                        <ImpedimentHistoryTable impedimentHistory={issue.impedimentHistory}/>
                    </ModalSection>}
                </ModalContent>

                <ModalFooter>
                    <Button onClick={this.handleClose}>Fechar</Button>
                </ModalFooter>
            </>}
        </Modal>;
    }
}

IssueModal.propTypes = {
    isOpen: PropTypes.bool,
    issueId: PropTypes.number,
    board: PropTypes.object,
    closeModal: PropTypes.func
};

export default IssueModal;
