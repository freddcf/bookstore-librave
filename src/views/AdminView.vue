<template>
  <div class="py-6 table d-flex justify-center">
    <v-data-table
      class="px-8 py-8 dataTable"
      :loading="isLoading"
      loading-text="Carregando dados... Por favor espere!"
      :headers="headers"
      :items="admins"
      :search="search"
      :items-per-page="5"
      :sort-by="['id']"
      :footer-props="{
        itemsPerPageOptions: [5, 10, 25, 50],
        itemsPerPageText: 'Linhas por página',
      }"
      update:sort-by
      multi-sort
    >
      <template v-slot:top>
        <v-toolbar-title
          v-if="$vuetify.breakpoint.xs"
          class="font-weight-medium text-h4 text-center mb-4"
          >Admin</v-toolbar-title
        >
        <v-toolbar flat class="mb-5">
          <v-toolbar-title class="font-weight-medium text-h4"
            >Admin</v-toolbar-title
          >
          <v-divider
            v-if="!$vuetify.breakpoint.xs"
            class="mx-6"
            light
            vertical
          ></v-divider>

          <v-dialog v-model="dialog" persistent max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                color="c500"
                class="rounded-lg px-0"
                min-width="40"
                height="40"
                v-bind="attrs"
                v-on="on"
              >
                <PhPlus size="30" weight="bold" />
              </v-btn>
            </template>
            <v-card>
              <v-card-title :class="postAdmin ? 'fitCard' : 'defautCard'">
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text :class="postAdmin ? 'fitCard' : 'defautCard'">
                <v-container>
                  <v-form
                    class="px-1"
                    ref="form"
                    v-model="valid"
                    lazy-validation
                  >
                    <v-row>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model.trim="editedItem.name"
                          label="Nome do administrador"
                          append-icon="mdi-account"
                          counter="45"
                          :rules="[
                            rules.required,
                            rules.maxLength,
                            rules.minLength,
                            rules.notEmpty,
                            rules.onlyWords,
                          ]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model.trim="editedItem.email"
                          label="Email do administrador"
                          append-icon="mdi-email-outline"
                          counter="100"
                          :rules="[
                            rules.required,
                            rules.maxEmailLength,
                            rules.minLength,
                            rules.validEmail,
                            rules.notEmpty,
                          ]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model.trim="editedItem.city"
                          label="Cidade do administrador"
                          append-icon="mdi-city-variant-outline"
                          counter="30"
                          :rules="[
                            rules.required,
                            rules.maxCityLength,
                            rules.minLength,
                            rules.notEmpty,
                            rules.onlyWords,
                          ]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model.trim="editedItem.address"
                          label="Endereço do administrador"
                          append-icon="mdi-map-marker-outline"
                          counter="50"
                          :rules="[
                            rules.required,
                            rules.maxAddressLength,
                            rules.minLength,
                            rules.notEmpty,
                            rules.basicValidationString,
                          ]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-if="postAdmin"
                          v-model.trim="editedItem.username"
                          label="Username do administrador"
                          append-icon="mdi-card-account-details-outline"
                          counter="50"
                          :rules="[
                            rules.required,
                            rules.maxUsernameLength,
                            rules.minLength,
                            rules.validUsername,
                            rules.onlyWords,
                          ]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-if="postAdmin"
                          v-model.trim="editedItem.password"
                          label="Senha do administrador"
                          append-icon="mdi-lock-outline"
                          :rules="[
                            rules.required,
                            rules.minLength,
                            rules.minPassword,
                            rules.noSpaces,
                            rules.basicValidationString,
                          ]"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="close"> Cancelar </v-btn>
                <v-btn color="primary" text @click="save" :disabled="!valid">
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-spacer></v-spacer>
          <v-col class="d-flex" cols="12" md="5" sm="5" xs="3">
            <v-text-field
              class="searchInput"
              hide-details
              v-model="search"
              label="Pesquisar"
              color="c500"
              append-icon="mdi-magnify"
              clearable
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top color="c800">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              outlined
              color="c800"
              class="tableBtn blueBtn rounded-md px-0 mr-2"
              min-width="30"
              height="30"
              v-bind="attrs"
              v-on="on"
              @click="editItem(item)"
            >
              <PhNotePencil size="25" weight="bold" />
            </v-btn>
          </template>
          <span>Editar</span>
        </v-tooltip>
        <v-tooltip top color="c900">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              outlined
              color="c900"
              class="tableBtn redBtn rounded-md px-0"
              min-width="30"
              height="30"
              v-bind="attrs"
              v-on="on"
              @click="deleteItem(item)"
            >
              <PhTrash size="25" weight="bold" />
            </v-btn>
          </template>
          <span>Deletar</span>
        </v-tooltip>
      </template>
      <template v-slot:no-data>
        <h3>Tabela vazia...</h3>
      </template>
      <template v-slot:no-results>
        <span>Nenhum registro encontrado!</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { PhPlus, PhNotePencil, PhTrash } from 'phosphor-vue';
import userAccess from '@/services/userAccess';
import { useAuthToken } from '@/stores/authToken';

