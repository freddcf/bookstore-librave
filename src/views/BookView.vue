<template>
  <div class="py-6 table d-flex justify-center">
    <v-data-table
      class="px-8 py-8 dataTable"
      :loading="isLoading"
      loading-text="Carregando dados... Por favor espere!"
      :headers="headers"
      :items="books"
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
                          v-model.trim="editedItem.name"
                          label="Nome do livro"
                          append-icon="mdi-book-open-page-variant"
                          counter="25"
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
                          v-model.trim="editedItem.author"
                          label="Nome do autor"
                          append-icon="mdi-account-box-outline"
                          counter="20"
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
                          v-model.trim="editedItem.quantity"
                          type="number"
                          label="Quantidade de livros"
                          append-icon="mdi-book-plus-multiple-outline"
                          counter="20"
                          :rules="[
                            rules.required,
                            rules.minNum,
                            rules.notEmpty,
                          ]"
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
                          :rules="[rules.required]"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-menu
                          v-model="modal"
                          :nudge-right="0"
                          :close-on-content-click="false"
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
                              :rules="[rules.required]"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.launchDate"
                            @input="modal = false"
                            locale="pt-br"
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
import bookAccess from '@/services/bookAccess';
import publisherAccess from '@/services/publisherAccess';
import moment from 'moment';

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
    isLoading: true,
    modal: false,
    valid: true,
    todayDate: new Date().toISOString().slice(0, 10),
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
      publisher: null,
      publisherId: 0,
    },
    defaultItem: {
      id: 0,
      name: '',
      quantity: '',
      rentedQuantity: 0,
      launchDate: '',
      author: '',
      publisher: null,
      publisherId: 0,
    },
    rules: {
      required: (value) => !!value || 'Este campo é obrigatório.',
      maxLength: (value) => value.length <= 45 || 'Máximo de 45 caracteres.',
      minLength: (value) => value.length >= 3 || 'Mínimo de 3 caracteres.',
      minNum: (value) => value >= 1 || 'O valor mínimo é 1',
      notEmpty: (value) => !/[ ]+$/.test(value) || 'Inválido.',
      onlyWords: (value) =>
        !/[^a-zA-ZÀ-ú'` ]+/.test(value) || 'Caracteres inválidos detectados.',
      basicValidationString: (value) =>
        !/[^a-zA-Z0-9À-ú'`,. ]+/.test(value) ||
        'Caracteres inválidos detectados.',
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
      val || this.$refs.form.resetValidation();
    },
  },

  created() {
    this.fetchApi();
  },

  methods: {
    async fetchApi() {
      await bookAccess.getAll().then((res) => {
        this.books = res.data.content;
        this.books.forEach((item) => {
          item.launchDate = this.parseDate(item.launchDate);
        });
        publisherAccess.getAll().then((res) => {
          this.publishers = res.data.content;
        });
        this.isLoading = false;
      });
    },

    getQuantityColor(value) {
      if (value < 10) return 'red';
      else if (value < 50) return 'orange';
      else return 'green';
    },

    parseDate(date) {
      return moment(date).format('DD-MM-yyyy');
    },

    parseDateISO(date) {
      const [dd, mm, yyyy] = date.split('-')
      return `${yyyy}-${mm}-${dd}`
    },

    editItem(item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item);
      this.editedItem.launchDate = this.parseDateISO(item.launchDate);
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
      this.editedItem.publisherId =
        this.editedItem.publisher.id ?? this.editedItem.publisher;
      if (this.editedIndex > -1) {
        this.update();
      } else {
        this.insert();
      }
      this.close();
    },

    async insert() {
      await bookAccess
        .post(this.editedItem)
        .then(() => this.fetchApi())
        .then(() => {
          this.$swal({
            title: 'Sucesso',
            text: 'Livro cadastrado!',
            icon: 'success',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Livro cadastrado', '', 'success');
          });
        })
        .catch((e) => {
          this.$swal({
            title: 'Opss...',
            text: e.response.data.message,
            icon: 'info',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Erro ao cadastrar livro', '', 'error');
          });
        });
    },

    async update() {
      await bookAccess
        .put(this.editedIndex, this.editedItem)
        .then(() => this.fetchApi())
        .then(() => {
          this.$swal({
            title: 'Sucesso',
            text: 'Livro alterada!',
            icon: 'success',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Livro alterado', '', 'success');
          });
        })
        .catch((e) => {
          this.$swal({
            title: 'Opss...',
            text: e.response.data.message,
            icon: 'info',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Erro ao editar livro', '', 'error');
          });
        });
    },

    async delete() {
      await bookAccess
        .delete(this.editedIndex)
        .then(() => this.fetchApi())
        .then(() => {
          this.$swal({
            title: 'Sucesso',
            text: 'Livro deletado!',
            icon: 'success',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Livro deletado', '', 'info');
          });
        })
        .catch((e) => {
          this.$swal({
            title: 'Opss...',
            text: e.response.data.message,
            icon: 'info',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Erro ao deletar livro', '', 'error');
          });
        });
    },
  },
};
</script>

<style scoped>
.dataTable {
  width: 1200px;
}
</style>
