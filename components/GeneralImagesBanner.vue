<template>
  <v-container fluid class="px-sm-15">
    <v-row class="px-1">
      <v-col
        cols="6"
        :sm="columnas"
        v-for="item in content"
        :style="styling.divStyle"
      >
        <v-row class="d-flex flex-column" style="height: 100%">
          <v-col class="text-center" style="height: 100%">
            <img
              :src="item.src"
              alt="imagen"
              style="height: 100%; width: 100%; object-fit: cover"
              :class="styling.imgClass"
            />
          </v-col>
          <v-col
            v-if="item.nombre"
            class="text-center pa-0 text-subtitle-2 text-sm-subtitle-1"
            style="color: white"
          >
            {{ item.nombre }}
          </v-col>
          <v-col
            v-if="item.descripcion"
            class="d-flex text-center pa-0 justify-center text-body-2 text-md-body-1"
            style="color: black; width: 100%"
          >
            {{ item.descripcion }}
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    styling: Object,
    content: Object,
    columnas: {
      type: String,
      default: '3',
    },
  },
  setup() {
    const thisRoute = useRoute().path;
    return {
      thisRoute,
    };
  },
};
</script>
