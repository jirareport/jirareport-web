import React from "react";

import PropTypes from "prop-types";

import { Button } from "components/ui";
import { ChangelogTable, ImpedimentHistoryTable } from "components";
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalSection } from "components/Modal";

const EstimateIssueModal = ({ estimate, board, handleClose }) => estimate ?
    <Modal isOpen closeModal={handleClose}>
        <ModalHeader title={estimate.key}/>

        <ModalContent>
            <ModalSection title="Lead Time Por Coluna">
                <ChangelogTable changelog={estimate.changelog}/>
            </ModalSection>

            {board.feature.impediment && <ModalSection title="Histórico de Impedimentos">
                <ImpedimentHistoryTable impedimentHistory={estimate.impedimentHistory}/>
            </ModalSection>}
        </ModalContent>

        <ModalFooter>
            <Button onClick={handleClose}>Fechar</Button>
        </ModalFooter>
    </Modal> : <></>;

EstimateIssueModal.propTypes = {
    board: PropTypes.any.isRequired,
    estimate: PropTypes.any.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default EstimateIssueModal;
