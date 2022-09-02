<template>
  <nav>
    <v-app-bar flat app color="c400 c100--text">
      <v-app-bar-title>
        <v-img height="31" :src="logo"></v-img>
      </v-app-bar-title>
      <v-spacer></v-spacer>

      <v-btn
        depressed
        tile
        class="c400 c000--text"
        active-class="activated-btn"
        to="/"
      >
        <PhHouse size="22" />
        Home
      </v-btn>
      <v-btn
        depressed
        tile
        class="transparent c000--text"
        active-class="activated-btn"
        to="/user"
      >
        <PhUser size="22" />
        Usuário
      </v-btn>
      <v-btn
        depressed
        tile
        class="transparent c000--text"
        active-class="activated-btn"
        to="/publisher"
      >
        <PhBooks size="22" />
        Editora
      </v-btn>
      <v-btn
        depressed
        tile
        class="transparent c000--text"
        active-class="activated-btn"
        to="/book"
      >
        <PhBookBookmark size="22" />
        Livro
      </v-btn>
      <v-btn
        depressed
        tile
        class="transparent c000--text"
        active-class="activated-btn"
        to="/rental"
      >
        <PhNotepad size="22" />
        Aluguel
      </v-btn>
    </v-app-bar>
  </nav>
</template>

<script>
import {
  PhHouse,
  PhUser,
  PhBooks,
  PhBookBookmark,
  PhNotepad,
} from 'phosphor-vue';

export default {
  name: 'Navbar',
  components: {
    PhHouse,
    PhUser,
    PhBooks,
    PhBookBookmark,
    PhNotepad,
  },
  data: () => ({
    logo: require('@/assets/logo.svg'),
  }),
};
</script>

<style scoped>
.v-app-bar {
  padding: 0 100px;
}
.v-btn {
  border-bottom: 3px solid transparent !important;
  transition: all 0.3s;
}
.v-btn.activated-btn {
  border-bottom: 3px solid #02af8e !important;
  transition: all 0.3s;
}
.activated-btn.v-btn::before {
  display: none;
}
</style>
