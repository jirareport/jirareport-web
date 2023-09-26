import React, { Component } from "react";

import { connect } from "react-redux";

import PropTypes from "prop-types";
import { AlertService, HttpService, NotificationService } from "services";

import { Button, Col } from "components/ui";
import { Link } from "react-router-dom";

import t from 'i18n/i18n'

import M from "materialize-css";

import "./CardBoard.scss";

class CardBoard extends Component {
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateDropdownTrigger();
    }


    componentDidMount() {
        this.updateDropdownTrigger();
    }

    updateDropdownTrigger = () => {
        const element = document.querySelectorAll(".board-dropdown-trigger");
        M.Dropdown.init(element, {
            constrainWidth: false
        });
    };

    deleteBoard = async () => {
        const { board } = this.props;

        try {
            const willDelete = await AlertService.confirmRemove();
            if (willDelete) {
                await HttpService.delete(`/boards/${board.id}`);
                NotificationService.notifySuccess(t('boards.remove.success'));
                this.props.refreshBoards();
            }
        } catch (e) {
            NotificationService.notifyError(t('boards.remove.failure'));
        }
    };

    cloneBoard = async () => {
        const { board } = this.props;

        try {
            await HttpService.post("/boards", {}, {
                params: {
                    boardIdToClone: board.id
                }
            });

            NotificationService.notifySuccess(t('boards.clone.success'));
            this.props.refreshBoards();
        } catch (e) {
            NotificationService.notifyError(t('boards.clone.failure'));
        }
    };

    render() {
        const { board, userConfig } = this.props;

        return <Col s={12} l={6}>
            <div className="card">
                <div className="card-content card__content">
                    <span className="card-title">{board.name}</span>
                    <Link to="#" className="board-dropdown-trigger" data-target={"board-dropdown-" + board.id}>
                        <i className="material-icons black-text lighten-1">more_vert</i>
                    </Link>
                    <ul id={"board-dropdown-" + board.id} className="dropdown-content">
                        <li>
                            <Link to={`/boards/${board.id}/edit`}>
                                {t('boards.dropdown.actions.edit')}
                            </Link>
                        </li>
                        <li>
                            <Link to={`/boards/${board.id}/dynamic-field-configs`}>
                                {t('boards.dropdown.actions.dynamicFieldConfigs')}
                            </Link>
                        </li>
                        <li>
                            <Link to={`/boards/${board.id}/lead-time-configs`}>
                                {t('boards.dropdown.actions.leadTimeConfigs')}
                            </Link>
                        </li>
                        <li>
                            <Link to={`/boards/${board.id}/holidays`}>
                                {t('boards.dropdown.actions.holidays')}
                            </Link>
                        </li>
                        <li>
                            <Button link onClick={this.cloneBoard}>
                                {t('boards.dropdown.actions.clone')}
                            </Button>
                        </li>
                        {userConfig.username === board.owner && <li>
                            <Button link onClick={this.deleteBoard}>
                                {t('boards.dropdown.actions.remove')}
                            </Button>
                        </li>}
                    </ul>
                </div>
                <div className="card-action right-align">
                    <Link to={`/boards/${board.id}/estimates`}>
                        {t('boards.buttons.estimates')}
                    </Link>
                    <Link to={`/boards/${board.id}/issues`}>
                        {t('boards.buttons.issues')}
                    </Link>
                    <Link to={`/boards/${board.id}/issue-periods`}>
                        {t('boards.buttons.issuePeriods')}
                    </Link>
                </div>
            </div>
        </Col>;
    }
}

const mapStateToProps = state => ({
    ...state.auth
});

CardBoard.propTypes = {
    userConfig: PropTypes.object,
    refreshBoards: PropTypes.func
};

export default connect(mapStateToProps, null)(CardBoard);
