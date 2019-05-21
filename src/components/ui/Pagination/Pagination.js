import React from "react";

import classnames from "classnames";

import { Button } from "components/ui";

import "./Pagination.scss";

export default ({ data, goToPage }) => {
    const pages = Array.apply(null, { length: data.totalPages }).map(Number.call, Number);

    if (data.totalPages <= 1) {
        return null;
    }

    return <div className="center-align">
        <ul className="pagination">
            <li className={classnames({
                "disabled": data.first,
                "waves-effect": !data.first
            })}>
                <Button link
                        type="button"
                        onClick={() => goToPage(data.number - 1)}
                        disabled={data.first}
                        className="pagination__button">
                    <i className="material-icons">chevron_left</i>
                </Button>
            </li>
            {pages.map(page => <li key={page} className={classnames({
                "active blue lighten-1": page === data.number,
                "waves-effect": page !== data.number
            })}>
                <Button link
                        type="button"
                        onClick={() => goToPage(page)}>
                    {page + 1}
                </Button>
            </li>)}
            <li className={classnames({
                "disabled": data.last,
                "waves-effect": !data.last
            })}>
                <Button link
                        type="button"
                        onClick={() => goToPage(data.number + 1)}
                        disabled={data.last}
                        className="pagination__button">
                    <i className="material-icons">chevron_right</i>
                </Button>
            </li>
        </ul>
    </div>;
};
