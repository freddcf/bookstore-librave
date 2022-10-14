<template>
  <nav>
    <v-app-bar flat app color="c400 c100--text" :class="($vuetify.breakpoint.mdAndUp) ? 'hidemenu' : 'showmenu'">
      
      <v-app-bar-title>
        <v-img height="31" :src="logo"></v-img>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <div class="hidden-md-and-down">
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
          to="/admin"
        >
          <PhUserCircleGear size="22" />
          Admin
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
      </div>
      <v-app-bar-nav-icon
        @click="drawer = true"
        class="hidden-lg-and-up c000--text"
      ></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer
      class="hidden-lg-and-up drawer"
      v-model="drawer"
      absolute
      temporary
    >
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="c500--text text--accent-4"
          class="pt-5"
        >
          <v-list-item class="my-3" to="/">
            <v-list-item-icon>
              <PhHouse size="25" />
            </v-list-item-icon>
            <v-list-item-title class="text-h6">Home</v-list-item-title>
          </v-list-item>
          <v-list-item class="my-3" to="/user">
            <v-list-item-icon>
              <PhUser size="25" />
            </v-list-item-icon>
            <v-list-item-title class="text-h6">Usuário</v-list-item-title>
          </v-list-item>
          <v-list-item class="my-3" to="/admin">
            <v-list-item-icon>
              <PhUserCircleGear size="25" />
            </v-list-item-icon>
            <v-list-item-title class="text-h6">Admin</v-list-item-title>
          </v-list-item>
          <v-list-item class="my-3" to="/publisher">
            <v-list-item-icon>
              <PhBooks size="25" />
            </v-list-item-icon>
            <v-list-item-title class="text-h6">Editora</v-list-item-title>
          </v-list-item>
          <v-list-item class="my-3" to="/book">
            <v-list-item-icon>
              <PhBookBookmark size="25" />
            </v-list-item-icon>
            <v-list-item-title class="text-h6">Livro</v-list-item-title>
          </v-list-item>
          <v-list-item class="my-3" to="/rental">
            <v-list-item-icon>
              <PhNotepad size="25" />
            </v-list-item-icon>
            <v-list-item-title class="text-h6">Aluguel</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import {
  PhHouse,
  PhUser,
  PhUserCircleGear,
  PhBooks,
  PhBookBookmark,
  PhNotepad,
} from 'phosphor-vue';

export default {
  name: 'Navbar',
  components: {
    PhHouse,
    PhUser,
    PhUserCircleGear,
    PhBooks,
    PhBookBookmark,
    PhNotepad,
  },
  data: () => ({
    logo: require('@/assets/logo.svg'),
    drawer: false,
    group: null,
  }),
  watch: {
    '$vuetify.breakpoint.mdAndUp'() {
      this.drawer = false
    }
  }
};
</script>

<style scoped>
.hidemenu {
  padding: 0 100px;
}

.showmenu {
  padding: 0 20px;
}

.v-btn.activated-btn {
  position: relative;
}
.v-btn.activated-btn::after {
  position: absolute;
  content: '';
  height: 100%;
  width: 100%;
  border-bottom: 3px solid #02af8e !important;
  transition: all 0.3s;
}
.activated-btn.v-btn::before {
  display: none;
}
</style>
