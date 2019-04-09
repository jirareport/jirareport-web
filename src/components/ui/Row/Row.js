import React from "react";

import classnames from "classnames";

export default ({ children, className }) =>
    <div className={classnames("row", className)}>
        {children}
    </div>;
