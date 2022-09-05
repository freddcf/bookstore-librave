<template>
  <LineChartGenerator :chart-options="chartOptions" :chart-data="chartData" />
</template>

<script>
import { Line as LineChartGenerator } from 'vue-chartjs/legacy';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
);

export default {
  name: 'LineChart',
  components: {
    LineChartGenerator,
  },

  data() {
    return {
      chartData: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'April',
          'May',
          'June',
          'July',
        ],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#49c9a8',
            data: [40, 39, 10, 40, 39, 50, 46, 40, 39, 10, 30],
            tension: 0.1,
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
