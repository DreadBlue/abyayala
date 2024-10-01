<template>
  <HomeBanner />
  <HomeRooms />
  <GeneralImagesBanner :styling="styling" :content="content" />
  <HomeLocation />
</template>

<script>
export default {
  data() {
    return {
      styling: {
        divStyle: 'max-height: 260px',
        imgClass: 'rounded-xl',
      },
      content: {
        imagen1: {
          src: 'otros/bargente.jpg',
        },
        imagen2: {
          src: 'otros/polar.jpeg',
        },
        imagen3: {
          src: 'otros/piscinachica.jpg',
        },
        imagen4: {
          src: 'otros/cena.jpg',
        },
        imagen5: {
          src: 'otros/aerea.jpg',
        },
        imagen6: {
          src: 'otros/panoramica.jpg',
        },
        imagen7: {
          src: 'otros/piscinagente.jpg',
        },
        imagen8: {
          src: 'otros/piscinasola.jpg',
        },
      },
    };
  },
};
</script>
