import React from "react";

import PropTypes from "prop-types";

const EfficiencyItem = ({ label, value }) =>
    <div className="issue-modal__efficiency-item">
        <span className="issue-modal__efficiency-item__label">{label}:</span>
        <span className="issue-modal__efficiency-item__value">{value}</span>
    </div>;

EfficiencyItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
};

export default EfficiencyItem;
