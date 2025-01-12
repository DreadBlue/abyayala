<template>
  <v-container fluid class="pa-0 h-100">
    <v-row class="h-100">
      <v-col cols="12" class="d-flex d-md-none justify-center">
        <div
          class="d-flex w-75 bg-second rounded elevation-8 pa-3 align-center justify-space-between"
        >
          <v-btn append-icon="mdi-filter-multiple">
            Filtros
            <v-menu
              activator="parent"
              location="top"
              :close-on-content-click="false"
            >
              <v-list v-model:opened="open">
                <v-list-group value="time">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-calendar-range"
                      title="Periodo"
                    ></v-list-item>
                  </template>

                  <v-list-item>
                    <GeneralDatePicker
                      v-model="myvar"
                      style="width: 180px"
                      :date="time[0]"
                      class="pb-4"
                      labelInput="Inicio"
                    />
                    <GeneralDatePicker
                      style="width: 180px"
                      :date="time[1]"
                      labelInput="Fin"
                    />
                  </v-list-item>
                </v-list-group>

                <v-list-group value="room">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-bed"
                      title="Cabañas"
                    ></v-list-item>
                  </template>

                  <v-list-item>
                    <template v-slot:prepend="{ isActive }">
                      <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                    </template>
                    <v-list-item-title>Ancestral</v-list-item-title>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend="{ isActive }">
                      <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                    </template>
                    <v-list-item-title>Safari</v-list-item-title>
                  </v-list-item>
                </v-list-group>
              </v-list>
            </v-menu>
          </v-btn>
          <v-btn append-icon="mdi-magnify"
            >Buscar<v-menu
              activator="parent"
              location="bottom"
              :close-on-content-click="false"
            >
              <v-text-field
                variant="solo"
                v-model="buscar"
              ></v-text-field></v-menu
          ></v-btn>
        </div>
      </v-col>

      <v-col cols="12" class="h-100 d-none d-md-block">
        <v-card class="mx-15" width="300" height="100%">
          <v-list>
            <v-list-item
              prepend-icon="mdi-filter-multiple"
              title="filtros"
            ></v-list-item>
            <v-list-group value="time">
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  prepend-icon="mdi-calendar-range"
                  title="Periodo"
                ></v-list-item>
              </template>

              <v-list-item>
                <GeneralDatePicker
                  v-model="myvar"
                  style="width: 180px"
                  :date="time[0]"
                  class="pb-4"
                  labelInput="Inicio"
                />
                <GeneralDatePicker
                  style="width: 180px"
                  :date="time[1]"
                  labelInput="Fin"
                />
              </v-list-item>
            </v-list-group>

            <v-list-group value="room">
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  prepend-icon="mdi-bed"
                  title="Cabañas"
                ></v-list-item>
              </template>

              <v-list-item>
                <template v-slot:prepend="{ isActive }">
                  <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                </template>
                <v-list-item-title>Ancestral</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend="{ isActive }">
                  <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                </template>
                <v-list-item-title>Safari</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    myvar: undefined,
    open: ['Filters'],
    time: [
      new Date().toLocaleString().slice(0, 9),
      new Date().toLocaleString().slice(0, 9),
    ],
    buscar: '',
    drawer: false,
    group: null,
    items: [
      {
        title: 'Foo',
        value: 'foo',
      },
      {
        title: 'Bar',
        value: 'bar',
      },
      {
        title: 'Fizz',
        value: 'fizz',
      },
      {
        title: 'Buzz',
        value: 'buzz',
      },
    ],
  }),
  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>
