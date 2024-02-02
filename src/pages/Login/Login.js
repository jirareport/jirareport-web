import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { authActions } from "stores/ducks/auth";

import { AuthService, NotificationService } from "services";

import { Button, Col, InputField, Panel, Row } from "components/ui";

import "./Login.scss";

import t from "i18n/i18n";

class Login extends Component {
    state = {
        username: "",
        password: "",
        isLoading: false
    };

    componentDidMount() {
        if (this.props.isLoggedIn) {
            this.redirect();
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({
            isLoading: true
        });

        try {
            const response = await AuthService.login(this.state.username, this.state.password);
            this.props.login(response.token, response.userConfig);

            this.redirect();

            NotificationService.notifySuccess(t('login.successMessage'));
        } catch (e) {
            const response = e.response;
            if (response) {
                const reason = response.headers['x-auth-fail-reason'];

                if (reason) {
                    NotificationService.notifyError(reason);
                    return;
                } 
            }            
            
            NotificationService.notifyError(t('login.failureMessage'));
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    redirect() {
        const { from } = this.props.location.state || { from: { pathname: "/boards" } };
        this.props.history.push(from);
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const { password, username, isLoading } = this.state;

        return <div className="container login__container">
            <Row>
                <Col s={12} l={6} offsetL={3}>
                    <Panel loading={isLoading}>
                        <div className="login-panel__header-container">
                            <h4 className="login-panel__header center-align">{t('login.title')}</h4>
                        </div>

                        <Row>
                            <InputField s={12}
                                        name="username"
                                        onChange={this.handleChange}
                                        label={t('login.usernameLabel')}
                                        value={username}
                            />

                            <InputField s={12}
                                        type="password"
                                        name="password"
                                        onChange={this.handleChange}
                                        label={t('login.passwordLabel')}
                                        value={password}
                            />

                            <Col s={12}>
                                <Button type="submit" block onClick={this.handleSubmit}>
                                    {t('login.submit')}
                                </Button>
                            </Col>
                        </Row>
                    </Panel>
                </Col>
            </Row>
        </div>;
    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators({
        ...authActions
    }, dispatch);

const mapStateToProps = state => ({
    ...state.auth
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
