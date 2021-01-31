import React, { useState } from 'react';
import Select from 'react-select';
import { Bar } from 'react-chartjs-2';

const options = [
  { label: 'last hour', value: 'hour' },
  { label: 'last day', value: 'day' },
  { label: 'last week', value: 'week' },
  { label: 'last month', value: 'month' },
  { label: 'last year', value: 'year' },
];

const getRandomColors = (numOfBars) => {
  const letters = '0123456789ABCDEF'.split('');
  const colors = [];
  for (let i = 0; i < numOfBars; i++) {
    let color = '#';
    for (let k = 0; k < 6; k++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    colors.push(color);
  }
  return colors;
};

function requestApi(date) {
  const labels = [9876, 4245, 2345, 3452, 6534];
  let result;

  switch (date) {
    case 'hour':
      result = {
        labels,
        datasets: [
          {
            label: 'Agent performance',
            data: [3428, 8743, 5748, 4675, 9265],
            backgroundColor: getRandomColors(labels.length),
            borderWidth: 2,
          },
        ],
      };
      break;

    case 'day':
      result = {
        labels,
        datasets: [
          {
            label: 'Agent performance',
            data: [3454, 4555, 4554, 5454, 4542, 6543, 3445, 4567],
            backgroundColor: getRandomColors(labels.length),
            borderWidth: 2,
          },
        ],
      };
      break;
    default:
      break;
  }
  return Promise.resolve(result);
}

function getDataFromDate(date) {
  return requestApi(date);
}

function customTheme(theme) {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary25: '#43425d',
      primary: '#3c4a64',
    },
  };
}

const defaultDate = options[0];
const defaultData = {};

export default function App() {
  const [date, setDate] = React.useState(defaultDate.value);
  const [chartData, setChartData] = useState(defaultData);

  const handleChange = (value) => {
    const date = value.value;
    setDate(date);
  };

  React.useEffect(() => {
    getDataFromDate(date).then((chartData) => {
      setChartData(chartData);
    });
  }, [date]);

  return (
    <div className="card-one">
      <span className="dropdown-select">
        <Select
          options={options}
          defaultValue={defaultDate}
          theme={customTheme}
          onChange={handleChange}
        />
      </span>
      <Bar
        data={chartData}
        options={{
				  responsive: true,
				  scales: {
				    yAxes: [
				      {
				        ticks: {
				          beginAtZero: true,
				        },
				      },
				    ],
				  },
				  legend: {
				    display: true,
				    position: 'bottom',
				  },
        }}
        height={140}
      />
    </div>
  );
}
