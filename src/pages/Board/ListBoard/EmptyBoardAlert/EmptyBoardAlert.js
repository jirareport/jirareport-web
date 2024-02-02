import React from "react";

import { Col } from "components/ui";

import "./EmptyBoardAlert.scss";

import t from 'i18n/i18n';

export default () =>
    <Col s={12} className="center-align empty-board-alert__container">
        <h5>{t('boards.empytBoardList')}</h5>
    </Col>;
