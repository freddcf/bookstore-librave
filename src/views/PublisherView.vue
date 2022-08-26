<template>
  <div class="table">
    <v-card>
      <v-card-title>
        Nutrition
        <v-divider class="mx-6" light vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Digite para pesquisar"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="desserts" :search="search">
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'PublisherView',
  data: () => ({
    search: '',
    headers: [
      {
        text: 'Dessert (100g serving)',
        align: 'start',
        value: 'name',
      },
      { text: 'Calories', value: 'calories' },
      { text: 'Fat (g)', value: 'fat' },
      { text: 'Carbs (g)', value: 'carbs' },
      { text: 'Protein (g)', value: 'protein' },
      { text: 'Iron (%)', value: 'iron' },
    ],
    desserts: [
      {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: '1%',
      },
      {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        iron: '1%',
      },
      {
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        iron: '7%',
      },
      {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        iron: '8%',
      },
      {
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        iron: '16%',
      },
      {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        iron: '0%',
      },
      {
        name: 'Lollipop',
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        iron: '2%',
      },
      {
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        iron: '45%',
      },
      {
        name: 'Donut',
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
        iron: '22%',
      },
      {
        name: 'KitKat',
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        iron: '6%',
      },
    ],
  }),
};
</script>

<style>
.v-data-table {
  padding: 30px;
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
.v-card .v-card__title {
  margin-left: 30px;
}
.v-divider--vertical {
  border-width: 3px;
  border-radius: 10px;
}
.theme--light.v-divider {
  border-color: #1D3245;
}

.v-input {
  width: 0px;
  color: #e868ff;
  color: #e868ff;
}

.table {
  padding: 30px 100px;
}
.v-card .v-card-title {
  margin: 40px;
}
.v-card {
  border-radius: 10px;
  border: 3px solid #1d3245;
}
</style>
