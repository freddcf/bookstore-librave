<template>
  <v-app>
    <Navbar v-if="verifyLogin" />

    <v-main class="c600" v-if="verifyLogin">
      <router-view />
    </v-main>

    <Footer v-if="verifyLogin" />

    <LoginView v-else />
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import LoginView from './views/LoginView.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
    LoginView,
  },

  data: () => ({
    isLogged: false,
  }),
  computed: {
    verifyLogin() {
      return this.$route.name !== 'login' && this.$route.name !== 'register';
    },
  },
};
</script>

<style>
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

.form-input.v-text-field .v-label {
  font-size: 20px;
}

.form-input.v-text-field .v-input__control .v-input__slot {
  min-height: 60px;
}
.form-input .v-input__control .v-text-field__details .v-messages {
  font-size: 14px;
}
</style>
