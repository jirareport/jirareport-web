import React from "react";
import PropTypes from "prop-types";

const ModalFooter = ({ children }) =>
    <div className="modal__footer">
        {children}
    </div>;

ModalFooter.propTypes = {
    children: PropTypes.node.isRequired
};

export default ModalFooter;
