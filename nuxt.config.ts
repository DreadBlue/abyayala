// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: false,
  nitro: {
    firebase: {
      gen: 2
    }
  },
  devtools: { enabled: true },
  app: { 
    head: {
      title: 'Abya Yala Hostel',
      link: [{
        rel: "icon", href: "/logo-e7954e35.ico", type:"image/x-icon"
      }],
      script:[
       {
        src: "https://checkout.bold.co/library/boldPaymentButton.js"
       } 
      ] 
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  css: ['vuetify/lib/styles/main.sass'],
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt',
    'dayjs-nuxt',
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
