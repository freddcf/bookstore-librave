<template>
  <div class="py-6 table d-flex justify-center">
    <v-data-table
      class="px-8 py-8 dataTable"
      :headers="headers"
      :items="users"
      :search="search"
      :items-per-page="5"
    >
      <template v-slot:top>
        <v-toolbar flat class="mb-5">
          <v-toolbar-title class="font-weight-medium text-h4"
            >Usuários</v-toolbar-title
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
                        counter
                        maxlength="25"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.email"
                        label="Publisher city"
                        append-icon="mdi-city-variant-outline"
                        counter
                        maxlength="20"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.city"
                        label="Publisher city"
                        append-icon="mdi-city-variant-outline"
                        counter
                        maxlength="20"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.address"
                        label="Publisher city"
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
  name: 'UserView',
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
      { text: 'Email', value: 'email' },
      { text: 'Cidade', value: 'city' },
      { text: 'Endereço', value: 'address' },
      { text: 'Ações', value: 'actions', sortable: false, align: 'center' },
    ],
    publishers: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: '',
      email: '',
      city: '',
      address: '',
    },
    defaultItem: {
      id: 0,
      name: '',
      email: '',
      city: '',
      address: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nova usuário' : 'Editar usuário';
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

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.users.splice(this.editedIndex, 1);
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
        Object.assign(this.users[this.editedIndex], this.editedItem);
      } else {
        this.users.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style scoped>
.dataTable {
  width: 1000px;
}
</style>
