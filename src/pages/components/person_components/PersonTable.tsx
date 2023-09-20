import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableCell, TableRow, Pagination } from '@mui/material';
import axios from 'axios';

type Person = {
  id: number;
  date: string;
  name: string;
  shipTo: string;
  paymentMethod: string;
};

type PersonTableProps = {
  rows: any;
  count: number;
  pagination: any;
};

const PersonTable: React.FC<PersonTableProps> = ({ rows, count, pagination }) => {

  const handleNextPage = (event: React.ChangeEvent<unknown>, value: number) => {
    // setPage(value);
    pagination(value)
  };

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Rank / Name</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any) => {
            return (
              <TableRow key={row.id}>
                <TableCell>{row.full_name}</TableCell>
                <TableCell>{row.rank.rank_code}</TableCell>
                <TableCell>{row.unit.unit_code}</TableCell>
                <TableCell>{row.email}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Pagination count={count} color="secondary" sx={{ marginTop: "10px" }} onChange={handleNextPage} />
    </>
  );
};

export default PersonTable;
