<template>
  <v-container class="virtual-scroll-container" @scroll="handleScroll">
    <v-row v-for="(categorie, key) in foodMenu">
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <span class="text-md-h2 text-h3 ml-md-15 color-main">{{ key }}</span>
      </v-col>
      <v-col
        v-for="plate in categorie"
        cols="12"
        sm="3"
        class="d-flex justify-center align-center text-center"
      >
        <div class="d-flex justify-center">
          <menu-card :plate="plate" />
        </div>
      </v-col>
    </v-row>
    <v-col cols="12" class="d-flex flex-column align-center">
      <span class="text-md-h4 text-h5 d-flex justify-center color-third"
        >RESUMEN DEL PEDIDO</span
      >
      <v-table class="w-md-75 w-100 my-5">
        <thead>
          <tr>
            <th class="text-left"></th>
            <th class="text-left">Plato</th>
            <th class="text-left">Precio</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in menu" :key="item.name">
            <v-btn @click="deletePlate(index)">x</v-btn>
            <td>{{ item.nombre }}</td>
            <td>{{ item.precio }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-container>
  <v-col cols="12">
    <div class="d-flex justify-center ga-4">
      <v-btn readonly class="ml-2 bg-second color-white"
        >COMIDA: {{ menuPrice.toLocaleString("es-Co") }}</v-btn
      >
      <v-btn class="bg-second color-white" @click="updateInfo(menuPrice)"
        >Continuar</v-btn
      >
    </div>
  </v-col>
</template>

<script setup>
import menuJSON from "../../assets/menu.json";
import { useBookingStore } from "/stores/booking.js";

const foodMenu = menuJSON;
const route = useRoute();
const router = useRouter();
const useBooking = useBookingStore();
const menuPrice = computed(() => useBooking.precioMenu);
const menu = computed(() => useBooking.menu);

function deletePlate(item) {
  const newPrice = menuPrice.value - menu.value[item].precio;
  const newMenu = menu.value.splice(item, 1);
  const newItem = {
    menu: menu.value,
    precioMenu: newPrice,
  };
  useBooking.updateDetails(newItem);
}

function updateInfo(item) {
  const data = route.query;
  router.push({
    path: "/reservar/datos",
    query: {
      ...data,
      menuAmount: menuPrice.value,
    },
  });
  const newItem = {
    precioMenu: item,
  };
  useBooking.updateDetails(newItem);
}
</script>

<style scoped>
.virtual-scroll-container {
  height: 55vh;
  overflow-y: auto;
  position: relative;
}

.virtual-scroll-list {
  position: relative;
  width: 100%;
}

.virtual-scroll-item {
  position: absolute;
  width: 100%;
  box-sizing: border-box;
}
</style>
