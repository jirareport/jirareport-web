import React from "react";

const ModalSection = ({ title, children }) => {
    return <div className="modal__section">
        <h5 className="modal__section__header">
            {title}
        </h5>
        <div className="modal__section__content">
            {children}
        </div>
    </div>;
};

export default ModalSection;
