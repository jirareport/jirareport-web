import React from "react";

import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import { DashboardRouter, ScrollToTop } from "routers";

import Login from "pages/Login/Login";

export default () =>
    <BrowserRouter>
        <ScrollToTop>
            <Switch>
                <Route exact path="/" render={() => <Redirect to={{ pathname: "/login" }}/>}/>
                <Route exact path="/login" component={Login}/>
                <DashboardRouter/>
            </Switch>
        </ScrollToTop>
    </BrowserRouter>;

