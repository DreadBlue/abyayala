<template>
  <v-app>
    <layout-nav-bar />
    <div v-if="show">
      <general-availability-searcher />
    </div>
    <slot />
    <layout-footer />
  </v-app>
</template>

<script setup>
let show = ref(true);
const searcherRoutes = [
  "/",
  "/actividades",
  "/cabanas",
  "/quienes-somos",
  "/contacto",
  "/disponibilidad",
];
const currentRoute = computed(() => useRoute().path);
watchEffect(() => {
  for (let route of searcherRoutes) {
    if (route == currentRoute.value) {
      show.value = true;
      break;
    } else {
      show.value = false;
    }
  }
});
</script>
