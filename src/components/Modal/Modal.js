import React from "react";

import PropTypes from "prop-types";

import ReactModal from "react-modal";

import "./Modal.scss";

const Modal = ({ isOpen, children, closeModal }) =>
    <ReactModal isOpen={isOpen}
                onRequestClose={closeModal}
                className="modal"
                overlayClassName="modal__overlay">
        {children}
    </ReactModal>;

Modal.propTypes = {
    children: PropTypes.node.isRequired,
    closeModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
};

export default Modal;
