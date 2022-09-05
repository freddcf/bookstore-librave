<template>
  <Radar :chart-options="chartOptions" :chart-data="chartData" />
</template>

<script>
import { Radar } from 'vue-chartjs/legacy';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  RadialLinearScale,
  LineElement
);

export default {
  name: 'ChartRadar',
  components: {
    Radar,
  },
  data() {
    return {
      chartData: {
        labels: [
          'Eating',
          'Drinking',
          'Sleeping',
          'Designing',
          'Coding',
          'Crying'
        ],
        datasets: [
          {
            label: 'My Second dataset',
            fill: true,
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: 'rgba(255,99,132,1)',
            pointHoverBorderColor: 'rgba(255,99,132,1)',
            data: [28, 48, 40, 19, 27, 100],
          },
        ],
      },
      chartOptions: {
        radius: 5,
        hitRadius: 20,
        hoverRadius: 10,
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
};
</script>
