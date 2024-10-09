<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col v-for="item in displayed" cols="12" sm="6" md="4">
        <NuxtLink
          class="d-flex flex-wrap ga-4"
          style="text-decoration: none"
          :to="`/reserva-${item.idReserva}/${item.Correo}`"
        >
          <v-card class="mx-auto" min-width="320">
            <v-img
              class="align-end text-white"
              height="200"
              :src="cabanasPic[item['Tipo de cabaña']]"
              cover
            >
              <v-card-title>{{ item['Tipo de cabaña'] }}</v-card-title>
            </v-img>

            <v-card-text class="pt-4 texto-main">
              {{ capitalizeWords(item.Nombre) }}
            </v-card-text>

            <v-card-subtitle class="d-flex flex-column px-4 pb-3 ga-1">
              <div>{{ item['Cantidad de cabañas'] }} cabaña(s)</div>
              <v-divider
                :thickness="4"
                class="border-opacity-100 rounded color-main"
              />
              <div>CHECK IN: {{ item['Check in'] }}</div>
              <v-divider
                :thickness="4"
                class="border-opacity-100 rounded color-main"
              />
              <div>CHECK OUT: {{ item['Check out'] }}</div>
              <v-divider
                :thickness="4"
                class="border-opacity-100 rounded color-main"
              />
              <div>{{ item.Celular }}</div>
              <v-divider
                :thickness="4"
                class="border-opacity-100 rounded color-main"
              />
              <div>{{ item.Correo }}</div>
            </v-card-subtitle>
          </v-card>
        </NuxtLink>
      </v-col>
      <v-col cols="4" class="d-flex">
        <v-card
          class="d-flex flex-column ga-3 justify-center align-center mx-3 bg-mygrey"
          min-width="320"
          min-height="280"
          @click="loadReservas"
        >
          <v-icon icon="mdi-plus-circle-outline" size="100"></v-icon>
          <p class="text-subtitle-2">Cargar más reservas</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useAdminStore } from '/stores/admin.js';

export default {
  props: {
    bookings: {
      type: Array,
      required: true,
    },
  },
  data() {
    const useAdmin = useAdminStore();
    return {
      displayed: [],
      cabanasPic: {
        Ancestral: '/cabanas/ancestral.jpeg',
        Safari: '/otros/imagen3.JPG',
        AncestralDos: '/cabanas/anamay.jpeg',
      },
      useAdmin,
    };
  },
  watch: {
    bookings: {
      immediate: true,
      handler(newBookings) {
        this.displayed = [...newBookings];
      },
    },
  },
  methods: {
    capitalizeWords(str) {
      return str.replace(/(^|\s)\S/g, (match) => match.toUpperCase());
    },
    async loadReservas() {
      const moreBookings = await this.useAdmin.cargarReservas();
      this.displayed = [...this.displayed, ...moreBookings];
    },
  },
};
</script>
