<template>
  <v-container
    fluid
    style="background: linear-gradient(180deg, #00bbd6, rgb(250, 250, 250))"
    class="text-sm-body-1 text-body-2"
  >
    <v-row>
      <v-col
        cols="12"
        sm="6"
        class="d-flex flex-column text-center align-center"
      >
        <span class="pb-2 color-white text-md-h3 text-sm-h4 text-h6"
          >CABAÑA ANCESTRAL</span
        >
        <img
          src="/assets/imgs/home/canabasafari.jpeg"
          alt="Cabaña Ancestral"
          style="max-width: 70%"
        />
        <span class="pt-2 color-white text-subtitle-2 text-sm-subtitle-1"
          >320.000 COP</span
        >
      </v-col>
      <v-col
        cols="12"
        sm="6"
        class="d-flex flex-column text-center align-center"
      >
        <span class="pb-2 color-white text-md-h3 text-sm-h4 text-h6"
          >CABAÑA ANCESTRAL</span
        >
        <img
          src="/assets/imgs/home/cabanaancestral.jpg"
          alt="Cabaña Ancestral"
          style="max-width: 70%"
        />
        <span class="pt-2 color-white text-subtitle-2 text-sm-subtitle-1"
          >420.000 COP</span
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex flex-column text-center ga-2 pt-0">
        <span class="color-third text-md-h3 text-sm-h4 text-h6">INCLUYE</span>
        <span>⛺️ Alojamiento</span>
        <span
          >🍳 Desayuno <a href="./pages/menu.html">(Menú restaurante)</a></span
        >
        <span>🍺 Acceso a piscina, bar y mirador</span>
        <span>
          🏞 Visita a cascada El escobo (Modestia aparte, una de las más bonitas
          y altas del país.)
        </span>
        <span>*Cabaña Ancestral tiene baño particular.</span>
        <span style="font-weight: 900">Todo para dos personas.</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import rooms from "../assets/rooms.json";

export default {
  data() {
    return {
      stylingCabanas: {
        divStyle: "height: 100%",
        imgStyle: "height: 100%; width: 87%; object-fit: cover;",
      },
      content: rooms.filter((item) => item.home === "si"),
    };
  },
};
</script>
