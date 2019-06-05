import React, { Component } from "react";

import { connect } from "react-redux";

import PropTypes from "prop-types";
import { AlertService, HttpService, NotificationService } from "services";

import { Button, Col } from "components/ui";
import { Link } from "react-router-dom";

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
                NotificationService.notifySuccess("Board removido com sucesso");
                this.props.refreshBoards();
            }
        } catch (e) {
            NotificationService.notifyError("Falha ao remover o board");
        }
    };

    copyBoard = async () => {
        const { board } = this.props;

        try {
            await HttpService.post("/boards", {}, {
                params: {
                    boardIdToClone: board.id
                }
            });

            NotificationService.notifySuccess("Board duplicado com sucesso");
            this.props.refreshBoards();
        } catch (e) {
            NotificationService.notifyError("Falha ao duplicar o board");
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
                            <Link to={`/boards/${board.id}/edit`}>Configurações</Link>
                        </li>
                        <li>
                            <Link to={`/boards/${board.id}/dynamic-field-configs`}>Campos Dinâmicos</Link>
                        </li>
                        <li>
                            <Link to={`/boards/${board.id}/lead-time-configs`}>Configurações de Lead Times</Link>
                        </li>
                        <li>
                            <Link to={`/boards/${board.id}/holidays`}>Feriados</Link>
                        </li>
                        <li>
                            <Button link onClick={this.copyBoard}>
                                Duplicar
                            </Button>
                        </li>
                        {userConfig.username === board.owner && <li>
                            <Button link onClick={this.deleteBoard}>
                                Remover
                            </Button>
                        </li>}
                    </ul>
                </div>
                <div className="card-action right-align">
                    <Link to={`/boards/${board.id}/estimates`}>Previsibilidade</Link>
                    <Link to={`/boards/${board.id}/issues`}>SandBox</Link>
                    <Link to={`/boards/${board.id}/issue-periods`}>Períodos</Link>
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
