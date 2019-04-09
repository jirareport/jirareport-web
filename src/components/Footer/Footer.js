import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./style.scss";

export default () =>
    <footer className="page-footer">
        <div className="container center-align">
            Made with <FontAwesomeIcon icon="coffee"/> and <FontAwesomeIcon icon="heart"/> by&nbsp;
            <a className="footer__external-link"
               href="https://github.com/orgs/jirareport/people"
               target="_blank"
               rel="noopener noreferrer">
                Jiratório folks
            </a>
        </div>
    </footer>;
