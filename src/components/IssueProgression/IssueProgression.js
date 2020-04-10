import React from "react";

import classnames from 'classnames';
import './IssueProgression.scss';
import validations from "validators/validations";

const IssueProgressionTable = ({ data }) =>
    <table className="centered issue-progression__table">
        <thead>
        <tr>
            {data.days.map(day =>
                <th key={day}>
                    {day}
                </th>
            )}
        </tr>
        </thead>
        <tbody>
        {Object.keys(data.issues).map(issue =>
            <tr key={issue} data-key={issue}>
                {data.issues[issue].map((isInProgress, index) =>
                    <td key={index} className={classnames({
                        'issue-progression__in-progress': isInProgress
                    })}>
                        {isInProgress ? issue : ""}
                    </td>
                )}
            </tr>
        )}
        </tbody>
    </table>;

const IssueProgression = ({ data }) =>
    validations.isEmptyObject(data) || validations.isEmptyObject(data.issues) ?
        <div className="center-align"><h5>Nenhuma informação encontrada.</h5></div> :
        <IssueProgressionTable data={data}/>;

export default IssueProgression;
