import React from "react";

import { Button, Col, Panel } from "components/ui";

import "./Sidebar.scss";

export default ({ s, m, l, xl, items, changeTab }) => {
    const tabs = items
        .filter(it => it.active !== false)
        .map(it => it.name);

    return <Col s={s} m={m} l={l} xl={xl}>
        <Panel title="Menu" contentClasses="sidebar__panel__content" wrapper="div">
            <ul className="sidebar__ul">
                {tabs.map((item, i) =>
                    <li className="sidebar__item" key={i}>
                        <Button link onClick={() => changeTab(item)}
                                className="sidebar__item__button waves-effect waves-gray">
                            {item}
                        </Button>
                    </li>)}
            </ul>
        </Panel>
    </Col>;
};
