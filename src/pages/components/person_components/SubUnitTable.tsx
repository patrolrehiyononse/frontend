import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableCell, TableRow, Pagination } from '@mui/material';


const SubUnitTable = ({ rows, count, pagination }: any) => {

    const handleNextPage = (event: React.ChangeEvent<unknown>, value: number) => {
        pagination(value)
    }

    return (
        <>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Unit Code</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell>Sub Unit Code</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Abbreviation</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row: any) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.unit.unit_code}</TableCell>
                            <TableCell>{row.unit.description}</TableCell>
                            <TableCell>{row.sub_unit_code}</TableCell>
                            <TableCell>{row.sub_unit_description}</TableCell>
                            <TableCell>{row.abbreviation}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination count={count} color="secondary" sx={{ marginTop: "10px" }} onChange={handleNextPage} />
        </>
    );

}

export default SubUnitTable;