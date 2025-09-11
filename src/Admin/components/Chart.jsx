import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip
);

const UserChart = () => {
  const data = {
    labels: ['2023/05', '2023/06', '2023/07', '2023/08'],
    datasets: [
      {
        type: 'bar',
        label: 'Basics',
        data: [2000, 2200, 2500, 2400],
        backgroundColor: '#647ff7'
      },
      {
        type: 'bar',
        label: 'Web Dev',
        data: [1800, 2000, 2100, 2300],
        backgroundColor: '#00ffff'
      },
      {
        type: 'line',
        label: 'Average',
        data: [1900, 2100, 2300, 2500],
        borderColor: '#ffffff',
        borderWidth: 2,
        tension: 0.3,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff'
        }
      },
      y: {
        ticks: {
          color: '#ffffff'
        }
      }
    }
  };

  return <Chart type='bar' data={data} options={options} />;
};

export default UserChart;
