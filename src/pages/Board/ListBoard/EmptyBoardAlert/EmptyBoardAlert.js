import React from "react";

import { Col } from "components/ui";

import "./EmptyBoardAlert.scss";

export default () =>
    <Col s={12} className="center-align empty-board-alert__container">
        <h5>Nenhum board encontrado</h5>
    </Col>;
