import React from "react";

import classnames from "classnames";

import { Link as RouterLink } from "react-router-dom";

import "./Button.scss";

function resolveClasses(className, flat, link, secondary, small, large, block, disabled) {
    return classnames(className, {
        "btn": !flat && !link,
        "waves-effect": true,
        "waves-light": !flat && !link && !secondary,
        "grey lighten-1 waves-light": secondary,
        "btn-flat": flat,
        "btn-small": small,
        "btn-large": large,
        "btn__block": block,
        "disabled": disabled,
        "btn__link": link
    });
}

export const Link = ({ className, children, flat, small, large, disabled, block, link, secondary, ...props }) => {
    return <RouterLink className={resolveClasses(className, flat, link, secondary, small, large, block, disabled)}
                       disabled={disabled} {...props}>
        {children}
    </RouterLink>;
};

export const Button = ({ className, children, flat, small, large, disabled, block, link, secondary, ...props }) => {
    return <button className={resolveClasses(className, flat, link, secondary, small, large, block, disabled)}
                   disabled={disabled} {...props}>
        {children}
    </button>;
};

export default Button;
