import * as React from 'react';
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';
import Title from './Title';
import { VacationData } from './Dashboard';

type Props = {
  data: VacationData[];
};

type CountsDatesByMonth = {
  month: string;
  amount: number;
};

// Funckija koja izračunava broj godišnjih koji su zaposlenici iskoristili po mjesecima
const countDatesByMonth = (arr: VacationData[]): CountsDatesByMonth[] => {
  const countsByMonth: { [month: string]: number } = {};

  arr.forEach((data) => {
    const textMonth = new Intl.DateTimeFormat('en-GB', {
      month: 'short',
    }).format(new Date(data.start));
    countsByMonth[textMonth] = (countsByMonth[textMonth] || 0) + data.daysLeft;
  });

  const transformedArray = Array.from({ length: 12 }, (_, index) => {
    const monthName = new Date(0, index).toLocaleString('default', {
      month: 'short',
    });
    const amount = countsByMonth[monthName] || 0;
    return { month: monthName, amount };
  });
  return transformedArray;
};

export default function Chart({ data }: Props) {
  const counts = countDatesByMonth(data);

  return (
    <React.Fragment>
      <Title>Vacation used montly</Title>
      <ResponsiveContainer>
        <BarChart
          data={counts}
          margin={{
            top: 16,
            right: 16,
            left: 0,
            bottom: 24,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis dataKey="amount" />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
