import React from "react";

import * as classnames from "classnames";

import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./style.scss";

export default ({ data, sortData, sortOptions, rows, actions, emptyMessage }) => {
    if (data.length === 0) {
        return <div className="center-align">
            <h5>{emptyMessage}</h5>
        </div>;
    }

    const retrieveValue = (item, field) => {
        if (typeof field === 'string' || field instanceof String) {
            return item[field];
        }

        return field(item);
    };

    const items = rows
        .filter(it => it.active !== false);

    return <ScrollSync>
        <div className="data-table__wrapper">
            <div className="data-table__header">
                <ScrollSyncPane>
                    <div className="data-table__scroller">
                        {items.map((item, i) =>
                            <div className={classnames("data-table__column", {
                                "data-table__column--large": item.large,
                                "data-table__column--small": item.small
                            })} key={i} onClick={() => item.sort && sortData(item.value)}>
                                <div className={classnames("data-table__header-item", {
                                    "data-table__header-item--sortable": item.sort
                                })}>
                                    {item.label}
                                    {item.sort && <FontAwesomeIcon
                                        icon={item.value !== sortOptions.field ? "sort" : (sortOptions.direction === "ASC" ? "sort-down" : "sort-up")}/>}
                                </div>
                            </div>
                        )}
                        {actions && <div className="data-table__column data-table__column--large">
                            <div className="data-table__header-item">Ações</div>
                        </div>}
                    </div>
                </ScrollSyncPane>
            </div>

            <ScrollSyncPane>
                <div className="data-table__body">
                    {items.map((item, i) =>
                        <div className={classnames("data-table__column", {
                            "data-table__column--large": item.large,
                            "data-table__column--small": item.small
                        })} key={i}>
                            {data.map((it, i) =>
                                <div className="data-table__cell" key={i}>
                                    {retrieveValue(it, item.value)}
                                </div>
                            )}
                        </div>)}

                    {actions && <div className="data-table__column data-table__column--large">
                        {data.map((it, i) =>
                            <div className="data-table__cell data-table__actions" key={i}>
                                {actions(it).map((action, i) =>
                                    <React.Fragment key={i}>
                                        {action}
                                    </React.Fragment>)}
                            </div>
                        )}
                    </div>}
                </div>
            </ScrollSyncPane>
        </div>
    </ScrollSync>;
};
