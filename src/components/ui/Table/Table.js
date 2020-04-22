import React from "react";

import "./Table.scss";

const Table = ({ data, rows, actions, emptyMessage }) => {
    if (!data || data.length === 0) {
        return <div className="center-align">
            <h5>{emptyMessage}</h5>
        </div>;
    }

    const headers = rows
        .filter(it => it.active !== false)
        .map(it => it.label);

    const fields = rows
        .filter(it => it.active !== false)
        .map(it => it.value);

    const retrieveValue = (item, field) => {
        if (typeof field === 'string' || field instanceof String) {
            return item[field];
        }

        return field(item);
    };


    return <table className="striped">
        <thead>
        <tr>
            {headers.map(label =>
                <th key={label}>
                    {label}
                </th>)}
            {actions && <th>Ações</th>}
        </tr>
        </thead>
        <tbody>
        {data.map((item, i) => <tr key={i}>
            {fields.map((field, i) =>
                <td key={i}>
                    {retrieveValue(item, field)}
                </td>
            )}
            {actions && <td className="table__actions">
                {actions(item).map((action, i) =>
                    <React.Fragment key={i}>
                        {action}
                    </React.Fragment>)}
            </td>}
        </tr>)}
        </tbody>
    </table>;
};

export default Table
