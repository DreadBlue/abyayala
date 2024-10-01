<template>
  <div class="bg-main text-center py-3 my-8">
    <div class="py-3">
      <span style="color: white" class="text-sm-h3 text-h4"
        >CABAÑAS SAFARI</span
      >
    </div>
    <GeneralImagesBanner :styling="stylingCabanas" :content="content" />
  </div>
  <v-container fluid class="pa-0 pb-0 pb-sm-7 px-5 px-sm-15">
    <v-row>
      <v-col class="text-center pa-0">
        <span class="text-sm-h3 text-h4 color-main">CABAÑA ANCESTRAL</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" style="max-height: 450px">
        <div style="max-height: 450px">
          <img
            src="/cabanas/ancestral.jpeg"
            alt="Cabaña Ancestral"
            style="width: 100%; max-height: 450px; object-fit: cover"
          />
        </div>
      </v-col>
      <v-col cols="6" class="d-flex flex-column text-center justify-center">
        <span class="color-third text-subtitle-2 text-sm-subtitle-1"
          >AWÁ KWAIKER</span
        >
        <span class="text-body-2 text-sm-body-1"
          >Pueblo Indio Americano, que en lengua Awapit significa "Gente de la
          montaña".</span
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import cabanas from '../assets/cabanas.json';

export default {
  data() {
    return {
      stylingCabanas: {
        divStyle: 'height: 100%',
        imgStyle: 'height: 100%; width: 87%; object-fit: cover;',
      },
      content: cabanas.filter((item) => item.tipo === 'Safari'),
    };
  },
};
</script>
