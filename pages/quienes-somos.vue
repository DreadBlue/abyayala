<template>
  <GeneralBanner :cards="BannerFamily" />
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <span class="text-h4 text-sm-h2 color-main text-center"
        >¿QUÉ ES ABYA YALA HOSTEL?
      </span>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center px-8 px-sm-15">
        <span class="text-center text-body-2 text-sm-body-1">
          Abya Yala, que significa Tierra Madura, Tierra Viva o Tierra en
          Florecimiento, fue el término utilizado por los Kuna, pueblo
          originario que habita en Colombia y Panamá, para designar al
          territorio comprendido por el Continente Americano, El término Abya
          Yala es en sí mismo un símbolo de identidad y respeto hacia las raíces
          de los pueblos originarios.
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center px-8 px-sm-15">
        <span class="text-center text-body-2 text-sm-body-1">
          Abya Yala Hostel es Un espacio pensado para conectarte con la
          naturaleza, a solo dos horas de la capital colombiana, Abya Yala
          Hostel, se convierte en una opción increíble para descansar, explorar,
          aprender e interactuar con nuestro planeta tierra y cuidar de el.
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="px-0 px-sm-15">
        <GeneralBanner :cards="BannerRoom" />
      </v-col>
      <v-col
        cols="6"
        class="d-flex flex-column ga-5 align-center justify-center text-center pr-5 pr-sm-15"
      >
        <span class="text-h5 text-sm-h3 color-third">NUESTRAS CABAÑAS</span>
        <span class="text-body-2 text-sm-body-1"
          >Disponemos de 8 cabañas en medio de la naturaleza, cada una tiene un
          nombre reconociendo los nombres ancestrales de nuestros
          territorios.</span
        >
        <v-btn class="text-body-2 text-sm-body-1" to="/cabanas"
          >QUIERO CONOCERLAS.</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const BannerFamily = {
  card: {
    title: '¿QUIENES SOMOS?',
    src: '/otros/familia.png',
    flex: 12,
    height: '500px',
  },
};
const BannerRoom = {
  card: {
    title: '',
    src: '/otros/imagen3.JPG',
    flex: 12,
  },
};
</script>
