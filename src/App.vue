<template>
  <v-app>
    <Navbar />

    <v-main class="c600">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar,
},

  data: () => ({
  }),
};
</script>
