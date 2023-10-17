import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableCell, TableRow, Pagination } from '@mui/material';


const StationTable = ({ rows, count, pagination }: any) => {

    const handleNextPage = (event: React.ChangeEvent<unknown>, value: number) => {
        pagination(value)
    }

    return (
        <>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Station Code</TableCell>
                        <TableCell>Station</TableCell>
                        <TableCell>Description</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row: any) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.station_code}</TableCell>
                            <TableCell>{row.station_name}</TableCell>
                            <TableCell>{row.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination count={count} color="secondary" sx={{ marginTop: "10px" }} onChange={handleNextPage} />
        </>
    );

}

export default StationTable;