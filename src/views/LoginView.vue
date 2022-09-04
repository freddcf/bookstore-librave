<template>
  <div class="c400 login-screen d-flex justify-center align-center">
    <div class="login d-flex flex-column justify-center align-center">
      <v-btn
        color="c400 c000--text"
        class="return-btn py-8"
        elevation="0"
        @click="$router.push('/')"
      >
        <PhArrowUUpLeft size="40" weight="bold" />
      </v-btn>
      <h1 class="c000--text display-3 font-weight-bold mb-5">LOGIN</h1>
      <form class="form-inputs">
        <v-col cols="12" class="form-inputs-wrapper">
          <v-text-field
            class="form-input rounded-lg mb-3"
            v-model.trim="username"
            :error-messages="usernameErrors"
            @input="v$.username.$touch()"
            @blur="v$.username.$touch()"
            solo
            label="Username"
            color="c500"
          >
            <template v-slot:prepend-inner>
              <v-icon color="c400" class="mr-1">
                mdi-account-circle-outline
              </v-icon>
            </template>
          </v-text-field>
          <v-text-field
            class="form-input rounded-lg"
            v-model.trim="password"
            :error-messages="passwordErrors"
            @input="v$.password.$touch()"
            @blur="v$.password.$touch()"
            :append-icon="showInputPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showInputPassword ? 'text' : 'password'"
            solo
            label="Password"
            color="c500"
            @click:append="showInputPassword = !showInputPassword"
          >
            <template v-slot:prepend-inner>
              <v-icon color="c400" class="mr-1">
                mdi-lock-alert-outline
              </v-icon>
            </template>
          </v-text-field>
          <router-link class="forgot-password" to="/recover">
            Esqueceu a senha?
          </router-link>
          <v-btn
            block
            height="60px"
            color="c600 c000--text rounded-lg mt-3"
            class="title"
            @click="submit"
          >
            Sign in
          </v-btn>
        </v-col>
      </form>
    </div>
  </div>
</template>

<script>
import { required } from '@vuelidate/validators';
import useValidate from '@vuelidate/core';
import { PhArrowUUpLeft } from 'phosphor-vue';

export default {
  name: 'LoginView',
  components: {
    PhArrowUUpLeft,
  },
  data: () => ({
    username: '',
    password: '',
    showInputPassword: '',
  }),
  setup: () => ({ v$: useValidate() }),
  validations() {
    return {
      username: { required },
      password: { required },
    };
  },
  methods: {
    submit() {
      this.v$.$touch();
      if (!this.v$.$error) {
        console.log('Perfect');
        console.log(this.username + ' - ' + this.password);
        // Do action
      }
    },
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.v$.username.$dirty) return errors;
      if (this.v$.username.required.$invalid)
        errors.push('Username is required.');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.v$.password.$dirty) return errors;
      if (this.v$.password.required.$invalid)
        errors.push('Password is required.');
      return errors;
    },
  },
};
</script>

<style scoped>
.login-screen {
  height: 100vh;
}
.form-inputs {
  width: 450px;
}
.form-input.v-text-field {
  font-size: 20px;
}
.v-input__prepend-inner .v-icon {
  font-size: 35px;
}

.forgot-password {
  display: block;
  text-decoration: none;
  color: #fff;
  text-align: right;
}

.return-btn {
  position: absolute;
  top: 50px;
  left: 50px;
}
</style>
