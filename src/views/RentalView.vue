<template>
  <div class="py-6 table d-flex justify-center">
    <v-data-table
      class="px-8 py-8 dataTable"
      :loading="isLoading"
      loading-text="Carregando dados... Por favor espere!"
      :headers="headers"
      :items="rentals"
      :search="search"
      :items-per-page="5"
      :sort-by="['id']"
      :footer-props="{
        itemsPerPageOptions: [5, 10, 25, 50],
      }"
      update:sort-by
      multi-sort
    >
      <template v-slot:top>
        <v-toolbar flat class="mb-5">
          <v-toolbar-title class="font-weight-medium text-h4"
            >Aluguel</v-toolbar-title
          >
          <v-divider class="mx-6" light vertical></v-divider>

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
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form
                    v-if="editedIndex === -1"
                    class="px-1"
                    ref="form"
                    v-model="valid"
                    lazy-validation
                  >
                    <v-row>
                      <v-col class="d-flex pb-0" cols="12">
                        <v-select
                          :items="books"
                          item-text="name"
                          item-value="id"
                          v-model="editedItem.book"
                          append-icon="mdi-book-open-page-variant"
                          label="Nome do livro"
                          required
                          :rules="[rules.required]"
                        ></v-select>
                      </v-col>
                      <v-col class="d-flex pb-0" cols="12">
                        <v-select
                          :items="users"
                          item-text="name"
                          item-value="id"
                          v-model="editedItem.users"
                          append-icon="mdi-account"
                          label="Nome do usuário"
                          required
                          :rules="[rules.required]"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-menu
                          v-model="modal"
                          :nudge-right="0"
                          :close-on-content-click="false"
                          transition="slide-y-transitionn"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.rentalDate"
                              label="Data de aluguel"
                              append-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              required
                              :rules="[rules.required]"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.rentalDate"
                            @input="modal = false"
                            locale="pt-br"
                            color="c500"
                            scrollable
                            :min="todayDate"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-menu
                          v-model="modal2"
                          :nudge-right="0"
                          :close-on-content-click="false"
                          transition="slide-y-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.returnForecast"
                              label="Previsão de retorno"
                              append-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              required
                              :rules="[rules.required]"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.returnForecast"
                            @input="modal2 = false"
                            locale="pt-br"
                            color="c500"
                            scrollable
                            :min="editedItem.rentalDate"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-form>
                  <v-form
                    v-else
                    class="px-3"
                    ref="form"
                    v-model="valid"
                    lazy-validation
                  >
                    <v-row>
                      <v-col cols="12" class="pb-0">
                        <v-menu
                          v-model="modal3"
                          :nudge-right="0"
                          :close-on-content-click="false"
                          transition="slide-y-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.returnDate"
                              label="Data de retorno"
                              append-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              required
                              :rules="[rules.required]"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.returnDate"
                            @input="modal3 = false"
                            locale="pt-br"
                            color="c500"
                            scrollable
                            :min="editedItem.rentalDate"
                          ></v-date-picker>
                        </v-menu>
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
          <v-col class="d-flex" cols="12" md="5">
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

      <template v-slot:[`item.rentalDate`]="{ item }">
        {{ parseDate(item.rentalDate) }}
      </template>

      <template v-slot:[`item.returnForecast`]="{ item }">
        {{ parseDate(item.returnForecast) }}
      </template>

      <template v-slot:[`item.returnDate`]="{ item }">
        <v-chip :color="getReturnedBookColor(item.returnDate)" dark>
          {{ formatReturnDate(item.returnDate) }}
        </v-chip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip v-if="item.returnDate === 'Não devolvido'" top color="c700">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              outlined
              color="c700"
              class="tableBtn orangeBtn rounded-md px-0"
              min-width="30"
              height="30"
              v-bind="attrs"
              v-on="on"
              @click="editItem(item)"
            >
              <PhBookmarksSimple size="25" weight="bold" />
            </v-btn>
          </template>
          <span>Devolver</span>
        </v-tooltip>
        <v-tooltip v-else top color="c900">
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
import { PhPlus, PhBookmarksSimple, PhTrash } from 'phosphor-vue';
import rentalAccess from '@/services/rentalAccess';
import bookAccess from '@/services/bookAccess';
import userAccess from '@/services/userAccess';
import { useAuthToken } from '@/stores/authToken';
import moment from 'moment';

