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
          <h2>Dados de aluguéis</h2>
          <div id="radarChart" :class="loaders">
            <ChartDoughnut
              v-if="exposeChart"
              :data="filteredRentalDates"
              class="chartComp"
            />
            <half-circle-spinner
              v-else
              :animation-duration="1000"
              :size="60"
              :color="'#FF7E55'"
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
import ChartDoughnut from '@/components/ChartDoughnut.vue';
import publisherAccess from '@/services/publisherAccess';
import userAccess from '@/services/userAccess';
import bookAccess from '@/services/bookAccess';
import rentalAccess from '@/services/rentalAccess';

export default {
  name: 'Home',
  components: {
    PhUser,
    PhBooks,
    PhBookBookmark,
    PhNotepad,
    ChartLine,
    ChartDoughnut,
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
    filteredRentalDates: {
      notReturned: 0,
      returnedInTime: 0,
      returnedWithDelay: 0,
    },
    currentYear: new Date().getFullYear(),
    dataForMonths: {},
  }),
  computed: {
    loaders() {
      return this.exposeChart ? false : 'd-flex justify-center align-center';
    },
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
      await rentalAccess.getAll().then((res) => {
        this.data.rentals = res.data.content.length;
        this.rentals = res.data.content;
      });
      this.loadMonths(this.currentYear);
      this.exposeChart = true;
    },

    loadMonths(currentYear) {
      const months = {};
      for (let i = 1; i <= 13; i++) {
        months[i] = `${currentYear}-${i.toString().padStart(2, 0)}-01`;
      }

      this.filterRentals(this.rentals, months);
      this.filterRentalStates(this.rentals);
    },

    filterRentals(rentals, months) {
      for (let i = 1; i <= 12; i++) {
        this.dataForMonths[i] = 0;
      }
      rentals.forEach((rental) => {
        for (let i = 1; i <= 12; i++) {
          if (
            rental.rentalDate >= months[i] &&
            rental.rentalDate < months[i + 1]
          ) {
            this.dataForMonths[i] += 1;
          }
        }
      });
      console.log(this.dataForMonths);
    },

    filterRentalStates(rentals) {
      rentals.forEach((rental) => {
        if (rental.returnDate === 'Não devolvido') {
          this.filteredRentalDates.notReturned += 1;
        } else {
          if (rental.returnDate.substring(0, 10) <= rental.returnForecast) {
            this.filteredRentalDates.returnedInTime += 1;
          }
          if (rental.returnDate.substring(0, 10) > rental.returnForecast) {
            this.filteredRentalDates.returnedWithDelay += 1;
          }
        }
      });
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

@media only screen and (max-width: 1050px){
  .dashboard {
  margin: 20px 20px;
  height: auto;
}
  .cards {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }

  .charts {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}

@media only screen and (max-width: 600px){
  .cards {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(1, 1fr);
  }
}
</style>
