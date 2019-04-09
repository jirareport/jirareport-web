import React from "react";

import ReactModal from "react-modal";

import { Button } from "components/ui";
import { ChangelogTable } from "components";

const EstimateIssueModal = ({ estimate, handleClose }) => {
    if (!estimate) {
        return null;
    }

    return <ReactModal isOpen={true}
                       onRequestClose={handleClose}
                       className="modal"
                       overlayClassName="modal-overlay">
        <div className="modal-header">
            <h5>{estimate.key}</h5>
        </div>
        <div className="modal-content">
            <h5 className="modal__section-header">Lead Time Por Coluna</h5>
            <ChangelogTable changelog={estimate.changelog}/>
        </div>
        <div className="modal-footer">
            <Button onClick={handleClose}>Fechar</Button>
        </div>
    </ReactModal>;
};

export default EstimateIssueModal;
