import React from "react";

import "./Chip.scss";

export default ({ children, close, ...others }) =>
    <div className="chip chip__container" {...others}>
        {children} <i className="chip__close material-icons" onClick={close}>close</i>
    </div>;
