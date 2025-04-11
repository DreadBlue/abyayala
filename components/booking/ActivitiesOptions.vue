<template>
  <v-container>
    <v-row>
      <v-col
        class="d-flex flex-md-row flex-column ga-md-3 justify-center align-center"
      >
        <span class="text-md-h1 text-h2 color-main">VIVE</span>
        <span class="text-md-h2 text-h3 color-second">EXPERIENCIAS</span>
      </v-col>
    </v-row>
    <v-row class="my-5">
      <v-col
        v-for="(actividad, key) in actividades"
        :key="actividad.name"
        cols="12"
        md="4"
      >
        <v-card :style="{ backgroundImage: `url(${actividad.img})` }">
          <v-card-title class="mt-5">
            <span class="color-white text-subtitle-1">{{
              actividad.name.toUpperCase()
            }}</span>
          </v-card-title>
          <v-card-text class="color-white">
            {{ actividad.description }}</v-card-text
          >
          <div
            style="height: 48px; width: 120px"
            class="bg-white rounded-xl d-flex align-center justify-center ml-10 mt-3 mb-2"
          >
            <v-icon
              icon="mdi-cash bg-second color-white rounded-xl ml-n4 pa-6"
              size="40"
            />
            <span class="ml-1 px-1"
              >${{ actividad.price.toLocaleString('es-Co') }}</span
            >
          </div>
          <span class="color-white text-body-2 ml-10">Precio por persona*</span>
          <div class="d-flex flex-column align-center mt-6">
            <v-number-input
              class="color-white w-50"
              variant="outlined"
              controlVariant="split"
              :min="0"
              v-model="actividades[key].amount"
            ></v-number-input>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        class="d-flex flex-md-row flex-column ga-3 justify-center align-center"
      >
        <v-btn readonly class="ml-2 bg-main" style="width: 210px"
          >ACTIVIDADES: {{ activitiesPrice.toLocaleString('es-Co') }}</v-btn
        >
        <v-btn class="bg-main" @click="redirection(activitiesPrice)"
          >Agregar y continuar reserva</v-btn
        >
        <v-btn class="bg-second" @click="redirection(0)">OMITIR</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { VNumberInput } from 'vuetify/labs/VNumberInput';
import { useBookingStore } from '/stores/booking.js';

const route = useRoute();
const router = useRouter();
const useBooking = useBookingStore();
const activitiesPrice = computed(() => {
  return (
    actividades.torrentismo.price * actividades.torrentismo.amount +
    actividades.canopy.price * actividades.canopy.amount +
    actividades.rafting.price * actividades.rafting.amount
  );
});
const actividades = reactive({
  torrentismo: {
    img: '/otros/newrappell.jpg',
    name: 'torrentismo',
    description:
      'Descubre la emoción de descender por cascadas majestuosas mientras te sumerges en la naturaleza. El torrentismo es la actividad perfecta para los amantes de la aventura y la adrenalina.',
    price: 75000,
    amount: 0,
  },
  canopy: {
    img: '/otros/newcanoppy.jpg',
    name: 'canopy',
    description:
      'Atrévete a vivir la adrenalina mientras te deslizas a toda velocidad por el canopy más largo de Colombia. Disfruta de vistas espectaculares y una experiencia que recordarás para siempre.',
    price: 80000,
    amount: 0,
  },
  rafting: {
    img: '/otros/newraftingg.jpg',
    name: 'rafting',
    description:
      'Embárcate en una emocionante aventura en las aguas rápidas de los ríos de la región. Perfecto para quienes buscan emociones fuertes, adrenalina y momentos llenos de risas en equipo.',
    price: 80000,
    amount: 0,
  },
});

function redirection(item) {
  const data = route.query;
  router.push({
    path: '/reservar/menu',
    query: {
      ...data,
      activitiesAmount: item,
    },
  });
  const newItem = {
    torrentismo: actividades.torrentismo.amount,
    canopy: actividades.canopy.amount,
    rafting: actividades.rafting.amount,
  };
  useBooking.updateDetails(newItem);
}



watch(activitiesPrice, (newPrecio) => {
  useBooking.updateDetails({ precioActivities: newPrecio });
});
</script>
