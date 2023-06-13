import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './BarChart';
import VacationDays from './PieChart';
import Employees from './Employees';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

export type VacationData = {
  id: number;
  name: string;
  description: string;
  start: Date;
  end: Date;
  daysLeft: number;
};

// Year used in format 2023 fetched on every refresh
const year = moment().format('YYYY');

// Croatian holidays
const holidays: Date[] = [
  new Date('01/01/' + year),
  new Date('01/06/' + year),
  new Date('04/09/' + year),
  new Date('05/01/' + year),
  new Date('05/30/' + year),
  new Date('06/08/' + year),
  new Date('06/22/' + year),
  new Date('08/05/' + year),
  new Date('08/15/' + year),
  new Date('11/01/' + year),
  new Date('11/18/' + year),
  new Date('12/25/' + year),
  new Date('12/26/' + year),
  new Date('04/10/' + year),
];

export default function Dashboard() {
  const [data, setData] = useState<VacationData[]>([]);

  // Function for calculating the working days with holidays exceptions as well
  function getBusinessDaysCount(
    startDate: Date,
    endDate: Date,
    holidays: Date[]
  ): number {
    let count = 0;

    const isHoliday = (date: Date): boolean => {
      const formattedDate = date.toISOString().split('T')[0];
      return holidays.some(
        (holiday) => holiday.toISOString().split('T')[0] === formattedDate
      );
    };

    while (startDate <= endDate) {
      const dayOfWeek = startDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHolidayDay = isHoliday(startDate);

      if (!isWeekend && !isHolidayDay) {
        count++;
      }

      startDate.setDate(startDate.getDate() + 1);
    }

    return count;
  }

  // Function for calculating if the time difference is more then 8h
  function sortDays(data: VacationData) {
    const diff = new Date(data.end).getTime() - new Date(data.start).getTime();
    const dayDiff = diff / (1000 * 3600 * 8);
    if (dayDiff >= 1) {
      return data;
    }
  }

  // Function to fetch data from backend and it maps correct daysLeft property value right after
  const fetchData = async () => {
    axios
      .get('http://localhost:3000/api/out-of-office')
      .then((response) => {
        const res = response.data
          .filter((_data: VacationData) => sortDays(_data))
          .map((value: VacationData) => ({
            ...value,
            daysLeft: getBusinessDaysCount(
              new Date(value.start),
              new Date(value.end),
              holidays
            ),
          }));
        setData(res);
      })
      .catch((error) => {
        console.log('There was an error with request!', error);
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to add up multiple entrys from employees to calculate correct number of days used and left
  function mergeDuplicatesByPropertyName(
    data: VacationData[],
    propertyName: keyof VacationData
  ): VacationData[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const duplicatesMap: Map<any, VacationData> = new Map();

    data.forEach((item) => {
      const propertyValue = item[propertyName];

      if (duplicatesMap.has(propertyValue)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const existingItem = duplicatesMap.get(propertyValue)!;
        existingItem.daysLeft += item.daysLeft;
      } else {
        duplicatesMap.set(propertyValue, { ...item });
      }
    });

    return Array.from(duplicatesMap.values());
  }

  const filteredData: VacationData[] = mergeDuplicatesByPropertyName(
    data,
    'name'
  );

  return (
    <Box>
      <CssBaseline />
      <MuiAppBar>
        <Toolbar>
          <Typography component="h1" variant="h6" color="inherit" noWrap>
            Dashboard
          </Typography>
        </Toolbar>
      </MuiAppBar>
      <Box
        component="main"
        sx={{
          backgroundColor: '#f5f5f5',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Vacation used montly */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 480,
                }}
              >
                <Chart data={data} />
              </Paper>
            </Grid>
            {/* Vacation days used */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 480,
                  justifyContent: 'space-between',
                }}
              >
                <VacationDays data={filteredData} />
              </Paper>
            </Grid>
            {/* Vacation days submitted */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Employees data={data} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
