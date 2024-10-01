<template>
  <v-container fluid class="px-3 px-sm-15">
    <v-row>
      <v-col cols="12" class="d-flex flex-column align-center ga-5">
        <span class="text-sm-h3 text-h4 color-main">CONTACTO</span>
        <div
          v-for="item in redes"
          class="d-flex ga-1 text-body-2 text-sm-body-1"
        >
          <v-icon :icon="item.icon"></v-icon>
          <span>{{ item.texto }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <span class="text-sm-h3 text-h4 color-third">¿CÓMO LLEGAR?</span>
      </v-col>
      <v-col cols="6">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d254408.03853972073!2d-74.39157541379505!3d4.918645356227185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8e3f9bf8054fdd45%3A0x51e46a5a7a9a8e79!2sPortal%2080%20-%20TransMilenio%2C%20Calle%2080a%2C%20Bogot%C3%A1!3m2!1d4.7097263!2d-74.1103439!4m5!1s0x8e408db994d6b66d%3A0x95036d19d28350b2!2sAbya%20Yala%20Hostel%2C%20vereda%20pinzaima%2C%20Nimaima%2C%20Cundinamarca!3m2!1d5.1269485!2d-74.392614!5e0!3m2!1ses-419!2sco!4v1676955998396!5m2!1ses-419!2sco"
          width="100%"
          height="100%"
          loading="lazy"
        ></iframe>
      </v-col>
      <v-col cols="6" class="d-flex flex-column ga-5 align-center">
        <span class="text-subtitle-2 text-sm-subtitle-1 color-main"
          >Transporte público</span
        >
        <span class="text-body-2 text-sm-body-1">Horarios Flote Aguila</span>
        <span class="text-body-2 text-sm-body-1 text-center"
          >Buses directos para Nimaima desde Portal de la 80:
        </span>
        <span class="text-body-2 text-sm-body-1">5:10 am </span>
        <span class="text-body-2 text-sm-body-1">8:50 am </span>
        <span class="text-body-2 text-sm-body-1">4:10 pm </span>
        <span class="text-subtitle-2 text-sm-subtitle-1 color-main"
          >¡Te esperamos!
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const redes = {
  whatsapp: {
    texto: '+57 311 226 9303',
    icon: 'mdi-whatsapp',
  },
  instagram: {
    texto: 'Instagram',
    icon: 'mdi-instagram',
  },
  facebook: {
    texto: 'Facebook',
    icon: 'mdi-facebook',
  },
  correo: {
    texto: 'reservas.abyayalahostel@gmail.com',
    icon: 'mdi-gmail',
  },
};
</script>
