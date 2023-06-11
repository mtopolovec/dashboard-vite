import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { VacationData } from './Dashboard';

// Function to help parse Date and set it correctly
function setDate(date: Date) {
  const parsedDate = new Date(date);
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(parsedDate);
}

type Props = {
  data: VacationData[];
};

export default function Employees({ data }: Props) {
  return (
    <React.Fragment>
      <Title>Vacation days submitted</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Vacation used</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row?.id}>
              <TableCell>{row?.name}</TableCell>
              <TableCell>{setDate(row?.start)}</TableCell>
              <TableCell>{setDate(row?.end)}</TableCell>
              <TableCell>{row?.description}</TableCell>
              <TableCell align="right">{`${row?.daysLeft} days`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
