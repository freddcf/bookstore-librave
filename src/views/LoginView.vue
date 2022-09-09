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
            v-model.trim="credentials.username"
            :error-messages="usernameErrors"
            @input="v$.credentials.username.$touch()"
            @blur="v$.credentials.username.$touch()"
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
            v-model.trim="credentials.password"
            :error-messages="passwordErrors"
            @input="v$.credentials.password.$touch()"
            @blur="v$.credentials.password.$touch()"
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
import userAccess from '@/services/userAccess';
import { useAuthToken } from '@/stores/authToken';

export default {
  name: 'LoginView',
  components: {
    PhArrowUUpLeft,
  },
  data: () => ({
    credentials: {
      username: '',
      password: '',
    },
    showInputPassword: '',
  }),
  setup: () => ({ v$: useValidate() }),
  validations() {
    return {
      credentials: {
        username: { required },
        password: { required },
      },
    };
  },
  methods: {
    submit() {
      this.v$.credentials.$touch();
      if (!this.v$.$error) {
        this.login();
      }
    },

    async login() {
      const store = useAuthToken();
      await userAccess
        .authenticate(this.credentials)
        .then((res) => {
          this.$swal({
            title: 'Sucesso',
            text: 'Admin logado!',
            icon: 'success',
            allowOutsideClick: false,
          }).then(() => {
            store.jwtToken = 'Bearer ' + res.data.jwtToken;
            console.log('token: ' + store.retriveToken);
          });
        })
        .catch(() => {
          this.$swal({
            title: 'Opss...',
            text: 'Credenciais inválidas',
            icon: 'info',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Erro ao logar', '', 'error');
          });
        });
    },
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.v$.credentials.username.$dirty) return errors;
      if (this.v$.credentials.username.required.$invalid)
        errors.push('Username is required.');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.v$.credentials.password.$dirty) return errors;
      if (this.v$.credentials.password.required.$invalid)
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
