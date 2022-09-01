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
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.returnDate"
                        label="Data de retorno"
                        append-icon="mdi-city-variant-outline"
                        counter
                        maxlength="20"
                      ></v-text-field>
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
          <v-text-field
            class="searchInput"
            v-model="search"
            label="Pesquisar"
            color="c500"
            clearable
            outlined
            dense
          ></v-text-field>
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
    headers: [
      { text: 'ID', align: 'start', value: 'id' },
      { text: 'Livro', value: 'bookName' },
      { text: 'Usuário', value: 'userName' },
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
    editedIndex: -1,
    editedItem: {
      id: 0,
      userName: '',
      bookName: '',
      rentalDate: '',
      returnForecast: '',
      returnDate: '',
    },
    defaultItem: {
      id: 0,
      userName: '',
      bookName: '',
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
          userName: 'Fred Fonseca',
          bookName: 'Como ficar rico',
          rentalDate: '12/05/2021',
          returnForecast: '05/06/2021',
          returnDate: 'Não devolvido',
        },
        {
          id: 2,
          userName: 'Caio',
          bookName: 'Teste01',
          rentalDate: '12/05/2021',
          returnForecast: '05/06/2021',
          returnDate: 'Não devolvido',
        },
        {
          id: 3,
          userName: 'Luc',
          bookName: 'Teste 02',
          rentalDate: '12/05/2021',
          returnForecast: '05/06/2021',
          returnDate: '28/05/2021 (Com atraso)',
        },
        {
          id: 4,
          userName: 'Tiago',
          bookName: 'Java e talz',
          rentalDate: '12/05/2021',
          returnForecast: '05/06/2021',
          returnDate: '28/05/2021 (No prazo)',
        },
        {
          id: 5,
          userName: 'Jonas',
          bookName: 'Vue Js',
          rentalDate: '12/05/2021',
          returnForecast: '05/06/2021',
          returnDate: 'Não devolvido',
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
