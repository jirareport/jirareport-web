import React from "react";

import "./PageHeader.scss";

export default ({ title, small, action }) =>
    <div className="page-header__container">
        <h4 className="page-header__header">
            {title}
            {small && <small>{small}</small>}
        </h4>
        {action && <>{action}</>}
    </div>;
