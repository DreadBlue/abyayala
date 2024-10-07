<template>
  <v-container fluid>
    <v-row>
      <v-col cols="7" sm="3">
        <NuxtLink to="/">
          <img
            src="../../assets/imgs/logoMain.png"
            alt="logo"
            style="width: 100%"
          />
        </NuxtLink>
      </v-col>
      <v-col class="d-flex flex-column d-sm-none align-end h-100">
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>

        <v-navigation-drawer
          v-model="drawer"
          :location="$vuetify.display.mobile ? 'left' : undefined"
          temporary
        >
          <v-list-item
            v-for="route in routes"
            :to="route.route"
            :active="false"
            :title="route.name"
            style="font-size: 4rem"
            variant="plain"
          ></v-list-item>
          <v-btn
            v-if="signOutBtn"
            class="bg-main color-white ma-5"
            @click="signOut"
            >Cerrar sesión</v-btn
          >
        </v-navigation-drawer>
      </v-col>
      <v-col cols="9" class="d-none d-sm-flex justify-space-evenly pa-0">
        <v-list-item
          v-for="route in routes"
          :to="route.route"
          :title="route.name"
          :active="false"
          variant="plain"
          class="px-0"
        ></v-list-item>
        <div class="d-flex align-center">
          <v-btn v-if="signOutBtn" class="bg-main color-white" @click="signOut"
            >Cerrar sesión</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';
import { useGeneralStore } from '/stores/general.js';

export default {
  setup() {
    const useGeneral = useGeneralStore();
    const signOutBtn = computed(() => useGeneral.signOutButton);
    return { signOutBtn, useGeneral };
  },
  data: () => ({
    drawer: false,
    group: null,
    routes: [
      {
        name: 'Inicio',
        route: '/',
      },
      {
        name: 'Actividades',
        route: '/actividades',
      },
      {
        name: 'Cabañas',
        route: '/cabanas',
      },
      {
        name: '¿Quienes somos?',
        route: '/quienes-somos',
      },
      {
        name: 'Contacto',
        route: '/contacto',
      },
      {
        name: 'Mi reserva',
        route: '/mireserva',
      },
    ],
  }),
  methods: {
    signOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          //signout
        })
        .catch((error) => {
          // An error happened.
        });
      this.useGeneral.updateState(false, 'signOutButton');
      return navigateTo('/admin');
    },
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>
