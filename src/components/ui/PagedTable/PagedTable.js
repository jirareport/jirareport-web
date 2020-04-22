import { Pagination, Table } from "components/ui/index";
import React from "react";

const PagedTable = ({ data, rows, actions, goToPage, emptyMessage }) => <>
    <Table data={data.content}
           rows={rows}
           actions={actions}
           emptyMessage={emptyMessage}/>

    <Pagination data={data} goToPage={goToPage}/>
</>;

export default PagedTable;
