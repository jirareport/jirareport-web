import React, { Component } from "react";
import { connect } from "react-redux";

import { FilterService, HttpService } from "services";
import queryString from "query-string";

import { PageHeader } from "components";
import { Button, Col, InputField, Link, Pagination, Panel, Preloader, Row, Select } from "components/ui";
import CardBoard from "./CardBoard/CardBoard";
import EmptyBoardAlert from "./EmptyBoardAlert/EmptyBoardAlert";

import t from "i18n/i18n";

class ListBoard extends Component {
    state = {
        boards: {
            content: []
        },
        filter: {
            name: "",
            owner: ""
        },
        owners: [],
        page: 0,
        isLoading: true
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location.search !== prevProps.location.search) {
            this.retrieveBoardsByQueryParams();
        }
    }

    componentDidMount() {
        this.retrieveOwners();
        this.retrieveBoardsByQueryParams();
    }

    retrieveBoardsByQueryParams = () => {
        const { name, owner, page } = queryString.parse(this.props.location.search);

        const filter = {
            name: name || "",
            owner: owner || ""
        };

        this.setState({
            filter: {
                ...filter
            },
            page
        });

        this.retrieveBoards(FilterService.cleanFilter({
            ...filter,
            page
        }));
    };

    retrieveOwners = async () => {
        const { data } = await HttpService.get("/boards/owners");
        const owners = [
            {
                label: t('boards.allOwners'),
                value: "all"
            },
            ...data.map(owner => ({
                label: owner,
                value: owner
            }))
        ];

        this.setState({
            owners
        });
    };

    handleFilter = event => {
        event.preventDefault();

        const query = FilterService.cleanFilter(this.state.filter);

        this.updateLocationSearch(query);
        this.retrieveBoards(query);
    };

    goToPage = page => {
        const query = FilterService.cleanFilter({
            ...this.state.filter,
            page
        });

        this.updateLocationSearch(query);
        this.retrieveBoards(query);
    };

    retrieveBoards = async query => {
        this.setState({
            isLoading: true
        });

        const { data } = await HttpService.get("/boards", { params: query });
        this.setState({
            boards: data,
            isLoading: false
        });
    };

    changeFilterValue = (target, value) => {
        this.setState({
            filter: {
                ...this.state.filter,
                [target]: value
            }
        });
    };

    updateLocationSearch = query => {
        this.props.history.push({
            pathname: "/boards",
            search: queryString.stringify(query)
        });
    };

    render() {
        const { userConfig } = this.props;
        const { filter, owners, boards, isLoading } = this.state;

        return <Row>
            <Col s={12}>
                <PageHeader title="Boards" action={
                    <Link to="/boards/new">{t('boards.new')}</Link>
                }/>
            </Col>

            <Col s={12}>
                <Panel collapsible defaultClose title={t('boards.filter.title')} actions={
                    <Button type="submit" onClick={this.handleFilter}>
                        {t('boards.filter.button')}
                    </Button>
                }>
                    <Row>
                        <InputField s={12} l={6}
                                    name="name"
                                    onChange={e => this.changeFilterValue("name", e.target.value)}
                                    value={filter.name}
                                    label={t('boards.nameLabel')}/>

                        <Col s={12} l={6}>
                            <Select withoutWrapper
                                    options={owners}
                                    label={t('boards.ownerLabel')}
                                    onChange={selected => this.changeFilterValue("owner", (selected || {}).value)}
                                    value={filter.owner || userConfig.username}/>
                        </Col>
                    </Row>
                </Panel>
            </Col>

            {isLoading ? <Col s={12}>
                <Preloader/>
            </Col> : <>
                {boards.content.map(board =>
                    <CardBoard key={board.id}
                               board={board}
                               refreshBoards={() => this.retrieveBoardsByQueryParams()}/>
                )}

                {boards.numberOfElements === 0 && <EmptyBoardAlert/>}

                <Col s={12}>
                    <Pagination data={boards} goToPage={this.goToPage}/>
                </Col>
            </>}
        </Row>;
    }

}

const mapStateToProps = state => ({
    ...state.auth
});

export default connect(mapStateToProps,)(ListBoard);
