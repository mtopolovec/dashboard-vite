import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import moment from 'moment';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { VacationData } from './Dashboard';

function createData(amount?: number) {
  return { amount };
}

// How much is max days of vacation for the company
const maxVacationDays = 25;

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

type PieData = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
};

// Values used for making the pie chart
const RADIAN = Math.PI / 180;

// Function used to make customized label for the pie chart
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieData) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

type Props = {
  data: VacationData[];
};

// Function used to calculate average data for vacation days
export default function VacationDays({ data }: Props) {
  function calculateEmployeesVacationDaysAverage(data: VacationData[]) {
    const sum = data.reduce((total, obj) => {
      return total + obj['daysLeft'];
    }, 0);
    return sum / data.length;
  }

  const totalDaysUsed = calculateEmployeesVacationDaysAverage(data);

  const chartData = [
    createData(maxVacationDays - totalDaysUsed),
    createData(totalDaysUsed),
  ];

  return (
    <React.Fragment>
      <Title>Vacation days used</Title>
      <Typography component="p" variant="h4" align="center">
        {`Used: ${totalDaysUsed.toFixed(2)} Left: ${(
          maxVacationDays - totalDaysUsed
        ).toFixed(2)}`}
      </Typography>
      <ResponsiveContainer height={300}>
        <PieChart width={260} height={260}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="amount"
          >
            {chartData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Typography color="text.secondary" align="right">
        {`Until: ${moment().format('DD.MM.YYYY - HH:mm')}`}
      </Typography>
    </React.Fragment>
  );
}
