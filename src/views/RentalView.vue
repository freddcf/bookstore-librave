<template>
  <div class="py-6 table d-flex justify-center">
    <v-data-table
      class="px-8 py-8 dataTable"
      :headers="headers"
      :items="rentals"
      :search="search"
      :items-per-page="5"
    >
      <template v-slot:top>
        <v-toolbar flat class="mb-5">
          <v-toolbar-title class="font-weight-medium text-h4"
            >Aluguel</v-toolbar-title
          >
          <v-divider class="mx-6" light vertical></v-divider>

          <v-dialog v-model="dialog" max-width="500px">
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
                  <v-row v-if="editedIndex === -1">
                    <v-col class="d-flex pb-0" cols="12">
                      <v-select
                        :items="books"
                        item-text="name"
                        item-value="id"
                        v-model="editedItem.book"
                        append-icon="mdi-book-open-page-variant"
                        label="Nome do livro"
                      ></v-select>
                    </v-col>
                    <v-col class="d-flex pb-0" cols="12">
                      <v-select
                        :items="users"
                        item-text="name"
                        item-value="id"
                        v-model="editedItem.user"
                        append-icon="mdi-account"
                        label="Nome do usuário"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-menu
                        v-model="modal"
                        :close-on-content-click="false"
                        :nudge-right="0"
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
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.rentalDate"
                          @input="modal = false"
                          color="c500"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-menu
                        v-model="modal2"
                        :close-on-content-click="false"
                        :nudge-right="0"
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
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.returnForecast"
                          @input="modal2 = false"
                          color="c500"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row v-else>
                    <v-col cols="12" class="pb-0">
                      <v-menu
                        v-model="modal3"
                        :close-on-content-click="false"
                        :nudge-right="0"
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
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.returnDate"
                          @input="modal3 = false"
                          color="c500"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="close"> Cancelar </v-btn>
                <v-btn color="primary" text @click="save"> Salvar </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-spacer></v-spacer>
          <v-col class="d-flex pb-0" cols="12" md="5">
            <v-text-field
              class="searchInput"
              v-model="search"
              label="Pesquisar"
              color="c500"
              clearable
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-toolbar>
      </template>

      <template v-slot:[`item.returnDate`]="{ item }">
        <v-chip :color="getReturnedBookColor(item.returnDate)" dark>
          {{ item.returnDate }}
        </v-chip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          v-if="item.returnDate === 'Não devolvido'"
          outlined
          color="c700"
          class="tableBtn orangeBtn rounded-md px-0"
          min-width="30"
          height="30"
          @click="editItem(item)"
        >
          <PhBookmarksSimple size="25" weight="bold" />
        </v-btn>
        <v-btn
          v-else
          outlined
          color="c900"
          class="tableBtn redBtn rounded-md px-0"
          min-width="30"
          height="30"
          @click="deleteItem(item)"
        >
          <PhTrash size="25" weight="bold" />
        </v-btn>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { PhPlus, PhBookmarksSimple, PhTrash } from 'phosphor-vue';

export default {
  name: 'RentalView',
  components: {
    PhPlus,
    PhBookmarksSimple,
    PhTrash,
  },
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    modal: false,
    modal2: false,
    modal3: false,
    headers: [
      { text: 'ID', align: 'start', value: 'id' },
      { text: 'Livro', value: 'book' },
      { text: 'Usuário', value: 'user' },
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
      user: '',
      book: '',
      rentalDate: '',
      returnForecast: '',
      returnDate: '',
    },
    defaultItem: {
      id: 0,
      user: '',
      book: '',
      rentalDate: '',
      returnForecast: '',
      returnDate: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nova aluguel' : 'Editar aluguel';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.rentals = [
        {
          id: 1,
          user: 'Fred Fonseca',
          book: 'Como ficar rico',
          rentalDate: '12/05/2021',
          returnForecast: '05/06/2021',
          returnDate: 'Não devolvido',
        },
        {
          id: 2,
          user: 'Caio',
          book: 'Teste01',
          rentalDate: '12/05/2021',
          returnForecast: '05/06/2021',
          returnDate: 'Não devolvido',
        },
        {
          id: 3,
          user: 'Luc',
          book: 'Teste 02',
          rentalDate: '12/05/2021',
          returnForecast: '05/06/2021',
          returnDate: '28/05/2021 (Com atraso)',
        },
        {
          id: 4,
          user: 'Tiago',
          book: 'Java e talz',
          rentalDate: '12/05/2021',
          returnForecast: '05/06/2021',
          returnDate: '28/05/2021 (No prazo)',
        },
        {
          id: 5,
          user: 'Jonas',
          book: 'Vue Js',
          rentalDate: '12/05/2021',
          returnForecast: '05/06/2021',
          returnDate: 'Não devolvido',
        },
      ];
      this.books = [
        {
          id: 1,
          name: 'Spring Security',
          quantity: 20,
          rentedQuantity: 9,
          launchDate: '18/11/2020',
          author: 'Ingred Soares',
          publisher: 'Saraiva',
        },
        {
          id: 2,
          name: 'Java pra nois',
          quantity: 10,
          rentedQuantity: 11,
          launchDate: '12/10/2019',
          author: 'Luiz Guilherme',
          publisher: 'Saraiva',
        },
        {
          id: 3,
          name: 'Laravel de todes',
          quantity: 70,
          rentedQuantity: 9,
          launchDate: '18/11/2020',
          author: 'Sem criatividade',
          publisher: 'Saraiva',
        },
        {
          id: 4,
          name: 'Go Lang',
          quantity: 100,
          rentedQuantity: 56,
          launchDate: '06/05/2021',
          author: 'Edsu',
          publisher: 'Saraiva',
        },
        {
          id: 5,
          name: 'Viu JotaEsi',
          quantity: 67,
          rentedQuantity: 24,
          launchDate: '18/11/2018',
          author: 'Pedro Edro',
          publisher: 'Saraiva',
        },
      ];
      this.users = [
        {
          id: 1,
          name: 'Saraiva',
          city: 'Fortaleza',
          email: 'sasa@gmail.com',
          address: 'Rua 243, 54',
        },
        {
          id: 2,
          name: 'Ice cream sandwich',
          city: 'Fortaleza',
          email: 'iceii@gmail.com',
          address: 'Avenida olimpio, 100',
        },
        {
          id: 3,
          name: 'Eclair',
          city: 'Fortaleza',
          email: 'ecate@gmail.com',
          address: 'Rua Savio Freitas, 435',
        },
        {
          id: 4,
          name: 'Cupcake',
          city: 'Fortaleza',
          email: 'cupcup@gmail.com',
          address: 'Avenida Dom Luís 282',
        },
        {
          id: 5,
          name: 'Gingerbread',
          city: 'Fortaleza',
          email: 'gi@gmail.com',
          address: 'Posto Ipiranga',
        },
      ];
    },

    getReturnedBookColor(item) {
      if (item === 'Não devolvido') return 'c700';
      else return 'green';
    },

    editItem(item) {
      this.editedIndex = this.rentals.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.returnDate = '';
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.rentals.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.rentals.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.rentals[this.editedIndex], this.editedItem);
      } else {
        this.rentals.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style scoped>
.dataTable {
  width: 1100px;
}
</style>
