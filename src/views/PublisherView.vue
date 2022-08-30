<template>
  <div class="py-6 table d-flex justify-center">
    <v-data-table
      class="px-8 py-8"
      :headers="headers"
      :items="publishers"
      :search="search"
      :items-per-page="5"
    >
      <template v-slot:top>
        <v-toolbar flat class="mb-5">
          <v-toolbar-title class="font-weight-medium text-h4"
            >Editoras</v-toolbar-title
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
                        v-model="editedItem.name"
                        label="Publisher name"
                        append-icon="mdi-book-open-page-variant-outline"
                        :rules="rules"
                        counter
                        maxlength="25"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.city"
                        label="Publisher city"
                        append-icon="mdi-city-variant-outline"
                        :rules="rules"
                        counter
                        maxlength="20"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="primary" text @click="save"> Save </v-btn>
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
                  >Cancel</v-btn
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
    <PhBookmarksSimple />
  </div>
</template>

<script>
import { PhPlus, PhNotePencil, PhTrash, PhBookmarksSimple } from 'phosphor-vue';

export default {
  name: 'PublisherView',
  components: {
    PhPlus,
    PhNotePencil,
    PhTrash,
    PhBookmarksSimple,
  },
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    rules: [v => v.length <= 25 || 'Max 25 characters'],
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'id',
      },
      { text: 'Nome', value: 'name' },
      { text: 'Cidade', value: 'city' },
      { text: 'Ações', value: 'actions', sortable: false },
    ],
    publishers: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      city: '',
    },
    defaultItem: {
      name: '',
      city: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nova editora' : 'Editar editora';
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

    editItem(item) {
      this.editedIndex = this.publishers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.publishers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.publishers.splice(this.editedIndex, 1);
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
        Object.assign(this.publishers[this.editedIndex], this.editedItem);
      } else {
        this.publishers.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style scoped>
.v-data-table {
  width: 800px;
}
.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 16px;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 15px;
}
.v-data-footer {
  font-size: 15px;
}

.theme--light.v-divider {
  border-width: 2px;
  border-radius: 10px;
  border-color: #1d3245 !important;
}
.v-text-field--outlined {
  color: #1d3245 !important;
}

/* broken */
div.v-input__control div.v-text-field__details {
  display: none;
}
/* broken */

.v-card .v-card-title {
  margin: 40px;
}

.tableBtn {
  border-width: 2px;
}
.tableBtn.blueBtn {
  background: rgba(53, 207, 255, 0.2) !important;
}
.tableBtn.redBtn {
  background: rgba(222, 24, 63, 0.2) !important;
}
</style>
