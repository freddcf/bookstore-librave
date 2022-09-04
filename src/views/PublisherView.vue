<template>
  <div class="py-6 table d-flex justify-center">
    <v-data-table
      class="px-8 py-8 dataTable"
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
                          label="Nome da editora"
                          append-icon="mdi-bookshelf"
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
                          v-model="editedItem.city"
                          label="Cidade da editora"
                          append-icon="mdi-city-variant-outline"
                          required
                          counter="20"
                          :rules="[
                            rules.required,
                            rules.maxCityLength,
                            rules.minLength,
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
      <v-tooltip top color="#0061A3">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            v-bind="attrs"
            v-on="on"
            text
            small
            rounded
            @click="showEdit(item)"
          >
            <v-icon dark> mdi-pencil </v-icon>
          </v-btn>
        </template>
        <span>Editar</span>
      </v-tooltip>

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
  name: 'PublisherView',
  components: {
    PhPlus,
    PhNotePencil,
    PhTrash,
  },
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'ID', align: 'start', value: 'id' },
      { text: 'Nome', value: 'name' },
      { text: 'Cidade', value: 'city' },
      { text: 'Ações', value: 'actions', sortable: false, align: 'center' },
    ],
    publishers: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: '',
      city: '',
    },
    defaultItem: {
      id: 0,
      name: '',
      city: '',
    },
    rules: {
      required: (value) => !!value || 'Este campo é obrigatório.',
      maxLength: (value) => value.length <= 45 || 'Máximo de 45 caracteres.',
      maxCityLength: (value) =>
        value.length <= 30 || 'Máximo de 30 caracteres.',
      minLength: (value) => value.length >= 3 || 'Mínimo de 3 caracteres.',
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
.dataTable {
  width: 800px;
}
</style>
