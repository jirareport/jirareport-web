import React from "react";

import classnames from "classnames";

export default ({ children, className, s, m, l, xl, offsetS, offsetM, offsetL, offsetXl, ...others }) =>
    <div className={
        classnames("col", className, {
            [`s${s}`]: s,
            [`m${m}`]: m,
            [`l${l}`]: l,
            [`xl${xl}`]: xl,
            [`offset-s${offsetS}`]: offsetS,
            [`offset-m${offsetM}`]: offsetM,
            [`offset-l${offsetL}`]: offsetL,
            [`offset-xl${offsetXl}`]: offsetXl,
        })
    } {...others}>
        {children}
    </div>;
