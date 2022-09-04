<template>
  <div class="c400 login-recover d-flex justify-center align-center">
    <v-btn
      color="c400 c000--text"
      class="return-btn py-8"
      elevation="0"
      @click="$router.push('login')"
    >
      <PhArrowUUpLeft size="40" weight="bold" />
    </v-btn>
    <div class="login d-flex flex-column justify-center align-center">
      <h1 class="c000--text display-2 font-weight-bold mb-5">
        Recover Password
      </h1>
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
            class="form-input rounded-lg mb-3"
            v-model.trim="email"
            :error-messages="emailErrors"
            @input="v$.email.$touch()"
            @blur="v$.email.$touch()"
            solo
            label="Email"
            color="c500"
          >
            <template v-slot:prepend-inner>
              <v-icon color="c400" class="mr-1"> mdi-email-outline </v-icon>
            </template>
          </v-text-field>
          <v-btn
            block
            height="60px"
            color="c600 c000--text rounded-lg"
            class="title"
            @click="submit"
          >
            Restore
          </v-btn>
        </v-col>
      </form>
    </div>
  </div>
</template>

<script>
import { required, email } from '@vuelidate/validators';
import useValidate from '@vuelidate/core';
import { PhArrowUUpLeft } from 'phosphor-vue';

export default {
  name: 'LoginRecoverView',
  components: {
    PhArrowUUpLeft,
  },
  data: () => ({
    username: '',
    email: '',
  }),
  setup: () => ({ v$: useValidate() }),
  validations() {
    return {
      username: { required },
      email: { required, email },
    };
  },
  methods: {
    submit() {
      console.log(this.v$.email);
      this.v$.$touch();
      if (!this.v$.$error) {
        console.log('Perfect');
        console.log(this.username + ' - ' + this.email);
        // Do action
      }
    },
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.v$.username.$dirty) return errors;
      if (this.v$.username.required.$invalid)
        errors.push('Este campo é obrigatório');
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.v$.email.$dirty) return errors;
      if (this.v$.email.required.$invalid)
        errors.push('Este campo é obrigatório');
      if (this.v$.email.email.$invalid) errors.push('Email inválido');
      return errors;
    },
  },
};
</script>

<style scoped>
.login-recover {
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

.return-btn {
  position: absolute;
  top: 50px;
  left: 50px;
}
</style>
