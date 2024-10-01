<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6" sm="4" v-for="item in productos">
        <v-card class="mx-auto" max-width="400">
          <v-img
            class="align-end text-white"
            height="200"
            :src="item.src"
            cover
          >
            <v-card-title>{{ item.nombre }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pt-4">
            {{ item.descripcion }}
          </v-card-subtitle>

          <v-card-text>
            <div>{{ item.precio }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps({
  productos: Object,
});
</script>
