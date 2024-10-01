<template>
  <v-container
    fluid
    class="pa-0 mt-10 text-body-2 text-sm-footer"
    style="color: white; font-size: 0.9rem"
  >
    <v-row class="bg-main px-15 mx-0">
      <v-col
        cols="12"
        sm="3"
        class="d-flex flex-column pa-0 py-5 text-center"
        style="font-style: italic"
      >
        <NuxtLink to="/">
          <img
            src="../../assets/imgs/logo.svg"
            alt="Logo"
            style="max-width: 80%"
            class="pb-3"
          />
        </NuxtLink>
        <span>Nimaima, Cundinamarca</span>
        <span>reservas.abyayalahostel@gmail.com</span>
      </v-col>
      <v-col
        cols="6"
        class="d-none d-sm-flex flex-column justify-center text-center align-end"
      >
      </v-col>
      <v-col
        cols="12"
        sm="3"
        class="d-flex flex-column justify-center pl-3 pl-sm-15 align-center"
      >
        <div class="w-25 pb-2">SIGUENOS</div>
        <div class="d-flex w-25 ga-4 justify-center">
          <NuxtLink
            to="https://www.facebook.com/abyayalahostel"
            style="color: white"
          >
            <v-icon icon="mdi-facebook"></v-icon>
          </NuxtLink>
          <NuxtLink
            to="https://www.instagram.com/hostelabyayala/"
            style="color: white"
          >
            <v-icon icon="mdi-instagram"></v-icon>
          </NuxtLink>
          <NuxtLink to="https://wa.me/+573112269303" style="color: white">
            <v-icon icon="mdi-whatsapp"></v-icon>
          </NuxtLink>
        </div>
      </v-col>
    </v-row>
    <v-row class="bg-second mx-0 py-2">
      <v-col
        cols="12"
        sm="5"
        class="d-flex ga-5 pl-6 pl-sm-15 align-center pt-0"
      >
        <NuxtLink>Términos y condiciones</NuxtLink>
        <NuxtLink
          to="https://maps.app.goo.gl/guAsprxNM6qezkfNA"
          style="text-decoration: none; color: white"
          >Maps</NuxtLink
        >
        <NuxtLink to="admin" style="text-decoration: none; color: white"
          >Admin</NuxtLink
        >
      </v-col>
      <v-col cols="12" sm="7" class="justify-end pt-0">
        <div class="text-end pr-10">
          All rights reserved - Desarrollado por
          <NuxtLink
            to="https://dreadblue.com"
            style="text-decoration: none"
            class="color-third"
            >Dread Blue SAS</NuxtLink
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
