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
                @click="this.$refs.form.resetValidation()"
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
                  <v-form class="px-1" ref="form">
                    <v-row>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Nome do livro"
                          append-icon="mdi-book-open-page-variant"
                          required
                          counter="25"
                          :rules="[
                            rules.required,
                            rules.maxLength,
                            rules.minLength,
                          ]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model="editedItem.author"
                          label="Nome do autor"
                          append-icon="mdi-account-box-outline"
                          required
                          counter="20"
                          :rules="[
                            rules.required,
                            rules.maxLength,
                            rules.minLength,
                          ]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model="editedItem.quantity"
                          type="number"
                          label="Quantidade de livros"
                          append-icon="mdi-book-plus-multiple-outline"
                          required
                          counter="20"
                          :rules="[rules.required, rules.minNum]"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex pb-0" cols="12">
                        <v-select
                          :items="publishers"
                          item-text="name"
                          item-value="id"
                          v-model="editedItem.publisher"
                          append-icon="mdi-bookshelf"
                          label="Nome da editora"
                          required
                          :rules="[rules.required]"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-menu
                          v-model="modal"
                          :nudge-right="0"
                          transition="slide-y-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.launchDate"
                              label="Data de lançamento"
                              append-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              required
                              :rules="[rules.required]"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="date"
                            @input="
                              modal = false;
                              editedItem.launchDate = formatDate;
                            "
                            color="c500"
                            :max="todayDate"
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
                <v-btn color="primary" text @click="save"> Salvar </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" persistent max-width="500px">
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
    todayDate: new Date().toISOString().slice(0, 10),
    date: '',
    headers: [
      { text: 'ID', align: 'start', value: 'id' },
      { text: 'Nome', value: 'name' },
      { text: 'Autor', value: 'author' },
      { text: 'Editora', value: 'publisher.name' },
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
    publishers: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: '',
      quantity: '',
      rentedQuantity: 0,
      launchDate: '',
      author: '',
      publisher: '',
    },
    defaultItem: {
      id: 0,
      name: '',
      quantity: '',
      rentedQuantity: 0,
      launchDate: '',
      author: '',
      publisher: '',
    },
    rules: {
      required: (value) => !!value || 'Este campo é obrigatório.',
      maxLength: (value) => value.length <= 45 || 'Máximo de 45 caracteres.',
      minLength: (value) => value.length >= 3 || 'Mínimo de 3 caracteres.',
      minNum: (value) => value >= 1 || 'O valor mínimo é 1',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo Livro' : 'Editar livro';
    },
    formatDate() {
      return this.date.replaceAll('-', '/');
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
      this.$refs.form.resetValidation();
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
          publisher: {
            id: 1,
            name: 'Saraiva',
            city: 'Fortaleza',
          },
        },
        {
          id: 2,
          name: 'Java pra nois',
          quantity: 10,
          rentedQuantity: 11,
          launchDate: '12/10/2019',
          author: 'Luiz Guilherme',
          publisher: {
            id: 1,
            name: 'Saraiva',
            city: 'Fortaleza',
          },
        },
        {
          id: 3,
          name: 'Laravel de todes',
          quantity: 70,
          rentedQuantity: 9,
          launchDate: '18/11/2020',
          author: 'Sem criatividade',
          publisher: {
            id: 1,
            name: 'Saraiva',
            city: 'Fortaleza',
          },
        },
        {
          id: 4,
          name: 'Go Lang',
          quantity: 100,
          rentedQuantity: 56,
          launchDate: '06/05/2021',
          author: 'Edsu',
          publisher: {
            id: 1,
            name: 'Saraiva',
            city: 'Fortaleza',
          },
        },
        {
          id: 5,
          name: 'Viu JotaEsi',
          quantity: 67,
          rentedQuantity: 24,
          launchDate: '18/11/2018',
          author: 'Pedro Edro',
          publisher: {
            id: 1,
            name: 'Saraiva',
            city: 'Fortaleza',
          },
        },
      ];
      this.publishers = [
        {
          id: 1,
          name: 'Saraiva',
          city: 'Fortaleza',
        },
        {
          id: 2,
          name: 'Ice cream sandwich',
          city: 'Fortaleza',
        },
        {
          id: 3,
          name: 'Eclair',
          city: 'Fortaleza',
        },
        {
          id: 4,
          name: 'Cupcake',
          city: 'Fortaleza',
        },
        {
          id: 5,
          name: 'Gingerbread',
          city: 'Fortaleza',
        },
        {
          id: 6,
          name: 'Jelly bean',
          city: 'Fortaleza',
        },
        {
          id: 7,
          name: 'Lollipop',
          city: 'Fortaleza',
        },
        {
          id: 8,
          name: 'Honeycomb',
          city: 'Fortaleza',
        },
        {
          id: 9,
          name: 'Donut',
          city: 'Fortaleza',
        },
        {
          id: 10,
          name: 'KitKat',
          city: 'Fortaleza',
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
      console.log(this.books);
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
