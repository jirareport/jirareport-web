import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, isLoggedIn, ...others }) =>
    <Route
        {...others}
        render={props =>
            isLoggedIn ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: "/login", state: { from: props.location } }}/>
            )
        }
    />;

const mapStateToProps = state => ({
    ...state.auth
});

export default connect(mapStateToProps, null)(PrivateRoute);
