import React from 'react';
import { Table, TableHead, TableBody, TableCell, TableRow, Pagination } from '@mui/material';

type Unit = {
  id: number;
  unit_code: string;
  description: string;
};

type UnitTableProps = {
  rows: Unit[];
  count: number;
  pagination: any
};

const UnitTable: React.FC<UnitTableProps> = ({ rows, count, pagination }) => {

  const handleNextPage = (event: React.ChangeEvent<unknown>, value: number) => {
    // setPage(value);
    pagination(value)
  };

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Unit Code</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.unit_code}</TableCell>
              <TableCell>{row.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination count={count} color="secondary" sx={{ marginTop: "10px" }} onChange={handleNextPage} />
    </>
  );
};

export default UnitTable;
