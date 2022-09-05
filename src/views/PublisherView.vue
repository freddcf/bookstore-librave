<template>
  <div class="py-6 table d-flex justify-center">
    <v-data-table
      class="px-8 py-8 dataTable"
      :loading="isLoading"
      loading-text="Carregando dados... Por favor espere!"
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
                    class="px-1"
                    ref="form"
                    v-model="valid"
                    lazy-validation
                  >
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
                <v-btn color="primary" text @click="save" :disabled="!valid">
                  Salvar
                </v-btn>
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
        <h3>[Tabela vazia...]</h3>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { PhPlus, PhNotePencil, PhTrash } from 'phosphor-vue';
import publisherAccess from '@/services/publisherAccess'

export default {
  name: 'PublisherView',
  components: {
    PhPlus,
    PhNotePencil,
    PhTrash,
  },
  data: () => ({
    search: '',
    isLoading: true,
    dialog: false,
    dialogDelete: false,
    valid: true,
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
      val || this.$refs.form.resetValidation();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.fetchApi();
  },

  methods: {
    fetchApi() {
      this.isLoading = false;
      publisherAccess.getAll().then((res) => { this.publishers = res.data.content });
    },

    editItem(item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      publisherAccess.delete(this.editedIndex).then(() => this.fetchApi())
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

    async save() {
      if (!this.$refs.form.validate()) return;
      if (this.editedIndex > -1) {
        try {
          await publisherAccess.put(this.editedIndex, this.editedItem).then(() => this.fetchApi());
        } catch(e) {
          console.log(e.response.data.message)
        }
      } else {
        publisherAccess.post(this.editedItem).then(() => this.fetchApi());
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
