import React, { Component } from "react";

import PropTypes from "prop-types";
import classnames from "classnames";

import { Button, Preloader } from "components/ui";

import "./style.scss";

class Panel extends Component {
    state = {
        open: !this.props.defaultClose
    };

    toggleOpen = () => {
        if (this.props.collapsible) {
            this.setState({
                open: !this.state.open
            });
        }
    };

    panelHeader = (title, small, collapsible) => {
        if (title) {
            return <div className="panel__header-container" onClick={this.toggleOpen}>
                <h5 className="panel__header">
                    {title} {small && <small>{small}</small>}
                </h5>
                {collapsible && <Button type="button" link onClick={this.toggleOpen}>
                    <i className="material-icons">{this.state.open ? "arrow_drop_down" : "arrow_drop_up"}</i>
                </Button>}
            </div>;
        }
        return null;
    };

    render() {
        const { children, title, small, actions, collapsible, className, loading, wrapper, contentClasses } = this.props;
        const { open } = this.state;

        const Wrapper = wrapper ? wrapper : "form";

        return <>
            <div className={classnames("card-panel", className)}>
                {this.panelHeader(title, small, collapsible)}
                <div className={classnames("panel__body", {
                    "panel__body--visible": open,
                    "panel__body--hidden": !open
                })}>
                    {loading ? <Preloader/> : <>
                        <Wrapper className="panel__wrapper">
                            <div className={classnames("panel__content", contentClasses)}>
                                {children}
                            </div>
                            {actions && <div className="panel__actions right-align">
                                {actions}
                            </div>}
                        </Wrapper>
                    </>}
                </div>
            </div>
        </>;
    }
}

Panel.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    small: PropTypes.string,
    actions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    collapsible: PropTypes.bool,
    className: PropTypes.string,
    defaultClose: PropTypes.bool,
    wrapper: PropTypes.string,
    loading: PropTypes.bool,
    contentClasses: PropTypes.string,
};

export default Panel;
