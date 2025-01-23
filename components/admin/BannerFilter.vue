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
                      title="Fecha de check in"
                    ></v-list-item>
                  </template>

                  <v-list-item>
                    <GeneralDatePicker
                      v-model="filters.time.startDate"
                      style="width: 180px"
                      class="py-2"
                      labelInput="Inicio"
                    />
                    <GeneralDatePicker
                      style="width: 180px"
                      class="pt-5"
                      v-model="filters.time.endDate"
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
                      <v-checkbox-btn
                        v-model="filters.cabanas.Ancestral"
                      ></v-checkbox-btn>
                    </template>
                    <v-list-item-title>Ancestral</v-list-item-title>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend="{ isActive }">
                      <v-checkbox-btn
                        v-model="filters.cabanas.Safari"
                      ></v-checkbox-btn>
                    </template>
                    <v-list-item-title>Safari</v-list-item-title>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend="{ isActive }">
                      <v-checkbox-btn
                        v-model="filters.cabanas.anamay"
                      ></v-checkbox-btn>
                    </template>
                    <v-list-item-title>Anamay</v-list-item-title>
                  </v-list-item>
                </v-list-group>

                <v-list-group value="actividades">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-run"
                      title="Actividades"
                    ></v-list-item>
                  </template>

                  <v-list-item>
                    <template v-slot:prepend="{ isActive }">
                      <v-checkbox-btn
                        v-model="filters.cabanas.Ancestral"
                      ></v-checkbox-btn>
                    </template>
                    <v-list-item-title>Ancestral</v-list-item-title>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend="{ isActive }">
                      <v-checkbox-btn
                        v-model="filters.cabanas.Safari"
                      ></v-checkbox-btn>
                    </template>
                    <v-list-item-title>Safari</v-list-item-title>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend="{ isActive }">
                      <v-checkbox-btn
                        v-model="filters.cabanas.anamay"
                      ></v-checkbox-btn>
                    </template>
                    <v-list-item-title>Anamay</v-list-item-title>
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
        <v-card class="mx-15 d-flex flex-column" width="300" height="600">
          <v-list>
            <v-list-item
              prepend-icon="mdi-filter-multiple"
              title="FILTROS"
            ></v-list-item>
            <v-list-group value="time">
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  prepend-icon="mdi-calendar-range"
                  title="Fecha de check in"
                ></v-list-item>
              </template>

              <v-list-item>
                <GeneralDatePicker
                  style="width: 180px"
                  v-model="filters.time.startDate"
                  class="pb-4 pt-3"
                  labelInput="Inicio"
                />
                <GeneralDatePicker
                  style="width: 180px"
                  class="pt-2"
                  v-model="filters.time.endDate"
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
                  <v-checkbox-btn
                    v-model="filters.cabanas.Ancestral"
                  ></v-checkbox-btn>
                </template>
                <v-list-item-title>Ancestral</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend="{ isActive }">
                  <v-checkbox-btn
                    v-model="filters.cabanas.Safari"
                  ></v-checkbox-btn>
                </template>
                <v-list-item-title>Safari</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend="{ isActive }">
                  <v-checkbox-btn
                    v-model="filters.cabanas.Anamay"
                  ></v-checkbox-btn>
                </template>
                <v-list-item-title>Anamay</v-list-item-title>
              </v-list-item>
            </v-list-group>

            <v-list-group value="actividades">
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  prepend-icon="mdi-run"
                  title="Actividades"
                ></v-list-item>
              </template>

              <v-list-item>
                <template v-slot:prepend="{ isActive }">
                  <v-checkbox-btn
                    v-model="filters.activities.Torrentismo"
                  ></v-checkbox-btn>
                </template>
                <v-list-item-title>Torrentismo</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend="{ isActive }">
                  <v-checkbox-btn
                    v-model="filters.activities.Canopy"
                  ></v-checkbox-btn>
                </template>
                <v-list-item-title>Canopy</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend="{ isActive }">
                  <v-checkbox-btn
                    v-model="filters.activities.Rafting"
                  ></v-checkbox-btn>
                </template>
                <v-list-item-title>Rafting</v-list-item-title>
              </v-list-item>
            </v-list-group>

            <v-list-group value="comida">
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  prepend-icon="mdi-food"
                  title="Comida"
                ></v-list-item>
              </template>

              <v-list-item>
                <template v-slot:prepend="{ isActive }">
                  <v-checkbox-btn
                    v-model="filters.comida.reservada"
                  ></v-checkbox-btn>
                </template>
                <v-list-item-title>Reservada</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend="{ isActive }">
                  <v-checkbox-btn
                    v-model="filters.comida.noReservada"
                  ></v-checkbox-btn>
                </template>
                <v-list-item-title>No reservada</v-list-item-title>
              </v-list-item>
            </v-list-group>

            <v-list-group value="pago">
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  prepend-icon="mdi-cash"
                  title="Pago"
                ></v-list-item>
              </template>

              <v-list-item>
                <template v-slot:prepend="{ isActive }">
                  <v-checkbox-btn
                    v-model="filters.pago.completo"
                  ></v-checkbox-btn>
                </template>
                <v-list-item-title>Completo</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend="{ isActive }">
                  <v-checkbox-btn
                    v-model="filters.pago.parcial"
                  ></v-checkbox-btn>
                </template>
                <v-list-item-title>Parcial</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend="{ isActive }">
                  <v-checkbox-btn
                    v-model="filters.pago.ninguno"
                  ></v-checkbox-btn>
                </template>
                <v-list-item-title>Sin pago registrado</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </v-list>
          <div class="d-flex justify-center align-end">
            <v-btn class="bg-main color-white mb-3" @click="filterHandler"
              >Buscar</v-btn
            >
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dayjs from 'dayjs';
export default {
  data() {
    const useAdmin = useAdminStore();
    return {
      open: ['Filters', 'Time'],
      buscar: '',
      warning: false,
      drawer: false,
      group: null,
      filters: {
        time: {
          startDate: dayjs().endOf('month').format('YYYY-MM-DD'),
          endDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        },
        activities: {
          Torrentismo: true,
          Canopy: true,
          Rafting: true,
        },
        transporte: {
          incluido: true,
          noIncluido: true,
        },
        comida: {
          reservada: true,
          noReservada: true,
        },
        cabanas: {
          Ancestral: true,
          Safari: true,
          Anamay: true,
        },
        pago: {
          completo: true,
          parcial: true,
          ninguno: true,
        },
      },
      useAdmin,
    };
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
  emits: ['update:bookings', 'update:loading'],
  methods: {
    async filterHandler() {
      this.$emit('update:loading', true);
      const bookings = await this.useAdmin.adminBookings(this.filters);
      if (bookings[0] != 'Faltan filtros') {
        this.$emit('update:bookings', bookings);
        this.$emit('update:loading', false);
      } else {
        console.log(bookings);
        this.warning = true;
      }
    },
  },
  async mounted() {
    const bookings = await this.useAdmin.adminBookings(this.filters);
    this.$emit('update:bookings', bookings);
    this.$emit('update:loading', false);
  },
};
</script>
