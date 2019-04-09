import React from "react";
import ReactDOM from "react-dom";

import "./index.scss";

import "config";

import { Provider } from "react-redux";
import store from "./stores/store";

import { Router } from "routers";
import ReactModal from "react-modal";

let element = document.getElementById("root");
ReactModal.setAppElement(element);

ReactDOM.render(
    <Provider store={store}>
        <Router/>
    </Provider>,
    element
);
