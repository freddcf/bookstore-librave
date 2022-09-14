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
  props: {
    data: Object,
  },

  data() {
    return {
      chartData: {
        labels: [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro',
        ],
        datasets: [
          {
            label: 'Dados mensais',
            backgroundColor: '#49c9a8',
            data: Object.values(this.data),
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
        plugins: {
          legend: {
            labels: {
              font: {
                size: 16,
              },
            },
          },
        },
      },
    };
  },
};
</script>
