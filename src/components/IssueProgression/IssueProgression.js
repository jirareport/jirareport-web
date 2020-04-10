import React from "react";

import classnames from 'classnames';
import './IssueProgression.scss';

const IssueProgression = ({ data }) =>
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

export default IssueProgression;
