<template>
  <div class="home">
    <div class="dashboard c000 rounded-lg">
      <div class="cards">
        <v-card
          class="card d-flex align-center justify-space-between rounded-lg pa-6"
        >
          <div class="card-content">
            <v-card-title class="number pa-0 pb-7">09</v-card-title>
            <v-card-subtitle class="name pa-0">Editoras</v-card-subtitle>
          </div>
          <PhBooks size="50px" color="#49c9a8" />
        </v-card>
        <v-card
          class="card d-flex align-center justify-space-between rounded-lg pa-6"
        >
          <div class="card-content">
            <v-card-title class="number pa-0 pb-7">43</v-card-title>
            <v-card-subtitle class="name pa-0">Livros</v-card-subtitle>
          </div>
          <PhBookBookmark size="50px" color="#49c9a8" />
        </v-card>
        <v-card
          class="card d-flex align-center justify-space-between rounded-lg pa-6"
        >
          <div class="card-content">
            <v-card-title class="number pa-0 pb-7">78</v-card-title>
            <v-card-subtitle class="name pa-0">Usuários</v-card-subtitle>
          </div>
          <PhUser size="50px" color="#49c9a8" />
        </v-card>
        <v-card
          class="card d-flex align-center justify-space-between rounded-lg pa-6"
        >
          <div class="card-content">
            <v-card-title class="number pa-0 pb-7">240</v-card-title>
            <v-card-subtitle class="name pa-0">Aluguéis</v-card-subtitle>
          </div>
          <PhNotepad size="50px" color="#49c9a8" />
        </v-card>
      </div>

      <div class="charts">
        <v-card class="chart d-flex flex-column align-center">
          <h2>Chart title</h2>
          <div id="lineChart">
            <ChartLine class="chartComp" />
          </div>
        </v-card>
        <v-card class="chart d-flex flex-column align-center">
          <h2>Another title</h2>
          <div id="radarChart">
            <ChartRadar class="chartComp" />
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { PhUser, PhBooks, PhBookBookmark, PhNotepad } from 'phosphor-vue';
import ChartLine from '@/components/ChartLine.vue';
import ChartRadar from '@/components/ChartRadar.vue';
/* eslint-disable */
export default {
  name: 'Home',
  components: {
    PhUser,
    PhBooks,
    PhBookBookmark,
    PhNotepad,
    ChartLine,
    ChartRadar,
  },
  data: () => ({}),
};
</script>

<style scoped>
.home {
  width: 100vw;
}
.dashboard {
  margin: 20px 100px;
  height: 80vh;
}

.cards {
  width: 100%;
  padding: 30px 15px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
}

.number {
  font-size: 30px;
  font-weight: 500;
  color: #49c9a8;
}
.name {
  color: #888;
  font-size: 18px;
  font-weight: 600;
}
.card-icon {
  font-size: 40px;
  color: #49c9a8;
}

.charts {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 20px;
  width: 100%;
  padding: 20px;
  padding-top: 0;
}
.chart {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
}
#lineChart,
#radarChart {
  width: 100%;
  height: 40vh;
}
.chartComp {
  height: 100%;
}
</style>
