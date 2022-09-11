<template>
  <div class="home">
    <div class="dashboard c000 rounded-lg">
      <div class="cards">
        <v-card
          class="card d-flex align-center justify-space-between rounded-lg pa-6"
        >
          <div class="card-content">
            <v-card-title class="number pa-0 pb-7">{{
              this.data.publishers.toString().padStart(2, 0)
            }}</v-card-title>
            <v-card-subtitle class="name pa-0">Editoras</v-card-subtitle>
          </div>
          <PhBooks size="50px" color="#49c9a8" />
        </v-card>
        <v-card
          class="card d-flex align-center justify-space-between rounded-lg pa-6"
        >
          <div class="card-content">
            <v-card-title class="number pa-0 pb-7">{{
              this.data.books.toString().padStart(2, 0)
            }}</v-card-title>
            <v-card-subtitle class="name pa-0">Livros</v-card-subtitle>
          </div>
          <PhBookBookmark size="50px" color="#49c9a8" />
        </v-card>
        <v-card
          class="card d-flex align-center justify-space-between rounded-lg pa-6"
        >
          <div class="card-content">
            <v-card-title class="number pa-0 pb-7">{{
              this.data.users.toString().padStart(2, 0)
            }}</v-card-title>
            <v-card-subtitle class="name pa-0">Usuários</v-card-subtitle>
          </div>
          <PhUser size="50px" color="#49c9a8" />
        </v-card>
        <v-card
          class="card d-flex align-center justify-space-between rounded-lg pa-6"
        >
          <div class="card-content">
            <v-card-title class="number pa-0 pb-7">{{
              this.data.rentals.toString().padStart(2, 0)
            }}</v-card-title>
            <v-card-subtitle class="name pa-0">Aluguéis</v-card-subtitle>
          </div>
          <PhNotepad size="50px" color="#49c9a8" />
        </v-card>
      </div>

      <div class="charts">
        <v-card class="chart d-flex flex-column align-center">
          <h2>Registro de alugueis no ano vigente ({{ this.currentYear }})</h2>
          <div id="lineChart" :class="loaders">
            <ChartLine
              v-if="exposeChart"
              :data="dataForMonths"
              class="chartComp"
            />
            <half-circle-spinner
              v-else
              :animation-duration="1000"
              :size="60"
              :color="'#49C9A8'"
            />
          </div>
        </v-card>
        <v-card class="chart d-flex flex-column align-center">
          <h2>Dados da biblioteca</h2>
          <div id="radarChart" :class="loaders">
            <ChartRadar v-if="exposeChart" :data="data" class="chartComp" />
            <half-circle-spinner
              v-else
              :animation-duration="1000"
              :size="60"
              :color="'rgba(255,99,132,1)'"
            />
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { PhUser, PhBooks, PhBookBookmark, PhNotepad } from 'phosphor-vue';
import { HalfCircleSpinner } from 'epic-spinners';
import ChartLine from '@/components/ChartLine.vue';
import ChartRadar from '@/components/ChartRadar.vue';
import publisherAccess from '@/services/publisherAccess';
import userAccess from '@/services/userAccess';
import bookAccess from '@/services/bookAccess';
import rentalAccess from '@/services/rentalAccess';
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
    HalfCircleSpinner,
  },
  data: () => ({
    exposeChart: false,
    data: {
      users: 0,
      admins: 0,
      publishers: 0,
      books: 0,
      rentals: 0,
    },
    rentals: [],
    currentYear: new Date().getFullYear(),
    dataForMonths: {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
    },
  }),
  computed: {
    loaders() {
      return this.exposeChart ? false : 'd-flex justify-center align-center'
    }
  },

  created() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      await publisherAccess.getAll().then((res) => {
        this.data.publishers = res.data.content.length;
      });
      await bookAccess.getAll().then((res) => {
        this.data.books = res.data.content.length;
      });
      await userAccess.getAll().then((res) => {
        this.data.users = res.data.content.filter(
          (user) => user.role === 'USER'
        ).length;
        this.data.admins = res.data.content.filter(
          (admin) => admin.role === 'ADMIN'
        ).length;
      });
      await rentalAccess
        .getAll(
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTY2MzI3MDEzNiwiaWF0IjoxNjYyNjY1MzM2fQ.5rTru88N-Qwmnlh8Y7kUmJhfPBMAl8BG92vePgkD5aho3FWM4iPygAtUBzR90YaWa59bozVAYfPMu1ZtMDqIUw'
        )
        .then((res) => {
          this.data.rentals = res.data.content.length;
          this.rentals = res.data.content;
        });
      this.loadMonths(this.currentYear);
      this.exposeChart = true;
    },

    loadMonths(currentYear) {
      const months = {
        january: `${currentYear}-01-01`,
        february: `${currentYear}-02-01`,
        march: `${currentYear}-03-01`,
        april: `${currentYear}-04-01`,
        may: `${currentYear}-05-01`,
        june: `${currentYear}-06-01`,
        july: `${currentYear}-07-01`,
        august: `${currentYear}-08-01`,
        september: `${currentYear}-09-01`,
        october: `${currentYear}-10-01`,
        november: `${currentYear}-11-01`,
        december: `${currentYear}-12-01`,
      };
      console.log(months);
      this.filterRentals(this.rentals, months);
    },

    filterRentals(rentals, months) {
      this.dataForMonths.january = rentals.filter(
        (rental) =>
          rental.rentalDate >= months.january &&
          rental.rentalDate < months.february
      ).length;
      this.dataForMonths.february = rentals.filter(
        (rental) =>
          rental.rentalDate >= months.february &&
          rental.rentalDate < months.march
      ).length;
      this.dataForMonths.march = rentals.filter(
        (rental) =>
          rental.rentalDate >= months.march && rental.rentalDate < months.april
      ).length;
      this.dataForMonths.april = rentals.filter(
        (rental) =>
          rental.rentalDate >= months.april && rental.rentalDate < months.may
      ).length;
      this.dataForMonths.may = rentals.filter(
        (rental) =>
          rental.rentalDate >= months.may && rental.rentalDate < months.june
      ).length;
      this.dataForMonths.june = rentals.filter(
        (rental) =>
          rental.rentalDate >= months.june && rental.rentalDate < months.july
      ).length;
      this.dataForMonths.july = rentals.filter(
        (rental) =>
          rental.rentalDate >= months.july && rental.rentalDate < months.august
      ).length;
      this.dataForMonths.august = rentals.filter(
        (rental) =>
          rental.rentalDate >= months.august &&
          rental.rentalDate < months.september
      ).length;
      this.dataForMonths.september = rentals.filter(
        (rental) =>
          rental.rentalDate >= months.september &&
          rental.rentalDate < months.october
      ).length;
      this.dataForMonths.october = rentals.filter(
        (rental) =>
          rental.rentalDate >= months.october &&
          rental.rentalDate < months.november
      ).length;
      this.dataForMonths.november = rentals.filter(
        (rental) =>
          rental.rentalDate >= months.november &&
          rental.rentalDate < months.december
      ).length;
      this.dataForMonths.december = rentals.filter(
        (rental) => rental.rentalDate >= months.december
      ).length;
    },
  },
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
  overflow: hidden;
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
