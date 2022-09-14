<template>
  <v-footer padless color="c400 c100--text px-10">
    <v-col class="text-center d-flex align-center justify-center" cols="12">
      {{ new Date().getFullYear() }} —
      <a
        class="d-flex align-center justify-center"
        href="http://github.com/freddcf"
        target="_blank"
      >
        <PhGithubLogo class="mr-1" size="25" weight="bold" />
        <strong>Fred Fonseca</strong>
      </a>
    </v-col>
  </v-footer>
</template>

<script>
import { PhGithubLogo } from 'phosphor-vue';

export default {
  name: 'Footer',
  components: {
    PhGithubLogo,
  },
};
</script>

<style scoped>
.v-footer a {
  text-decoration: none;
  color: #fff;
}
</style>
