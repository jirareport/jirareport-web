import React from "react";
import PropTypes from "prop-types";

const ModalHeader = ({ title }) =>
    <div className="modal__header">
        <h5>{title}</h5>
    </div>;

ModalHeader.propTypes = {
    title: PropTypes.string.isRequired
};

export default ModalHeader;
