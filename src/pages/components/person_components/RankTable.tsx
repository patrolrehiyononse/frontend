import React from 'react';
import { Table, TableHead, TableBody, TableCell, TableRow, Pagination } from '@mui/material';

type Rank = {
  id: number;
  rank_code: string;
  description: string;
};

type RankTableProps = {
  rows: Rank[];
  count: number;
  pagination: any
};

const RankTable: React.FC<RankTableProps> = ({ rows, count, pagination }) => {

  const handleNextPage = (event: React.ChangeEvent<unknown>, value: number) => {
    // setPage(value);
    pagination(value)
  };

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Rank Code</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.rank_code}</TableCell>
              <TableCell>{row.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination count={count} color="secondary" sx={{ marginTop: "10px" }} onChange={handleNextPage} />
    </>
  );
};

export default RankTable;
