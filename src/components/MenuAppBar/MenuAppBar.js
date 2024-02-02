import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { authActions } from "stores/ducks/auth";
import M from "materialize-css";
import { Link } from "react-router-dom";

import { AuthService, NotificationService } from "services";
import { getLang, setLang } from "i18n/i18n";

class MenuAppBar extends Component {
    state = {
        lang: getLang()
    }

    componentDidMount() {
        const dropdown = document.querySelectorAll(".dropdown-trigger");
        M.Dropdown.init(dropdown, {});
    }

    handleLogout = async () => {
        AuthService.logout();
        this.props.logout();

        NotificationService.notifySuccess("Logout realizado com sucesso");
    };

    handleLangChange = lang => {
        setLang(lang)
        this.setState({
            lang
        });
        window.location.reload();
    }

    render() {
        const { userConfig } = this.props;

        return <header>
            <nav>
                <div className="nav-wrapper blue lighten-1">
                    <Link to="/boards" className="brand-logo center">
                        Jiratório
                    </Link>
                    <ul className="right hide-on-med-and-down">
                        <li>
                            <Link to="#" className="dropdown-trigger" data-target="user-dropdown">
                                {userConfig.username}
                                <i className="material-icons right">arrow_drop_down</i>
                            </Link>
                            <ul id="user-dropdown" className="dropdown-content">
                                <li>
                                    <Link to="/users/me/configs">Configurações</Link>
                                </li>
                                <li>
                                    <Link onClick={this.handleLogout} to="#">Sair</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul className="right hide-on-med-and-down">
                        <li>
                            <Link to="#" className="dropdown-trigger" data-target="language-dropdown">
                                {this.state.lang}
                                <i className="material-icons right">arrow_drop_down</i>
                            </Link>
                            <ul id="language-dropdown" className="dropdown-content">
                                <li>
                                    <Link onClick={() => this.handleLangChange('en')} to="#">EN</Link>
                                </li>
                                <li>
                                    <Link onClick={() => this.handleLangChange('pt_BR')} to="#">PT-BR</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>;
    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators({
        ...authActions
    }, dispatch);

const mapStateToProps = state => ({
    ...state.auth
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuAppBar);
