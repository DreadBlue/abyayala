<template>
  <GeneralBanner :cards="BannerCard" class="mt-3" />
  <v-container fluid>
    <v-row>
      <v-col class="d-flex">
        <GeneralCard :productos="productos" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const productos = {
  torrentismo: {
    nombre: 'Torrentismo',
    precio: '$75.000',
    descripcion: 'Disfruta bajando a lo largo de una cascada.',
    src: '/otros/newrappel.jpeg',
  },
  canopy: {
    nombre: 'Capony',
    precio: '$80.000',
    descripcion: 'Lanzate por la tirolesa más larga de Colombia.',
    src: '/otros/newcanopy.jpeg',
  },
  rafting: {
    nombre: 'Rafting',
    precio: '$80.000',
    descripcion: 'Diviertete en el río remando con tus amigos.',
    src: '/otros/newrafting.jpeg',
  },
};

const BannerCard = {
  card: {
    title: 'ACTIVIDADES',
    src: '/otros/cascadaaerea.jpeg',
    flex: 12,
    height: '300px',
  },
};
</script>
