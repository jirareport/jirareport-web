import React from "react";

export default ({ title, data }) =>
    <div className="card  center-align">
        <div className="card-content ">
            <span className="card-title">{title}</span>
            <h2>{data}</h2>
        </div>
    </div>;
