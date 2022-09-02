<template>
  <v-app>
    <Navbar />

    <v-main class="c600">
      <router-view />
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
  },

  data: () => ({}),
};
</script>

<style>
.searchInput div.v-input__control div.v-text-field__details {
  display: none;
}

.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 15px !important;
}

.v-data-footer {
  font-size: 14px !important;
}

.theme--light.v-divider {
  border-width: 2px;
  border-radius: 10px;
  border-color: #1d3245 !important;
}
.v-text-field--outlined {
  color: #1d3245 !important;
}

.v-card .v-card-title {
  margin: 40px;
}

.tableBtn {
  border-width: 2px;
}
.tableBtn.blueBtn {
  background: rgba(53, 207, 255, 0.2) !important;
}
.tableBtn.redBtn {
  background: rgba(222, 24, 63, 0.2) !important;
}
.tableBtn.orangeBtn {
  background: rgba(255, 126, 85, 0.2) !important;
}
</style>
