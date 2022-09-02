<template>
  <div class="py-6 table d-flex justify-center">
    <v-data-table
      class="px-8 py-8 dataTable"
      :headers="headers"
      :items="books"
      :search="search"
      :items-per-page="5"
    >
      <template v-slot:top>
        <v-toolbar flat class="mb-5">
          <v-toolbar-title class="font-weight-medium text-h4"
            >Livros</v-toolbar-title
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
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Nome do livro"
                        append-icon="mdi-book-open-page-variant"
                        counter
                        maxlength="25"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="editedItem.author"
                        label="Nome do autor"
                        append-icon="mdi-account-box-outline"
                        counter
                        maxlength="20"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="editedItem.publisherName"
                        label="Nome da editora"
                        append-icon="mdi-bookshelf"
                        counter
                        maxlength="20"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="editedItem.quantity"
                        label="Quantidade de livros"
                        append-icon="mdi-book-plus-multiple-outline"
                        counter
                        maxlength="20"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-menu
                        v-model="modal"
                        :close-on-content-click="false"
                        :nudge-right="0"
                        transition="slide-y-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.launchDate"
                            label="Previsão de retorno"
                            append-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.launchDate"
                          @input="modal = false"
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

      <template v-slot:[`item.quantity`]="{ item }">
        <v-chip :color="getQuantityColor(item.quantity)" dark>
          {{ item.quantity }}
        </v-chip>
      </template>

      <template v-slot:[`item.rentedQuantity`]="{ item }">
        <v-chip color="c700" dark>
          {{ item.rentedQuantity }}
        </v-chip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          outlined
          color="c800"
          class="tableBtn blueBtn rounded-md px-0 mr-2"
          min-width="30"
          height="30"
          @click="editItem(item)"
        >
          <PhNotePencil size="25" weight="bold" />
        </v-btn>
        <v-btn
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
import { PhPlus, PhNotePencil, PhTrash } from 'phosphor-vue';

export default {
  name: 'BookView',
  components: {
    PhPlus,
    PhNotePencil,
    PhTrash,
  },
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    modal: false,
    headers: [
      { text: 'ID', align: 'start', value: 'id' },
      { text: 'Nome', value: 'name' },
      { text: 'Autor', value: 'author' },
      { text: 'Editora', value: 'publisherName' },
      {
        text: 'Lançamento',
        value: 'launchDate',
        sortable: false,
        align: 'center',
      },
      { text: 'Quantidade', value: 'quantity', align: 'center' },
      { text: 'Alugados', value: 'rentedQuantity', align: 'center' },
      { text: 'Ações', value: 'actions', sortable: false, align: 'center' },
    ],
    books: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: '',
      quantity: '',
      rentedQuantity: 0,
      launchDate: '',
      author: '',
      publisherName: '',
    },
    defaultItem: {
      id: 0,
      name: '',
      quantity: '',
      rentedQuantity: 0,
      launchDate: '',
      author: '',
      publisherName: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo Livro' : 'Editar livro';
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
      this.books = [
        {
          id: 1,
          name: 'Spring Security',
          quantity: 20,
          rentedQuantity: 9,
          launchDate: '18/11/2020',
          author: 'Ingred Soares',
          publisherName: 'Saraiva',
        },
        {
          id: 2,
          name: 'Java pra nois',
          quantity: 10,
          rentedQuantity: 11,
          launchDate: '12/10/2019',
          author: 'Luiz Guilherme',
          publisherName: 'Saraiva',
        },
        {
          id: 3,
          name: 'Laravel de todes',
          quantity: 70,
          rentedQuantity: 9,
          launchDate: '18/11/2020',
          author: 'Sem criatividade',
          publisherName: 'Saraiva',
        },
        {
          id: 4,
          name: 'Go Lang',
          quantity: 100,
          rentedQuantity: 56,
          launchDate: '06/05/2021',
          author: 'Edsu',
          publisherName: 'Saraiva',
        },
        {
          id: 5,
          name: 'Viu JotaEsi',
          quantity: 67,
          rentedQuantity: 24,
          launchDate: '18/11/2018',
          author: 'Pedro Edro',
          publisherName: 'Saraiva',
        },
      ];
    },

    getQuantityColor(value) {
      if (value < 10) return 'red';
      else if (value < 50) return 'orange';
      else return 'green';
    },

    editItem(item) {
      this.editedIndex = this.books.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.books.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.books.splice(this.editedIndex, 1);
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
        Object.assign(this.books[this.editedIndex], this.editedItem);
      } else {
        this.books.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style scoped>
.dataTable {
  width: 1200px;
}
</style>
