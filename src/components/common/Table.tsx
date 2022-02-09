import React from 'react';
import styled from 'styled-components';
import {
  Table as TableComponent,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  IconButton,
  TablePagination,
  TableFooter,
} from '@material-ui/core';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

const TablePaginationActions: React.FC<TablePaginationActionsProps> = ({
  count,
  page,
  rowsPerPage,
  onChangePage,
}) => {
  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <ControlsWrapper>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        <LastPageIcon />
      </IconButton>
    </ControlsWrapper>
  );
};

interface Props {
  data: Array<Object>;
  columns: Array<{
    title: string;
    data: (item: Object) => React.ReactNode;
  }>;
  rowsPerPage?: number;
  rowHeight?: number;
  [propName: string]: any;
}

const Table: React.FC<Props> = ({
  data,
  columns,
  rowsPerPage = 0,
  rowHeight = 61,
  ...rest
}) => {
  const [page, setPage] = React.useState(0);

  const handleChangePage = React.useCallback(
    (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [],
  );

  const emptyRows = React.useMemo(
    () => rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage),
    [data.length, page, rowsPerPage],
  );

  return (
    <TableComponent {...rest}>
      <TableHead>
        <TableRow>
          {columns.map(({ title }) => (
            <HeadTableCell key={title}>{title}</HeadTableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {(rowsPerPage > 0
          ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : data
        ).map((item) => (
          <TableRow key={JSON.stringify(item)}>
            {columns.map(({ title, data: columnData, ...restRow }) => (
              <TableCell key={title} {...restRow}>
                {columnData(item)}
              </TableCell>
            ))}
          </TableRow>
        ))}
        {emptyRows > 0 && (
          <TableRow style={{ height: rowHeight * emptyRows }}>
            <TableCell colSpan={6} />
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[rowsPerPage]}
            colSpan={columns.length}
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            ActionsComponent={TablePaginationActions}
          />
        </TableRow>
      </TableFooter>
    </TableComponent>
  );
};

const HeadTableCell = styled(TableCell)``;

const ControlsWrapper = styled.div`
  display: flex;
`;

export default Table;
