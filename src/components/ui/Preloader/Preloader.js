import React from "react";

import classnames from "classnames";

import "./style.scss";

export default ({ small }) =>
    <div className={classnames("loading__wrapper", {
        "loading__wrapper--small": small,
        "loading__wrapper--big": !small
    })}>
        <div className={classnames("preloader-wrapper active", {
            "small": small,
            "big": !small
        })}>
            <div className="spinner-layer spinner-blue-only">
                <div className="circle-clipper left">
                    <div className="circle"/>
                </div>
                <div className="gap-patch">
                    <div className="circle"/>
                </div>
                <div className="circle-clipper right">
                    <div className="circle"/>
                </div>
            </div>
        </div>
    </div>;