export default {
  name: 'RentalView',
  components: {
    PhPlus,
    PhBookmarksSimple,
    PhTrash,
  },
  data: () => ({
    search: '',
    isLoading: true,
    dialog: false,
    modal: false,
    modal2: false,
    modal3: false,
    valid: true,
    todayDate: new Date().toISOString().slice(0, 10),
    headers: [
      { text: 'ID', align: 'start', value: 'id' },
      { text: 'Livro', value: 'book.name' },
      { text: 'Usuário', value: 'users.name' },
      {
        text: 'Aluguel',
        value: 'rentalDate',
        sortable: false,
        align: 'center',
      },
      {
        text: 'Previsão',
        value: 'returnForecast',
        sortable: false,
        align: 'center',
      },
      {
        text: 'Devolução',
        value: 'returnDate',
        sortable: false,
        align: 'center',
      },
      { text: 'Ações', value: 'actions', sortable: false, align: 'center' },
    ],
    rentals: [],
    books: [],
    users: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      users: null,
      book: null,
      rentalDate: '',
      returnForecast: '',
      returnDate: '',
      userId: 0,
      bookId: 0,
    },
    defaultItem: {
      id: 0,
      users: null,
      book: null,
      rentalDate: '',
      returnForecast: '',
      returnDate: '',
      userId: 0,
      bookId: 0,
    },
    rules: {
      required: (value) => !!value || 'Este campo é obrigatório.',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo aluguel' : 'Editar aluguel';
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
      await rentalAccess.getAll().then((res) => {
        this.rentals = res.data.content;
        bookAccess.getAll().then((res) => {
          this.books = res.data.content;
        });
        userAccess
          .getAll()
          .then(
            (res) =>
              (res = res.data.content.filter((user) => user.role === 'USER'))
          )
          .then((res) => {
            this.users = res;
          });
        this.isLoading = false;
      });
    },

    getReturnedBookColor(item) {
      if (item === 'Não devolvido') return 'c700';
      else return 'green';
    },

    parseDate(date) {
      return moment(date).format('DD-MM-yyyy');
    },

    formatReturnDate(data) {
      if (!/^[0-9]+/.test(data)) return data;
      let dateToPrint = this.parseDate(data.substring(0, 10));
      let textToPrint = data.substring(10, data.length);
      return dateToPrint + textToPrint;
    },

    editItem(item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item);
      this.editedItem.returnDate = '';
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
      this.editedItem.bookId = this.editedItem.book.id ?? this.editedItem.book;
      this.editedItem.userId =
        this.editedItem.users.id ?? this.editedItem.users;
      if (this.editedIndex > -1) {
        this.update();
      } else {
        this.insert();
      }
      this.close();
    },

    async insert() {
      await rentalAccess
        .post(this.store.retriveToken, this.editedItem)
        .then(() => this.fetchApi())
        .then(() => {
          this.$swal({
            title: 'Sucesso',
            text: 'Aluguel cadastrado!',
            icon: 'success',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Aluguel cadastrado', '', 'success');
          });
        })
        .catch((e) => {
          this.$swal({
            title: 'Opss...',
            text: e.response.data.message,
            icon: 'info',
            allowOutsideClick: false,
          }).then(() => {
            if (e.response.data.code === 401) {
              this.$router.push('login');
            }
            window.Toast.fire('Erro ao cadastrar aluguel', '', 'error');
          });
        });
    },

    async update() {
      await rentalAccess
        .put(this.store.retriveToken, this.editedIndex, this.editedItem)
        .then(() => this.fetchApi())
        .then(() => {
          this.$swal({
            title: 'Sucesso',
            text: 'Livro devolvido!',
            icon: 'success',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Livro devolvido', '', 'success');
          });
        })
        .catch((e) => {
          this.$swal({
            title: 'Opss...',
            text: e.response.data.message,
            icon: 'info',
            allowOutsideClick: false,
          }).then(() => {
            if (e.response.data.code === 401) {
              this.$router.push('login');
            }
            window.Toast.fire('Erro ao editar aluguel', '', 'error');
          });
        });
    },

    async delete() {
      await rentalAccess
        .delete(this.store.retriveToken, this.editedIndex)
        .then(() => this.fetchApi())
        .then(() => {
          this.$swal({
            title: 'Sucesso',
            text: 'Aluguel deletado!',
            icon: 'success',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Aluguel deletado', '', 'info');
          });
        })
        .catch((e) => {
          this.$swal({
            title: 'Opss...',
            text: e.response.data.message,
            icon: 'info',
            allowOutsideClick: false,
          }).then(() => {
            if (e.response.data.code === 401) {
              this.$router.push('login');
            }
            window.Toast.fire('Erro ao deletar aluguel', '', 'error');
          });
        });
    },
  },
};
</script>

<style scoped>
.dataTable {
  width: 1100px;
}
</style>