export default {
  name: 'UserView',
  components: {
    PhPlus,
    PhNotePencil,
    PhTrash,
  },
  data: () => ({
    search: '',
    dialog: false,
    isLoading: true,
    valid: true,
    headers: [
      { text: 'ID', align: 'start', value: 'id' },
      { text: 'Nome', value: 'name' },
      { text: 'Email', value: 'email' },
      { text: 'Cidade', value: 'city' },
      { text: 'Endereço', value: 'address' },
      { text: 'Ações', value: 'actions', sortable: false, align: 'center' },
    ],
    admins: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: '',
      email: '',
      city: '',
      address: '',
      username: '',
      password: '',
    },
    defaultItem: {
      id: 0,
      name: '',
      email: '',
      city: '',
      address: '',
      username: '',
      password: '',
    },
    rules: {
      required: (value) => !!value || 'Este campo é obrigatório.',
      maxLength: (value) => value.length <= 45 || 'Máximo de 45 caracteres.',
      maxEmailLength: (value) =>
        value.length <= 100 || 'Máximo de 100 caracteres.',
      validEmail: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        ) || 'Email inválido.',
      validUsername: (value) => /^[a-z]+$/.test(value) || 'Username inválido.',
      maxCityLength: (value) =>
        value.length <= 30 || 'Máximo de 30 caracteres.',
      maxAddressLength: (value) =>
        value.length <= 50 || 'Máximo de 50 caracteres.',
      maxUsernameLength: (value) =>
        value.length <= 30 || 'Máximo de 30 caracteres.',
      minLength: (value) => value.length >= 3 || 'Mínimo de 3 caracteres.',
      minNum: (value) => value >= 1 || 'O valor mínimo é 1',
      minPassword: (value) =>
        value.length >= 8 || 'O mínimo para senhas são 8 caracteres.',
      notEmpty: (value) => !/[ ]+$/.test(value) || 'Inválido.',
      noSpaces: (value) => !/\s/.test(value) || 'Espaços não são aceitos.',
      onlyWords: (value) =>
        !/[^a-zA-ZÀ-ú'` ]+/.test(value) || 'Caracteres inválidos detectados.',
      basicValidationString: (value) =>
        !/[^a-zA-Z0-9À-ú'`,. ]+/.test(value) ||
        'Caracteres inválidos detectados.',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo admin' : 'Editar admin';
    },
    postAdmin() {
      return this.editedIndex === -1 ? true : false;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
      val || this.$refs.form.resetValidation();
    },
  },

  setup() {
    const store = useAuthToken();
    return { store };
  },

  created() {
    this.fetchApi();
  },

  methods: {
    async fetchApi() {
      await userAccess
        .getAll()
        .then(
          (res) =>
            (res = res.data.content.filter((user) => user.role === 'ADMIN'))
        )
        .then((res) => {
          this.admins = res;
          this.isLoading = false;
        });
    },

    editItem(item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item);
      this.deleteItemConfirm();
    },

    deleteItemConfirm() {
      this.$swal({
        title: 'Você deseja deletar esse registro?',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'Deletar',
        denyButtonText: 'Cancelar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.delete();
        } else if (result.isDenied) {
          this.$swal({
            title: 'Deleção interrompida!',
            icon: 'info',
            allowOutsideClick: false,
          });
        }
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
          this.$refs.form.resetValidation();
        });
      });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (!this.$refs.form.validate()) return;
      if (this.editedIndex > -1) {
        this.update();
      } else {
        this.insert();
      }
      this.close();
    },

    async insert() {
      await userAccess
        .postAdmin(this.store.getToken.value, this.editedItem)
        .then(() => this.fetchApi())
        .then(() => {
          this.$swal({
            title: 'Sucesso',
            text: 'Administrador cadastrado!',
            icon: 'success',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Administrador cadastrado', '', 'success');
          });
        })
        .catch((e) => {
          if (e.response.data.code === 401) {
            this.$swal({
              title: 'Opss...',
              text: e.response.data.message,
              icon: 'info',
              allowOutsideClick: false,
            }).then(() => {
              this.$router.push('login');
            });
          } else {
            this.$swal({
              title: 'Opss...',
              text: e.response.data.message,
              icon: 'info',
              allowOutsideClick: false,
            }).then(() => {
              window.Toast.fire('Erro ao cadastrar administrador', '', 'error');
            });
          }
        });
    },

    async update() {
      await userAccess
        .putAdmin(this.store.getToken.value, this.editedIndex, this.editedItem)
        .then(() => this.fetchApi())
        .then(() => {
          this.$swal({
            title: 'Sucesso',
            text: 'Administrador alterado!',
            icon: 'success',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Administrador alterado', '', 'success');
          });
        })
        .catch((e) => {
          if (e.response.data.code === 401) {
            this.$swal({
              title: 'Opss...',
              text: e.response.data.message,
              icon: 'info',
              allowOutsideClick: false,
            }).then(() => {
              this.$router.push('login');
            });
          } else {
            this.$swal({
              title: 'Opss...',
              text: e.response.data.message,
              icon: 'info',
              allowOutsideClick: false,
            }).then(() => {
              window.Toast.fire('Erro ao editar administrador', '', 'error');
            });
          }
        });
    },

    async delete() {
      await userAccess
        .deleteAdmin(this.store.getToken.value, this.editedIndex)
        .then(() => this.fetchApi())
        .then(() => {
          this.$swal({
            title: 'Sucesso',
            text: 'Administrador deletado!',
            icon: 'success',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Administrador deletado', '', 'info');
          });
        })
        .catch((e) => {
          if (e.response.data.code === 401) {
            this.$swal({
              title: 'Opss...',
              text: e.response.data.message,
              icon: 'info',
              allowOutsideClick: false,
            }).then(() => {
              this.$router.push('login');
            });
          } else {
            this.$swal({
              title: 'Opss...',
              text: e.response.data.message,
              icon: 'info',
              allowOutsideClick: false,
            }).then(() => {
              window.Toast.fire('Erro ao deletar administrador', '', 'error');
            });
          }
        });
    },
  },
};
</script>

<style scoped>
.dataTable {
  width: 1000px;
}

.fitCard {
  padding-bottom: 0px !important;
  margin-bottom: -10px !important;
}

.defaultCard {
  padding-bottom: 20px !important;
  margin-bottom: 0px !important;
}
</style>
