<template>
  <v-app>
    <layout-admin-nav-bar />
    <div>HOLA</div>
    <slot />
    <general-footer />
  </v-app>
</template>

<!-- <script setup lang="js">
import { useI18n } from 'vue-i18n';

const { setLocale } = useI18n();
const userLang = navigator.language;
const setLanguage = localStorage.getItem('setLanguage');

if(userLang.includes('es') && setLanguage == false) {
  setLocale('es');
} else if (userLang.includes('it') && setLanguage == false) {
  setLocale('it');
} else if (setLanguage == false) {
  setLocale('en');
};
</script> -->
