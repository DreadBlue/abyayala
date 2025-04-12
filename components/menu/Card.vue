<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card style="height: 300px; width: 220px">
          <div class="d-flex">
            <v-card-subtitle class="mt-3 color-second">{{
              plate.tipo
            }}</v-card-subtitle>
            <v-icon> </v-icon>
          </div>
          <v-card-title>{{ plate.nombre }}</v-card-title>
          <v-card-text style="height: 100px">{{
            plate.descripcion
          }}</v-card-text>
          <div
            style="height: 48px; width: 120px"
            class="bg-white rounded-xl d-flex align-center justify-center ml-5 mt-3"
          >
            <v-icon
              icon="mdi-cash bg-second color-white rounded-xl ml-n4 pa-5"
              size="30"
            />
            <span class="ml-1 px-1"
              >${{ plate.precio.toLocaleString("es-Co") }}</span
            >
          </div>
          <div class="d-flex justify-center mt-2">
            <v-btn class="color-second" @click="updateMenu()">Agregar</v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useBookingStore } from "/stores/booking.js";

const props = defineProps({
  plate: Object,
});
const useBooking = useBookingStore();

function updateMenu() {
  const current = useBooking.menu;
  const currentPrice = useBooking.precioMenu + props.plate.precio;
  const newItem = {
    menu: [...current, props.plate],
    precioMenu: currentPrice,
  };

  useBooking.updateDetails(newItem);
}
</script>
