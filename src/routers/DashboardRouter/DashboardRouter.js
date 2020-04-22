import React from "react";

import { Footer, MenuAppBar, PrivateRoute } from "components";

import { CreateBoard, EditBoard, ListBoard } from "pages/Board";
import { ListDynamicFieldConfigs } from "pages/DynamicFieldConfig";
import { CreateLeadTimeConfig, EditLeadTimeConfig, ListLeadTimeConfigs } from "pages/LeadTimeConfig";
import { CreateHoliday, EditHoliday, ListHolidays } from "pages/Holiday";
import { ListIssuePeriods, CreateIssuePeriod, IssuePeriodDetail } from "pages/IssuePeriod";
import { EditUserConfig } from "pages/UserConfig";
import { ListIssue } from "pages/Issue";
import { ListEstimateIssue } from "pages/EstimateIssue";

import "./DashboardRouter.scss";

export default () => <>
    <MenuAppBar/>
    <main className="dashboard__container">
        <PrivateRoute exact path="/boards" component={ListBoard}/>
        <PrivateRoute exact path="/boards/new" component={CreateBoard}/>
        <PrivateRoute exact path="/boards/:boardId(\d+)/edit" component={EditBoard}/>

        <PrivateRoute exact path="/boards/:boardId(\d+)/dynamic-field-configs" component={ListDynamicFieldConfigs}/>

        <PrivateRoute exact path="/boards/:boardId(\d+)/lead-time-configs" component={ListLeadTimeConfigs}/>
        <PrivateRoute exact path="/boards/:boardId(\d+)/lead-time-configs/new" component={CreateLeadTimeConfig}/>
        <PrivateRoute exact path="/boards/:boardId(\d+)/lead-time-configs/:leadTimeConfigId(\d+)/edit" component={EditLeadTimeConfig}/>

        <PrivateRoute exact path="/boards/:boardId(\d+)/holidays" component={ListHolidays}/>
        <PrivateRoute exact path="/boards/:boardId(\d+)/holidays/new" component={CreateHoliday}/>
        <PrivateRoute exact path="/boards/:boardId(\d+)/holidays/:holidayId(\d+)/edit" component={EditHoliday}/>

        <PrivateRoute exact path="/boards/:boardId(\d+)/issue-periods" component={ListIssuePeriods}/>
        <PrivateRoute exact path="/boards/:boardId(\d+)/issue-periods/:issuePeriodId(\d+)" component={IssuePeriodDetail}/>
        <PrivateRoute exact path="/boards/:boardId(\d+)/issue-periods/new" component={CreateIssuePeriod}/>

        <PrivateRoute exact path="/users/me/configs" component={EditUserConfig}/>

        <PrivateRoute exact path="/boards/:boardId(\d+)/issues" component={ListIssue}/>

        <PrivateRoute exact path="/boards/:boardId(\d+)/estimates" component={ListEstimateIssue}/>
    </main>
    <Footer/>
</>;
